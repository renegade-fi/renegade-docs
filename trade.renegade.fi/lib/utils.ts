import { env } from "@/env.mjs"
import { OrderState } from "@renegade-fi/react"
import { Metadata } from "next"

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

export const getReadableState = (state: OrderState) => {
  switch (state) {
    case OrderState.Created:
      return "Open"
    case OrderState.Matching:
      return "Open"
    case OrderState.SettlingMatch:
      return "Settling"
    case OrderState.Filled:
      return "Matched"
    case OrderState.Cancelled:
      return "Cancelled"
  }
}
