import { useEffect, useState } from "react"

import { usePrice } from "@/contexts/PriceContext/price-context"
import { Token } from "@sehyunchung/renegade-react"

export const useUSDPrice = (base: string, amount: number) => {
  const [price, setPrice] = useState(0)

  const { handleSubscribe, handleGetPrice } = usePrice()
  const priceReport = handleGetPrice(
    "binance",
    Token.findByTicker(base).address
  )
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe("binance", Token.findByTicker(base).address)
  }, [base, handleSubscribe])

  return price * amount
}
