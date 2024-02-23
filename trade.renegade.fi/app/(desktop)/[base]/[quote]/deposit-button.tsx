import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { env } from "@/env.mjs"
import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
} from "@/generated"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import { toast } from "sonner"
import { useAccount, useWaitForTransaction } from "wagmi"

import { useButton } from "@/hooks/use-button"
import { useIsLocked } from "@/hooks/use-is-locked"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { renegade } from "@/app/providers"

const MAX_INT = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export default function DepositButton() {
  const { baseTicker, baseTokenAmount } = useDeposit()
  const isLocked = useIsLocked()
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
  const isDisabled = accountId && (isLocked || !baseTokenAmount)

  const { address } = useAccount()
  const { data: allowance } = useErc20Allowance({
    address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
    args: [
      address ? address : "0x",
      env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
    ],
    watch: true,
  })
  console.log("🚀 ~ DepositButton ~ allowance:", allowance)
  const needsApproval = !allowance || allowance === BigInt(0)

  const { config } = usePrepareErc20Approve({
    address: Token.findAddressByTicker(baseTicker) as `0x${string}`,
    args: [env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`, MAX_INT],
  })
  const {
    write: approve,
    isLoading: approveIsLoading,
    data: approveData,
  } = useErc20Approve(config)
  const { isLoading: txIsLoading } = useWaitForTransaction({
    hash: approveData?.hash,
  })

  const handleApprove = async () => {
    if (!accountId || !approve) return
    approve()
  }

  const handleClick = async () => {
    if (shouldUse) {
      buttonOnClick()
    } else if (needsApproval) {
      // setIsLoading(true)
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
        .then(() => toast.info("Deposit task added to queue"))
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
            : `Deposit ${baseTokenAmount || ""} ${baseTicker}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
