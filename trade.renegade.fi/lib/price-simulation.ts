import { Direction } from "./types"

/** A bid/ask price level in an order book for a given pair */
export type PriceLevel = {
  /** The level's price, denominated in the quote asset */
  price: number
  /** The amount of liquidity at this price level, denominated in the base asset */
  quantity: number
}

/** An orderbook, comprised of bid/ask lists and a taker fee rate */
export class Orderbook {
  /**
   * The orderbook bids (buy-side price levels), in descending order of price.
   * Empty upon initialization.
   */
  bids: PriceLevel[] = []

  /**
   * The orderbook asks (sell-side price levels), in ascending order of price.
   * Empty upon initialization.
   */
  asks: PriceLevel[] = []

  /**
   * The percentage fee to apply to trades against this orderbook.
   * Defaults to 10 bips, this is the Binance taker fee for traders w/ <20M
   * in monthly trading volume.
   */
  feeRate: number = 0.001

  /** Adds bids to the orderbook, maintaining a descending sorting by price */
  addBids(bids: PriceLevel[]) {
    this.bids.push(...bids)
    this.bids.sort((a, b) => b.price - a.price)
  }

  /** Adds asks to the orderbook, maintaining an ascending sorting by price */
  addAsks(asks: PriceLevel[]) {
    this.asks.push(...asks)
    this.asks.sort((a, b) => a.price - b.price)
  }

  /** Sets the fee rate used by the orderbook */
  setFeeRate(feeRate: number) {
    this.feeRate = feeRate
  }

  /**
   * Simulates the effective price of a trade on an orderbook, inclusive of fees
   * @param quantity The amount of the base asset to trade
   * @param direction The direction of the trade (buy/sell)
   * @param feeRate The percentage fee to apply to the trade, deducted from the received asset
   * @returns The effective price of the trade (inclusive of fees) denominated in the quote asset
   */
  simulateTradePrice(quantity: number, direction: Direction): number {
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

    let effectivePrice = effectiveQuoteAmount / effectiveBaseAmount

    return effectivePrice
  }

  /**
   * @returns The midpoint price of the orderbook, denominated in the quote asset
   */
  midpointPrice(): number {
    return (this.asks[0].price + this.bids[0].price) / 2
  }
}
