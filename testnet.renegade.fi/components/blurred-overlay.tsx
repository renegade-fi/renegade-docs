"use client"

import { useEffect, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Input,
  Text,
  VStack,
  keyframes,
} from "@chakra-ui/react"

import { DISPLAYED_TICKERS, TICKER_TO_ADDR } from "@/lib/tokens"

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
    } 75% {
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
export function BlurredOverlay({
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

  function BaseTokenMenu() {
    const { balances } = useRenegade()
    const [height, setHeight] = useState("")
    useEffect(() => {
      if (height) return
      setHeight(`${window.innerHeight * 0.5}px`)
    }, [height])

    return (
      <Flex
        className="scroll"
        flexDirection="column"
        overflowY="scroll"
        maxHeight={height}
        fontSize="1.2em"
        border="var(--border)"
        borderColor="white.30"
        borderRadius="5px"
        animation={`${popAnimation(1.015)} 0.1s ease both`}
        backgroundColor="white.5"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&::-webkit-scrollbar-track": {
            display: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            display: "none",
          },
        }}
        hidden={activeModal !== "base-token"}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <VStack gap="2" margin="4">
          <Text color="white.80" fontSize="1.2em" textAlign="center">
            Select a Token
          </Text>
          <Input
            fontFamily="Favorit"
            borderRadius="10px"
            placeholder="Search name or paste ERC-20 address"
            type="text"
          />
        </VStack>
        <Flex position="relative" flexDirection="column">
          {DISPLAYED_TICKERS.map(([ticker], i) => {
            const tickerAddress = TICKER_TO_ADDR[ticker]
            const matchingBalance = Object.values(balances).find(
              (balance) => `0x${balance.mint.address}` === tickerAddress
            )
            const balanceAmount = matchingBalance
              ? matchingBalance.amount.toString()
              : "0"
            return (
              <Grid
                className="wrapper"
                key={ticker}
                position="relative"
                alignItems="center"
                gridTemplateColumns="2fr 1fr 1fr"
                overflow="hidden"
                height="60px"
                borderTop="var(--border)"
                _hover={{
                  transition: "0.3s cubic-bezier(0.215, 0.61, 0.355, 1)",
                }}
                cursor="pointer"
                transition="0.1s"
                onClick={() => setBaseToken(ticker)}
                paddingX="4"
              >
                <Box
                  position="absolute"
                  zIndex={-1}
                  bottom="-60px"
                  width="100%"
                  height="60px"
                  background="white.10"
                  transition="0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                  id="slide"
                />
                <GridItem>
                  <Box key={ticker} paddingY="2">
                    {ticker}
                  </Box>
                </GridItem>
                <GridItem>
                  <Box key={ticker} paddingLeft="4" paddingY="2">
                    <Text color="white.50" fontFamily="Favorit Mono">
                      {tickerAddress.slice(0, 6) + "..."}
                    </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box key={ticker} textAlign="right" paddingY="2">
                    <Text color="white.50" fontFamily="Favorit Mono">
                      {balanceAmount}
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            )
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
