import { Direction } from "./types"

/** A bid/ask price level in an order book for a given pair */
export type PriceLevel = {
  /** The level's price, denominated in the quote asset */
  price: number
  /** The amount of liquidity at this price level, denominated in the base asset */
  quantity: number
}

/**
 * The amount of base & quote assets transacted in a trade,
 * from the end-users perspective
 */
export type TradeAmounts = {
  /** The amount of the base asset transacted */
  effectiveBaseAmount: number
  /** The amount of the quote asset transacted */
  effectiveQuoteAmount: number
}

/** An orderbook, comprised of bid/ask lists and a taker fee rate */
export class Orderbook {
  /**
   * The orderbook bids (buy-side price levels), in descending order of price.
   */
  bids: PriceLevel[] = []

  /**
   * The orderbook asks (sell-side price levels), in ascending order of price.
   */
  asks: PriceLevel[] = []

  /**
   * The percentage fee to apply to trades against this orderbook.
   */
  feeRate: number = 0.001

  /**
   * Creates an orderbook initialized with the given bids, asks, and fee rate.
   * The bids and asks are assumed to be sorted in descending and ascending order of price, respectively.
   * The fee rate defaults to 10 bps, the Binance taker fee for traders w/ <20M in monthly trading volume.
   */
  constructor(bids: PriceLevel[], asks: PriceLevel[], feeRate: number = 0.001) {
    this.bids = bids
    this.asks = asks
    this.feeRate = feeRate
  }

  /**
   * Simulates the effective amounts of base/quote transacted in a trade on the orderbook,
   * inclusive of fees & price impact
   * @param quantity The amount of the base asset to trade
   * @param direction The direction of the trade (buy/sell)
   * @param feeRate The percentage fee to apply to the trade, deducted from the received asset
   * @returns The effective amounts of base/quote transacted from the end-users perspective
   */
  simulateTradeAmounts(quantity: number, direction: Direction): TradeAmounts {
    const levels = direction === Direction.BUY ? [...this.asks] : [...this.bids]
    let remaining = quantity
    let effectiveQuoteAmount = 0
    while (remaining > 0) {
      const level = levels.shift()
      if (level === undefined) {
        throw new Error("Insufficient price levels to simulate trade")
      }

      let filledAmount = Math.min(level.quantity, remaining)
      effectiveQuoteAmount += filledAmount * level.price
      remaining -= filledAmount
    }

    let effectiveBaseAmount =
      direction === Direction.BUY ? quantity * (1 - this.feeRate) : quantity

    effectiveQuoteAmount =
      direction === Direction.SELL
        ? effectiveQuoteAmount * (1 - this.feeRate)
        : effectiveQuoteAmount

    return {
      effectiveBaseAmount,
      effectiveQuoteAmount,
    }
  }

  /**
   * @returns The midpoint price of the orderbook, denominated in the quote asset
   */
  midpointPrice(): number {
    return (this.asks[0].price + this.bids[0].price) / 2
  }
}
