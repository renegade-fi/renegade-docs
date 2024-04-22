import { Analytics } from "@vercel/analytics/react"
import React from "react"

import { Footer } from "@/app/(desktop)/footer"
import { MainNav } from "@/app/(desktop)/main-nav"
import { Providers } from "@/app/providers"
import { TokensBanner } from "@/components/banners/tokens-banner"
import { TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"
import { constructMetadata } from "@/lib/utils"
import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import "@/styles/index.css"

export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const icons = await TICKER_TO_LOGO_URL_HANDLE
  // const prices = await getTokenBannerData(renegade)
  return (
    <html lang="en">
      <body>
        <Providers icons={icons}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              // width: "100vw",
              minHeight: "100vh",
              // overflowX: "hidden",
            }}
          >
            <MainNav />
            {children}
            <TokensBanner />
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
