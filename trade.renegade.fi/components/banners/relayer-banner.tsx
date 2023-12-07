"use client"

import React, { useEffect, useRef, useState } from "react"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"

import { BannerSeparator } from "../banner-separator"
import { PulsingConnection } from "../pulsing-connection-indicator"

interface RelayerStatusBannerProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  connectionState?: "live" | "dead" | "loading"
}

export const RelayerStatusBanner: React.FC<RelayerStatusBannerProps> = ({
  activeBaseTicker,
  activeQuoteTicker,
  connectionState,
}) => {
  const relayerStatusBannerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "left"
  )
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    const handleMouseUp = () => setIsClicked(false)
    const handleMouseMove = (event: MouseEvent) => {
      const relayerStatusBanner = relayerStatusBannerRef.current
      if (relayerStatusBanner && isClicked) {
        relayerStatusBanner.scrollBy(
          -event.movementX / window.devicePixelRatio,
          0
        )
      }
    }

    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isClicked])

  useEffect(() => {
    const performScroll = () => {
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
    }

    const scrollInterval = setInterval(performScroll, 50)
    return () => clearInterval(scrollInterval)
  }, [isScrolling, isHovered, isClicked, scrollDirection])

  let connectionText: React.ReactElement
  switch (connectionState) {
    case "loading":
      connectionText = <Text variant="status-gray">CONNECTING</Text>
      break
    case "live":
      connectionText = <Text variant="status-green">CONNECTED</Text>
      break
    case "dead":
      connectionText = <Text variant="status-red">DISCONNECTED</Text>
      break
    default:
      throw new Error("Invalid connection state: " + connectionState)
  }

  return (
    <Box
      ref={relayerStatusBannerRef}
      overflow="hidden"
      height="var(--banner-height)"
      color="white.80"
      borderBottom="var(--border)"
      whiteSpace="nowrap"
      userSelect="text"
      onMouseDown={() => setIsClicked(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(event: React.MouseEvent) => {
        const relayerStatusBanner = relayerStatusBannerRef.current
        if (relayerStatusBanner && isClicked) {
          relayerStatusBanner.scrollBy(
            -event.movementX / window.devicePixelRatio,
            0
          )
        }
      }}
      onMouseUp={() => setIsClicked(false)}
      paddingX="32px"
    >
      <Flex
        sx={{ justifyContent: "space-evenly" }}
        alignItems="center"
        height="var(--banner-height)"
      >
        <Flex gap="32px">
          <Text>Liquidity</Text>
          <Text>
            <Text as="span" fontFamily="Favorit Mono">
              420.00&nbsp;
            </Text>
            {activeBaseTicker}
          </Text>
          <Text>
            <Text as="span" fontFamily="Favorit Mono">
              69,000.00&nbsp;
            </Text>
            {activeQuoteTicker}
          </Text>
        </Flex>
        <BannerSeparator />
        <Flex gap="32px">
          <Text>Relayer</Text>
          <Text>renegade-relayer.eth</Text>
          <HStack>
            {connectionText}
            <PulsingConnection state={connectionState} />
          </HStack>
        </Flex>
        <BannerSeparator />
        <Flex gap="32px">
          <Text>Fees</Text>
          <Text>
            Relayer&nbsp;&nbsp;
            <Text as="span" fontFamily="Favorit Mono">
              0.08%
            </Text>
          </Text>
          <Text>
            Protocol&nbsp;&nbsp;
            <Text as="span" fontFamily="Favorit Mono">
              0.02%
            </Text>
          </Text>
          <Box width="0px" />
        </Flex>
      </Flex>
    </Box>
  )
}
