import { useEffect, useState } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Order, OrderId } from "@renegade-fi/renegade-js"
import { useLocalStorage } from "react-use"

import { renegade } from "@/app/providers"

export const useOrders = () => {
  const { accountId } = useRenegade()
  const [orders, setOrders] = useState<Record<OrderId, Order>>({})
  // const [savedOrders, setSavedOrders] = useLocalStorage(
  //   `${accountId}-orders`,
  //   Object.keys(orders)
  // )

  // useEffect(() => {
  //   if (!accountId) return

  //   const o: string[] = []
  //   if (savedOrders && savedOrders.length) {
  //     o.push(...savedOrders)
  //   }
  //   Object.keys(orders).forEach((id) => {
  //     if (!o.includes(id)) {
  //       o.push(id)
  //     }
  //   })
  //   setSavedOrders(o)
  // }, [accountId, orders, savedOrders, setSavedOrders])

  useEffect(() => {
    if (!accountId) return
    const interval = setInterval(async () => {
      const fetchedOrders = renegade.getOrders(accountId)
      setOrders(fetchedOrders)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [accountId])

  return orders
}
