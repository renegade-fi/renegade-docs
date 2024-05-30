import { Footer } from "@/app/(desktop)/footer"
import { MainNav } from "@/app/(desktop)/main-nav"
import { Providers } from "@/app/providers"
import { TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"
import { constructMetadata } from "@/lib/utils"
import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { Viewport } from "next"
import React from "react"

import { TokensBanner } from "@/components/banners/tokens-banner"
import "@/styles/index.css"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "black" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const icons = await TICKER_TO_LOGO_URL_HANDLE
  return (
    <html lang="en">
      <body>
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
            <TokensBanner />
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
