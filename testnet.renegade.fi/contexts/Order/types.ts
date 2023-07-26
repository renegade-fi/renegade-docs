export enum Direction {
  ACTIVE_TO_QUOTE,
  QUOTE_TO_ACTIVE,
}

export interface OrderContextValue {
  direction: Direction
  setDirection: (direction: Direction) => void
  baseToken: string
  quoteToken: string
  setBaseToken: (token: string) => void
  setQuoteToken: (token: string) => void
  baseTokenAmount: number
  setBaseTokenAmount: (amount: number) => void
}
