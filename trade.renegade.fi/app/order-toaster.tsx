import { formatNumber } from "@/lib/utils"
import {
  OrderMetadata,
  OrderState,
  Token,
  useOrderHistoryWebSocket,
} from "@renegade-fi/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function OrderToaster() {
  const [incomingOrder, setIncomingOrder] = useState<OrderMetadata>()
  useOrderHistoryWebSocket({
    onUpdate: (order) => {
      setIncomingOrder(order)
    },
  })
  const orderMetadataRef = useRef<Map<string, OrderMetadata>>(new Map())

  useEffect(() => {
    if (incomingOrder) {
      const existingOrder = orderMetadataRef.current.get(incomingOrder.id)

      // Ignore duplicate events
      if (existingOrder?.state === incomingOrder.state) {
        return
      }

      orderMetadataRef.current.set(incomingOrder.id, incomingOrder)

      const {
        fills,
        state,
        data: { base_mint, side, amount },
      } = incomingOrder
      const base = Token.findByAddress(base_mint)
      const formattedAmount = formatNumber(amount, base.decimals)
      const prevFills = existingOrder?.fills || []

      if (state === OrderState.Filled) {
        toast.success(
          `Order completely filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedAmount} ${base.ticker}`
        )
      } else if (fills.length > prevFills.length) {
        const sortedFills = fills.sort((a, b) =>
          a.price.timestamp > b.price.timestamp ? 1 : -1
        )
        const currentFill = sortedFills[sortedFills.length - 1].amount
        const formattedCurrentFill = formatNumber(currentFill, base.decimals)
        toast.success(
          `Order partially filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedCurrentFill} ${base.ticker}`
        )
      }
    }
  }, [incomingOrder])

  return null
}
