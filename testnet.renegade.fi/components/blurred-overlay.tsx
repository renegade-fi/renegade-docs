"use client"

import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { Flex, Text, keyframes } from "@chakra-ui/react"

interface BlurredOverlayProps {
  activeModal?: "buy-sell" | "base-token" | "quote-token"
  onClose: () => void
  buySellSelectableCoords: [number, number]
  quoteTokenSelectableCoords: [number, number]
}
export function BlurredOverlay({
  activeModal,
  buySellSelectableCoords,
  onClose,
  quoteTokenSelectableCoords,
}: BlurredOverlayProps) {
  const { setDirection, setQuoteToken } = useOrder()
  function OrText() {
    return (
      <Text
        margin="-10px 0 -5px 0"
        color="white.70"
        fontFamily="Aime"
        fontSize="0.8em"
      >
        or
      </Text>
    )
  }

  function BuySellMenu() {
    return (
      <Flex
        position="absolute"
        top={buySellSelectableCoords[1]}
        left={buySellSelectableCoords[0]}
        alignItems="center"
        flexDirection="column"
        fontSize="1.9em"
        transform="translate(-50%, -50%) translateX(-20px)"
        hidden={activeModal !== "buy-sell"}
      >
        <Text
          animation={`${snapAnimation(70)} 0.15s ease both`}
          cursor="pointer"
          onClick={() => {
            onClose()
            setDirection(Direction.BUY)
          }}
          variant="trading-body-button"
        >
          BUY
        </Text>
        <OrText />
        <Text
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          cursor="pointer"
          onClick={() => {
            onClose()
            setDirection(Direction.SELL)
          }}
          variant="trading-body-button"
        >
          SELL
        </Text>
      </Flex>
    )
  }

  function QuoteTokenMenu() {
    return (
      <Flex
        position="absolute"
        top={quoteTokenSelectableCoords[1]}
        left={quoteTokenSelectableCoords[0]}
        alignItems="center"
        flexDirection="column"
        fontSize="1.9em"
        transform="translate(-50%, -50%) translateX(-20px)"
        hidden={activeModal !== "quote-token"}
      >
        <Text
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(70)} 0.15s ease both`}
          cursor="pointer"
          onClick={() => {
            onClose()
            setQuoteToken("USDC")
          }}
          variant="trading-body-button"
        >
          USDC
        </Text>
        <OrText />
        <Text
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          cursor="pointer"
          onClick={() => {
            onClose()
            setQuoteToken("USDT")
          }}
          variant="trading-body-button"
        >
          USDT
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      pointerEvents={activeModal ? "auto" : "none"}
      transition="0.1s"
      backdropFilter={activeModal ? "blur(8px)" : ""}
      onClick={() => {
        onClose()
      }}
    >
      <BuySellMenu />
      <QuoteTokenMenu />
    </Flex>
  )
}

function snapAnimation(translateY: number) {
  return keyframes`
    0% {
      transform: translateY(${translateY}%);
      opacity: 0;
    }
    80% {
      transform: translateY(${-translateY / 6}%);
      opacity: 0.4;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  `
}
