import { Orderbook, TradeAmounts } from "./price-simulation"
import { Direction } from "./types"
import { DISPLAY_TOKENS } from "@/lib/tokens"
import { Token } from "@renegade-fi/react"
import { Metadata } from "next"
import numeral from "numeral"
import { formatUnits } from "viem/utils"

import { OrderbookResponseData } from "@/app/api/get-binance-orderbook/route"

export function safeLocalStorageGetItem(key: string): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

export function safeLocalStorageSetItem(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

export function formatPrice(num: number) {
  const formatted = num.toFixed(2)
  return formatted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatNumber = (
  balance: bigint,
  decimals: number,
  long: boolean = false
) => {
  const balanceValue = Number(formatUnits(balance, decimals))
  const tempNumeral = numeral(balanceValue)

  if (balanceValue.toString().indexOf("e") !== -1) {
    if (long) {
      return formatScientificToDecimal(balanceValue)
    } else {
      return tempNumeral.format("0[.]00e+0")
    }
  }

  let formatStr = ""
  if (balanceValue > 10000000) {
    formatStr = long ? "0,0[.]00" : "0.00a"
  } else if (balanceValue > 1000000) {
    formatStr = long ? "0.[00]" : "0[.]00a"
  } else if (balanceValue > 10000) {
    formatStr = long ? "0.[00]" : "0[.]00a"
  } else if (balanceValue > 100) {
    formatStr = `0[.]00${long ? "00" : ""}`
  } else if (balanceValue >= 1) {
    formatStr = `0.[00${long ? "00" : ""}]`
  } else {
    formatStr = getFormat(balanceValue, long)
  }

  if (Number(balance.toString())) return tempNumeral.format(formatStr)
  return tempNumeral.format("0")
}

export const formatScientificToDecimal = (price: number) => {
  let priceStr = price.toString()
  const decimalPos = priceStr.indexOf(".")
  const exponentPos = priceStr.indexOf("e")

  if (decimalPos === -1) {
    priceStr =
      priceStr.substring(0, exponentPos) + "." + priceStr.substring(exponentPos)
  }

  const integerPart = priceStr.split(".")[0]
  const fractionalPart = priceStr.split(".")[1].split("e")[0]
  const exponentValue = Math.abs(Number(priceStr.split("e")[1]))

  return `0.${"0".repeat(
    exponentValue - 1
  )}${integerPart}${fractionalPart.substring(0, 3)}`
}

export const getFormat = (price: number, long: boolean = false) => {
  let format = "0."
  const fraction = price.toString().split(".")[1]

  if (fraction) {
    for (let digit of fraction) {
      if (digit === "0") {
        format += 0
      } else {
        break
      }
    }
  }

  return format + (long ? "0000" : "0")
}

export function constructMetadata({
  title = `Renegade Testnet | On-Chain Dark Pool`,
  description = `Trade any ERC-20 with zero price impact. Renegade is a MPC-based dark pool, delivering zero slippage cryptocurrency trades via anonymous crosses at midpoint prices.`,
  image = "https://www.renegade.fi/opengraph.png",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string | null
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: process.env.NEXT_PUBLIC_URL,
      ...(image && {
        images: [
          {
            url: image,
          },
        ],
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      creator: "@renegade_fi",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export const fundWallet = async (
  tokens: { ticker: string; amount: string }[],
  address: `0x${string}`
) => {
  await fetch(`/api/fund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tokens,
      address,
    }),
  })
}

export const fundList: { ticker: string; amount: string }[] = [
  { ticker: "WETH", amount: "3" },
  { ticker: "USDC", amount: "10000" },
  {
    ticker: "WBTC",
    amount: "0.2",
  },
  {
    ticker: "BNB",
    amount: "17",
  },
  {
    ticker: "MATIC",
    amount: "10000",
  },
  {
    ticker: "LDO",
    amount: "5000",
  },
  {
    ticker: "LINK",
    amount: "700",
  },
  {
    ticker: "UNI",
    amount: "1250",
  },
  {
    ticker: "SUSHI",
    amount: "5000",
  },
  {
    ticker: "1INCH",
    amount: "10000",
  },
  {
    ticker: "AAVE",
    amount: "120",
  },
  {
    ticker: "COMP",
    amount: "180",
  },
  {
    ticker: "MKR",
    amount: "3.75",
  },
  {
    ticker: "MANA",
    amount: "10000",
  },
  {
    ticker: "ENS",
    amount: "700",
  },
  {
    ticker: "DYDX",
    amount: "3333",
  },
  {
    ticker: "CRV",
    amount: "10000",
  },
]

export async function getInitialPrices(): Promise<Map<string, number>> {
  const baseUrl = process.env.NEXT_PUBLIC_PRICE_REPORTER_URL
  const usdtAddress = Token.findByTicker("USDT").address

  const promises = DISPLAY_TOKENS({ hideStables: true }).map((token) => {
    const topic = `binance-${token.address}-${usdtAddress}`
    return fetch(`https://${baseUrl}:3000/price/${topic}`)
      .then((res) => res.text())
      .then((price) => [topic, parseFloat(price)] as [string, number])
  })
  const results = await Promise.all(promises)
  return new Map(results)
}

export function calculateMaxQuote(maxQuote: number, usdPrice: number) {
  const baseMax = (maxQuote / usdPrice) * 0.99
  if (baseMax < 0.000001) {
    return
  }
  return baseMax
}

export async function getBinanceOrderbook(
  base_ticker: string,
  quote_ticker: string,
  timestamp: number
): Promise<OrderbookResponseData> {
  const url = new URL("/api/get-binance-orderbook", window.location.origin)
  url.searchParams.set("base_ticker", base_ticker)
  url.searchParams.set("quote_ticker", quote_ticker)
  url.searchParams.set("timestamp", timestamp.toString())
  const req = new Request(url)
  req.headers.set("Content-Type", "application/json")
  const res = await fetch(req)
  return res.json()
}

export async function simBinanceTradeAndMidpoint(
  base: Token,
  quote: Token,
  direction: Direction,
  quantity: number,
  timestamp: number
): Promise<{ tradeAmounts: TradeAmounts; midpointPrice: number }> {
  // Fetch the Binance orderbook at the given timestamp
  const orderbookRes = await getBinanceOrderbook(
    base.ticker,
    quote.ticker,
    timestamp
  )

  const orderbook = new Orderbook(orderbookRes.bids, orderbookRes.asks)

  // Simulate the effective amounts of base / quote that would be transacted on the Binance orderbook
  const tradeAmounts = orderbook.simulateTradeAmounts(quantity, direction)

  // Simulate the effective amounts of base / quote that would be transacted in Renegade (at the midpoint price)
  const midpointPrice = orderbook.midpointPrice()

  return {
    tradeAmounts,
    midpointPrice,
  }
}

export function calculateSavings(
  binanceTradeAmounts: TradeAmounts,
  quantity: number,
  direction: Direction,
  renegadePrice: number,
  renegadeFeeRate: number
): number {
  const {
    effectiveBaseAmount: effectiveBinanceBase,
    effectiveQuoteAmount: effectiveBinanceQuote,
  } = binanceTradeAmounts

  const renegadeQuote = quantity * renegadePrice

  const effectiveRenegadeBase =
    direction === Direction.BUY ? quantity * (1 - renegadeFeeRate) : quantity

  const effectiveRenegadeQuote =
    direction === Direction.SELL
      ? renegadeQuote * (1 - renegadeFeeRate)
      : renegadeQuote

  // Calculate the savings in base/quote amounts transacted between the Binance and Renegade trades.
  // When buying, we save when we receive more base and send less quote than on Binance.
  // When selling, we save when we receive more quote and send less base than on Binance.
  const baseSavings =
    direction === Direction.BUY
      ? effectiveRenegadeBase - effectiveBinanceBase
      : effectiveBinanceBase - effectiveRenegadeBase

  const quoteSavings =
    direction === Direction.SELL
      ? effectiveRenegadeQuote - effectiveBinanceQuote
      : effectiveBinanceQuote - effectiveRenegadeQuote

  // Represent the total savings via Renegade, denominated in the quote asset, priced at the current midpoint
  return baseSavings * renegadePrice + quoteSavings
}
