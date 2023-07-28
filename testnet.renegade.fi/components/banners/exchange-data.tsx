import { ExchangeData, HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import ExchangeConnectionsBanner from "@/components/banners/exchange-banner"

export const renegade = new Renegade({
  relayerHostname: process.env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME || "",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
  verbose: false,
})

async function ExchangeTape({
  baseToken,
  quoteToken,
}: {
  baseToken: string
  quoteToken: string
}) {
  const healthStates: HealthStates = await renegade?.queryExchangeHealthStates(
    new Token({ ticker: baseToken }),
    new Token({ ticker: quoteToken })
  )
  const healthStatesExchanges = healthStates["all_exchanges"]
  const fallbackPriceReport: ExchangeData = {
    median: healthStates["median"]["DataTooStale"]?.[0],
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
  const newPriceReporterHealthStates = {
    median: getHealthState(healthStates["median"]),
    binance: getHealthState(healthStates["all_exchanges"]["Binance"]),
    coinbase: getHealthState(healthStates["all_exchanges"]["Coinbase"]),
    kraken: getHealthState(healthStates["all_exchanges"]["Kraken"]),
    okx: getHealthState(healthStates["all_exchanges"]["Okx"]),
    uniswapv3: getHealthState(healthStates["all_exchanges"]["UniswapV3"]),
  }
  return (
    <ExchangeConnectionsBanner
      priceReport={fallbackPriceReport}
      priceReporterHealthStates={newPriceReporterHealthStates}
      activeBaseTicker={baseToken}
      activeQuoteTicker={quoteToken}
    />
  )
}
function getHealthState(priceReport: any): HealthState {
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

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation"

export default ExchangeTape
