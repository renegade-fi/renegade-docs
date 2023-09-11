import { CallbackId, Exchange, PriceReport } from "@renegade-fi/renegade-js"

export interface ExchangeContextValue {
  onRegisterPriceListener: (
    exchange: Exchange,
    base: string,
    quote: string,
    decimals?: number
  ) => Promise<CallbackId | undefined>
  getPriceData: (exchange: Exchange, base: string, quote: string) => PriceReport
}
