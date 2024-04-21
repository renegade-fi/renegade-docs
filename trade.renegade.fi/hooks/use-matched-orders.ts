import { LocalOrder } from "@/contexts/Order/types"
import { useGlobalOrders } from "@/hooks/use-global-orders"
import { useOrders, useWalletId } from "@sehyunchung/renegade-react"
import { useLocalStorage } from "usehooks-ts"

export const useMatchedOrders = () => {
  const globalOrders = useGlobalOrders()
  const walletId = useWalletId()
  const orders = useOrders()
  const [savedOrders] = useLocalStorage<LocalOrder[]>(
    `order-details-${walletId}`,
    []
  )

  const matched = savedOrders.filter((order) => {
    return (
      order.id in globalOrders &&
      globalOrders[order.id].state === "Cancelled" &&
      !orders.some((o) => o.id === order.id)
    )
  })

  return matched
}
