import { FUNDED_ADDRESSES } from "@/constants/storage-keys"
import { env } from "@/env.mjs"
import { Metadata } from "next"
import numeral from "numeral"
import { Address } from "viem"
import { formatUnits } from "viem/utils"

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
  address: Address
) => {
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
    console.error("could not fund", text)
  } else {
    const fundedAddresses = JSON.parse(
      safeLocalStorageGetItem(FUNDED_ADDRESSES) || "[]"
    )
    const updatedAddresses = Array.from(new Set([...fundedAddresses, address]))
    safeLocalStorageSetItem(FUNDED_ADDRESSES, JSON.stringify(updatedAddresses))
    console.log("Funding success")
  }
}

export const fundList: { ticker: string; amount: string }[] = [
  { ticker: "WETH", amount: "10" },
  { ticker: "USDC", amount: "1000000" },
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
