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

export function compareBalances(
  oldBalances: Record<BalanceId, Balance>,
  newBalances: Record<BalanceId, Balance>
): boolean {
  return Object.keys(oldBalances).every((balanceId) => {
    const oldBalance = oldBalances[balanceId as keyof typeof oldBalances]
    const newBalance = newBalances[balanceId as keyof typeof newBalances]

    if (
      oldBalance &&
      newBalance &&
      oldBalance.mint.address === newBalance.mint.address
    ) {
      return oldBalance.amount !== newBalance.amount
    }

    return true
  })
}
