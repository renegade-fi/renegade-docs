"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useParams, useRouter } from "next/navigation"
import { CounterpartyOrder, TaskType } from "@/contexts/Renegade/types"
import { CallbackId, Order, OrderId, Token } from "@renegade-fi/renegade-js"

import {
  getNetwork,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "@/lib/utils"
import { renegade } from "@/app/providers"

import { useRenegade } from "../Renegade/renegade-context"
import { Direction, OrderContextValue } from "./types"

type OrderProviderProps = { children: React.ReactNode }

const OrderStateContext = createContext<OrderContextValue | undefined>(
  undefined
)

function OrderProvider({ children }: OrderProviderProps) {
  const params = useParams()
  const router = useRouter()
  const [direction, setDirection] = useState<Direction>(
    safeLocalStorageGetItem("direction") === "buy"
      ? Direction.BUY
      : Direction.SELL
  )
  const baseTicker = params.base?.toString()
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}/${quoteTicker}`)
  }
  const quoteTicker = params.quote?.toString()
  const handleSetQuoteToken = (token: string) => {
    router.push(`/${baseTicker}/${token}`)
  }
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)
  const { accountId, setTask } = useRenegade()

  const [_, setOrderBook] = useState<Record<OrderId, CounterpartyOrder>>({})

  useEffect(() => {
    if (!baseTicker || !quoteTicker) return
    const regex = /[a-z]/
    if (regex.test(baseTicker) || regex.test(quoteTicker)) {
      router.replace(
        `/${baseTicker.toUpperCase()}/${quoteTicker.toUpperCase()}`
      )
    }
  }, [baseTicker, quoteTicker, router])

  const orderCallbackId = useRef<CallbackId>()
  useEffect(() => {
    if (orderCallbackId.current) return
    const handleNetworkListener = async () => {
      await renegade
        .registerOrderBookCallback((message: string) => {
          console.log("[Order Book]", message)
          const orderBookEvent = JSON.parse(message)
          const orderBookEventType = orderBookEvent.type
          const orderBookEventOrder = orderBookEvent.order
          if (
            orderBookEventType === "NewOrder" ||
            orderBookEventType === "OrderStateChange"
          ) {
            setOrderBook((orderBook) => {
              const newOrderBook = { ...orderBook }
              newOrderBook[orderBookEventOrder.id] = {
                orderId: orderBookEventOrder.id,
                publicShareNullifier:
                  orderBookEventOrder.public_share_nullifier,
                isLocal: orderBookEventOrder.local,
                clusterId: orderBookEventOrder.cluster,
                state: orderBookEventOrder.state,
                timestamp: orderBookEventOrder.timestamp,
                handshakeState: "not-matching",
              } as CounterpartyOrder
              return newOrderBook
            })
          } else {
            console.error("Unknown order book event type:", orderBookEventType)
          }
        })
        .then((callbackId) => (orderCallbackId.current = callbackId))
    }
    handleNetworkListener()
    return () => {
      if (!orderCallbackId.current) return
      renegade.releaseCallback(orderCallbackId.current)
      orderCallbackId.current = undefined
    }
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    if (
      !accountId ||
      !baseTicker ||
      !quoteTicker ||
      !baseTokenAmount ||
      !direction
    )
      return
    const order = new Order({
      baseToken: new Token({ ticker: baseTicker, network: getNetwork() }),
      quoteToken: new Token({ ticker: quoteTicker, network: getNetwork() }),
      side: direction,
      type: "midpoint",
      amount: BigInt(baseTokenAmount),
    })
    renegade.task
      .placeOrder(accountId, order)
      .then(([taskId]) => setTask(taskId, TaskType.PlaceOrder))
  }, [accountId, baseTicker, baseTokenAmount, direction, quoteTicker, setTask])

  const handleSetDirection = useCallback((direction: Direction) => {
    setDirection(direction)
    safeLocalStorageSetItem("direction", direction)
  }, [])

  return (
    <OrderStateContext.Provider
      value={{
        baseTicker,
        baseTokenAmount,
        direction,
        onPlaceOrder: handlePlaceOrder,
        quoteTicker,
        setBaseToken: handleSetBaseToken,
        setBaseTokenAmount,
        setDirection: handleSetDirection,
        setQuoteToken: handleSetQuoteToken,
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
