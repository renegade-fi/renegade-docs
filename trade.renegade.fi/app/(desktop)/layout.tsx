import { MainNav } from "@/app/(desktop)/main-nav"
import { Providers } from "@/app/providers"
import { PriceStoreProvider } from "@/contexts/price-context"
import { TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"
import { constructMetadata, getInitialPrices } from "@/lib/utils"
import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import React from "react"

import "@/styles/index.css"

export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const icons = await TICKER_TO_LOGO_URL_HANDLE
  const prices = await getInitialPrices()
  return (
    <html lang="en">
      <body>
        <PriceStoreProvider initialPrices={prices}>
          <Providers icons={icons}>
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                minHeight: "100vh",
                overflow: "hidden",
              }}
            >
              <MainNav />
              {children}
              {/* <TokensBanner /> */}
              {/* <Footer /> */}
            </div>
          </Providers>
        </PriceStoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
