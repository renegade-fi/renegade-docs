import type { Metadata } from "next"

import { Providers } from "@/app/providers"

import "./animations.css"
import "./fonts.css"
// TODO: merge globals.css and index.css
import "./globals.css"
import "./index.css"
import backgroundPattern from "@/icons/background_pattern.png"

import AllTokensData from "@/components/banners/all-tokens-data"
import ExchangeData from "@/components/banners/exchange-data"
import RelayerStatusData from "@/components/banners/relayer-status-data"
import Footer from "@/components/footer"
import MainNav from "@/components/main-nav"

export const metadata: Metadata = {
  title: "Renegade Migration",
  description: "Renegade Testnet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                backgroundImage: `url(${backgroundPattern.src})`,
                backgroundSize: "cover",
              }}
            >
              <ExchangeData />
              <RelayerStatusData />
              {children}
              <AllTokensData />
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
