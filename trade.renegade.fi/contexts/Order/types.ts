import { Token } from "@sehyunchung/renegade-react"

export enum Direction {
  BUY = "buy",
  SELL = "sell",
}

export interface OrderContextValue {
  base: Token
  baseTicker: string
  baseTokenAmount: string
  direction: Direction
  quote: Token
  quoteTicker: string
  setBaseToken: (token: string) => void
  setBaseTokenAmount: (e: React.ChangeEvent<HTMLInputElement>) => void
  setDirection: (direction: Direction) => void
  setQuoteToken: (token: string) => void
}

export interface LocalOrder {
  id: string
  base: string
  quote: string
  side: string
  amount: string
  timestamp: number
}
