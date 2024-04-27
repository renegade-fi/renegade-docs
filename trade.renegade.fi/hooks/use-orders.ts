import {
  ExtendedOrderMetadata,
  Order,
  useOrderHistory,
  useOrders as useUserOrders,
  useWalletId,
} from "@sehyunchung/renegade-react"
import { useMemo } from "react"
import { useReadLocalStorage } from "usehooks-ts"

export const useOrders = (): ExtendedOrderMetadata[] => {
  const walletId = useWalletId()
  const orders = useUserOrders()
  const orderHistory = useOrderHistory({ sort: "desc" })

  const localOrders = useReadLocalStorage<Record<string, Order>>(
    `order-history-${walletId}`,
    {
      initializeWithValue: false,
      deserializer: (value) =>
        JSON.parse(value, (_, v) => {
          if (typeof v === "string" && /^\d+n$/.test(v)) {
            return BigInt(v.slice(0, -1))
          }
          return v
        }),
    }
  )

  const deobfuscatedOrderHistory: ExtendedOrderMetadata[] = useMemo(() => {
    // Map through each order in orderHistory
    return orderHistory.map((order) => {
      // Attempt to find a matching order in localOrders if it exists
      const localOrder = localOrders ? localOrders[order.id] : undefined
      // Attempt to find a matching order in the more recent userOrders
      const userOrder = orders.find((o) => o.id === order.id)

      // If a matching userOrder is found, merge its details with the current order
      if (userOrder) {
        return {
          ...order,
          ...userOrder,
        }
        // If no userOrder is found but a localOrder exists, merge localOrder details instead
      } else if (localOrder) {
        return {
          ...order,
          ...localOrder,
        }
      }
      // If neither userOrder nor localOrder is found, return the original order
      return order
    })
  }, [localOrders, orderHistory, orders])
  // This logic ensures that each order in orderHistory is extended with the most recent data available,
  // either from userOrders or localOrders, prioritizing userOrders as they are more recent.

  return deobfuscatedOrderHistory
}
