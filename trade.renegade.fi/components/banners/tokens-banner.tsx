"use client"

import { Stack, Text } from "@chakra-ui/react"
import { Exchange, PriceReport } from "@renegade-fi/renegade-js"
import Link from "next/link"

import Marquee from "@/components/banners/marquee"
import { LivePrices } from "@/components/live-price"
import { DISPLAYED_TICKERS } from "@/lib/tokens"

export function TokensBanner({
  prices,
}: {
  prices: (PriceReport | undefined)[]
}) {
  return (
    <Marquee
      autoFill
      pauseOnHover
      style={{
        alignItems: "center",
        borderBottom: "var(--border)",
        borderTop: "var(--border)",
        display: "flex",
        height: "var(--banner-height)",
      }}
    >
      {DISPLAYED_TICKERS.map(([baseTicker, quoteTicker], i) => {
        return (
          <Link
            href={`/${baseTicker}/${quoteTicker}`}
            key={baseTicker + quoteTicker}
          >
            <Stack alignItems="center" direction="row" marginRight="0.5rem">
              <Text color="white.80" fontFamily="Favorit Expanded">
                {baseTicker}
              </Text>
              <LivePrices
                baseTicker={baseTicker}
                quoteTicker={quoteTicker}
                exchange={Exchange.Median}
                price={prices[i]?.midpointPrice}
              />
            </Stack>
          </Link>
        )
      })}
    </Marquee>
  )
}
