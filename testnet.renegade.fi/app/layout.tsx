import React from "react"
import type { Metadata } from "next"

import { Providers } from "@/app/providers"

import "./animations.css"
import "./fonts.css"
import "./globals.css"
import "./index.css"
// TODO: merge globals.css and index.css
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
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
