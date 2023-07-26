"use client"

import React, { createRef, useEffect, useRef, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Flex, HStack, Input, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { LivePrices } from "@/components/banners/live-price"
import BlurredOverlay from "@/components/blurred-overlay"
import PlaceOrderButton from "@/components/place-order-button"

interface SelectableProps {
  text: string
  onClick: () => void
  activeModal?: "buy-sell" | "base-token" | "quote-token"
}
const Selectable = React.forwardRef(
  (props: SelectableProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <HStack
        ref={ref}
        onClick={props.onClick}
        cursor="pointer"
        userSelect="none"
      >
        <Text
          variant={
            props.activeModal
              ? "trading-body-button-blurred"
              : "trading-body-button"
          }
        >
          {props.text}
        </Text>
        <ChevronDownIcon boxSize="20px" viewBox="6 6 12 12" color="white.100" />
      </HStack>
    )
  }
)
Selectable.displayName = "selectable"

export default function TradingBody() {
  const {
    direction,
    baseToken,
    quoteToken,
    baseTokenAmount,
    setBaseTokenAmount,
  } = useOrder()
  const [activeModal, setActiveModal] = useState<
    "buy-sell" | "base-token" | "quote-token"
  >()

  const buySellSelectableRef = createRef<HTMLDivElement>()
  const baseTokenSelectableRef = createRef<HTMLDivElement>()
  const quoteTokenSelectableRef = createRef<HTMLDivElement>()
  const buySellSelectableCoords = useRef<[number, number]>([0, 0])
  const quoteTokenSelectableCoords = useRef<[number, number]>([0, 0])

  useEffect(() => {
    function getRefCoords(
      ref: React.RefObject<HTMLDivElement>
    ): [number, number] {
      if (!ref.current || !ref.current.offsetParent) {
        return [0, 0]
      }
      return [
        // @ts-ignore
        ref.current.offsetParent.offsetLeft +
          ref.current.offsetLeft +
          ref.current.offsetWidth / 2,
        // @ts-ignore
        ref.current.offsetParent.offsetTop +
          ref.current.offsetTop +
          ref.current.offsetHeight / 2 +
          (baseTokenAmount ? -15 : 10),
      ]
    }
    buySellSelectableCoords.current = getRefCoords(buySellSelectableRef)
    quoteTokenSelectableCoords.current = getRefCoords(quoteTokenSelectableRef)

    return () => {}
  }, [baseTokenAmount, buySellSelectableRef, quoteTokenSelectableRef])

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      position="relative"
      flexGrow="1"
    >
      <Box
        transform={baseTokenAmount ? "translateY(-15px)" : "translateY(10px)"}
        transition="0.15s"
      >
        <HStack fontFamily="Aime" fontSize="1.8em" spacing="20px">
          <Selectable
            text={direction === Direction.QUOTE_TO_ACTIVE ? "BUY" : "SELL"}
            onClick={() => setActiveModal("buy-sell")}
            activeModal={activeModal}
            ref={buySellSelectableRef}
          />
          <Input
            borderColor="whiteAlpha.300"
            _placeholder={{ color: "whiteAlpha.400" }}
            fontFamily="Favorit"
            fontSize="0.8em"
            placeholder="0.00"
            width="200px"
            borderRadius="100px"
            type="number"
            outline="none !important"
            value={baseTokenAmount || ""}
            onChange={(e) => setBaseTokenAmount(parseFloat(e.target.value))}
            onKeyPress={(e) => e.key === "-" && e.preventDefault()}
            onFocus={(e) =>
              e.target.addEventListener("wheel", (e) => e.preventDefault(), {
                passive: false,
              })
            }
            _focus={{
              borderColor: "white.50 !important",
              boxShadow: "none !important",
            }}
          />
          <Selectable
            text={baseToken}
            onClick={() => setActiveModal("base-token")}
            activeModal={activeModal}
            ref={baseTokenSelectableRef}
          />
          <Text
            fontFamily="Favorit"
            fontWeight="200"
            fontSize="0.9em"
            color="white.50"
          >
            {direction === Direction.QUOTE_TO_ACTIVE ? "with" : "for"}
          </Text>
          <Selectable
            text={quoteToken}
            onClick={() => setActiveModal("quote-token")}
            activeModal={activeModal}
            ref={quoteTokenSelectableRef}
          />
        </HStack>
        <HStack
          marginTop="5px"
          color="white.50"
          fontFamily="Favorit Extended"
          fontWeight="100"
          spacing="0"
        >
          <Text marginRight="4px">
            Trades are end-to-end encrypted and always clear at the real-time
            midpoint of
          </Text>
          <Box fontFamily="Favorit Mono">
            <LivePrices
              baseTicker={baseToken}
              quoteTicker={quoteToken}
              exchange={Exchange.Median}
              onlyShowPrice
              withCommas
            />
          </Box>
        </HStack>
      </Box>
      <PlaceOrderButton />
      <BlurredOverlay
        activeModal={activeModal}
        onClose={() => setActiveModal(undefined)}
        buySellSelectableCoords={buySellSelectableCoords.current}
        quoteTokenSelectableCoords={quoteTokenSelectableCoords.current}
      />
    </Flex>
  )
}
