"use client"

import { useMemo } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"
import { useAccount as useAccountWagmi } from "wagmi"

import { findBalanceByTicker } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { useButton } from "@/hooks/use-button"
import { useIsLocked } from "@/hooks/use-is-locked"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { OrderStepper } from "@/components/steppers/order-stepper/order-stepper"

export function PlaceOrderButton() {
  const { address } = useAccountWagmi()
  const balances = useBalance()
  const {
    isOpen: placeOrderIsOpen,
    onOpen: onOpenPlaceOrder,
    onClose: onClosePlaceOrder,
  } = useDisclosure()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { getPriceData } = useExchange()
  const isLocked = useIsLocked()
  const { baseTicker, quoteTicker, baseTokenAmount, direction } = useOrder()
  const { accountId } = useRenegade()

  const priceReport = getPriceData(Exchange.Median, baseTicker, quoteTicker)

  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Place Orders",
    onOpenSignIn,
    signInText: "Sign in to Place Orders",
  })

  const hasInsufficientBalance = useMemo(() => {
    const baseBalance = findBalanceByTicker(balances, baseTicker)
    const quoteBalance = findBalanceByTicker(balances, quoteTicker)
    if (direction === Direction.SELL) {
      return baseBalance.amount < baseTokenAmount
    }
    if (!priceReport?.midpointPrice) return false
    return quoteBalance.amount < priceReport?.midpointPrice
  }, [
    balances,
    baseTicker,
    baseTokenAmount,
    direction,
    priceReport?.midpointPrice,
    quoteTicker,
  ])

  const isSignedIn = accountId !== undefined
  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (!priceReport?.midpointPrice) {
    placeOrderButtonContent = "No Exchange Data"
  } else if (hasInsufficientBalance) {
    placeOrderButtonContent = "Insufficient Balance"
  } else {
    placeOrderButtonContent = `Place Order for ${
      baseTokenAmount || ""
    } ${baseTicker}`
  }
  const isDisabled =
    accountId && (!baseTokenAmount || hasInsufficientBalance || isLocked)

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
        isLoading={isLocked}
        loadingText="Please wait for task completion"
        onClick={() => {
          if (shouldUse) {
            buttonOnClick()
          } else if (isDisabled) {
            return
          } else {
            onOpenPlaceOrder()
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
