import {
  DEFAULT_QUOTE,
  usePrice as usePriceContext,
} from "@/contexts/PriceContext/price-context"
import { Exchange } from "@renegade-fi/react"
import { useEffect, useState } from "react"
import { Address } from "viem"

export const usePrice = (
  exchange: Exchange,
  base: Address,
  quote: Address = DEFAULT_QUOTE[exchange]
) => {
  // const prevBase = usePrevious(base)
  const { handleSubscribe, handleGetPrice, handleGetInitialPrice } =
    usePriceContext()
  const [price, setPrice] = useState(() => handleGetInitialPrice(base))

  const priceReport = handleGetPrice(exchange, base, quote)

  useEffect(() => {
    setPrice(0)
  }, [base])

  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])

  useEffect(() => {
    handleSubscribe(exchange, base)
  }, [base, exchange, handleSubscribe])

  return price
}
