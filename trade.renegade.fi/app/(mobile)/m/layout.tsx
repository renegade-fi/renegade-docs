import { Providers } from "@/app/providers"
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
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
