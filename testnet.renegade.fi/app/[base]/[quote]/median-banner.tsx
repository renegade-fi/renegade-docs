"use client"

import { useOrder } from "@/contexts/Order/order-context"
import { ExchangeReport, HealthState, PriceReport } from "@/types"
import { Box, Flex, Link, Spacer, Stack, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { TICKER_TO_ADDR } from "@/lib/tokens"
import { BannerSeparator } from "@/components/banners/banner-separator"
import { LivePrices } from "@/components/banners/live-price"
import { PulsingConnection } from "@/components/banners/pulsing-connection-indicator"
import { InteractiveMarquee } from "@/app/[base]/[quote]/marquee"

export default function MedianBanner({
  priceReport,
  priceReporterHealthStates,
}: {
  priceReport: ExchangeReport
  priceReporterHealthStates: {
    median: HealthState
    binance: HealthState
    coinbase: HealthState
    kraken: HealthState
    okx: HealthState
    uniswapv3: HealthState
  }
}) {
  const { baseTicker, quoteTicker } = useOrder()
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
          activeBaseTicker={baseTicker}
          activeQuoteTicker={quoteTicker}
          exchange={Exchange.Median}
          healthState={priceReporterHealthStates.median}
          priceReport={priceReport.median}
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
          {Object.keys(Exchange)
            .filter((e) => e !== "Median")
            .map((exchange) => {
              const e = exchange.toLowerCase()
              return (
                <Flex key={exchange} alignItems="center" gap="4" marginLeft="4">
                  <ExchangeConnectionTriple
                    activeBaseTicker={baseTicker}
                    activeQuoteTicker={quoteTicker}
                    exchange={exchange.toLowerCase() as Exchange}
                    healthState={priceReporterHealthStates[e as Exchange]}
                    priceReport={priceReport[e as Exchange]}
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
  activeBaseTicker: string
  activeQuoteTicker: string
  exchange: Exchange
  healthState: HealthState
  isMobile?: boolean
  priceReport?: PriceReport
}
export function ExchangeConnectionTriple(props: ExchangeConnectionTripleProps) {
  // Remap some tickers, as different exchanges use different names
  let renamedBaseTicker = props.activeBaseTicker
  let renamedQuoteTicker = props.activeQuoteTicker
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
    uniswapv3: `https://info.uniswap.org/#/tokens/${
      TICKER_TO_ADDR[props.activeBaseTicker]
    }`,
    median: "",
  }[props.exchange]

  let showPrice: boolean
  let connectionText: string
  let textVariant: string
  // TODO: update state to reflect cache behavior
  if (props.healthState === "connecting") {
    showPrice = true
    connectionText = "LIVE"
    textVariant = "status-green"
  } else if (props.healthState === "unsupported") {
    showPrice = false
    connectionText = "UNSUPPORTED"
    textVariant = "status-gray"
  } else if (props.healthState === "live") {
    showPrice = true
    connectionText = "LIVE"
    textVariant = "status-green"
  } else if (props.healthState === "no-data") {
    showPrice = false
    connectionText = "NO DATA"
    textVariant = "status-gray"
  } else if (props.healthState === "too-stale") {
    showPrice = false
    connectionText = "TOO STALE"
    textVariant = "status-red"
  } else if (props.healthState === "not-enough-data") {
    showPrice = false
    connectionText = "NOT ENOUGH DATA"
    textVariant = "status-gray"
  } else if (props.healthState === "too-much-deviation") {
    showPrice = false
    connectionText = "TOO MUCH DEVIATION"
    textVariant = "status-red"
  } else {
    throw new Error("Invalid health state: " + props.healthState)
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
      <BannerSeparator flexGrow={1} link={link} />
      {showPrice && (
        <LivePrices
          baseTicker={props.activeBaseTicker}
          quoteTicker={props.activeQuoteTicker}
          exchange={props.exchange}
          link={link}
          isMobile={props.isMobile}
          price={props.priceReport?.midpointPrice}
        />
      )}
      <Stack
        alignItems="baseline"
        justifyContent="center"
        direction={props.isMobile ? "column" : "row"}
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
