"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useParams, useRouter } from "next/navigation"
import { Order, OrderId, Token } from "@renegade-fi/renegade-js"

import { renegade } from "../../app/providers"
import { HealthStates } from "../../types"
import { useRenegade } from "../Renegade/renegade-context"
import { CounterpartyOrder, TaskType } from "../Renegade/types"
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
  const { accountId, setTask } = useRenegade()
  const [midpointPrice, setMidpointPrice] = useState<number>()

  const [orderBook, setOrderBook] = useState<
    Record<OrderId, CounterpartyOrder>
  >({})

  useEffect(() => {
    if (!baseTicker || !quoteTicker) return
    const regex = /[a-z]/
    if (regex.test(baseTicker) || regex.test(quoteTicker)) {
      router.replace(
        `/${baseTicker.toUpperCase()}/${quoteTicker.toUpperCase()}`
      )
    }
  }, [baseTicker, quoteTicker, router])

  const fetchPrice = useCallback(async () => {
    if (!baseTicker || !quoteTicker) return
    const { median }: HealthStates = await renegade.queryExchangeHealthStates(
      new Token({ ticker: baseTicker }),
      new Token({ ticker: quoteTicker })
    )
    const price =
      median.Nominal?.midpointPrice ||
      median.DataTooStale?.[0].midpointPrice ||
      0
    return price
  }, [baseTicker, quoteTicker])

  const handleOrderListener = useCallback(async () => {
    await renegade.registerOrderBookCallback((message: string) => {
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
            publicShareNullifier: orderBookEventOrder.public_share_nullifier,
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
      baseToken: new Token({ ticker: baseTicker }),
      quoteToken: new Token({ ticker: quoteTicker }),
      side: direction,
      type: "limit",
      amount: BigInt(baseTokenAmount),
      price: await fetchPrice(),
    })
    const [taskId, taskJob] = await renegade.task.placeOrder(accountId, order)
    setTask(taskId, TaskType.PlaceOrder)
    await taskJob.then(() => setTask(undefined, undefined))
    handleOrderListener()
  }, [
    accountId,
    baseTicker,
    baseTokenAmount,
    direction,
    fetchPrice,
    handleOrderListener,
    quoteTicker,
    setTask,
  ])

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
        setMidpointPrice,
        onPlaceOrder: handlePlaceOrder,
        midpointPrice,
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
