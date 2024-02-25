import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { env } from "@/env.mjs"
import {
  useErc20Allowance,
  useErc20Approve,
  useErc20BalanceOf,
  usePrepareErc20Approve,
} from "@/generated"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import { toast } from "sonner"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useWaitForTransaction } from "wagmi"

import { useButton } from "@/hooks/use-button"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { renegade } from "@/app/providers"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export default function DepositButton() {
  const { baseTicker, baseTokenAmount } = useDeposit()
  const { accountId } = useRenegade()
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
  const { data: l1Balance } = useErc20BalanceOf({
    address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
    args: [address ?? "0x"],
  })
  // TODO: Adjust decimals
  console.log("Balance on L1: ", formatUnits(l1Balance ?? BigInt(0), 18))

  // Get L1 ERC20 Allowance
  const { data: allowance } = useErc20Allowance({
    address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
    args: [
      address ? address : "0x",
      env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
    ],
    watch: true,
  })
  console.log(`${baseTicker} allowance: `, allowance)

  // L1 ERC20 Approval
  const { config } = usePrepareErc20Approve({
    address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
    args: [env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`, MAX_INT],
  })
  const {
    write: approve,
    isLoading: approveIsLoading,
    data: approveData,
  } = useErc20Approve(config)
  const { isLoading: txIsLoading, isSuccess: txIsSuccess } =
    useWaitForTransaction({
      hash: approveData?.hash,
    })

  const hasRpcConnectionError = !allowance
  const hasInsufficientBalance = l1Balance
    ? l1Balance < parseUnits(baseTokenAmount, 18)
    : false
  const needsApproval = allowance === BigInt(0) && !txIsSuccess

  const isDisabled =
    (accountId && !baseTokenAmount) ||
    hasRpcConnectionError ||
    hasInsufficientBalance

  const handleApprove = async () => {
    if (!accountId || !approve) return
    approve()
  }

  const handleClick = async () => {
    if (shouldUse) {
      buttonOnClick()
    } else if (isDisabled) {
      return
    } else if (needsApproval) {
      handleApprove()
    } else {
      if (!accountId || !address) return
      await renegade.task
        .deposit(
          accountId,
          new Token({ address: Token.findAddressByTicker(baseTicker) }),
          BigInt(baseTokenAmount),
          address
        )
        .then(() =>
          toast.message(`Started to deposit ${baseTokenAmount} ${baseTicker}`, {
            description: "Check the history tab for the status of the task",
          })
        )

        .catch((error) => toast.error(`Error depositing: ${error}`))
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
        isLoading={approveIsLoading || txIsLoading}
        loadingText="Approving"
        onClick={handleClick}
        rightIcon={<ArrowForwardIcon />}
      >
        {shouldUse
          ? buttonText
          : needsApproval
          ? `Approve ${baseTicker}`
          : hasRpcConnectionError
          ? "Error connecting to sequencer"
          : hasInsufficientBalance
          ? "Insufficient balance"
          : `Deposit ${baseTokenAmount || ""} ${baseTicker}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
