import { useEffect, useState } from "react"
import { Order, OrderId } from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

export const useGlobalOrders = () => {
  const [orders, setOrders] = useState<Record<string, GlobalOrder>>({})

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedOrders = (await renegade.queryOrders())
        .orders as GlobalOrder[]
      console.log("🚀 ~ interval ~ fetchedOrders:", fetchedOrders.length)
      setOrders((prev) => {
        const newOrders = { ...prev }
        fetchedOrders.forEach((order) => {
          newOrders[order.id] = order
        })
        return newOrders
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [orders])

  return orders
}

interface GlobalOrder {
  id: OrderId
  public_share_nullifier: Array<any> // You may want to specify a more specific type than `any`.
  local: boolean
  cluster: string
  state: string
  timestamp: number
}
