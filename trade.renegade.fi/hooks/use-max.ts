import { Token, useBalances } from "@renegade-fi/react"
import { formatUnits } from "viem"

export function useMax(base: string) {
  const balances = useBalances()
  const max = balances.find(
    (b) => b.mint === Token.findByTicker(base).address
  )?.amount
  return max ? formatUnits(max, Token.findByTicker(base).decimals) : ""
}
