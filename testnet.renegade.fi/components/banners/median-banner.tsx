"use client"

import { useOrder } from "@/contexts/Order/order-context"
import { Box, Flex, Link, Spacer, Stack, Text } from "@chakra-ui/react"
import {
  Exchange,
  ExchangeHealthState,
  HealthState,
  PriceReport,
} from "@renegade-fi/renegade-js"

import { TICKER_TO_ADDR } from "@/lib/tokens"
import { BannerSeparator } from "@/components/banners/banner-separator"
import { LivePrices } from "@/components/banners/live-price"
import { InteractiveMarquee } from "@/components/banners/marquee"
import { PulsingConnection } from "@/components/banners/pulsing-connection-indicator"

export function MedianBanner({ report }: { report: ExchangeHealthState }) {
  return (
    <Flex
      alignItems="center"
      style={{
        borderBottom: "var(--border)",
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width="24%"
        minWidth="400px"
        height="100%"
      >
        <Spacer flexGrow="3" />
        <Text whiteSpace="nowrap">NBBO Feed</Text>
        <BannerSeparator flexGrow={4} />
        <ExchangeConnectionTriple
          exchange={Exchange.Median}
          priceReport={
            report.Median || { healthState: HealthState.enum.NoDataReported }
          }
        />
        <BannerSeparator flexGrow={4} />
      </Flex>
      <Flex position="relative">
        <Box
          position="absolute"
          zIndex="1"
          top={"1px"}
          bottom={"1px"}
          width={"10px"}
          background={`linear-gradient(${"90deg"}, rgba(0,0,0,1), rgba(0,0,0,0))`}
        />
        <InteractiveMarquee>
          {Object.entries(report)
            .filter(([exchange]) => exchange !== "Median")
            .map(([exchange, p]) => {
              return (
                <Flex key={exchange} alignItems="center" gap="4" marginLeft="4">
                  <ExchangeConnectionTriple
                    exchange={exchange.toLowerCase() as Exchange}
                    priceReport={p}
                  />
                  <BannerSeparator flexGrow={4} />
                </Flex>
              )
            })}
        </InteractiveMarquee>
      </Flex>
    </Flex>
  )
}

interface ExchangeConnectionTripleProps {
  exchange: Exchange
  isMobile?: boolean
  priceReport: PriceReport
}
export function ExchangeConnectionTriple(props: ExchangeConnectionTripleProps) {
  const { baseTicker, quoteTicker } = useOrder()
  // Remap some tickers, as different exchanges use different names
  let renamedBaseTicker = baseTicker
  let renamedQuoteTicker = quoteTicker
  if (renamedBaseTicker === "WBTC") {
    renamedBaseTicker = "BTC"
  }
  if (renamedBaseTicker === "WETH") {
    renamedBaseTicker = "ETH"
  }
  if (renamedQuoteTicker === "USDC") {
    renamedQuoteTicker = {
      binance: "BUSD",
      coinbase: "USD",
      kraken: "USD",
      okx: "USDT",
    }[props.exchange.toString()] as string // TODO: This is wrong?
  }

  // Construct the link
  const link = {
    binance: `https://www.binance.com/en/trade/${renamedBaseTicker}_${renamedQuoteTicker}`,
    coinbase: `https://www.coinbase.com/advanced-trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    kraken: `https://pro.kraken.com/app/trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    okx: `https://www.okx.com/trade-swap/${renamedBaseTicker}-${renamedQuoteTicker}-swap`,
    uniswapv3: `https://info.uniswap.org/#/tokens/${TICKER_TO_ADDR[baseTicker]}`,
    median: "",
  }[props.exchange]
  const healthState = props.priceReport?.healthState

  let showPrice: boolean
  let connectionText: string
  let textVariant: string
  // TODO: update state to reflect cache behavior
  if (healthState === HealthState.enum.Connecting) {
    showPrice = true
    connectionText = "LIVE"
    textVariant = "status-green"
  } else if (healthState === HealthState.enum.Unsupported) {
    showPrice = false
    connectionText = "UNSUPPORTED"
    textVariant = "status-gray"
  } else if (healthState === HealthState.enum.Live) {
    showPrice = true
    connectionText = "LIVE"
    textVariant = "status-green"
  } else if (healthState === HealthState.enum.NoDataReported) {
    showPrice = false
    connectionText = "NO DATA"
    textVariant = "status-gray"
  } else if (healthState === HealthState.enum.TooStale) {
    showPrice = false
    connectionText = "TOO STALE"
    textVariant = "status-red"
  } else if (healthState === HealthState.enum.NotEnoughData) {
    showPrice = false
    connectionText = "NOT ENOUGH DATA"
    textVariant = "status-gray"
  } else if (healthState === HealthState.enum.TooMuchDeviation) {
    showPrice = false
    connectionText = "TOO MUCH DEVIATION"
    textVariant = "status-red"
  } else {
    throw new Error("Invalid health state: " + healthState)
  }

  const pulseState = {
    "status-green": "live",
    "status-gray": "loading",
    "status-red": "dead",
  }[textVariant] as "live" | "loading" | "dead"

  return (
    <Flex
      as={Link}
      alignItems="center"
      gap="2"
      _hover={{ textDecoration: "none" }}
      userSelect="none"
      cursor="pointer"
      href={link}
      isExternal
    >
      <Text variant={props.isMobile ? "rotate-right" : undefined}>
        {props.exchange[0].toUpperCase() + props.exchange.slice(1)}
      </Text>
      <BannerSeparator flexGrow={1} />
      {showPrice && (
        <LivePrices
          baseTicker={baseTicker}
          quoteTicker={quoteTicker}
          exchange={props.exchange}
          isMobile={props.isMobile}
          price={props.priceReport?.midpointPrice}
        />
      )}
      <Stack
        alignItems="baseline"
        justifyContent="center"
        direction={props.isMobile ? "column" : "row"}
        whiteSpace="nowrap"
        spacing={props.isMobile ? "8px" : "1"}
      >
        <Text
          sx={
            props.isMobile
              ? {
                  writingMode: "vertical-rl",
                  textOrientation: "sideways",
                }
              : undefined
          }
          lineHeight="1"
          variant={textVariant}
        >
          {connectionText}
        </Text>
        <PulsingConnection state={pulseState} />
      </Stack>
    </Flex>
  )
}
