export enum Direction {
  BUY = "buy",
  SELL = "sell",
}

export interface OrderContextValue {
  direction: Direction
  setDirection: (direction: Direction) => void
  baseTicker: string
  quoteTicker: string
  setBaseToken: (token: string) => void
  setQuoteToken: (token: string) => void
  baseTokenAmount: number
  setBaseTokenAmount: (amount: number) => void
  setMidpointPrice: (price?: number) => void
  onPlaceOrder: () => void
  midpointPrice?: number
}
