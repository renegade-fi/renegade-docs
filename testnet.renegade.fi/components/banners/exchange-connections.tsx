"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { ExchangeData, HealthState } from "@/types"
import { Box, Flex, Spacer, Stack } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { BannerSeparator } from "./banner-separator"
import { ExchangeConnectionTriple } from "./exchange-connection-triple"
import { MedianTriple } from "./median-triple"

interface ExchangeConnectionsBannerProps {
  priceReport: ExchangeData
  isMobile?: boolean
  priceReporterHealthStates: {
    median: HealthState
    binance: HealthState
    coinbase: HealthState
    kraken: HealthState
    okx: HealthState
    uniswapv3: HealthState
  }
}

export default function ExchangeConnectionsBanner({
  isMobile,
  priceReport,
  priceReporterHealthStates,
}: ExchangeConnectionsBannerProps) {
  const { baseToken, quoteToken } = useOrder()
  const exchangeConnectionsBannerRef = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolling, setIsScrolling] = useState(true)
  const [mouseDownX, setMouseDownX] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "left"
  )
  const [isTooShort, setIsTooShort] = useState(false)

  function onMouseEnter() {
    setIsHovered(true)
  }

  function onMouseLeave() {
    setIsHovered(false)
  }

  function onMouseDown(event: React.MouseEvent) {
    setIsClicked(true)
    setMouseDownX(event.clientX)
  }

  function onMouseUp() {
    setIsClicked(false)
  }

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const exchangeConnectionsBanner = exchangeConnectionsBannerRef.current
      if (exchangeConnectionsBanner && isClicked) {
        exchangeConnectionsBanner.scrollBy(
          -event.movementX / window.devicePixelRatio,
          0
        )
      }
    },
    [isClicked]
  )

  const performScroll = useCallback(() => {
    const exchangeConnectionsBanner = exchangeConnectionsBannerRef.current
    if (exchangeConnectionsBanner && isScrolling) {
      let scrollDest = isMobile
        ? exchangeConnectionsBanner.scrollTop
        : exchangeConnectionsBanner.scrollLeft
      scrollDest += scrollDirection === "left" ? 1 : -1
      const maxScroll = isMobile
        ? exchangeConnectionsBanner.scrollHeight -
          exchangeConnectionsBanner.clientHeight
        : exchangeConnectionsBanner.scrollWidth -
          exchangeConnectionsBanner.clientWidth
      setIsTooShort(maxScroll > 5)
      if (maxScroll > 5 && !isHovered && !isClicked) {
        if (scrollDest <= 0) {
          scrollDest = 0
          setIsScrolling(false)
          setScrollDirection("left")
          setTimeout(() => setIsScrolling(true), 1000)
        } else if (scrollDest >= maxScroll) {
          scrollDest = maxScroll
          setIsScrolling(false)
          setScrollDirection("right")
          setTimeout(() => setIsScrolling(true), 1000)
        }
        exchangeConnectionsBanner.scrollTo(
          isMobile ? 0 : scrollDest,
          isMobile ? scrollDest : 0
        )
      }
    }
    setTimeout(performScroll, 50)
  }, [isClicked, isHovered, isMobile, isScrolling, scrollDirection])

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)
    performScroll()
    return () => {
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [onMouseMove, performScroll])
  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      width={isMobile ? "calc(0.75 * var(--banner-height))" : "100%"}
      height={isMobile ? "220vw" : "var(--banner-height)"}
      alignItems="center"
      justifyContent="flex-start"
      fontSize={isMobile ? "0.8em" : undefined}
      borderBottom={isMobile ? undefined : "var(--border)"}
      borderLeft={isMobile ? "var(--border)" : undefined}
      borderColor="border"
      color="white.80"
      userSelect="none"
      spacing="0px"
    >
      <MedianTriple
        activeBaseTicker={baseToken}
        activeQuoteTicker={quoteToken}
        healthState={priceReporterHealthStates["median"]}
        isMobile={isMobile}
        priceReport={priceReport["median"]}
      />
      <Flex
        flexDirection={isMobile ? "column" : "row"}
        height={isMobile ? "60%" : undefined}
        width={isMobile ? undefined : "76%"}
        position="relative"
      >
        <Box
          height={isMobile ? "10px" : undefined}
          width={isMobile ? undefined : "10px"}
          position="absolute"
          top={isMobile ? "0px" : "1px"}
          bottom={isMobile ? undefined : "1px"}
          left={isMobile ? "1px" : "0px"}
          right={isMobile ? "1px" : undefined}
          visibility={isTooShort ? undefined : "hidden"}
          bg={`linear-gradient(${
            isMobile ? "180deg" : "90deg"
          }, rgba(0,0,0,1), rgba(0,0,0,0))`}
          zIndex="1"
        ></Box>
        <Box
          height="100%"
          width="100%"
          overflowX="hidden"
          overflowY="hidden"
          onMouseEnter={isMobile ? undefined : onMouseEnter}
          onMouseLeave={isMobile ? undefined : onMouseLeave}
          onMouseDown={isMobile ? undefined : onMouseDown}
          onMouseUp={isMobile ? undefined : onMouseUp}
          // @ts-ignore
          onMouseMove={isMobile ? undefined : onMouseMove}
          onDragStart={(e) => e.preventDefault()}
          onClick={(e) => {
            if (isMobile || Math.abs(e.clientX - mouseDownX) > 5) {
              e.preventDefault()
            }
          }}
          position="relative"
          ref={exchangeConnectionsBannerRef}
        >
          <Flex
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="center"
            minHeight={isMobile ? "310vw" : "var(--banner-height)"}
            minWidth={isMobile ? undefined : "1200px"}
          >
            <ExchangeConnectionTriple
              activeBaseTicker={baseToken}
              activeQuoteTicker={quoteToken}
              exchange={Exchange.Binance}
              healthState={priceReporterHealthStates["binance"]}
              isMobile={isMobile}
              priceReport={priceReport["binance"]}
            />
            <BannerSeparator flexGrow={4} />
            <ExchangeConnectionTriple
              activeBaseTicker={baseToken}
              activeQuoteTicker={quoteToken}
              exchange={Exchange.Coinbase}
              healthState={priceReporterHealthStates["coinbase"]}
              isMobile={isMobile}
              priceReport={priceReport["binance"]}
            />
            <BannerSeparator flexGrow={4} />
            <ExchangeConnectionTriple
              activeBaseTicker={baseToken}
              activeQuoteTicker={quoteToken}
              exchange={Exchange.Kraken}
              healthState={priceReporterHealthStates["kraken"]}
              isMobile={isMobile}
              priceReport={priceReport["kraken"]}
            />
            <BannerSeparator flexGrow={4} />
            <ExchangeConnectionTriple
              activeBaseTicker={baseToken}
              activeQuoteTicker={quoteToken}
              exchange={Exchange.Okx}
              healthState={priceReporterHealthStates["okx"]}
              isMobile={isMobile}
              priceReport={priceReport["okx"]}
            />
            <BannerSeparator flexGrow={4} />
            <ExchangeConnectionTriple
              activeBaseTicker={baseToken}
              activeQuoteTicker={quoteToken}
              exchange={Exchange.Uniswapv3}
              healthState={priceReporterHealthStates["uniswapv3"]}
              isMobile={isMobile}
              priceReport={priceReport["uniswapv3"]}
            />
            <Spacer flexGrow="3" />
          </Flex>
        </Box>
      </Flex>
    </Stack>
  )
}
