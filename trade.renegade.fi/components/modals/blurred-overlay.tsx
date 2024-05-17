"use client"

import { Direction } from "@/lib/types"
import { Flex, Text, keyframes } from "@chakra-ui/react"
import { useLocalStorage } from "usehooks-ts"

interface BlurredOverlayProps {
  activeModal?: "buy-sell" | "base-token" | "quote-token"
  onClose: () => void
  buySellSelectableCoords: [number, number]
}
export function BlurredOverlay({
  activeModal,
  buySellSelectableCoords,
  onClose,
}: BlurredOverlayProps) {
  const [_, setDirection] = useLocalStorage("direction", Direction.BUY)
  function OrText() {
    return (
      <Text
        margin="-10px 0 -5px 0"
        color="text.secondary"
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
