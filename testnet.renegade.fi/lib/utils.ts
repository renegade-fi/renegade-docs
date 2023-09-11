import {
  Balance,
  BalanceId,
  ExchangeHealthState,
  Renegade,
  Token,
} from "@renegade-fi/renegade-js"

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
): Balance | undefined {
  const addressToFind = new Token({ ticker }).address
  const foundBalance = Object.entries(balances)
    .map(([, balance]) => balance)
    .find((balance) => balance.mint.address === addressToFind)

  return foundBalance
}
