import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"
import { Metadata } from "next"
import { formatUnits, isAddress, parseUnits } from "viem"

import { env } from "@/env.mjs"
import { DISPLAYED_TICKERS } from "@/lib/tokens"

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

export async function getTokenBannerData(renegade: Renegade) {
  try {
    const priceReports = await Promise.all(
      DISPLAYED_TICKERS.map(([baseTicker, quoteTicker]) =>
        renegade.queryPriceReporter(
          getToken({ ticker: baseTicker }),
          getToken({ ticker: quoteTicker })
        )
      )
    )

    const formattedPrices = priceReports.map((report) => {
      if (report.price_report?.Nominal) {
        return report.price_report.Nominal.price as number
      } else {
        return 0
      }
    })

    return formattedPrices
  } catch (error) {
    console.error("Error fetching token banner data:", error)
    return []
  }
}

export function findBalanceByTicker(
  balances: Record<BalanceId, Balance>,
  ticker: string
) {
  const addressToFind = Token.findAddressByTicker(ticker)
  const foundBalance =
    Object.entries(balances)
      .map(([, balance]) => balance)
      // TODO: 0x prefix issue
      .find((balance) => `0x${balance.mint.address}` === addressToFind) ??
    new Balance({
      mint: getToken({ ticker }),
      amount: BigInt(0),
      relayer_fee_balance: BigInt(0),
      protocol_fee_balance: BigInt(0),
    })
  return foundBalance
}

export function getToken({
  address,
  ticker,
  input,
}: {
  address?: string
  ticker?: string
  input?: string
}) {
  if (address && isAddress(address)) {
    return new Token({ address })
  } else if (ticker) {
    return new Token({ ticker })
  } else if (input && isAddress(input)) {
    return new Token({ address: input })
  } else {
    return new Token({ ticker: input })
  }
}

export function formatAmount(amount: bigint, token: Token) {
  const decimals = token.decimals
  if (!decimals) throw new Error(`Decimals not found for 0x${token.address}`)
  let formatted = formatUnits(amount, decimals)
  if (formatted.includes(".")) {
    const [integerPart, decimalPart] = formatted.split(".")
    formatted = `${integerPart}.${decimalPart.substring(0, 2)}`
  }
  return formatted
}

export function parseAmount(amount: string, token: Token) {
  const decimals = token.decimals
  if (!decimals) throw new Error(`Decimals not found for 0x${token.address}`)
  // TODO: Should try to fetch decimals from on chain
  return parseUnits(amount, decimals)
}

export function formatPrice(num: number) {
  const formatted = num.toFixed(2)
  return formatted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
      url: env.NEXT_PUBLIC_URL,
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
      creator: "@dubdotco",
    },
    metadataBase: new URL(env.NEXT_PUBLIC_URL),
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
  try {
    const response = await fetch(`/api/fund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens,
        address,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        text ||
          "Funding failed: An unexpected error occurred. Please try again."
      )
    }

    const text = await response.text()
    safeLocalStorageSetItem(`funded_${address}`, "true")
    console.log("Funding success:", text)
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

export const fundList: { ticker: string; amount: string }[] = [
  {
    ticker: "WBTC",
    amount: "5",
  },
  {
    ticker: "BNB",
    amount: "100",
  },
  {
    ticker: "MATIC",
    amount: "100",
  },
  {
    ticker: "LDO",
    amount: "100",
  },
  {
    ticker: "LINK",
    amount: "100",
  },
  {
    ticker: "UNI",
    amount: "100",
  },
  {
    ticker: "SUSHI",
    amount: "100",
  },
  {
    ticker: "1INCH",
    amount: "100",
  },
  {
    ticker: "AAVE",
    amount: "100",
  },
  {
    ticker: "COMP",
    amount: "100",
  },
  {
    ticker: "MKR",
    amount: "100",
  },
  {
    ticker: "REN",
    amount: "100",
  },
  {
    ticker: "MANA",
    amount: "100",
  },
  {
    ticker: "ENS",
    amount: "100",
  },
  {
    ticker: "DYDX",
    amount: "100",
  },
  {
    ticker: "CRV",
    amount: "100",
  },
]
