import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { ExchangeReport, HealthState, HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import RelayerStatusData from "@/components/banners/relayer-status-data"
import TradingBody from "@/components/trading-body"
import MedianBanner from "@/app/[base]/[quote]/median-banner"

export function getHealthState(priceReport: any): HealthState {
  if (!priceReport || priceReport === "Unsupported") {
    return "unsupported"
  }
  if (typeof priceReport === "object" && priceReport["Nominal"] !== undefined) {
    return "live"
  }
  if (priceReport === "NoDataReported") {
    return "no-data"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["DataTooStale"] !== undefined
  ) {
    return "too-stale"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["NotEnoughDataReported"] !== undefined
  ) {
    return "not-enough-data"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["TooMuchDeviation"] !== undefined
  ) {
    return "too-much-deviation"
  }
  throw new Error("Invalid priceReport: " + priceReport)
}

export async function getExchangeBannerData(
  base: string,
  quote: string,
  renegade?: Renegade
) {
  if (!renegade)
    return { report: {} as ExchangeReport, exchangeHealthStates: {} as any }
  const res: HealthStates = await renegade.queryExchangeHealthStates(
    new Token({ ticker: base }),
    new Token({ ticker: quote })
  )
  const healthStatesExchanges = res["all_exchanges"]
  const report: ExchangeReport = {
    median:
      res.median.Nominal ||
      res.median.DataTooStale?.[0] ||
      res.median.TooMuchDeviation?.[0],
    binance:
      healthStatesExchanges["Binance"] &&
      healthStatesExchanges["Binance"]["Nominal"],
    coinbase:
      healthStatesExchanges["Coinbase"] &&
      healthStatesExchanges["Coinbase"]["Nominal"],
    kraken:
      healthStatesExchanges["Kraken"] &&
      healthStatesExchanges["Kraken"]["Nominal"],
    okx:
      healthStatesExchanges["Okx"] && healthStatesExchanges["Okx"]["Nominal"],
    uniswapv3:
      healthStatesExchanges["UniswapV3"] &&
      healthStatesExchanges["UniswapV3"]["Nominal"],
  }
  const exchangeHealthStates = {
    median: getHealthState(res["median"]),
    binance: getHealthState(res["all_exchanges"]["Binance"]),
    coinbase: getHealthState(res["all_exchanges"]["Coinbase"]),
    kraken: getHealthState(res["all_exchanges"]["Kraken"]),
    okx: getHealthState(res["all_exchanges"]["Okx"]),
    uniswapv3: getHealthState(res["all_exchanges"]["UniswapV3"]),
  }

  return { report, exchangeHealthStates }
}

export async function getTokenBannerData(renegade?: Renegade) {
  if (!renegade) return []
  const promisesArr: Promise<HealthStates>[] = []
  DISPLAYED_TICKERS.forEach(
    async ([baseTicker, quoteTicker]: [string, string]) => {
      promisesArr.push(
        renegade.queryExchangeHealthStates(
          new Token({ ticker: baseTicker }),
          new Token({ ticker: quoteTicker })
        )
      )
    }
  )
  const res = await Promise.all(promisesArr)

  const prices = res.map((healthState) => {
    return (
      healthState.median.DataTooStale?.[0] ||
      healthState.median.Nominal ||
      healthState.median.TooMuchDeviation?.[0]
    )
  })
  return prices
}
