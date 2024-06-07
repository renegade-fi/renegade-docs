import {
  MAX_BALANCES_PLACE_ORDER_TOOLTIP,
  MAX_ORDERS_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Direction } from "@/lib/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  useBackOfQueueBalances,
  useBackOfQueueOrders,
  useBalances,
  useStatus,
} from "@renegade-fi/react"
import { MAX_BALANCES, MAX_ORDERS } from "@renegade-fi/react/constants"
import { useMemo } from "react"
import { useLocalStorage } from "usehooks-ts"
import { useAccount as useAccountWagmi } from "wagmi"

import { useButton } from "@/hooks/use-button"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { Tooltip } from "@/components/tooltip"

export function PlaceOrderButton({
  baseTokenAmount,
  onOpen,
}: {
  baseTokenAmount: string
  onOpen: () => void
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

  const status = useStatus()
  const isConnected = status === "in relayer"

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

  const backOfQueueBalances = useBackOfQueueBalances()
  const orders = useBackOfQueueOrders()

  const isMaxOrders = orders.length === MAX_ORDERS
  const isMaxBalances = backOfQueueBalances.length === MAX_BALANCES
  const isExistingBalance = balances.find(
    ({ mint }) =>
      mint === (direction === Direction.BUY ? baseAddress : quoteAddress)
  )

  const isDisabled =
    isConnected &&
    (hasZeroBalance || isMaxOrders || (isMaxBalances && !isExistingBalance))

  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (isMaxOrders) {
    placeOrderButtonContent = "Max orders reached"
  } else if (!isExistingBalance && isMaxBalances) {
    placeOrderButtonContent = "Max balances reached"
  } else if (hasZeroBalance) {
    placeOrderButtonContent = "Insufficient balance"
  } else {
    placeOrderButtonContent = `Place Order for ${
      baseTokenAmount || "0"
    } ${base}`
  }

  return (
    <>
      <Tooltip
        label={
          isMaxOrders
            ? MAX_ORDERS_TOOLTIP
            : !isExistingBalance && isMaxBalances
            ? MAX_BALANCES_PLACE_ORDER_TOOLTIP
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
              onOpen()
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
