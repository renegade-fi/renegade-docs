import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated"
import { signPermit2 } from "@/lib/permit2"
import { FAILED_DEPOSIT_MSG, QUEUED_DEPOSIT_MSG } from "@/lib/task"
import {
  MAX_BALANCES_TOOLTIP,
  UNUSED_BALANCE_NEEDED_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Direction } from "@/lib/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  chain,
  parseAmount,
  useBackOfQueueBalances,
  useBackOfQueueOrders,
  useConfig,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { deposit, getPkRootScalars } from "@renegade-fi/react/actions"
import { MAX_BALANCES } from "@renegade-fi/react/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { createPublicClient, http, parseUnits } from "viem"
import { useAccount, useBlockNumber, useWalletClient } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { Tooltip } from "@/components/tooltip"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

const publicClient = createPublicClient({
  chain,
  transport: http(),
})

export default function DepositButton({
  baseTokenAmount,
  setBaseTokenAmount,
}: {
  baseTokenAmount: string
  setBaseTokenAmount: (baseTokenAmount: string) => void
}) {
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [_, setDirection] = useLocalStorage("direction", Direction.BUY)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Deposit",
    onOpenSignIn: onOpen,
    signInText: "Sign in to Deposit",
  })

  const { address } = useAccount()
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  // Get ERC20 balance
  const { data: balance, queryKey: balanceQueryKey } = useReadErc20BalanceOf({
    address: Token.findByTicker(base).address,
    args: [address ?? "0x"],
  })

  // ERC20 Allowance
  const { data: allowance, queryKey: allowanceQueryKey } =
    useReadErc20Allowance({
      address: Token.findByTicker(base).address,
      args: [address ?? "0x", process.env.NEXT_PUBLIC_PERMIT2_CONTRACT],
    })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: balanceQueryKey })
    queryClient.invalidateQueries({ queryKey: allowanceQueryKey })
  }, [blockNumber, base, queryClient, balanceQueryKey, allowanceQueryKey])

  // ERC20 Approval
  const status = useStatus()
  const isConnected = status === "in relayer" && address
  const { writeContractAsync: approve, status: approveStatus } =
    useWriteErc20Approve()
  const { data: walletClient } = useWalletClient()
  const handleApprove = async () => {
    if (!isConnected || !walletClient) return
    const nonce = await publicClient.getTransactionCount({
      address: walletClient.account.address,
    })
    await approve({
      address: Token.findByTicker(base).address,
      args: [process.env.NEXT_PUBLIC_PERMIT2_CONTRACT, MAX_INT],
      nonce,
    }).then(() => {
      // TODO: May need to await confirmation
      handleSignAndDeposit()
    })
  }

  // Deposit
  const config = useConfig()
  const { data: taskHistory } = useTaskHistory()
  const isQueue = Array.from(taskHistory?.values() || []).find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )
  const handleSignAndDeposit = async () => {
    if (!walletClient) return
    const token = Token.findByTicker(base)
    const amount = parseUnits(baseTokenAmount, 18)
    const pkRoot = getPkRootScalars(config)
    // Generate Permit2 Signature
    const { signature, nonce, deadline } = await signPermit2({
      amount,
      chainId: chain.id,
      spender: process.env.NEXT_PUBLIC_DARKPOOL_CONTRACT,
      permit2Address: process.env.NEXT_PUBLIC_PERMIT2_CONTRACT,
      token,
      walletClient,
      pkRoot,
    })
    setBaseTokenAmount("")
    if (isQueue) {
      toast.message(QUEUED_DEPOSIT_MSG(token, amount))
    }
    await deposit(config, {
      fromAddr: walletClient.account.address,
      mint: token.address,
      amount,
      permitNonce: nonce,
      permitDeadline: deadline,
      permit: signature,
    })
      .then(() => {
        if (token.ticker === "USDC") {
          setDirection(Direction.BUY)
        } else {
          setDirection(Direction.SELL)
        }
      })
      .catch((e) => {
        toast.error(
          FAILED_DEPOSIT_MSG(
            token,
            amount,
            e.shortMessage ?? e.response?.data ?? e.message
          )
        )
        console.error(`Error depositing: ${e.response?.data ?? e.message}`)
      })
  }

  const hasInsufficientBalance = balance
    ? balance < parseAmount(baseTokenAmount, Token.findByTicker(base))
    : true
  const needsApproval = allowance === BigInt(0) || allowance === undefined

  const balances = useBackOfQueueBalances()
  const orders = useBackOfQueueOrders()
  const isMaxBalances = balances.length === MAX_BALANCES
  const mints = balances.map((balance) => balance.mint)
  const isExistingBalance = mints.includes(Token.findByTicker(base).address)
  const orderResultsInNewBalance = orders.some(
    (order) =>
      !mints.includes(order.side === "Buy" ? order.base_mint : order.quote_mint)
  )

  const isDisabled =
    isConnected &&
    (hasInsufficientBalance ||
      (!isExistingBalance &&
        balances.length === MAX_BALANCES - 1 &&
        orderResultsInNewBalance) ||
      (!isExistingBalance && isMaxBalances))

  const handleClick = async () => {
    if (shouldUse) {
      buttonOnClick()
    } else if (isDisabled) {
      return
    } else if (needsApproval) {
      handleApprove()
    } else {
      handleSignAndDeposit()
    }
  }

  let buttonContent: string
  if (shouldUse) {
    buttonContent = buttonText
  } else if (hasInsufficientBalance) {
    buttonContent = "Insufficient balance"
  } else if (!isExistingBalance && isMaxBalances) {
    buttonContent = "Max balances reached"
  } else if (
    !isExistingBalance &&
    balances.length === MAX_BALANCES - 1 &&
    orderResultsInNewBalance
  ) {
    buttonContent = "Unused balance slot needed for order"
  } else if (needsApproval) {
    buttonContent = `Approve ${base}`
  } else {
    buttonContent = `Deposit ${baseTokenAmount || "0"} ${base}`
  }

  return (
    <>
      <Tooltip
        label={
          !isExistingBalance && isMaxBalances
            ? MAX_BALANCES_TOOLTIP
            : !isExistingBalance &&
              balances.length === MAX_BALANCES - 1 &&
              orderResultsInNewBalance
            ? UNUSED_BALANCE_NEEDED_TOOLTIP
            : ""
        }
      >
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
          opacity={baseTokenAmount ? 1 : 0}
          borderWidth="thin"
          borderColor="white.40"
          borderRadius="100px"
          _hover={
            isDisabled
              ? { backgroundColor: "transparent" }
              : {
                  borderColor: "white.60",
                  color: "white",
                }
          }
          transform={baseTokenAmount ? "translateY(10px)" : "translateY(-10px)"}
          visibility={baseTokenAmount ? "visible" : "hidden"}
          cursor={cursor}
          transition="0.15s"
          backgroundColor="transparent"
          isDisabled={isDisabled}
          isLoading={approveStatus === "pending"}
          loadingText="Approving"
          onClick={handleClick}
          rightIcon={<ArrowForwardIcon />}
        >
          {buttonContent}
        </Button>
      </Tooltip>
      {isOpen && <CreateStepper onClose={onClose} />}
    </>
  )
}
