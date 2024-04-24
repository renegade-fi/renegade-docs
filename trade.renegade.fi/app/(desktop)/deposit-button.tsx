import { env } from "@/env.mjs"
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated"
import { signPermit2 } from "@/lib/permit2"
import { Direction } from "@/lib/types"
import { parseAmount } from "@/lib/utils"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import {
  chain,
  deposit,
  useConfig,
  useStatus,
} from "@sehyunchung/renegade-react"
import { getPkRootScalars } from "@sehyunchung/renegade-react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { parseUnits } from "viem"
import { useAccount, useBlockNumber, useWalletClient } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export default function DepositButton({
  baseTokenAmount,
}: {
  baseTokenAmount: string
}) {
  const [base] = useLocalStorage("base", "MATIC", {
    initializeWithValue: false,
  })
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Deposit",
    onOpenSignIn,
    signInText: "Sign in to Deposit",
  })

  const { address } = useAccount()

  // Get L1 ERC20 balance
  const { data: l1Balance, queryKey: l1BalanceQueryKey } =
    useReadErc20BalanceOf({
      address: Token.findAddressByTicker(base) as `0x${string}`,
      args: [address ?? "0x"],
    })

  // Get L1 ERC20 Allowance
  const { data: allowance, queryKey: allowanceQueryKey } =
    useReadErc20Allowance({
      address: Token.findAddressByTicker(base) as `0x${string}`,
      args: [
        address ?? "0x",
        env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`,
      ],
    })

  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: l1BalanceQueryKey })
    queryClient.invalidateQueries({ queryKey: allowanceQueryKey })
  }, [allowanceQueryKey, blockNumber, l1BalanceQueryKey, queryClient])

  // L1 ERC20 Approval
  const { writeContractAsync: approve, status: approveStatus } =
    useWriteErc20Approve()

  const { data: walletClient } = useWalletClient()

  const hasRpcConnectionError = typeof allowance === "undefined"
  const hasInsufficientBalance = l1Balance
    ? l1Balance < parseAmount(baseTokenAmount, new Token({ ticker: base }))
    : true
  const needsApproval = allowance === BigInt(0) && approveStatus !== "success"
  const status = useStatus()
  const isConnected = status === "in relayer"

  const isDisabled =
    (isConnected && !baseTokenAmount) ||
    hasRpcConnectionError ||
    hasInsufficientBalance

  const [_, setDirection] = useLocalStorage("direction", Direction.BUY)
  const config = useConfig()
  const handleApprove = async () => {
    if (!isConnected) return
    await approve({
      address: Token.findAddressByTicker(base) as `0x${string}`,
      args: [env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`, MAX_INT],
    }).then(() => {
      // TODO: May need to await confirmation
      handleSignAndDeposit()
    })
  }

  const handleSignAndDeposit = async () => {
    if (!walletClient) return
    const token = new Token({ address: Token.findAddressByTicker(base) })
    const amount = parseUnits(baseTokenAmount, 18)

    const pkRoot = getPkRootScalars(config)

    // Generate Permit2 Signature
    const { signature, nonce, deadline } = await signPermit2({
      amount,
      chainId: chain.id,
      spender: env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
      permit2Address: env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`,
      token,
      walletClient,
      pkRoot,
    })
    await deposit(config, {
      fromAddr: walletClient.account.address,
      mint: `0x${token.address}`,
      amount,
      permitNonce: nonce,
      permitDeadline: deadline,
      permit: signature,
    })
      .then(() => {
        toast.message(`Started to deposit ${baseTokenAmount} ${base}`, {
          description: "Check the history tab for the status of the task",
        })
        if (token.ticker === "USDC") {
          setDirection(Direction.BUY)
        } else {
          setDirection(Direction.SELL)
        }
      })
      .catch((e) => {
        toast.error(`Error depositing: ${e.response.data ?? e.message}`)
      })
  }

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
          : hasRpcConnectionError
          ? "Error connecting to chain"
          : `Deposit ${baseTokenAmount || ""} ${base}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
