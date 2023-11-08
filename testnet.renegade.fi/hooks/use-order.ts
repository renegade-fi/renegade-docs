import { useEffect, useState } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Order, OrderId } from "@renegade-fi/renegade-js"

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"
import { renegade } from "@/app/providers"

export const useOrders = () => {
  const { accountId } = useRenegade()
  const [orders, setOrders] = useState<Record<OrderId, Order>>({})

  useEffect(() => {
    if (!accountId) return
    const interval = setInterval(async () => {
      const existingOrders = safeLocalStorageGetItem(`orders-${accountId}`)
      const existingOrdersArray = existingOrders
        ? existingOrders.split(",")
        : []

      const fetchedOrders = renegade.getOrders(accountId)
      setOrders(fetchedOrders)

      const uniqueNewOrderIds = Object.keys(fetchedOrders).filter(
        (orderId) => !existingOrdersArray.includes(orderId)
      )

      existingOrdersArray.push(...uniqueNewOrderIds)
      const updatedOrders = existingOrdersArray.join(",")

      safeLocalStorageSetItem(`orders-${accountId}`, updatedOrders)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [accountId])

  return orders
}
