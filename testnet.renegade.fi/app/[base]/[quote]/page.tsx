import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { MedianBanner } from "@/components/banners/median-banner"
import { RelayerStatusData } from "@/components/banners/relayer-status-data"
import { OrdersAndCounterpartiesPanel } from "@/components/panels/orders-panel"
import { WalletsPanel } from "@/components/panels/wallets-panel"
import { TradingBody } from "@/app/[base]/[quote]/body"

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
  params: { base, quote },
}: {
  params: { base: string; quote: string }
}) {
  const report = await renegade.queryExchangeHealthStates(
    new Token({ ticker: base }),
    new Token({ ticker: quote })
  )
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
      <MedianBanner report={report} />
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
          <RelayerStatusData baseToken={base} quoteToken={quote} />
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
