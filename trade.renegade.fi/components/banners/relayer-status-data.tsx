"use client"

import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useTvl } from "@/hooks/use-tvl"

import { RelayerStatusBanner } from "@/components/banners/relayer-banner"

export function RelayerStatusData() {
  const [ping, setPing] = useState("loading")
  const [base] = useLocalStorage("base", "WETH", { initializeWithValue: false })
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const baseTvl = useTvl(base)
  const quoteTvl = useTvl(quote)

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost"
              ? "http"
              : "https"
          }://${process.env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME}:3000/v0/ping`
        )
        if (response.ok) {
          setPing("live")
        } else {
          setPing("dead")
        }
      } catch (error) {
        setPing("dead")
      }
    }

    fetchPing()
    const intervalId = setInterval(fetchPing, 60000) // Set interval to 60 seconds

    return () => clearInterval(intervalId) // Cleanup interval on component unmount
  }, [])

  return (
    <RelayerStatusBanner
      // @ts-ignore
      connectionState={ping}
      activeBaseTicker={base}
      activeQuoteTicker={quote}
      baseTvl={baseTvl}
      quoteTvl={quoteTvl}
    />
  )
}
