"use client"

import { Box, Stack, Text } from "@chakra-ui/react"

import { LivePrices } from "@/components/live-price"

const DISPLAYED_TICKERS = [
  ["WBTC", "USDC"],
  ["WETH", "USDC"],
  ["UNI", "USDC"],
  ["AAVE", "USDC"],
  ["BNB", "USDC"],
  ["MATIC", "USDC"],
  ["LDO", "USDC"],
]

export function TokensBanner({ prices }: { prices: number[] }) {
  return (
    <Box
      width="calc(0.75 * var(--banner-height))"
      fontSize="0.8em"
      borderRight="var(--border)"
      borderLeft="var(--border)"
    >
      {DISPLAYED_TICKERS.map(([baseTicker, quoteTicker], i) => {
        return (
          <Stack
            key={`${baseTicker}_${quoteTicker}`}
            alignItems="center"
            direction="column-reverse"
            marginBottom="0.5rem"
          >
            <Text
              color="white.80"
              fontFamily="Favorit Expanded"
              variant="rotate-left"
            >
              {baseTicker}
            </Text>
            <LivePrices
              shouldRotate={true}
              isMobile
              baseTicker={baseTicker}
              quoteTicker={quoteTicker}
              exchange="binance"
              initialPrice={prices[i]}
            />
          </Stack>
        )
      })}
    </Box>
  )
}
