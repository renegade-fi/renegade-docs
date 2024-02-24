import { useEffect, useState } from "react"
import { OrderId } from "@renegade-fi/renegade-js"
import { renegade } from "@/app/providers"

export const useGlobalOrders = () => {
  const [orders, setOrders] = useState<Record<string, GlobalOrder>>({})

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedOrders = (await renegade.queryOrders())
        .orders as GlobalOrder[]

      setOrders((prev) => {
        const newOrders = { ...prev }
        fetchedOrders.forEach((order) => {
          newOrders[order.id] = {
            ...order,
          }
        })
        const sortedOrders = Object.fromEntries(
          Object.entries(newOrders).sort(([, a], [, b]) =>
            a.timestamp > b.timestamp ? -1 : 1
          )
        )
        return sortedOrders
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return orders
}
export interface GlobalOrder {
  id: OrderId
  public_share_nullifier: Array<any>
  local: boolean
  cluster: string
  state: string
  timestamp: number
}
