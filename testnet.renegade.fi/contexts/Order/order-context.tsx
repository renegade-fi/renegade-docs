import { createContext, useContext, useState } from "react"

import { Direction, OrderContextValue } from "./types"

type OrderProviderProps = { children: React.ReactNode }

const OrderStateContext = createContext<OrderContextValue | undefined>(
  undefined
)

function OrderProvider({ children }: OrderProviderProps) {
  const [direction, setDirection] = useState<Direction>(
    Direction.ACTIVE_TO_QUOTE
  )
  const [baseToken, setBaseToken] = useState("WBTC")
  const [quoteToken, setQuoteToken] = useState("USDC")
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)
  // TODO: sync order details with local storage
  // TODO: use handle -> on pattern
  return (
    <OrderStateContext.Provider
      value={{
        direction,
        setDirection,
        baseToken,
        setBaseToken,
        quoteToken,
        setQuoteToken,
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
