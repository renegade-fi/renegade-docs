"use client"
import { Renegade } from "@renegade-fi/renegade-js"

import { RelayerStatusBanner } from "@/components/banners/relayer-banner"
import { env } from "@/env.mjs"
import { useEffect, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost",

  verbose: false,
})

export function RelayerStatusData() {
  const [ping, setPing] = useState("loading")
  const { baseTicker, quoteTicker } = useOrder()

  useEffect(() => {
    const fetchPing = async () => {
      try {
        await renegade?.ping()
        setPing("live")
      } catch (error) {
        setPing("dead")
      }
    }

    fetchPing()
  }, [])
  return (
    <RelayerStatusBanner
      // @ts-ignore
      connectionState={ping}
      activeBaseTicker={baseTicker}
      activeQuoteTicker={quoteTicker}
    />
  )
}
