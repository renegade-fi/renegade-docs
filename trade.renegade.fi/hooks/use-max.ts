import { Token, useBalances } from "@renegade-fi/react"
import { formatUnits } from "viem/utils"

export function useMax(base: string) {
  const balances = useBalances()
  const max = balances.get(Token.findByTicker(base).address)?.amount
  return max ? formatUnits(max, Token.findByTicker(base).decimals) : ""
}
