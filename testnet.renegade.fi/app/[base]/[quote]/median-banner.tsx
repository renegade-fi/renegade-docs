"use client"

import { Fragment } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { ExchangeReport, HealthState } from "@/types"
import { Box, Flex, Spacer, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { BannerSeparator } from "@/components/banners/banner-separator"
import { ExchangeConnectionTriple } from "@/components/banners/exchange-banner"
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
    <Flex alignItems="center">
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
                <Fragment key={exchange}>
                  <ExchangeConnectionTriple
                    activeBaseTicker={baseTicker}
                    activeQuoteTicker={quoteTicker}
                    exchange={exchange as Exchange}
                    healthState={priceReporterHealthStates[e as Exchange]}
                    priceReport={priceReport[e as Exchange]}
                  />
                  <BannerSeparator flexGrow={4} />
                </Fragment>
              )
            })}
        </InteractiveMarquee>
      </Flex>
    </Flex>
  )
}
