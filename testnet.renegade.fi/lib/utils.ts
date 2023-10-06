import { env } from "@/env.mjs"
import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"

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
  return await Promise.all(
    DISPLAYED_TICKERS.map(([baseTicker, quoteTicker]) =>
      renegade.queryExchangeHealthStates(
        new Token({ ticker: baseTicker }),
        new Token({ ticker: quoteTicker })
      )
    )
  ).then((res) => res.map((e) => e.Median))
}

export function findBalanceByTicker(
  balances: Record<BalanceId, Balance>,
  ticker: string
) {
  const addressToFind = new Token({ ticker, network: getNetwork() }).address
  const foundBalance =
    Object.entries(balances)
      .map(([, balance]) => balance)
      .find((balance) => balance.mint.address === addressToFind) ??
    new Balance({
      mint: new Token({ ticker, network: getNetwork() }),
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
