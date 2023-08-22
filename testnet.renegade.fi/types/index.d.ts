export interface ExchangeReport {
  binance: PriceReport
  coinbase: PriceReport
  kraken: PriceReport
  median?: PriceReport
  okx: PriceReport
  uniswapv3: PriceReport
}

export interface HealthStates {
  all_exchanges: {
    [key: string]: {
      Nominal: PriceReport
    }
  }
  median: {
    DataTooStale?: [PriceReport, number]
    Nominal?: PriceReport
    TooMuchDeviation?: [PriceReport, number]
  }
}

type HealthState =
  | "connecting"
  | "live"
  | "no-data"
  | "not-enough-data"
  | "too-much-deviation"
  | "too-stale"
  | "unsupported"

export interface PriceReport {
  baseToken: { [addr: string]: string }
  exchange: string
  localTimestamp: number
  midpointPrice: number
  quoteToken: { [addr: string]: string }
  reportedTimestamp: number
  topic: string
  type: string
}
