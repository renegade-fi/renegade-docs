import { PriceReport } from "@/contexts/RenegadeContext"

export interface HealthStates {
  median: {
    DataTooStale?: [PriceReport, number]
    Nominal?: PriceReport
    TooMuchDeviation?: [PriceReport, number]
  }
  all_exchanges: {
    [key: string]: {
      Nominal: PriceReport
    }
  }
}

export interface ExchangeData {
  median?: PriceReport
  binance: PriceReport
  coinbase: PriceReport
  kraken: PriceReport
  okx: PriceReport
  uniswapv3: PriceReport
}

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation"
