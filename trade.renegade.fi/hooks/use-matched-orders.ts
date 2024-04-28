import { LocalOrder } from "@/lib/types"
import { useOrderBook, useOrders, useWalletId } from "@renegade-fi/react"
import { useLocalStorage } from "usehooks-ts"

export const useMatchedOrders = () => {
  const globalOrders = useOrderBook()
  const walletId = useWalletId()
  const orders = useOrders()
  const [savedOrders] = useLocalStorage<LocalOrder[]>(
    `order-details-${walletId}`,
    []
  )

  const matched = savedOrders.filter((order) => {
    const orderInNetworkOrders = globalOrders.find((o) => o.id === order.id)
    const isCancelled = orderInNetworkOrders?.state === "Cancelled"
    const inUserOrder = orders.some((o) => o.id === order.id)
    return orderInNetworkOrders && isCancelled && !inUserOrder
  })

  return matched
}
