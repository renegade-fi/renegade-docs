"use client"

import { useExchange } from "@/contexts/Exchange/exchange-context"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Exchange, Order, OrderId } from "@renegade-fi/renegade-js"
import { useMemo } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { useAccount as useAccountWagmi } from "wagmi"

import { renegade } from "@/app/providers"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { OrderStepper } from "@/components/steppers/order-stepper/order-stepper"
import { LocalOrder } from "@/components/steppers/order-stepper/steps/confirm-step"
import { useBalance } from "@/hooks/use-balance"
import { useButton } from "@/hooks/use-button"
import { findBalanceByTicker, formatAmount, parseAmount, safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"

export function PlaceOrderButton() {
  const { address } = useAccountWagmi()
  const balances = useBalance()
  const { isOpen: placeOrderIsOpen, onClose: onClosePlaceOrder } =
    useDisclosure()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { getPriceData } = useExchange()
  const { base, baseTicker, baseTokenAmount, direction, quote, quoteTicker } =
    useOrder()
  const { accountId } = useRenegade()

  const priceReport = getPriceData(Exchange.Median, baseTicker, quoteTicker)

  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Place Orders",
    onOpenSignIn,
    signInText: "Sign in to Place Orders",
  })

  const handlePlaceOrder = async () => {
    if (!accountId) return
    const id = uuidv4() as OrderId
    const parsedAmount = parseAmount(baseTokenAmount, base)
    const order = new Order({
      id,
      baseToken: base,
      quoteToken: quote,
      side: direction,
      type: "midpoint",
      amount: parsedAmount,
    })
    renegade.task
      .placeOrder(accountId, order)
      .then(() => {
        const o = safeLocalStorageGetItem(`order-details-${accountId}`)
        const parseO: LocalOrder[] = o ? JSON.parse(o) : []
        const newO = [
          ...parseO,
          {
            id,
            base: order.baseToken.address,
            quote: order.quoteToken.address,
            side: direction,
            amount: baseTokenAmount,
          },
        ]
        safeLocalStorageSetItem(
          `order-details-${accountId}`,
          JSON.stringify(newO)
        )
      })
      .then(() =>
        toast.message(
          `Started to place order to ${direction === "buy" ? "Buy" : "Sell"
          } ${baseTokenAmount} ${baseTicker} for ${quoteTicker}`,
          {
            description: "Check the history tab for the status of the task",
          }
        )
      )
      .catch(() => toast.error("Error placing order, please try again"))
  }

  const hasInsufficientBalance = useMemo(() => {
    const baseBalance = findBalanceByTicker(balances, baseTicker).amount
    const quoteBalance = findBalanceByTicker(balances, quoteTicker).amount
    const price = priceReport?.midpointPrice ? priceReport.midpointPrice * parseFloat(baseTokenAmount) : 0
    if (direction === Direction.SELL) {
      return baseBalance < parseAmount(baseTokenAmount, base)
    }
    // TODO: Check this
    return parseFloat(formatAmount(quoteBalance, quote)) < price
  }, [balances, base, baseTicker, baseTokenAmount, direction, priceReport?.midpointPrice, quote, quoteTicker])

  const isSignedIn = accountId !== undefined
  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (!priceReport?.midpointPrice) {
    placeOrderButtonContent = "No Exchange Data"
  } else if (hasInsufficientBalance) {
    placeOrderButtonContent = "Insufficient Balance"
  } else {
    placeOrderButtonContent = `Place Order for ${baseTokenAmount || ""
      } ${baseTicker}`
  }
  const isDisabled = accountId && (!baseTokenAmount || hasInsufficientBalance)

  return (
    <>
      <Button
        padding="20px"
        color="white.80"
        fontSize="1.2em"
        fontWeight="200"
        opacity={!baseTokenAmount ? "0" : !address || !isSignedIn ? "0.6" : "1"}
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
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
      {placeOrderIsOpen && <OrderStepper onClose={onClosePlaceOrder} />}
    </>
  )
}