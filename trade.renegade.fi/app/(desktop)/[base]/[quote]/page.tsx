import { PriceReporterWs } from "@renegade-fi/renegade-js"
import Image from "next/image"

import { Main } from "@/app/(desktop)/[base]/[quote]/main"
import { MedianBanner } from "@/components/banners/median-banner"
import { RelayerStatusData } from "@/components/banners/relayer-status-data"
import { OrdersAndCounterpartiesPanel } from "@/components/panels/orders-panel"
import { WalletsPanel } from "@/components/panels/wallets-panel"
import { env } from "@/env.mjs"
import backgroundPattern from "@/icons/background_pattern.png"

// export function generateStaticParams() {
//   return DISPLAYED_TICKERS.filter(([base]) => base !== "USDC").map(
//     ([base, quote]) => {
//       return {
//         base,
//         quote,
//       }
//     }
//   )
// }

export default async function Page({
  params: { base, quote },
}: {
  params: { base: string; quote: string }
}) {
  const report = await new PriceReporterWs(env.NEXT_PUBLIC_PRICE_REPORTER_URL)
    .getExchangePrices(base)
    .catch(() => {
      return undefined
    })
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
