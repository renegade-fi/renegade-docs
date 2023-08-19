import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { ExchangeReport, HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { getHealthState } from "@/lib/getHealthState"
import { DISPLAYED_TICKERS } from "@/lib/tokens"
import RelayerStatusData from "@/components/banners/relayer-status-data"
import TradingBody from "@/components/trading-body"
import MedianBanner from "@/app/[base]/[quote]/median-banner"

export function generateStaticParams() {
  return DISPLAYED_TICKERS.map(([base, quote]) => {
    return {
      base,
      quote,
    }
  })
}

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_NODE_ENV === "development" ? true : false,
  verbose: false,
})

export default async function Home({
  params: { base: baseToken, quote: quoteToken },
}: {
  params: { base: string; quote: string }
}) {
  // Exchange Banner Data
  const activePairRes: Promise<HealthStates> =
    renegade?.queryExchangeHealthStates(
      new Token({ ticker: baseToken }),
      new Token({ ticker: quoteToken })
    )

  // All Tokens Banner Data
  const tokensBannerRes: Promise<HealthStates>[] = []
  DISPLAYED_TICKERS.forEach(
    async ([baseTicker, quoteTicker]: [string, string]) => {
      tokensBannerRes.push(
        renegade?.queryExchangeHealthStates(
          new Token({ ticker: baseTicker }),
          new Token({ ticker: quoteTicker })
        )
      )
    }
  )

  // Parallel Data Fetching
  const [healthStates, ...tokensBannerHealthStates] = await Promise.all([
    activePairRes,
    ...tokensBannerRes,
  ])

  const initialTokenPrices = tokensBannerHealthStates.map((healthState) => {
    return (
      healthState.median.DataTooStale?.[0] ||
      healthState.median.Nominal ||
      healthState.median.TooMuchDeviation?.[0]
    )
  })

  const healthStatesExchanges = healthStates["all_exchanges"]
  const initialActivePair: ExchangeReport = {
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
  const priceReporterHealthStates = {
    median: getHealthState(healthStates["median"]),
    binance: getHealthState(healthStates["all_exchanges"]["Binance"]),
    coinbase: getHealthState(healthStates["all_exchanges"]["Coinbase"]),
    kraken: getHealthState(healthStates["all_exchanges"]["Kraken"]),
    okx: getHealthState(healthStates["all_exchanges"]["Okx"]),
    uniswapv3: getHealthState(healthStates["all_exchanges"]["UniswapV3"]),
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        backgroundImage: `url(${backgroundPattern.src})`,
        backgroundSize: "cover",
      }}
    >
      <MedianBanner
        priceReport={initialActivePair}
        priceReporterHealthStates={priceReporterHealthStates}
      />
      <RelayerStatusData baseToken={baseToken} quoteToken={quoteToken} />
      <TradingBody />
    </div>
  )
}
