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
            setDirection(Direction.QUOTE_TO_ACTIVE)
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
            setDirection(Direction.ACTIVE_TO_QUOTE)
          }}
          variant="trading-body-button"
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
        color="border"
        border="var(--border)"
        borderRadius="5px"
        onClick={() => {
          onClose()
          setBaseToken(ticker)
        }}
      >
        <Image width="20px" height="20px" alt="Ticker" src={imageUrl} />
        <Text color="white.90" fontSize="0.8em">
          {ticker}
        </Text>
      </HStack>
    )
  }

  function BaseTokenMenu() {
    return (
      <Flex
        alignItems="center"
        flexDirection="column"
        maxWidth="25%"
        minHeight="75%"
        padding="25px"
        fontSize="1.5em"
        border="var(--border)"
        borderColor="white.30"
        borderRadius="15px"
        animation={`${popAnimation(1.015)} 0.1s ease both`}
        backgroundColor="white.5"
        hidden={activeModal !== "base-token"}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Text width="100%" color="white.80" fontSize="0.8em" textAlign="left">
          Select a Token
        </Text>
        <Input
          width="100%"
          margin="15px 10px 0 10px"
          fontFamily="Favorit"
          fontSize="0.8em"
          borderRadius="10px"
          placeholder="Search name or paste ERC-20 address"
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
      <BaseTokenMenu />
      <QuoteTokenMenu />
    </Flex>
  )
}
