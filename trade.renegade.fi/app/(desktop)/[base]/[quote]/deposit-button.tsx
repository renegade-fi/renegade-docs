import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Token, stylusDevnetEc2 } from "@renegade-fi/renegade-js"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { parseUnits } from "viem"
import { useAccount, useBlockNumber, useWalletClient } from "wagmi"

import { renegade } from "@/app/providers"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { env } from "@/env.mjs"
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated"
import { useButton } from "@/hooks/use-button"
import { signPermit2 } from "@/lib/permit2"
import { parseAmount } from "@/lib/utils"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export default function DepositButton() {
  const { baseTicker, baseTokenAmount } = useDeposit()
  const { accountId, pkRoot } = useRenegade()
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
  const { writeContract: approve, status: approveStatus } =
    useWriteErc20Approve()

  const { data: walletClient } = useWalletClient()

  const hasRpcConnectionError = typeof allowance === "undefined"
  const hasInsufficientBalance = l1Balance
    ? l1Balance <
      parseAmount(baseTokenAmount, new Token({ ticker: baseTicker }))
    : true
  const needsApproval = allowance === BigInt(0) && approveStatus !== "success"

  const isDisabled =
    (accountId && !baseTokenAmount) ||
    hasRpcConnectionError ||
    hasInsufficientBalance

  const handleApprove = async () => {
    if (!accountId) return
    approve({
      address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
      args: [env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`, MAX_INT],
    })
  }

  const [_, setDirection] = useLocalStorage("direction", Direction.BUY)
  const handleSignAndDeposit = async () => {
    if (!accountId || !walletClient) return
    const token = new Token({ address: Token.findAddressByTicker(baseTicker) })
    const amount = parseUnits(baseTokenAmount, 18)

    // Generate Permit2 Signature
    const { signature, nonce, deadline } = await signPermit2({
      amount,
      chainId: stylusDevnetEc2.id,
      spender: env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
      permit2Address: env.NEXT_PUBLIC_PERMIT2_CONTRACT as `0x${string}`,
      token,
      walletClient,
      pkRoot,
    })

    // Deposit
    await renegade.task
      .deposit(
        accountId,
        token,
        amount,
        walletClient.account.address,
        nonce,
        deadline,
        signature
      )
      .then(() =>
        toast.message(`Started to deposit ${baseTokenAmount} ${baseTicker}`, {
          description: "Check the history tab for the status of the task",
        })
      )
      .then(() => {
        if (token.ticker === "USDC") {
          setDirection(Direction.BUY)
        } else {
          setDirection(Direction.SELL)
        }
      })
      .catch((error) => toast.error(`Error depositing: ${error}`))
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
          ? `Approve ${baseTicker}`
          : hasRpcConnectionError
          ? "Error connecting to chain"
          : `Deposit ${baseTokenAmount || ""} ${baseTicker}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
