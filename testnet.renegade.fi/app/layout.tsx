import React from "react"
import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { Renegade } from "@renegade-fi/renegade-js"

import { TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"
import { getTokenBannerData } from "@/lib/utils"
import { TokensBanner } from "@/components/banners/tokens-banner"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { Providers } from "@/app/providers"

import "./animations.css"
import "./fonts.css"
import "./globals.css"
import "./index.css"

export const metadata: Metadata = {
  title: {
    default: "Trade - Renegade Testnet",
    template: `%s - Renegade Testnet`,
  },
  description:
    "The on-chain dark pool. MPC-based DEX for anonymous crosses at midpoint prices.",
}

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost",
  verbose: false,
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const icons = await TICKER_TO_LOGO_URL_HANDLE
  const prices = await getTokenBannerData(renegade)

  if (!prices.length) {
    throw new Error("Failed to fetch token banner data")
  }

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
            <TokensBanner prices={prices} />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
