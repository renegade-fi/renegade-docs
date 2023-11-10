import Image from "next/image"
import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { MedianBanner } from "@/components/banners/median-banner"
import { RelayerStatusData } from "@/components/banners/relayer-status-data"
import { OrdersAndCounterpartiesPanel } from "@/components/panels/orders-panel"
import { WalletsPanel } from "@/components/panels/wallets-panel"
import { Main } from "@/app/(desktop)/[base]/[quote]/main"

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
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost",
  verbose: false,
})

export default async function Page({
  params: { base, quote },
  searchParams,
}: {
  params: { base: string; quote: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  console.log("🚀 ~ searchParams:", searchParams)
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
        position: "relative",
      }}
    >
      <Image
        alt="bg"
        fill
        priority
        src={backgroundPattern}
        style={{ objectFit: "cover", objectPosition: "center", zIndex: -1 }}
      />
      <MedianBanner
        report={report}
        activeBaseTicker={base}
        activeQuoteTicker={quote}
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
          <RelayerStatusData baseToken={base} quoteToken={quote} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              position: "relative",
            }}
          >
            <Main />
          </div>
        </div>
        <OrdersAndCounterpartiesPanel />
      </div>
    </div>
  )
}
