import { FAILED_WITHDRAWAL_MSG, QUEUED_WITHDRAWAL_MSG } from "@/lib/task"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  parseAmount,
  useBalances,
  useConfig,
  useFees,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { payFees, withdraw } from "@renegade-fi/react/actions"
import { useMemo } from "react"
import { toast } from "sonner"
import { useAccount } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"

export default function WithdrawButton({
  baseTicker,
  baseTokenAmount,
  setBaseTokenAmount,
}: {
  baseTicker: string
  baseTokenAmount: string
  setBaseTokenAmount: (baseTokenAmount: string) => void
}) {
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Withdraw",
    onOpenSignIn,
    signInText: "Sign in to Withdraw",
  })
  const balances = useBalances()

  const hasInsufficientBalance = useMemo(() => {
    const renegadeBalance = balances.get(Token.findByTicker(baseTicker).address)
    if (!renegadeBalance) return true
    return (
      renegadeBalance.amount <
      parseAmount(baseTokenAmount, Token.findByTicker(baseTicker))
    )
  }, [balances, baseTicker, baseTokenAmount])

  const status = useStatus()
  const isConnected = status === "in relayer"

  const isDisabled = isConnected && (!baseTokenAmount || hasInsufficientBalance)

  const config = useConfig()
  const { address } = useAccount()

  const fees = useFees()
  const { data: taskHistory } = useTaskHistory()
  const isQueue = Array.from(taskHistory?.values() || []).find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )

  const handleWithdraw = async () => {
    if (!address) return
    const token = Token.findByTicker(baseTicker)
    const amount = parseAmount(baseTokenAmount, token)
    setBaseTokenAmount("")
    if (isQueue) {
      toast.message(QUEUED_WITHDRAWAL_MSG(token, amount))
    }

    if (fees.size > 0) {
      await payFees(config)
    }

    // Withdraw
    await withdraw(config, {
      mint: token.address,
      amount,
      destinationAddr: address,
    }).catch((e) => {
      toast.error(FAILED_WITHDRAWAL_MSG(token, amount))
      console.error(`Error withdrawing: ${e.response?.data ?? e.message}`)
    })
  }

  const handleClick = async () => {
    if (shouldUse) {
      buttonOnClick()
    } else if (isDisabled) {
      return
    } else {
      handleWithdraw()
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
        loadingText="Approving"
        onClick={handleClick}
        rightIcon={<ArrowForwardIcon />}
      >
        {shouldUse
          ? buttonText
          : hasInsufficientBalance
          ? "Insufficient balance"
          : `Withdraw ${baseTokenAmount || "0"} ${baseTicker}`}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
