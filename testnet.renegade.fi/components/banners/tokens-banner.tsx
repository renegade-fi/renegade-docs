"use client"

import Link from "next/link"
import { Stack, Text } from "@chakra-ui/react"
import { Exchange, PriceReport } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { LivePrices } from "@/components/banners/live-price"

import { InteractiveMarquee } from "./marquee"

export function TokensBanner({
  prices,
}: {
  prices: (PriceReport | undefined)[]
}) {
  return (
    <div
      style={{
        borderBottom: "var(--border)",
        borderTop: "var(--border)",
      }}
    >
      <InteractiveMarquee>
        {DISPLAYED_TICKERS.map(([baseTicker, quoteTicker], i) => {
          return (
            <Link
              href={`/${baseTicker}/${quoteTicker}`}
              key={baseTicker + quoteTicker}
            >
              <Stack alignItems="center" direction="row">
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
      </InteractiveMarquee>
    </div>
  )
}
