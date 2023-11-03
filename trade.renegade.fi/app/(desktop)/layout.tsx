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

import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import "@/styles/index.css"
import {
  BASE_URL,
  DESCRIPTION,
  SHORT_DESCRIPTION,
  SHORT_NAME,
  TRADE_TITLE,
} from "../../../seo"

export const metadata: Metadata = {
  title: {
    default: TRADE_TITLE,
    template: `%s - ${TRADE_TITLE}`,
  },
  description: DESCRIPTION,
  openGraph: {
    title: TRADE_TITLE,
    description: SHORT_DESCRIPTION,
    url: BASE_URL,
    siteName: SHORT_NAME,
    locale: "en_US",
    type: "website",
  },
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
