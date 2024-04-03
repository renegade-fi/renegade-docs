import { Exchange, PriceReporterWs, Token } from "@renegade-fi/renegade-js"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { env } from "@/env.mjs"

const PriceContext = createContext<{
  priceReporter: PriceReporterWs | null
  handleSubscribe: (
    exchange: Exchange,
    base: string,
    quote: string,
    decimals: number
  ) => void
  handleGetPrice: (
    exchange: Exchange,
    base: string,
    quote: string
  ) => number | undefined
  handleGetLastUpdate: (
    exchange: Exchange,
    base: string,
    quote: string
  ) => number | undefined
} | null>(null)

const invalid = ["USDT", "BUSD", "CBETH", "RNG"]

export const PriceProvider = ({ children }: { children: React.ReactNode }) => {
  const [priceReporter, setPriceReporter] = useState<PriceReporterWs | null>(
    null
  )
  const [prices, setPrices] = useState<Record<string, number>>({})
  const lastUpdateRef = useRef<Record<string, number>>({})
  const [attempted, setAttempted] = useState<Record<string, boolean>>({})
  useEffect(() => {
    const priceReporter = new PriceReporterWs(
      env.NEXT_PUBLIC_PRICE_REPORTER_URL
    )
    setPriceReporter(priceReporter)
    return () => {
      priceReporter.teardown()
    }
  }, [])

  const handleSubscribe = (
    exchange: Exchange,
    base: string,
    quote: string,
    decimals: number
  ) => {
    if (!priceReporter || invalid.includes(base)) return

    const topic = getTopic(exchange, base, quote)
    if (attempted[topic]) return

    priceReporter.subscribeToTokenPair(
      exchange,
      new Token({ ticker: base }),
      new Token({ ticker: quote || "USDT" }),
      (price) => {
        const now = Date.now()
        const lastUpdateTime = lastUpdateRef.current[topic] || 0

        const randomThreshold = Math.random() * 1000 + 200
        if (now - lastUpdateTime < randomThreshold) {
          return
        }

        setPrices((prevPrices) => {
          if (
            prevPrices[topic]?.toFixed(decimals) !==
            Number(price).toFixed(decimals)
          ) {
            return { ...prevPrices, [topic]: Number(price) }
          }
          return prevPrices
        })
        lastUpdateRef.current[topic] = now
      }
    )
    setAttempted((prev) => ({ ...prev, [topic]: true }))
  }

  const handleGetPrice = (exchange: Exchange, base: string, quote: string) => {
    const topic = getTopic(exchange, base, quote)
    return prices[topic]
  }

  const handleGetLastUpdate = (
    exchange: Exchange,
    base: string,
    quote: string
  ) => {
    const topic = getTopic(exchange, base, quote)
    return lastUpdateRef.current[topic]
  }

  return (
    <PriceContext.Provider
      value={{
        priceReporter,
        handleSubscribe,
        handleGetPrice,
        handleGetLastUpdate,
      }}
    >
      {children}
    </PriceContext.Provider>
  )
}

export const usePrice = () => {
  const context = useContext(PriceContext)
  if (!context) {
    throw new Error("usePrice must be used within a PriceProvider")
  }
  return context
}

function getTopic(exchange: Exchange, base: string, quote: string) {
  return `${exchange}-${base}-${quote}`
}
