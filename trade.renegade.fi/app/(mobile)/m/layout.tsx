import React from "react"
import type { Metadata } from "next"

import { Providers } from "@/app/providers"

import "@/styles/animations.css"
import "@/styles/fonts.css"
import "@/styles/globals.css"
import "@/styles/index.css"
import { SHORT_DESCRIPTION, TRADE_TITLE } from "../../../../seo"

export const metadata: Metadata = {
  title: {
    default: TRADE_TITLE,
    template: `%s - ${TRADE_TITLE}`,
  },
  description: SHORT_DESCRIPTION,
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
