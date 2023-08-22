"use client"

import React, { createRef, useEffect, useRef, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Box, Flex, HStack, Input, Text, useDisclosure } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"
import { useAccount } from "wagmi"

import { LivePrices } from "@/components/banners/live-price"
import BlurredOverlay from "@/components/blurred-overlay"
import PlaceOrderButton from "@/components/place-order-button"
import TestnetStepper from "@/components/steppers/testnet-stepper/testnet-stepper"
import { TaskStatus } from "@/components/task-status"

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

export default function TradingBody() {
  const {
    direction,
    baseTicker,
    quoteTicker,
    baseTokenAmount,
    setBaseTokenAmount,
  } = useOrder()
  const [activeModal, setActiveModal] = useState<
    "buy-sell" | "base-token" | "quote-token"
  >()
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { accountId, balances, taskState, taskType } = useRenegade()

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

  useEffect(() => {
    const preloaded = localStorage.getItem(`${address}-preloaded`)
    if (preloaded || !accountId || Object.keys(balances).length) return
    if (!preloaded && accountId) {
      onOpen()
    }
  }, [accountId, address, balances, onOpen])

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flexGrow="1"
      >
        <Box
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
            <Selectable
              text={baseTicker}
              onClick={() => setActiveModal("base-token")}
              activeModal={activeModal}
              ref={baseTokenSelectableRef}
            />
            <Text
              color="white.50"
              fontFamily="Favorit"
              fontSize="0.9em"
              fontWeight="200"
            >
              {direction === Direction.BUY ? "with" : "for"}
            </Text>
            <Selectable
              text={quoteTicker}
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
                baseTicker={baseTicker}
                quoteTicker={quoteTicker}
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
        <Box position="absolute" right="0" bottom="0">
          {taskState && taskType && <TaskStatus />}
        </Box>
      </Flex>
      {isOpen && <TestnetStepper onClose={onClose} />}
    </>
  )
}
