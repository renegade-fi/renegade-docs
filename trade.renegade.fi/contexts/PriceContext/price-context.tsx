import {
  Exchange,
  PRICE_REPORTER_TOPIC,
  Token,
  WebSocketManager,
  useConfig,
} from "@renegade-fi/react"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Address } from "viem"

export const DEFAULT_QUOTE: Record<Exchange, Address> = {
  binance: Token.findByTicker("USDT").address,
  coinbase: Token.findByTicker("USDC").address,
  kraken: "0x0000000000000000000000000000000000000000" as Address,
  okx: Token.findByTicker("USDT").address,
}

type PriceContextValue = {
  handleSubscribe: (exchange: Exchange, base: Address, quote?: Address) => void
  handleGetPrice: (
    exchange: Exchange,
    base: Address,
    quote?: Address
  ) => number | undefined
  handleGetLastUpdate: (
    exchange: Exchange,
    base: Address,
    quote?: Address
  ) => number | undefined
  handleGetInitialPrice: (base: Address, quote?: Address) => number
}

const PriceContext = createContext<PriceContextValue | null>(null)

const invalid = [Token.findByTicker("USDT").address]

export const PriceProvider = ({ children }: { children: React.ReactNode }) => {
  const { getPriceReporterBaseUrl } = useConfig()
  const [priceReporter, setPriceReporter] = useState<WebSocketManager | null>(
    null
  )
  const [prices, setPrices] = useState<Record<string, number>>({})
  const lastUpdateRef = useRef<Record<string, number>>({})
  const [attempted, setAttempted] = useState<Record<string, boolean>>({})
  const initialPrice = useRef<Record<string, number>>({})
  useEffect(() => {
    if (!priceReporter) {
      setPriceReporter(new WebSocketManager(getPriceReporterBaseUrl()))
    } else {
      priceReporter.connect()
    }
    return () => {
      if (priceReporter) {
        priceReporter.close()
      }
    }
  }, [getPriceReporterBaseUrl, priceReporter])

  const handleSubscribe = (
    exchange: Exchange,
    base: Address,
    quote: Address = DEFAULT_QUOTE[exchange]
  ) => {
    if (!priceReporter || invalid.includes(base)) return

    const topic = PRICE_REPORTER_TOPIC(exchange, base, quote)
    if (attempted[topic]) return

    priceReporter.subscribe(topic, (price) => {
      const now = Date.now()
      const lastUpdateTime = lastUpdateRef.current[topic] || 0

      const randomThreshold = Math.random() * 1000 + 200
      if (now - lastUpdateTime < randomThreshold) {
        return
      }

      setPrices((prevPrices) => {
        if (prevPrices[topic] !== Number(price)) {
          return { ...prevPrices, [topic]: Number(price) }
        }
        return prevPrices
      })
      if (!initialPrice.current[`${base}-${quote}`]) {
        initialPrice.current[`${base}-${quote}`] = Number(price)
      }
      lastUpdateRef.current[topic] = now
    })
    setAttempted((prev) => ({ ...prev, [topic]: true }))
  }

  const handleGetPrice = (
    exchange: Exchange,
    base: Address,
    quote: Address = DEFAULT_QUOTE[exchange]
  ) => {
    const topic = PRICE_REPORTER_TOPIC(exchange, base, quote)
    return prices[topic]
  }

  const handleGetLastUpdate = (
    exchange: Exchange,
    base: Address,
    quote: Address = DEFAULT_QUOTE[exchange]
  ) => {
    const topic = PRICE_REPORTER_TOPIC(exchange, base, quote)
    return lastUpdateRef.current[topic]
  }

  const handleGetInitialPrice = (
    base: Address,
    quote: Address = DEFAULT_QUOTE["binance"]
  ) => {
    return initialPrice.current[`${base}-${quote}`] ?? 0
  }

  return (
    <PriceContext.Provider
      value={{
        handleSubscribe,
        handleGetPrice,
        handleGetLastUpdate,
        handleGetInitialPrice,
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
