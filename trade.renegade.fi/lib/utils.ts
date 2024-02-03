import { env } from "@/env.mjs"
import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"

import {
  DISPLAYED_TICKERS,
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
  ticker: string
) {
  const addressToFind = Token.findAddressByTicker(ticker)
  const foundBalance =
    Object.entries(balances)
      .map(([, balance]) => balance)
      // TODO: 0x prefix issue
      .find((balance) => `0x${balance.mint.address}` === addressToFind) ??
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

// TODO: Find better abstraction logic for constructing token from address or ticker, unknown until runtime
export function getToken(token: {
  address?: string
  ticker?: string
  input?: string
  // TODO: Remove network parameter
  network?: string
}) {
  if (token.input && token.input.length > 6) {
    return new Token({ address: token.input })
  } else if (token.input && token.input.length <= 6) {
    return new Token({ ticker: token.input })
  } else if (token.address) {
    return new Token({ address: token.address })
  } else {
    return new Token({ ticker: token.ticker })
  }
}

// TODO: Move to Token object in SDK as static method
export function getTickerFromToken(token: Token) {
  console.log("🚀 ~ getTickerFromToken ~ token:", token)
  try {
    // TODO: Should just keep prefix in SDK
    return Token.findTickerByAddress(`0x${token.address}`)
  } catch (error) {
    throw new Error(`Could not get ticker from token: ${token.serialize()}`)
  }
}
