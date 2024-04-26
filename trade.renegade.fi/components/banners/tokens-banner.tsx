"use client"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { Stack, Text } from "@chakra-ui/react"
import { useLocalStorage } from "usehooks-ts"

import Marquee from "@/components/banners/marquee"
import { LivePrices } from "@/components/live-price"

export function TokensBanner({}: { prices?: number[] }) {
  const [_, setBaseToken] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
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
      {DISPLAYED_TICKERS.map(([baseTicker, quoteTicker]) => {
        if (["USDC", "USDT"].includes(baseTicker)) {
          return null
        }
        return (
          <Stack
            key={baseTicker + quoteTicker}
            alignItems="center"
            direction="row"
            marginRight="0.5rem"
            onClick={() => setBaseToken(baseTicker)}
          >
            <Text color="white.80" fontFamily="Favorit Expanded">
              {baseTicker}
            </Text>
            <LivePrices
              baseTicker={baseTicker}
              quoteTicker={quoteTicker}
              exchange="binance"
            />
          </Stack>
        )
      })}
    </Marquee>
  )
}
