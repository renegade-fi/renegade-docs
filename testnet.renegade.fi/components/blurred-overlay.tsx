"use client"

import React, { useEffect, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import {
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  keyframes,
} from "@chakra-ui/react"

import { TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"

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

function popAnimation(maxScale: number) {
  return keyframes`
    0% {
      transform: scale(0.95);
      opacity: 0;
    }
    75% {
      transform: scale(${maxScale});
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `
}

interface BlurredOverlayProps {
  activeModal?: "buy-sell" | "base-token" | "quote-token"
  onClose: () => void
  buySellSelectableCoords: [number, number]
  quoteTokenSelectableCoords: [number, number]
}
export default function BlurredOverlay({
  activeModal,
  buySellSelectableCoords,
  onClose,
  quoteTokenSelectableCoords,
}: BlurredOverlayProps) {
  const { setDirection, setBaseToken, setQuoteToken } = useOrder()
  function OrText() {
    return (
      <Text
        margin="-10px 0 -5px 0"
        fontFamily="Aime"
        fontSize="0.8em"
        color="white.70"
      >
        or
      </Text>
    )
  }

  function BuySellMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        hidden={activeModal !== "buy-sell"}
        position="absolute"
        left={buySellSelectableCoords[0]}
        top={buySellSelectableCoords[1]}
        transform="translate(-50%, -50%) translateX(-20px)"
        fontSize="1.9em"
      >
        <Text
          variant="trading-body-button"
          cursor="pointer"
          animation={`${snapAnimation(70)} 0.15s ease both`}
          onClick={() => {
            onClose()
            setDirection(Direction.QUOTE_TO_ACTIVE)
          }}
        >
          BUY
        </Text>
        <OrText />
        <Text
          variant="trading-body-button"
          cursor="pointer"
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          onClick={() => {
            onClose()
            setDirection(Direction.ACTIVE_TO_QUOTE)
          }}
        >
          SELL
        </Text>
      </Flex>
    )
  }

  interface SingleBaseTokenProps {
    ticker: string
  }
  function SingleBaseToken({ ticker }: SingleBaseTokenProps) {
    const [imageUrl, setImageUrl] = useState("DEFAULT.png")
    useEffect(() => {
      const getLogos = async () => {
        await TICKER_TO_LOGO_URL_HANDLE.then((TICKER_TO_LOGO_URL) =>
          setImageUrl(TICKER_TO_LOGO_URL[ticker])
        )
      }
      getLogos()
    }, [ticker])

    return (
      <HStack
        as={Button}
        margin="5px"
        padding="8px"
        border="var(--border)"
        borderRadius="5px"
        color="border"
        onClick={() => {
          onClose()
          setBaseToken(ticker)
        }}
      >
        <Image alt="Ticker" src={imageUrl} width="20px" height="20px" />
        <Text fontSize="0.8em" color="white.90">
          {ticker}
        </Text>
      </HStack>
    )
  }

  function BaseTokenMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        padding="25px"
        maxWidth="25%"
        minHeight="75%"
        hidden={activeModal !== "base-token"}
        fontSize="1.5em"
        backgroundColor="white.5"
        border="var(--border)"
        borderColor="white.30"
        borderRadius="15px"
        animation={`${popAnimation(1.015)} 0.1s ease both`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Text width="100%" fontSize="0.8em" textAlign="left" color="white.80">
          Select a Token
        </Text>
        <Input
          width="100%"
          margin="15px 10px 0 10px"
          fontFamily="Favorit"
          fontSize="0.8em"
          placeholder="Search name or paste ERC-20 address"
          borderRadius="10px"
          type="text"
        />
        <Flex flexWrap="wrap" margin="15px 0 0 0">
          {["WBTC", "WETH", "UNI", "CRV", "AAVE", "LDO"].map((ticker) => {
            return <SingleBaseToken key={ticker} ticker={ticker} />
          })}
        </Flex>
      </Flex>
    )
  }

  function QuoteTokenMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        hidden={activeModal !== "quote-token"}
        position="absolute"
        left={quoteTokenSelectableCoords[0]}
        top={quoteTokenSelectableCoords[1]}
        transform="translate(-50%, -50%) translateX(-20px)"
        fontSize="1.9em"
      >
        <Text
          variant="trading-body-button"
          cursor="pointer"
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(70)} 0.15s ease both`}
          onClick={() => {
            onClose()
            setQuoteToken("USDC")
          }}
        >
          USDC
        </Text>
        <OrText />
        <Text
          variant="trading-body-button"
          cursor="pointer"
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          onClick={() => {
            onClose()
            setQuoteToken("USDT")
          }}
        >
          USDT
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      backdropFilter={activeModal ? "blur(8px)" : ""}
      transition="0.1s"
      userSelect="none"
      onClick={() => {
        onClose()
      }}
      pointerEvents={activeModal ? "auto" : "none"}
    >
      <BuySellMenu />
      <BaseTokenMenu />
      <QuoteTokenMenu />
    </Flex>
  )
}
