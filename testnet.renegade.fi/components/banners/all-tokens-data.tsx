import { HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { TICKER_TO_NAME_AND_DEFAULT_DECIMALS } from "@/lib/tokens"

import AllTokensBanner from "./all-tokens"

const renegade = new Renegade({
  relayerHostname: process.env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME || "",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: false,
  verbose: false,
})

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
  const fallbackPriceReport = healthStates.map(
    (healthState) => healthState.median.DataTooStale?.[0]
  )
  // TODO: Add setOrderInfo prop
  return <AllTokensBanner priceReports={fallbackPriceReport} />
}

export default AllTokensData

export const DISPLAYED_TICKERS: [string, string][] = Object.keys(
  TICKER_TO_NAME_AND_DEFAULT_DECIMALS
).map((ticker: string) => [ticker, "USDC"])
