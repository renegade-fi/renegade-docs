import React from "react"
import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { Renegade } from "@renegade-fi/renegade-js"

import { getTokenBannerData } from "@/lib/utils"
import Footer from "@/components/footer"
import MainNav from "@/components/main-nav"
import TokensBanner from "@/app/[base]/[quote]/tokens-banner"
import { Providers } from "@/app/providers"

import "./animations.css"
import "./fonts.css"
// TODO: merge globals.css and index.css
import "./globals.css"
import "./index.css"

export const metadata: Metadata = {
  title: "Renegade",
  description: "Renegade Testnet",
}

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_NODE_ENV === "development" ? true : false,
  verbose: false,
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const prices = await getTokenBannerData(renegade)

  if (!prices.length) {
    throw new Error("Failed to fetch token banner data")
  }

  return (
    <html lang="en">
      <body>
        <Providers>
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
            <TokensBanner initialTokenPrices={prices} />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
