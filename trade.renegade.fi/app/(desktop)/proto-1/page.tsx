import { Main } from "@/app/(desktop)/main"
import { OrderHistoryTable } from "@/app/(desktop)/proto-1/order-history-table"
import { RightSection } from "@/app/(desktop)/proto-1/right-section"
import { TabsBar } from "@/app/(desktop)/proto-1/tabs"
import backgroundPattern from "@/icons/background_pattern.png"
import { Box } from "@chakra-ui/react"
import Image from "next/image"

import { MedianBannerWrapper } from "@/components/banners/median-banner"

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
      <MedianBannerWrapper />
      <div style={{ flexGrow: 1, display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowX: "hidden",
          }}
        >
          {/* <RelayerStatusData /> */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Main />
            <Box
              width="100%"
              height="calc(30vh + 2 * var(--banner-height))"
              // borderTop="var(--border)"
            >
              <TabsBar />
              <OrderHistoryTable />
            </Box>
          </div>
        </div>
        <RightSection />
        {/* <OrdersAndCounterpartiesPanel /> */}
      </div>
    </div>
  )
}
