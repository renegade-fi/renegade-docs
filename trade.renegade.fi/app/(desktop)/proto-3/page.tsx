import { Main } from "@/app/(desktop)/main"
import { OrderHistoryTable } from "@/app/(desktop)/proto-1/order-history-table"
import { TabsBar } from "@/app/(desktop)/proto-1/tabs"
import { RightSection } from "@/app/(desktop)/proto-3/right-section"
import backgroundPattern from "@/icons/background_pattern.png"
import { Box } from "@chakra-ui/react"
import Image from "next/image"

import { RelayerStatusData } from "@/components/banners/relayer-status-data"
import { TokensBanner } from "@/components/banners/tokens-banner"

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
        alt=""
        fill
        priority
        src={backgroundPattern}
        style={{ zIndex: -1 }}
      />
      {/* <MedianBannerWrapper /> */}
      <div style={{ flexGrow: 1, display: "flex" }}>
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
              flexGrow: 1,
            }}
          >
            <Main />
            <Box
              // width="100%"
              height="calc(40vh + var(--banner-height))"
            >
              <TabsBar />
              <OrderHistoryTable />
            </Box>
            <TokensBanner />
          </div>
        </div>
        <RightSection />
        {/* <OrdersAndCounterpartiesPanel /> */}
      </div>
    </div>
  )
}
