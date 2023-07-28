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
  const [direction, setDirection] = useState<Direction>(
    Direction.ACTIVE_TO_QUOTE
  )
  const baseToken = params.base?.toString().toUpperCase()
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}/${quoteToken}`)
  }
  const quoteToken = params.quote?.toString().toUpperCase()
  const handleSetQuoteToken = (token: string) => {
    router.push(`/${baseToken}/${token}`)
  }
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)
  // TODO: sync order details with local storage

  useEffect(() => {
    const regex = /[a-z]/
    if (regex.test(baseToken) || regex.test(quoteToken)) {
      router.push(`/${baseToken.toUpperCase()}/${quoteToken.toUpperCase()}`)
    }
  }, [baseToken, quoteToken, router])

  return (
    <OrderStateContext.Provider
      value={{
        direction,
        setDirection,
        baseToken,
        setBaseToken: handleSetBaseToken,
        quoteToken,
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
