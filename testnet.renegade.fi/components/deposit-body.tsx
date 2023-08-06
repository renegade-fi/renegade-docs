"use client"

import React, { createRef, useEffect, useRef, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { View } from "@/contexts/Renegade/types"
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

import BlurredOverlay from "@/components/blurred-overlay"

import DepositStepper from "./steppers/deposit-stepper/deposit-stepper"

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

export default function DepositBody() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { baseTicker, baseTokenAmount, setBaseTokenAmount } = useOrder()
  const { setView } = useRenegade()
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
            <div>
              <Button
                position="absolute"
                top="-24px"
                onClick={() => setView(View.TRADING)}
                variant="link"
              >
                <ChevronLeftIcon />
                Back to Trading
              </Button>
              <Text color="white.50" fontSize="34px">
                Let&apos;s get started by depositing{" "}
              </Text>
            </div>
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
          </HStack>
        </Box>
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
          opacity={baseTokenAmount ? 1 : 0}
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
          onClick={onOpen}
        >
          Preview Deposit
        </Button>
        <BlurredOverlay
          activeModal={activeModal}
          onClose={() => setActiveModal(undefined)}
          buySellSelectableCoords={buySellSelectableCoords.current}
          quoteTokenSelectableCoords={quoteTokenSelectableCoords.current}
        />
      </Flex>
      {/* <DepositModal isOpen={isOpen} onClose={onClose} /> */}
      {isOpen && <DepositStepper onClose={onClose} />}
    </>
  )
}
