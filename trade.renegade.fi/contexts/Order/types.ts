import { Token } from "@renegade-fi/renegade-js"

export enum Direction {
  BUY = "buy",
  SELL = "sell",
}

export interface OrderContextValue {
  base: Token
  baseTicker: string
  baseTokenAmount: number
  direction: Direction
  quote: Token
  quoteTicker: string
  setBaseToken: (token: string) => void
  setBaseTokenAmount: (amount: number) => void
  setDirection: (direction: Direction) => void
  setQuoteToken: (token: string) => void
}
