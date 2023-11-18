import { env } from "@/env.mjs"
import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"

import {
  ADDR_TO_TICKER,
  DISPLAYED_TICKERS,
  KATANA_ADDRESS_TO_TICKER,
} from "@/lib/tokens"

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
  return await Promise.all(
    DISPLAYED_TICKERS.map(([baseTicker, quoteTicker]) =>
      renegade.queryExchangeHealthStates(
        getToken({ ticker: baseTicker, network: "goerli" }),
        getToken({ ticker: quoteTicker, network: "goerli" })
      )
    )
  ).then((res) => res.map((e) => e.Median))
}

export function findBalanceByTicker(
  balances: Record<BalanceId, Balance>,
  // TODO: Change to Token type
  ticker: string
) {
  const addressToFind = getToken({ ticker, network: getNetwork() }).address
  const foundBalance =
    Object.entries(balances)
      .map(([, balance]) => balance)
      .find((balance) => balance.mint.address === addressToFind) ??
    new Balance({
      mint: getToken({ ticker, network: getNetwork() }),
      amount: BigInt(0),
    })
  return foundBalance
}

export function getNetwork() {
  if (env.NEXT_PUBLIC_CHAIN_ID) {
    return env.NEXT_PUBLIC_CHAIN_ID
  } else if (
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME.endsWith(".renegade.fi")
  ) {
    const regex = /-([^\.]+)\.renegade\.fi$/
    const match = env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME.match(regex)
    if (match) {
      if (match[1] === "devnet") {
        return "katana"
      }
    } else {
      return undefined
    }
  }
  return undefined
}

export function getToken(token: {
  address?: string
  ticker?: string
  input?: string
  network?: string
}) {
  const network = token.network ?? getNetwork()
  if (token.input && token.input.length > 6) {
    return new Token({ address: token.input, network })
  } else if (token.input && token.input.length <= 6) {
    return new Token({ ticker: token.input, network })
  } else if (token.address) {
    return new Token({ address: token.address, network })
  } else {
    return new Token({ ticker: token.ticker, network })
  }
}

export function getTickerFromToken(token: Token) {
  try {
    if (getNetwork() === "katana") {
      return KATANA_ADDRESS_TO_TICKER[`0x${token.address}`]
    } else {
      return ADDR_TO_TICKER[`0x${token.address}`]
    }
  } catch (error) {
    throw new Error(`Could not get ticker from token: ${token}`)
  }
}
