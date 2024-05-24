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
        filled,
        state,
        data: { base_mint, side },
      } = incomingOrder
      const base = Token.findByAddress(base_mint)
      const formattedFilled = formatNumber(filled, base.decimals)
      const lastFilled = existingOrder?.filled || BigInt(0)

      if (state === OrderState.Filled) {
        toast.success(
          `Order completely filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedFilled} ${base.ticker}`
        )
      } else if (filled > lastFilled) {
        const currentFill = filled - lastFilled
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
