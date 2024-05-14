"use client"

import { Stack, Text } from "@chakra-ui/react"
import { tokenMapping } from "@renegade-fi/react"
import { useLocalStorage } from "usehooks-ts"

import Marquee from "@/components/banners/marquee"
import { LivePrices } from "@/components/live-price"

export function TokensBanner({}: { prices?: number[] }) {
  const [_, setBaseToken] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const tokens = tokenMapping.tokens.filter(
    ({ ticker }) => !["USDC", "USDT"].includes(ticker)
  )
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
      {tokens.map(({ ticker }) => {
        return (
          <Stack
            key={ticker}
            alignItems="center"
            direction="row"
            marginRight="0.5rem"
            padding="4px 8px"
            borderRadius="0.5rem"
            _hover={{
              backgroundColor: "white.10",
            }}
            transition="background 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
            onClick={() => setBaseToken(ticker)}
          >
            <Text color="white.80" fontFamily="Favorit Expanded">
              {ticker}
            </Text>
            <LivePrices
              baseTicker={ticker}
              quoteTicker="USDC"
              exchange="binance"
            />
          </Stack>
        )
      })}
    </Marquee>
  )
}
