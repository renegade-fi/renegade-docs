import { CallbackId, Exchange } from "@renegade-fi/renegade-js"

export type PriceReport = {
  type: "PriceReport"
  baseToken: {
    addr: string
  }
  quoteToken: {
    addr: string
  }
  price: number
  localTimestamp: number
}
export interface ExchangeContextValue {
  onRegisterPriceListener: (
    exchange: Exchange,
    base: string,
    quote: string,
    decimals?: number
  ) => Promise<CallbackId | undefined>
  getPriceData: (
    exchange: Exchange,
    base: string,
    quote: string
  ) => PriceReport | undefined
}
