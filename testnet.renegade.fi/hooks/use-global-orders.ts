import { useEffect, useState } from "react"
import { OrderId } from "@renegade-fi/renegade-js"

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"
import { renegade } from "@/app/providers"

export const useGlobalOrders = () => {
  const [orders, setOrders] = useState<Record<string, GlobalOrder>>({})

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedOrders = (await renegade.queryOrders())
        .orders as GlobalOrder[]

      const o = safeLocalStorageGetItem("timestampMap")
      const timestampMap = o ? JSON.parse(o) : {}

      fetchedOrders.forEach((order) => {
        if (!timestampMap[order.id]) {
          console.log("adding timestamp for order", order.id)
          timestampMap[order.id] = timestampFromId(order.id)
        }
      })

      if (Object.keys(timestampMap).length) {
        console.log("setting timestampmap")
        safeLocalStorageSetItem("timestampMap", JSON.stringify(timestampMap))
      }

      setOrders((prev) => {
        const newOrders = { ...prev }
        fetchedOrders.forEach((order) => {
          newOrders[order.id] = {
            ...order,
            timestamp: timestampMap[order.id],
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

// TODO: Remove once orderbook returns correct timestamps
function timestampFromId(inputString: string): number {
  const numericValue = Number(inputString.match(/\d/g)?.join("")) || 0
  const offsetInMilliseconds = (numericValue % 180) * 60000
  return Date.now() - offsetInMilliseconds
}

export interface GlobalOrder {
  id: OrderId
  public_share_nullifier: Array<any>
  local: boolean
  cluster: string
  state: string
  timestamp: number
}
