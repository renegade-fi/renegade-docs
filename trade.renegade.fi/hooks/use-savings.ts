import { Direction } from "@/lib/types"
import { calculateSavings, simBinanceTradeAndMidpoint } from "@/lib/utils"
import {
  OrderMetadata,
  PartialOrderFill,
  Token,
  formatAmount,
} from "@renegade-fi/react"
import { CreateOrderParameters } from "@renegade-fi/react/actions"
import { useCallback, useEffect, useState } from "react"

export function usePredictedSavings(
  order: CreateOrderParameters,
  renegadeFeeRate: number,
  updateDep: any
): number {
  const [predictedSavings, setPredictedSavings] = useState(0)

  const fetchPredictedSavings = useCallback(
    async (
      baseAddr: `0x${string}`,
      quoteAddr: `0x${string}`,
      direction: Direction,
      amount: bigint,
      renegadeFeeRate: number
    ) => {
      const base = Token.findByAddress(baseAddr)
      const quote = Token.findByAddress(quoteAddr)
      const quantityFloat = parseFloat(formatAmount(amount, base, 10))

      const { tradeAmounts, midpointPrice } = await simBinanceTradeAndMidpoint(
        base,
        quote,
        direction,
        quantityFloat,
        Date.now()
      )

      const savings = calculateSavings(
        tradeAmounts,
        quantityFloat,
        direction,
        midpointPrice,
        renegadeFeeRate
      )

      setPredictedSavings(savings)
    },
    []
  )

  useEffect(() => {
    fetchPredictedSavings(
      order.base,
      order.quote,
      order.side as Direction,
      order.amount,
      renegadeFeeRate
    )
  }, [
    fetchPredictedSavings,
    order.amount,
    order.base,
    order.quote,
    order.side,
    renegadeFeeRate,
    updateDep,
  ])

  return predictedSavings
}

export function useSavingsPerFill(
  order: OrderMetadata,
  renegadeFeeRate: number
): Array<number> {
  const [savingsPerFill, setSavingsPerFill] = useState<Array<number>>([])

  const fetchSavingsPerFill = useCallback(
    async (
      baseAddr: `0x${string}`,
      quoteAddr: `0x${string}`,
      direction: Direction,
      fills: PartialOrderFill[],
      renegadeFeeRate: number
    ) => {
      const base = Token.findByAddress(baseAddr)
      const quote = Token.findByAddress(quoteAddr)

      const savingsPerFill = await Promise.all(
        fills.map(async (fill) => {
          const { amount, price, timestamp } = fill
          const priceFloat = parseFloat(formatAmount(price, quote, 10))
          const quantityFloat = parseFloat(formatAmount(amount, base, 10))
          const timestampNum = Number(timestamp)

          const { tradeAmounts } = await simBinanceTradeAndMidpoint(
            base,
            quote,
            direction,
            quantityFloat,
            timestampNum
          )

          return calculateSavings(
            tradeAmounts,
            quantityFloat,
            direction,
            priceFloat,
            renegadeFeeRate
          )
        })
      )

      setSavingsPerFill(savingsPerFill)
    },
    []
  )

  useEffect(() => {
    fetchSavingsPerFill(
      order.data.base_mint,
      order.data.quote_mint,
      order.data.side as Direction,
      order.fills,
      renegadeFeeRate
    )
  }, [
    fetchSavingsPerFill,
    order.data.base_mint,
    order.data.quote_mint,
    order.data.side,
    order.fills,
    renegadeFeeRate,
  ])

  return savingsPerFill
}
