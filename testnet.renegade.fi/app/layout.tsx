import React from "react"
import type { Metadata } from "next"
import { env } from "@/env.mjs"
import { HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import Footer from "@/components/footer"
import MainNav from "@/components/main-nav"
import TokensBanner from "@/app/[base]/[quote]/tokens-banner"
import { Providers } from "@/app/providers"

// TODO: merge globals.css and index.css
import "./animations.css"
import "./fonts.css"
import "./globals.css"
import "./index.css"

export const metadata: Metadata = {
  title: "Renegade Migration",
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

const tokensBannerRes: Promise<HealthStates>[] = []
DISPLAYED_TICKERS.forEach(
  async ([baseTicker, quoteTicker]: [string, string]) => {
    tokensBannerRes.push(
      renegade?.queryExchangeHealthStates(
        new Token({ ticker: baseTicker }),
        new Token({ ticker: quoteTicker })
      )
    )
  }
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tokensBannerHealthStates = await Promise.all(tokensBannerRes)

  const initialTokenPrices = tokensBannerHealthStates.map((healthState) => {
    return (
      healthState.median.DataTooStale?.[0] ||
      healthState.median.Nominal ||
      healthState.median.TooMuchDeviation?.[0]
    )
  })
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
            <TokensBanner initialTokenPrices={initialTokenPrices} />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
