"use client"

import React, { createRef, useEffect, useRef, useState } from "react"
import { OrderProvider, useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, HStack, Input, Text, useDisclosure } from "@chakra-ui/react"

import { useUDSPrice } from "@/hooks/use-usd-price"
import { BlurredOverlay } from "@/components/blurred-overlay"
import { TokenSelectModal } from "@/components/modals/token-select-modal"
import { PlaceOrderButton } from "@/components/place-order-button"

interface SelectableProps {
  text: string
  onClick: () => void
  activeModal?: "buy-sell" | "quote-token"
}
const Selectable = React.forwardRef(
  (props: SelectableProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <HStack
        ref={ref}
        userSelect="none"
        cursor="pointer"
        onClick={props.onClick}
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

export function TradingBody() {
  return (
    <OrderProvider>
      <TradingInner />
    </OrderProvider>
  )
}

function TradingInner() {
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const {
    baseTicker,
    baseTokenAmount,
    direction,
    quoteTicker,
    setBaseToken,
    setBaseTokenAmount,
  } = useOrder()
  const [activeModal, setActiveModal] = useState<"buy-sell" | "quote-token">()

  const buySellSelectableRef = createRef<HTMLDivElement>()
  const buySellSelectableCoords = useRef<[number, number]>([0, 0])

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

    return () => {}
  }, [baseTokenAmount, buySellSelectableRef])

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flexGrow="1"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          transform={baseTokenAmount ? "translateY(-15px)" : "translateY(10px)"}
          transition="0.15s"
        >
          <HStack fontFamily="Aime" fontSize="1.8em" spacing="20px">
            <Selectable
              text={direction.toString().toUpperCase()}
              onClick={() => setActiveModal("buy-sell")}
              activeModal={activeModal}
              ref={buySellSelectableRef}
            />
            <Input
              width="200px"
              fontFamily="Favorit"
              fontSize="0.8em"
              borderColor="whiteAlpha.300"
              borderRadius="100px"
              _focus={{
                borderColor: "white.50 !important",
                boxShadow: "none !important",
              }}
              _placeholder={{ color: "whiteAlpha.400" }}
              outline="none !important"
              onChange={(e) => setBaseTokenAmount(parseFloat(e.target.value))}
              onFocus={(e) =>
                e.target.addEventListener("wheel", (e) => e.preventDefault(), {
                  passive: false,
                })
              }
              onKeyPress={(e) => e.key === "-" && e.preventDefault()}
              placeholder="0.00"
              type="number"
              value={baseTokenAmount || ""}
            />
            <HStack
              userSelect="none"
              cursor="pointer"
              onClick={onOpenTokenMenu}
            >
              <Text cursor="pointer" variant="trading-body-button">
                {baseTicker}
              </Text>
              <ChevronDownIcon
                boxSize="20px"
                viewBox="6 6 12 12"
                color="white.100"
              />
            </HStack>
            <Text
              color="white.50"
              fontFamily="Favorit"
              fontSize="0.9em"
              fontWeight="200"
            >
              {direction === Direction.BUY ? "with" : "for"}
            </Text>
            <Text variant="trading-body-button">{quoteTicker}</Text>
          </HStack>
          <HelperText baseTicker={baseTicker} />
        </Flex>
        <PlaceOrderButton />
        <BlurredOverlay
          activeModal={activeModal}
          onClose={() => setActiveModal(undefined)}
          buySellSelectableCoords={buySellSelectableCoords.current}
        />
      </Flex>
      <TokenSelectModal
        isOpen={tokenMenuIsOpen}
        isTrading
        onClose={onCloseTokenMenu}
        setToken={setBaseToken}
      />
    </>
  )
}

function HelperText({ baseTicker }: { baseTicker: string }) {
  const usdPrice = useUDSPrice(baseTicker, 1)
  return (
    <HStack
      marginTop="5px"
      color="white.50"
      fontFamily="Favorit Extended"
      fontWeight="100"
      userSelect="text"
      spacing="0"
    >
      <Text marginRight="4px">
        Trades are end-to-end encrypted and always clear at the real-time
        midpoint of ${usdPrice}
      </Text>
    </HStack>
  )
}
