import { Orderbook } from "@/lib/price-simulation"
import { Direction } from "@/lib/types"
import { getBinanceOrderbook } from "@/lib/utils"
import { Token, formatAmount } from "@renegade-fi/react"
import { CreateOrderParameters } from "@renegade-fi/react/actions"
import { useCallback, useEffect, useState } from "react"

export function usePredictedSavings(
  order: CreateOrderParameters,
  renegadeFeeRate: number,
  updateDep: any
) {
  const [predictedSavings, setPredictedSavings] = useState(0)

  const fetchPredictedSavings = useCallback(
    async (
      baseAddr: `0x${string}`,
      quoteAddr: `0x${string}`,
      direction: Direction,
      amount: bigint
    ) => {
      // Fetch the Binance orderbook at the given timestamp
      const baseToken = Token.findByAddress(baseAddr)
      const quoteToken = Token.findByAddress(quoteAddr)
      const timestamp = Date.now()
      const orderbookRes = await getBinanceOrderbook(
        baseToken.ticker,
        quoteToken.ticker,
        timestamp
      )

      const orderbook = new Orderbook(orderbookRes.bids, orderbookRes.asks)
      const quantityFloat = parseFloat(formatAmount(amount, baseToken, 10))

      // Simulate the effective amounts of base / quote that would be transacted on the Binance orderbook
      const {
        effectiveBaseAmount: effectiveBinanceBase,
        effectiveQuoteAmount: effectiveBinanceQuote,
      } = orderbook.simulateTradeAmounts(quantityFloat, direction)

      // Simulate the effective amounts of base / quote that would be transacted in Renegade (at the midpoint price)
      const midpointPrice = orderbook.midpointPrice()
      const renegadeQuote = quantityFloat * midpointPrice

      const effectiveRenegadeBase =
        direction === Direction.BUY
          ? quantityFloat * (1 - renegadeFeeRate)
          : quantityFloat

      const effectiveRenegadeQuote =
        direction === Direction.SELL
          ? renegadeQuote * (1 - renegadeFeeRate)
          : renegadeQuote

      // Calculate the savings in base/quote amounts transacted between the Binance and Renegade trades.
      // When buying, we save when we receive more base and send less quote than on Binance.
      // When selling, we save when we receive more quote and send less base than on Binance.
      const baseSavings =
        direction === Direction.BUY
          ? effectiveRenegadeBase - effectiveBinanceBase
          : effectiveBinanceBase - effectiveRenegadeBase

      const quoteSavings =
        direction === Direction.SELL
          ? effectiveRenegadeQuote - effectiveBinanceQuote
          : effectiveBinanceQuote - effectiveRenegadeQuote

      // Represent the total savings via Renegade, denominated in the quote asset, priced at the current midpoint
      const totalSavingsAsQuote = baseSavings * midpointPrice + quoteSavings

      setPredictedSavings(totalSavingsAsQuote)
    },
    [renegadeFeeRate]
  )

  useEffect(() => {
    fetchPredictedSavings(
      order.base,
      order.quote,
      order.side as Direction,
      order.amount
    )
  }, [
    fetchPredictedSavings,
    order.amount,
    order.base,
    order.quote,
    order.side,
    updateDep,
  ])

  return predictedSavings
}
