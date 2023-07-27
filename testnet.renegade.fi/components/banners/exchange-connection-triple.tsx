import React from "react"
import { PriceReport } from "@/contexts/RenegadeContext"
import { Flex, Link, Stack, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { TICKER_TO_ADDR } from "@/lib/tokens"

import { BannerSeparator } from "./banner-separator"
import { LivePrices } from "./live-price"
import { PulsingConnection } from "./pulsing-connection-indicator"

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation"

function LinkWrapper(props: { link?: string; children: React.ReactNode }) {
  return (
    <Flex
      as={Link}
      cursor={props.link ? undefined : "inherit"}
      height="100%"
      alignItems="center"
      justifyContent="center"
      href={props.link}
      isExternal
      flexGrow="1"
      userSelect="none"
      _hover={{ textDecoration: "none" }}
    >
      {props.children}
    </Flex>
  )
}

interface ExchangeConnectionTripleProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  exchange: Exchange
  healthState: HealthState
  isMobile?: boolean
  priceReport: PriceReport
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
    median: undefined,
  }[props.exchange]

  let showPrice: boolean
  let connectionText: string
  let textVariant: string
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
    <>
      <LinkWrapper link={link}>
        <Text variant={props.isMobile ? "rotate-right" : undefined}>
          {props.exchange[0].toUpperCase() + props.exchange.slice(1)}
        </Text>
      </LinkWrapper>
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
      <LinkWrapper link={link}>
        <Stack
          direction={props.isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          spacing={props.isMobile ? "8px" : "5px"}
        >
          <Text
            variant={textVariant}
            lineHeight="1"
            sx={
              props.isMobile
                ? {
                    writingMode: "vertical-rl",
                    textOrientation: "sideways",
                  }
                : undefined
            }
          >
            {connectionText}
          </Text>
          <PulsingConnection state={pulseState} />
        </Stack>
      </LinkWrapper>
    </>
  )
}
