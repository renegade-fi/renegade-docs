import React from "react"
import { env } from "@/env.mjs"
import { HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import TokensBanner from "@/app/[base]/[quote]/tokens-banner"

export const dynamic = "force-static"

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

export default async function Layout({
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
    <>
      {children}
      <TokensBanner initialTokenPrices={initialTokenPrices} />
    </>
  )
}
