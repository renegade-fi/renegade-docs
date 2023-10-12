"use client"

import React, { useMemo } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Button, HStack, Text, useDisclosure } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import { useAccount as useAccountWagmi } from "wagmi"

import { findBalanceByTicker } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { LivePrices } from "@/components/banners/live-price"
import { SignInModal } from "@/components/modals/signin-modal"
import { OrderStepper } from "@/components/steppers/order-stepper/order-stepper"

export function PlaceOrderButton() {
  const { address } = useAccountWagmi()
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
  const { setOpen } = useModalConnectKit()
  const { accountId } = useRenegade()
  const balances = useBalance()
  const { baseTicker, quoteTicker, baseTokenAmount, direction } = useOrder()
  const { getPriceData } = useExchange()

  const priceReport = getPriceData(Exchange.Median, baseTicker, quoteTicker)

  const hasInsufficientBalance = useMemo(() => {
    if (!accountId) return false
    const baseBalance = findBalanceByTicker(balances, baseTicker)
    const quoteBalance = findBalanceByTicker(balances, quoteTicker)
    if (direction === Direction.SELL) {
      return baseBalance.amount < baseTokenAmount
    }
    if (!priceReport?.midpointPrice) return false
    return quoteBalance.amount < priceReport?.midpointPrice
  }, [
    accountId,
    balances,
    baseTicker,
    baseTokenAmount,
    direction,
    priceReport?.midpointPrice,
    quoteTicker,
  ])

  const isSignedIn = accountId !== undefined
  let placeOrderButtonContent: React.ReactElement
  if (!address) {
    placeOrderButtonContent = <Text>Connect Wallet to Place Orders</Text>
  } else if (!isSignedIn) {
    placeOrderButtonContent = <Text>Sign in to Place Orders</Text>
  } else if (!priceReport?.midpointPrice) {
    placeOrderButtonContent = <Text>No Exchange Data</Text>
  } else if (hasInsufficientBalance) {
    placeOrderButtonContent = <Text>Insufficient Balance</Text>
  } else {
    placeOrderButtonContent = (
      <HStack spacing="4px">
        <Text>Place Order for</Text>
        <Box fontFamily="Favorit Mono">
          <LivePrices
            baseTicker={baseTicker}
            quoteTicker={quoteTicker}
            exchange={Exchange.Median}
            onlyShowPrice
            withCommas
            scaleBy={baseTokenAmount}
          />
        </Box>
        <ArrowForwardIcon />
      </HStack>
    )
  }

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
        _hover={{
          borderColor: "white.60",
          color: "white",
        }}
        _focus={{
          backgroundColor: "transparent",
        }}
        transform={baseTokenAmount ? "translateY(10px)" : "translateY(-10px)"}
        visibility={baseTokenAmount ? "visible" : "hidden"}
        cursor={baseTokenAmount ? "pointer" : "default"}
        transition="0.15s"
        backgroundColor="transparent"
        onClick={() => {
          if (!baseTokenAmount || hasInsufficientBalance) {
            return
          }
          if (!address) {
            setOpen(true)
            return
          }
          if (!isSignedIn) {
            onOpenSignIn()
            return
          }
          onOpenPlaceOrder()
        }}
      >
        {placeOrderButtonContent}
      </Button>
      <SignInModal isOpen={signInIsOpen} onClose={onCloseSignIn} />
      {placeOrderIsOpen && <OrderStepper onClose={onClosePlaceOrder} />}
    </>
  )
}
