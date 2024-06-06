import { Providers } from "@/app/providers"
import { PriceStoreProvider } from "@/contexts/price-context"
import { getInitialPrices } from "@/lib/utils"
import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import type { Metadata } from "next"
import React from "react"

import "@/styles/index.css"

export const metadata: Metadata = {
  title: {
    default: "Trade - Renegade Testnet",
    template: `%s - Renegade Testnet`,
  },
  description:
    "The on-chain dark pool. MPC-based DEX for anonymous crosses at midpoint prices.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const prices = await getInitialPrices()
  return (
    <html lang="en">
      <body>
        <PriceStoreProvider initialPrices={prices}>
          <Providers>{children}</Providers>
        </PriceStoreProvider>
      </body>
    </html>
  )
}
