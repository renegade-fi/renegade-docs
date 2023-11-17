export enum Direction {
  BUY = "buy",
  SELL = "sell",
}

export interface OrderContextValue {
  baseTicker: string
  baseTokenAmount: number
  direction: Direction
  quoteTicker: string
  setBaseToken: (token: string) => void
  setBaseTokenAmount: (amount: number) => void
  setDirection: (direction: Direction) => void
  setQuoteToken: (token: string) => void
}
