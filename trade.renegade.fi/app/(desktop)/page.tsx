import Image from "next/image"

import { Main } from "@/app/(desktop)/main"
import { MedianBannerWrapper } from "@/components/banners/median-banner"
import { RelayerStatusData } from "@/components/banners/relayer-status-data"
import { OrdersAndCounterpartiesPanel } from "@/components/panels/orders-panel"
import { WalletsPanel } from "@/components/panels/wallets-panel"
import backgroundPattern from "@/icons/background_pattern.png"

export const dynamic = "force-dynamic"

export default function Page() {
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
      <MedianBannerWrapper />
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
          <RelayerStatusData />
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
