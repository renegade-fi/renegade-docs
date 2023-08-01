"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Direction, OrderContextValue } from "./types"

type OrderProviderProps = { children: React.ReactNode }

const OrderStateContext = createContext<OrderContextValue | undefined>(
  undefined
)

function OrderProvider({ children }: OrderProviderProps) {
  const params = useParams()
  const router = useRouter()
  const [direction, setDirection] = useState<Direction>(Direction.BUY)
  const baseTicker = params.base?.toString()
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}/${quoteTicker}`)
  }
  const quoteTicker = params.quote?.toString()
  const handleSetQuoteToken = (token: string) => {
    router.push(`/${baseTicker}/${token}`)
  }
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)
  // TODO: sync order details with local storage

  useEffect(() => {
    if (!baseTicker || !quoteTicker) return
    const regex = /[a-z]/
    if (regex.test(baseTicker) || regex.test(quoteTicker)) {
      router.replace(
        `/${baseTicker.toUpperCase()}/${quoteTicker.toUpperCase()}`
      )
    }
  }, [baseTicker, quoteTicker, router])

  return (
    <OrderStateContext.Provider
      value={{
        direction,
        setDirection,
        baseTicker,
        setBaseToken: handleSetBaseToken,
        quoteTicker,
        setQuoteToken: handleSetQuoteToken,
        baseTokenAmount,
        setBaseTokenAmount,
      }}
    >
      {children}
    </OrderStateContext.Provider>
  )
}

function useOrder() {
  const context = useContext(OrderStateContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within a OrderProvider")
  }
  return context
}

export { OrderProvider, useOrder }
