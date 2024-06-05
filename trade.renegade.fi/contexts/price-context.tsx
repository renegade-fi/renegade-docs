"use client"

import { TICKER_TO_DEFAULT_DECIMALS } from "@/lib/tokens"
import { Exchange, Token, tokenMapping } from "@renegade-fi/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { StoreApi, createStore, useStore } from "zustand"

interface PricesState {
  prices: Map<string, number>
  lastUpdated: Map<string, number>
  subscriptions: Set<string>
}

type PricesContextValue = {
  store: StoreApi<PricesState>
  handleSubscribe: ({
    exchange,
    baseAddress,
  }: {
    exchange: Exchange
    baseAddress: `0x${string}`
  }) => void
}

const PriceStoreContext = createContext<PricesContextValue | null>(null)

export const PriceStoreProvider: React.FC<
  PropsWithChildren & {
    initialPrices: Map<string, number>
  }
> = ({ children, initialPrices }) => {
  const [store] = useState(() =>
    createStore<PricesState>()(() => {
      const initialLastUpdated = new Map<string, number>()
      initialPrices.forEach((_, key) => {
        initialLastUpdated.set(key, Date.now())
      })
      return {
        prices: initialPrices ?? new Map(),
        lastUpdated: initialLastUpdated,
        subscriptions: new Set(),
      }
    })
  )

  const { readyState, sendJsonMessage } = useWebSocket(
    `wss://${process.env.NEXT_PUBLIC_PRICE_REPORTER_URL}:4000`,
    {
      filter: () => false,
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.topic && data.price) {
            const { topic, price } = data
            const prevPrice = store.getState().prices.get(topic)
            const d = TICKER_TO_DEFAULT_DECIMALS[topic.split("-")[1]]
            const priceNeedsUpdate =
              !prevPrice || prevPrice.toFixed(d) !== price.toFixed(d)

            if (priceNeedsUpdate) {
              store.setState((state) => ({
                prices: new Map(state.prices).set(topic, price),
              }))
            }

            store.setState((state) => ({
              lastUpdated: new Map(state.lastUpdated).set(topic, Date.now()),
            }))
          } else if (data.subscriptions) {
            store.setState((state) => ({
              subscriptions: new Set(state.subscriptions),
            }))
          }
        } catch (error) {
          console.error(`Failed to parse message: ${event.data}`)
        }
      },
      shouldReconnect: () => true,
    }
  )

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      for (const token of tokenMapping.tokens) {
        const topic = `binance-${token.address}-${DEFAULT_QUOTE.binance}`
        sendJsonMessage({
          method: "subscribe",
          topic,
        })
      }
    }
  }, [readyState, sendJsonMessage])

  const handleSubscribe = ({
    exchange = "binance",
    baseAddress,
  }: {
    exchange: Exchange
    baseAddress: `0x${string}`
  }) => {
    const topic = `${exchange}-${baseAddress}-${DEFAULT_QUOTE[exchange]}`
    if (!store.getState().subscriptions.has(topic)) {
      sendJsonMessage({
        method: "subscribe",
        topic,
      })
    }
  }

  return (
    <PriceStoreContext.Provider value={{ store, handleSubscribe }}>
      {children}
    </PriceStoreContext.Provider>
  )
}

export const usePrice = ({
  exchange = "binance",
  baseAddress,
}: {
  exchange?: Exchange
  baseAddress: `0x${string}`
}) => {
  const context = useContext(PriceStoreContext)
  if (!context) {
    throw new Error("usePrice must be used within a PriceStoreProvider")
  }

  const { store, handleSubscribe } = context
  const quoteAddress = DEFAULT_QUOTE[exchange]
  const topic = `${exchange}-${baseAddress}-${quoteAddress}`
  const price = useStore(store, (state) => state.prices.get(topic))

  useEffect(() => {
    handleSubscribe({ exchange, baseAddress })
  }, [baseAddress, exchange, handleSubscribe, quoteAddress])

  return price ? price : 0
}

export const useLastUpdated = ({
  exchange = "binance",
  baseAddress,
}: {
  exchange?: Exchange
  baseAddress: `0x${string}`
}) => {
  const context = useContext(PriceStoreContext)
  if (!context) {
    throw new Error("useLastUpdated must be used within a PriceStoreProvider")
  }
  const { store } = context
  const topic = `${exchange}-${baseAddress}-${DEFAULT_QUOTE[exchange]}`
  return useStore(store, (state) => state.lastUpdated.get(topic)) ?? 0
}

export const DEFAULT_QUOTE: Record<Exchange, `0x${string}`> = {
  binance: Token.findByTicker("USDT").address,
  coinbase: Token.findByTicker("USDC").address,
  kraken: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  okx: Token.findByTicker("USDT").address,
}
