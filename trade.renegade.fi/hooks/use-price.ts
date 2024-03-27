import { Exchange } from "@renegade-fi/renegade-js"
import { useEffect, useState } from "react"

import { usePrice } from "@/contexts/PriceContext/price-context"

const THRESHOLD = 60 * 1000 // 1 minute

export const useExchangePrice = (
  exchange: Exchange,
  base: string,
  quote: string
) => {
  const [price, setPrice] = useState(0)

  const { handleSubscribe, handleGetPrice, handleGetLastUpdate } = usePrice()
  const priceReport = handleGetPrice(exchange, base, quote)
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe(exchange, base, quote, 2)
  }, [base, handleSubscribe, quote, exchange])

  const lastUpdate = handleGetLastUpdate(exchange, base, quote)
  let state: "live" | "stale" | "idle" = "idle"
  if (lastUpdate) {
    state = lastUpdate < Date.now() - THRESHOLD ? "stale" : "live"
  }

  return { price, state }
}
