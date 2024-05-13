import { env } from "@/env.mjs"
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated"
import { signPermit2 } from "@/lib/permit2"
import { FAILED_DEPOSIT_MSG, QUEUED_DEPOSIT_MSG } from "@/lib/task"
import { Direction } from "@/lib/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  chain,
  deposit,
  getPkRootScalars,
  parseAmount,
  useConfig,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { createPublicClient, http, parseUnits } from "viem"
import { useAccount, useBlockNumber, useWalletClient } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"

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
      args: [
        address ?? "0x",
        env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`,
      ],
    })

  useEffect(() => {
    console.log("invalidating queries")
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
      args: [env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`, MAX_INT],
      nonce,
    }).then(() => {
      // TODO: May need to await confirmation
      handleSignAndDeposit()
    })
  }

  // Deposit
  const config = useConfig()
  const taskHistory = useTaskHistory()
  const isQueue = taskHistory.find(
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
      chainId: config.getRenegadeChain().id,
      spender: env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
      permit2Address: env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`,
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
  const isDisabled = isConnected && (!baseTokenAmount || hasInsufficientBalance)
  const needsApproval = allowance === BigInt(0) || allowance === undefined

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

  return (
    <>
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
        {shouldUse
          ? buttonText
          : hasInsufficientBalance
          ? "Insufficient balance"
          : needsApproval
          ? `Approve ${base}`
          : `Deposit ${baseTokenAmount || "0"} ${base}`}
      </Button>
      {isOpen && <CreateStepper onClose={onClose} />}
    </>
  )
}
