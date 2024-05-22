import { FAILED_PLACE_ORDER_MSG, QUEUED_PLACE_ORDER_MSG } from "@/lib/task"
import { INSUFFICIENT_BALANCE_TOOLTIP } from "@/lib/tooltip-labels"
import { Direction } from "@/lib/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  createOrder,
  parseAmount,
  useBalances,
  useConfig,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { useMemo } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { v4 as uuidv4 } from "uuid"
import { useAccount as useAccountWagmi } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { Tooltip } from "@/components/tooltip"

export function PlaceOrderButton({
  baseTokenAmount,
  setBaseTokenAmount,
}: {
  baseTokenAmount: string
  setBaseTokenAmount: (baseTokenAmount: string) => void
}) {
  const { address } = useAccountWagmi()
  const balances = useBalances()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const baseToken = Token.findByTicker(base)
  const baseAddress = baseToken.address
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const quoteToken = Token.findByTicker(quote)
  const quoteAddress = quoteToken.address
  const [direction] = useLocalStorage("direction", Direction.BUY)

  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Place Orders",
    onOpenSignIn,
    signInText: "Sign in to Place Orders",
  })

  const config = useConfig()
  const status = useStatus()

  const isConnected = status === "in relayer"

  const taskHistory = useTaskHistory()
  const isQueue = taskHistory.find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )
  const handlePlaceOrder = async () => {
    const id = uuidv4()
    const parsedAmount = parseAmount(baseTokenAmount, baseToken)
    setBaseTokenAmount("")
    if (isQueue) {
      toast.message(QUEUED_PLACE_ORDER_MSG(baseToken, parsedAmount, direction))
    }
    await createOrder(config, {
      id,
      base: baseAddress,
      quote: quoteAddress,
      side: direction,
      amount: parsedAmount,
    }).catch((e) => {
      toast.error(
        FAILED_PLACE_ORDER_MSG(
          baseToken,
          parsedAmount,
          direction,
          e.shortMessage ?? e.response.data
        )
      )
      console.error(`Error placing order: ${e.response?.data ?? e.message}`)
    })
  }

  const hasZeroBalance = useMemo(() => {
    if (!baseTokenAmount) return false
    const baseBalance =
      balances.find(({ mint }) => mint === baseAddress)?.amount || BigInt(0)
    const quoteBalance =
      balances.find(({ mint }) => mint === quoteAddress)?.amount || BigInt(0)
    if (direction === Direction.SELL) {
      return baseBalance === BigInt(0)
    }
    return quoteBalance === BigInt(0)
  }, [balances, baseAddress, baseTokenAmount, direction, quoteAddress])

  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (hasZeroBalance) {
    placeOrderButtonContent = "Insufficient Balance"
  } else {
    placeOrderButtonContent = `Place Order for ${
      baseTokenAmount || "0"
    } ${base}`
  }

  const isDisabled = isConnected && (!baseTokenAmount || hasZeroBalance)

  const hasInsufficientBalance = useMemo(() => {
    if (!baseTokenAmount) return false
    const sendMint = direction === Direction.SELL ? baseAddress : quoteAddress
    const sendBalance =
      balances.find(({ mint }) => mint === sendMint)?.amount || BigInt(0)
    return !sendBalance
  }, [balances, baseAddress, baseTokenAmount, direction, quoteAddress])

  return (
    <>
      <Tooltip
        placement="bottom"
        label={
          !shouldUse && !hasZeroBalance && hasInsufficientBalance
            ? INSUFFICIENT_BALANCE_TOOLTIP
            : ""
        }
      >
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
          opacity={
            !baseTokenAmount ? "0" : !address || !isConnected ? "0.6" : "1"
          }
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
          loadingText="Please wait for task completion"
          onClick={() => {
            if (shouldUse) {
              buttonOnClick()
            } else if (isDisabled) {
              return
            } else {
              handlePlaceOrder()
            }
          }}
          rightIcon={<ArrowForwardIcon />}
        >
          {placeOrderButtonContent}
        </Button>
      </Tooltip>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
