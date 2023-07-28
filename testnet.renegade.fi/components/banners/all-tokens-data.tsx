import { HealthStates } from "@/types"
import { Token } from "@renegade-fi/renegade-js"

import { TICKER_TO_NAME_AND_DEFAULT_DECIMALS } from "@/lib/tokens"

import { renegade } from "./exchange-data"
import AllTokensBanner from "./tokens-banner"

async function AllTokensData() {
  const res: Promise<HealthStates>[] = []
  DISPLAYED_TICKERS.forEach(
    async ([baseTicker, quoteTicker]: [string, string]) => {
      res.push(
        renegade?.queryExchangeHealthStates(
          new Token({ ticker: baseTicker }),
          new Token({ ticker: quoteTicker })
        )
      )
    }
  )
  const healthStates = await Promise.all(res)
  const fallbackPriceReport = healthStates.map((healthState) => {
    return (
      healthState.median.DataTooStale?.[0] ||
      healthState.median.Nominal ||
      healthState.median.TooMuchDeviation?.[0]
    )
  })
  return <AllTokensBanner priceReports={fallbackPriceReport} />
}

export default AllTokensData

export const DISPLAYED_TICKERS: [string, string][] = Object.keys(
  TICKER_TO_NAME_AND_DEFAULT_DECIMALS
).map((ticker: string) => [ticker, "USDC"])
