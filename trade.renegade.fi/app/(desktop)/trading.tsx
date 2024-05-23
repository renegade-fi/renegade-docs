"use client"

import { PlaceOrderButton } from "@/app/(desktop)/place-order-button"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { Direction } from "@/lib/types"
import { ChevronDownIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Token } from "@renegade-fi/react"
import numeral from "numeral"
import React, { createRef, useEffect, useRef, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useMax } from "@/hooks/use-max"
import { useUSDPrice } from "@/hooks/use-usd-price"

import { BlurredOverlay } from "@/components/modals/blurred-overlay"
import { TradingTokenSelectModal } from "@/components/modals/renegade-token-select-modal"

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
        <ChevronDownIcon boxSize="20px" viewBox="6 6 12 12" />
      </HStack>
    )
  }
)
Selectable.displayName = "selectable"

export function TradingBody() {
  const { view } = useApp()
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const [baseTokenAmount, setBaseTokenAmount] = useState("")
  const [base, setBase] = useLocalStorage(
    "base",
    Token.findByTicker("WETH").ticker
  )
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const [direction] = useLocalStorage("direction", Direction.BUY)
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

  useEffect(() => {
    if (view === ViewEnum.TRADING && base === "USDC") {
      setBase("WETH")
    }
  }, [base, setBase, view])

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
            <InputWithMaxButton
              baseTokenAmount={baseTokenAmount}
              setBaseTokenAmount={setBaseTokenAmount}
            />
            <HStack
              userSelect="none"
              cursor="pointer"
              onClick={onOpenTokenMenu}
            >
              <Text cursor="pointer" variant="trading-body-button">
                {base}
              </Text>
              <ChevronDownIcon boxSize="20px" viewBox="6 6 12 12" />
            </HStack>
            <Text
              color="text.secondary"
              fontFamily="Favorit"
              fontSize="0.9em"
              fontWeight="200"
            >
              {direction === Direction.BUY ? "with" : "for"}
            </Text>
            <Text variant="trading-body-button">{quote}</Text>
          </HStack>
          <HelperText base={Token.findByTicker(base)} />
        </Flex>
        <PlaceOrderButton
          baseTokenAmount={baseTokenAmount}
          setBaseTokenAmount={setBaseTokenAmount}
        />
        <BlurredOverlay
          activeModal={activeModal}
          onClose={() => setActiveModal(undefined)}
          buySellSelectableCoords={buySellSelectableCoords.current}
        />
      </Flex>
      <TradingTokenSelectModal
        isOpen={tokenMenuIsOpen}
        onClose={onCloseTokenMenu}
      />
    </>
  )
}

function HelperText({ base }: { base: Token }) {
  const usdPrice = useUSDPrice(base)
  const formattedUsdPrice = numeral(usdPrice).format("$0.00")
  return (
    <Text color="text.muted" fontWeight="100" userSelect="text">
      Trades are end-to-end encrypted and always clear at the real-time midpoint
      of {formattedUsdPrice}
    </Text>
  )
}

function InputWithMaxButton({
  baseTokenAmount,
  setBaseTokenAmount,
}: {
  baseTokenAmount: string
  setBaseTokenAmount: (value: string) => void
}) {
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const [direction] = useLocalStorage("direction", Direction.BUY)
  const max = useMax(direction === Direction.SELL ? base : quote)
  const usdPrice = useUSDPrice(Token.findByTicker(base))
  const buyMax = (1 / usdPrice) * Number(max) * 0.99

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        isFinite(parseFloat(value)) &&
        parseFloat(value) >= 0)
    ) {
      setBaseTokenAmount(value)
    }
  }

  const handleSetMax = () => {
    if (max) {
      if (direction === Direction.SELL) {
        setBaseTokenAmount(max)
      } else {
        setBaseTokenAmount(buyMax.toString())
      }
    }
  }
  const hideMaxButton =
    !max ||
    (direction === Direction.SELL
      ? baseTokenAmount === max
      : baseTokenAmount === buyMax.toString())

  return (
    <InputGroup>
      <Input
        width="200px"
        paddingRight={hideMaxButton ? undefined : "3rem"}
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
        onChange={handleSetBaseTokenAmount}
        onFocus={(e) =>
          e.target.addEventListener("wheel", (e) => e.preventDefault(), {
            passive: false,
          })
        }
        placeholder="0.00"
        type="number"
        value={baseTokenAmount || ""}
      />
      {!hideMaxButton && (
        <InputRightElement width="3.5rem">
          <Button
            color="text.secondary"
            fontFamily="Favorit"
            fontWeight="400"
            borderRadius="100px"
            onClick={handleSetMax}
            size="xs"
            variant="ghost"
          >
            Max
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  )
}
