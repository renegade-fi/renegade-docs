"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react"

import { PulsingConnection } from "@/components/banners/pulsing-connection-indicator"

import { BannerSeparator } from "./banner-separator"

type RelayerBannerProps = {
  connectionState?: string
}

export default function RelayerBanner({ connectionState }: RelayerBannerProps) {
  const { baseToken, quoteToken } = useOrder()
  const relayerStatusBannerRef = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolling, setIsScrolling] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "left"
  )

  const performScroll = useCallback(() => {
    const relayerStatusBanner = relayerStatusBannerRef.current
    if (relayerStatusBanner && isScrolling && !isHovered && !isClicked) {
      let scrollDest =
        relayerStatusBanner.scrollLeft + (scrollDirection === "left" ? 1 : -1)
      const maxScroll =
        relayerStatusBanner.scrollWidth - relayerStatusBanner.clientWidth
      if (maxScroll > 0) {
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
        relayerStatusBanner.scrollTo(scrollDest, 0)
      }
    }
    setTimeout(performScroll, 50)
  }, [isClicked, isHovered, isScrolling, scrollDirection])

  function onMouseEnter() {
    setIsHovered(true)
  }

  function onMouseLeave() {
    setIsHovered(false)
  }

  function onMouseDown() {
    setIsClicked(true)
  }

  function onMouseUp() {
    setIsClicked(false)
  }

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const relayerStatusBanner = relayerStatusBannerRef.current
      if (relayerStatusBanner && isClicked) {
        relayerStatusBanner.scrollBy(
          -event.movementX / window.devicePixelRatio,
          0
        )
      }
    },
    [isClicked]
  )

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)
    performScroll()
    return () => {
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [onMouseMove, performScroll])

  let connectionText: React.ReactElement
  if (connectionState === "loading") {
    connectionText = <Text variant="status-gray">CONNECTING</Text>
  } else if (connectionState === "live") {
    connectionText = <Text variant="status-green">CONNECTED</Text>
  } else if (connectionState === "dead") {
    connectionText = <Text variant="status-red">DISCONNECTED</Text>
  } else {
    throw new Error("Invalid connection state: " + connectionState)
  }
  return (
    <Box
      height="var(--banner-height)"
      overflow="hidden"
      borderBottom="var(--border)"
      borderColor="border"
      color="white.80"
      userSelect="none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      // @ts-ignore
      onMouseMove={onMouseMove}
      ref={relayerStatusBannerRef}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        minWidth="1200px"
        height="var(--banner-height)"
      >
        <Spacer flexGrow="2" />
        <Text>Liquidity</Text>
        <BannerSeparator flexGrow={1} />
        <Text>420.00 {baseToken}</Text>
        <BannerSeparator flexGrow={1} />
        <Text>69,000.00 {quoteToken}</Text>
        <BannerSeparator flexGrow={3} />
        <Text>Relayer</Text>
        <BannerSeparator flexGrow={1} />
        <Text>renegade-relayer.eth</Text>
        <BannerSeparator flexGrow={1} />
        <HStack>
          {connectionText}
          <PulsingConnection state={connectionState} />
        </HStack>
        <BannerSeparator flexGrow={3} />
        <Text>Fees</Text>
        <BannerSeparator flexGrow={1} />
        <Text>Relayer 0.08%</Text>
        <BannerSeparator flexGrow={1} />
        <Text>Protocol 0.02%</Text>
        <BannerSeparator flexGrow={3} />
        <Text>Debug</Text>
        <Spacer flexGrow="2" />
      </Flex>
    </Box>
  )
}
