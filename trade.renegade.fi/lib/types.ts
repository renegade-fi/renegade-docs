export interface LocalOrder {
  id: string
  base: string
  quote: string
  side: string
  amount: string
  timestamp: number
}

export enum Direction {
  BUY = "buy",
  SELL = "sell",
}
