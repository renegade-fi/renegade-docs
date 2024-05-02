import {
  OrderMetadata,
  OrderState,
  Token,
  formatAmount,
  useOrderHistory,
  useOrderHistoryWebSocket,
  useOrders,
} from "@renegade-fi/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function OrderToaster() {
  const orderHistory = useOrderHistory()
  const incomingOrder = useOrderHistoryWebSocket()
  const orders = useOrders()
  const orderMetadataRef = useRef<Map<string, OrderMetadata>>(new Map())

  // Hydrate initial task history
  useEffect(() => {
    orderHistory.forEach((order) => {
      if (orderMetadataRef.current.get(order.id)) return
      orderMetadataRef.current.set(order.id, order)
    })
  }, [orderHistory])

  useEffect(() => {
    if (incomingOrder) {
      const existingOrder = orderMetadataRef.current.get(incomingOrder.id)

      // Ignore duplicate events
      if (existingOrder?.state === incomingOrder.state) {
        return
      }

      orderMetadataRef.current.set(incomingOrder.id, incomingOrder)

      const {
        filled,
        state,
        data: { base_mint, side },
      } = incomingOrder
      const base = Token.findByAddress(base_mint)
      const formattedFilled = formatAmount(filled, base)
      const lastFilled = existingOrder?.filled || BigInt(0)

      // TODO: Race condition if user orders gets update quicker than order history
      if (state === OrderState.Filled) {
        toast.success(
          `Order completely filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedFilled} ${base.ticker}`
        )
      } else if (filled > lastFilled) {
        const currentFill = filled - lastFilled
        const formattedCurrentFill = formatAmount(currentFill, base)
        toast.success(
          `Order partially filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedCurrentFill} ${base.ticker}`
        )
      }
    }
  }, [incomingOrder, orders])

  return null
}
