import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { Renegade } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { getExchangeBannerData } from "@/lib/utils"
import RelayerStatusData from "@/components/banners/relayer-status-data"
import OrdersAndCounterpartiesPanel from "@/components/orders-panel"
import TradingBody from "@/components/trading-body"
import WalletsPanel from "@/components/wallets-panel"
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
  const { report, exchangeHealthStates } = await getExchangeBannerData(
    baseToken,
    quoteToken,
    renegade
  )
  if (!report || !exchangeHealthStates) {
    throw new Error("Failed to fetch exchange banner data")
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
        priceReport={report}
        priceReporterHealthStates={exchangeHealthStates}
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
    </div>
  )
}
