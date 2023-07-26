export interface HealthStates {
  median: {
    DataTooStale: [PriceReport, number]
  }
  all_exchanges: {
    [key: string]: {
      Nominal: PriceReport
    }
  }
}

export interface ExchangeData {
  median: PriceReport
  binance: PriceReport
  coinbase: PriceReport
  kraken: PriceReport
  okx: PriceReport
  uniswapv3: PriceReport
}
