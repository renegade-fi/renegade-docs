import { useEffect, useState } from "react"
import { ExchangeHealthState, Token } from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

export const usePrice = (base: string) => {
  const [price, setPrice] = useState<ExchangeHealthState>({})

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedPrice = await renegade.queryExchangeHealthStates(
        new Token({ ticker: base }),
        new Token({ ticker: "USDC" })
      )
      setPrice(fetchedPrice)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [base])

  return price
}
