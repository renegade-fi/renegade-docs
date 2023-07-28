"use client"

import React from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import RenegadeContext from "@/contexts/RenegadeContext"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Button, HStack, Text, useDisclosure } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import { useAccount as useAccountWagmi } from "wagmi"

import { LivePrices } from "@/components/banners/live-price"

import PlaceOrderModal from "./modals/place-order-modal"
import SignInModal from "./modals/signin-modal"

export default function PlaceOrderButton() {
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
  const { accountId } = React.useContext(RenegadeContext)
  const { baseToken, direction, quoteToken, baseTokenAmount } = useOrder()

  const isSignedIn = accountId !== undefined
  let placeOrderButtonContent: React.ReactElement
  if (!address) {
    placeOrderButtonContent = <Text>Connect Wallet to Place Orders</Text>
  } else if (!isSignedIn) {
    placeOrderButtonContent = <Text>Sign in to Place Orders</Text>
  } else {
    placeOrderButtonContent = (
      <HStack spacing="4px">
        <Text>Place Order for</Text>
        <Box fontFamily="Favorit Mono">
          <LivePrices
            baseTicker={baseToken}
            quoteTicker={quoteToken}
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
        opacity={!baseTokenAmount ? "0" : !address || !isSignedIn ? "0.6" : "1"}
        visibility={baseTokenAmount ? "visible" : "hidden"}
        transform={baseTokenAmount ? "translateY(10px)" : "translateY(-10px)"}
        cursor={baseTokenAmount ? "pointer" : "default"}
        transition="0.15s"
        padding="20px"
        backgroundColor="transparent"
        fontSize="1.2em"
        fontWeight="200"
        color="white.80"
        borderWidth="thin"
        borderRadius="100px"
        borderColor="white.40"
        _hover={{
          borderColor: "white.60",
          color: "white",
        }}
        _focus={{
          backgroundColor: "transparent",
        }}
        onClick={() => {
          if (!baseTokenAmount) {
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
      <PlaceOrderModal
        isOpen={placeOrderIsOpen}
        onClose={onClosePlaceOrder}
        activeDirection={
          direction === Direction.QUOTE_TO_ACTIVE ? "buy" : "sell"
        }
        activeBaseTicker={baseToken}
        activeQuoteTicker={quoteToken}
        activeBaseTokenAmount={baseTokenAmount}
      />
    </>
  )
}
