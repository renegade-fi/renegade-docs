import { Balance, BalanceId, Renegade, Token } from "@renegade-fi/renegade-js"
import { formatUnits, isAddress, parseUnits } from "viem"

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
