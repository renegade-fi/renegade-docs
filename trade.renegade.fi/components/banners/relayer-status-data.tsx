"use client"

import { usePing } from "@renegade-fi/react"
import { useLocalStorage } from "usehooks-ts"

import { useTvl } from "@/hooks/use-tvl"

import { RelayerStatusBanner } from "@/components/banners/relayer-banner"

export function RelayerStatusData() {
  const [base] = useLocalStorage("base", "WETH", { initializeWithValue: false })
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const baseTvl = useTvl(base)
  const quoteTvl = useTvl(quote)

  const { data: ping, status } = usePing()
  const connectionState =
    status === "pending"
      ? "loading"
      : status === "error" || !ping
      ? "dead"
      : "live"

  return (
    <RelayerStatusBanner
      connectionState={connectionState}
      activeBaseTicker={base}
      activeQuoteTicker={quote}
      baseTvl={baseTvl}
      quoteTvl={quoteTvl}
    />
  )
}
