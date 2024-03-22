import { Exchange, PriceReport } from "@renegade-fi/renegade-js"
import { useEffect, useMemo, useRef, useState } from "react"

import { useExchange } from "@/contexts/Exchange/exchange-context"

export const useUSDPrice = (base: string, amount: number) => {
  const [currentPriceReport, setCurrentPriceReport] = useState<PriceReport>({})

  const { getPriceData, onRegisterPriceListener } = useExchange()
  const priceReport = getPriceData(Exchange.Median, base, "USDC")

  useEffect(() => {
    if (!priceReport) return
    setCurrentPriceReport(priceReport)
  }, [priceReport])

  const callbackIdRef = useRef(false)
  useEffect(() => {
    if (callbackIdRef.current) return
    onRegisterPriceListener(Exchange.Median, base, "USDC", 2).then(
      (callbackId) => {
        if (callbackId) {
          callbackIdRef.current = true
        }
      }
    )
  }, [base, onRegisterPriceListener])

  const formattedPrice = useMemo(() => {
    let basePrice

    if (currentPriceReport.midpointPrice) {
      basePrice = currentPriceReport.midpointPrice
    } else if (base === "USDC") {
      basePrice = 1
    } else {
      basePrice = 0
    }

    let totalPrice = basePrice * amount

    let formattedPriceStr = totalPrice.toFixed(2)
    const priceStrParts = formattedPriceStr.split(".")

    // Add commas for thousands separation
    priceStrParts[0] = priceStrParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return priceStrParts.join(".")
  }, [amount, base, currentPriceReport.midpointPrice])

  return formattedPrice
}
