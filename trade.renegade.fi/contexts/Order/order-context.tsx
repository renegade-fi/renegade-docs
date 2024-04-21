"use client"

import { useToast } from "@chakra-ui/react"
import { CallbackId, OrderId } from "@renegade-fi/renegade-js"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useLocalStorage } from "usehooks-ts"

import { renegade } from "@/app/providers"
import { CounterpartyOrder } from "@/contexts/Renegade/types"
import { Token } from "@sehyunchung/renegade-react"

import { Direction, OrderContextValue } from "./types"

const OrderStateContext = createContext<OrderContextValue | undefined>(
  undefined
)

function OrderProvider({ children }: PropsWithChildren) {
  const [direction, setDirection] = useLocalStorage("direction", Direction.BUY)
  const handleSetDirection = (direction: Direction) => {
    setDirection(direction)
  }

  // const [base, setBase] = useState<Token>(Token.findByTicker("WETH"))
  const [base, setBase] = useLocalStorage(
    "base",
    Token.findByTicker("WETH").ticker
  )
  const [quote, setQuote] = useState<Token>(Token.findByTicker("USDC"))
  const [baseTokenAmount, setBaseTokenAmount] = useState("")

  const [orderBook, setOrderBook] = useState<
    Record<OrderId, CounterpartyOrder>
  >({})

  const orderCallbackId = useRef<CallbackId>()
  useEffect(() => {
    if (orderCallbackId.current) return
    const handleNetworkListener = async () => {
      await renegade
        .registerOrderBookCallback((message: string) => {
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

  const mpcCallbackId = useRef<CallbackId>()
  const toast = useToast()
  useEffect(() => {
    if (mpcCallbackId.current) return
    const handleMpcCallback = async () => {
      await renegade
        .registerMpcCallback((message: string) => {
          let lastToastTime = 0
          console.log("[MPC]", message)
          const mpcEvent = JSON.parse(message)
          const mpcEventOrderId = mpcEvent.local_order_id
          if (Date.now() - lastToastTime < 500) {
            return
          } else {
            lastToastTime = Date.now()
          }
          const toastId =
            mpcEvent.type === "HandshakeCompleted"
              ? "handshake-completed"
              : "handshake-started"
          if (!toast.isActive(toastId)) {
            toast({
              id: toastId,
              title: `MPC ${
                mpcEvent.type === "HandshakeCompleted" ? "Finished" : "Started"
              }`,
              description: `A handshake with a counterparty has ${
                mpcEvent.type === "HandshakeCompleted" ? "completed" : "begun"
              }.`,
              status: "info",
              duration: 5000,
              isClosable: true,
            })
          }
          if (orderBook[mpcEventOrderId]) {
            const handshakeState =
              mpcEvent.type === "HandshakeCompleted"
                ? "completed"
                : "in-progress"
            setOrderBook((orderBook) => {
              const newOrderBook = { ...orderBook }
              newOrderBook[mpcEventOrderId].handshakeState = handshakeState
              return newOrderBook
            })
          }
        })
        .then((callbackId) => (mpcCallbackId.current = callbackId))
    }
    handleMpcCallback()
    return () => {
      if (!mpcCallbackId.current) return
      renegade.releaseCallback(mpcCallbackId.current)
      mpcCallbackId.current = undefined
    }
  }, [orderBook, toast])

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        isFinite(parseFloat(value)) &&
        parseFloat(value) >= 0)
    ) {
      setBaseTokenAmount(value)
    }
  }

  return (
    <OrderStateContext.Provider
      value={{
        base: Token.findByTicker(base),
        baseTicker: base,
        baseTokenAmount,
        direction,
        quote,
        quoteTicker: quote.ticker,
        setBaseToken: setBase,
        setBaseTokenAmount: handleSetBaseTokenAmount,
        setDirection: handleSetDirection,
        setQuoteToken: setQuote,
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
