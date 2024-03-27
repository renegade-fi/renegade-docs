import { Exchange } from "@renegade-fi/renegade-js"
import { useEffect, useState } from "react"

import { usePrice } from "@/contexts/PriceContext/price-context"

export const useUSDPrice = (base: string, amount: number) => {
  const [price, setPrice] = useState(0)

  const { handleSubscribe, handleGetPrice } = usePrice()
  const priceReport = handleGetPrice(Exchange.Binance, base, "USDC")
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe(Exchange.Binance, base, "USDC", 2)
  }, [base, handleSubscribe])

  return price * amount
}
