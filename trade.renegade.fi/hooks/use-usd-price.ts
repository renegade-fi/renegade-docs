import { usePrice } from "@/contexts/PriceContext/price-context"
import { Token } from "@renegade-fi/react"
import { useEffect, useState } from "react"
import { formatUnits, parseUnits } from "viem/utils"

// Returns USD price of the given amount of the base token
export const useUSDPrice = (base: Token, amount?: bigint) => {
  const [price, setPrice] = useState(0)

  const { handleSubscribe, handleGetPrice } = usePrice()
  const priceReport = handleGetPrice("binance", base.address)
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe("binance", base.address)
  }, [base, handleSubscribe])

  return (
    price *
    parseFloat(
      formatUnits(amount || parseUnits("1", base.decimals), base.decimals)
    )
  )
}
