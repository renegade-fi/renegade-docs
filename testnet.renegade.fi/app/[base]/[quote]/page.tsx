import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { ExchangeReport, HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { getHealthState } from "@/lib/getHealthState"
import { DISPLAYED_TICKERS } from "@/lib/tokens"
import ExchangeConnectionsBanner from "@/components/banners/exchange-banner"
import RelayerStatusData from "@/components/banners/relayer-status-data"
import AllTokensBanner from "@/components/banners/tokens-banner"
import OrdersAndCounterpartiesPanel from "@/components/orders-panel"
import TradingBody from "@/components/trading-body"
import WalletsPanel from "@/components/wallets-panel"

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

  const initialAllTokens = tokensBannerHealthStates.map((healthState) => {
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
      <ExchangeConnectionsBanner
        priceReport={initialActivePair}
        priceReporterHealthStates={priceReporterHealthStates}
        activeBaseTicker={baseToken}
        activeQuoteTicker={quoteToken}
      />
      <div style={{ flexGrow: 1, display: "flex" }}>
        <WalletsPanel />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowX: "hidden",
          }}
        >
          <RelayerStatusData baseToken={baseToken} quoteToken={quoteToken} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              position: "relative",
            }}
          >
            <TradingBody />
          </div>
        </div>
        <OrdersAndCounterpartiesPanel />
      </div>
      <AllTokensBanner priceReports={initialAllTokens} />
    </div>
  )
}
