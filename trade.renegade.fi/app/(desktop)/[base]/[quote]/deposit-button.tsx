import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import {
  chain,
  deposit,
  useConfig,
  useStatus,
} from "@sehyunchung/renegade-react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"
import { parseUnits } from "viem"
import { useAccount, useBlockNumber, useWalletClient } from "wagmi"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { Direction } from "@/contexts/Order/types"
import { env } from "@/env.mjs"
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated"
import { useButton } from "@/hooks/use-button"
import useTaskCompletionToast from "@/hooks/use-task-completion-toast"
import { signPermit2 } from "@/lib/permit2"
import { parseAmount } from "@/lib/utils"
import { getPkRootScalars } from "@sehyunchung/renegade-react"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export default function DepositButton() {
  const { baseTicker, baseTokenAmount } = useDeposit()
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
      address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
      args: [address ?? "0x"],
    })

  // Get L1 ERC20 Allowance
  const { data: allowance, queryKey: allowanceQueryKey } =
    useReadErc20Allowance({
      address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
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
    ? l1Balance <
      parseAmount(baseTokenAmount, new Token({ ticker: baseTicker }))
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
  const { executeTaskWithToast } = useTaskCompletionToast()
  const handleApprove = async () => {
    if (!isConnected) return
    await approve({
      address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
      args: [env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`, MAX_INT],
    }).then(() => {
      handleSignAndDeposit()
    })
  }

  const handleSignAndDeposit = async () => {
    if (!walletClient) return
    const token = new Token({ address: Token.findAddressByTicker(baseTicker) })
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
    const { taskId } = await deposit(config, {
      fromAddr: walletClient.account.address,
      mint: `0x${token.address}`,
      amount,
      permitNonce: nonce,
      permitDeadline: deadline,
      permit: signature,
    })

    await executeTaskWithToast(taskId, "Deposit").then(() => {
      if (token.ticker === "USDC") {
        setDirection(Direction.BUY)
      } else {
        setDirection(Direction.SELL)
      }
    })
  }

  const handleClick = async () => {
    console.log("handleClick: ", {
      shouldUse,
      isDisabled,
      needsApproval,
      hasRpcConnectionError,
      hasInsufficientBalance,
    })
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
          ? `Approve ${baseTicker}`
          : hasRpcConnectionError
          ? "Error connecting to chain"
          : `Deposit ${baseTokenAmount || ""} ${baseTicker}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
