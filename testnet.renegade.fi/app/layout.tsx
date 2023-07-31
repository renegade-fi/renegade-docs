import React from "react"
import type { Metadata } from "next"

import Footer from "@/components/footer"
import MainNav from "@/components/main-nav"
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
