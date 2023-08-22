import { Balance, BalanceId, Token } from "@renegade-fi/renegade-js"

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
