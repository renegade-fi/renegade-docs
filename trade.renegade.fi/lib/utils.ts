import { env } from "@/env.mjs"
import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"

import {
  DISPLAYED_TICKERS,
} from "@/lib/tokens"
import { isAddress } from "viem"

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
        getToken({ ticker: baseTicker }),
        getToken({ ticker: quoteTicker })
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
      mint: getToken({ ticker }),
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

export function getToken({ address, ticker, input }: {
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