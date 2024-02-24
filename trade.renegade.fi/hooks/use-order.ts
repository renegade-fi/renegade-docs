import { useRenegade } from "@/contexts/Renegade/renegade-context"

export const useOrders = () => {
  // const { accountId } = useRenegade()
  // const [orders, setOrders] = useState<Record<OrderId, Order>>({})

  // useEffect(() => {
  //   if (!accountId) return
  //   const interval = setInterval(async () => {
  //     const existingOrders = safeLocalStorageGetItem(`orders-${accountId}`)
  //     const existingOrdersArray = existingOrders
  //       ? existingOrders.split(",")
  //       : []

  //     const fetchedOrders = await renegade
  //       .queryWallet(accountId)
  //       .then(() => renegade.getOrders(accountId))
  //     setOrders(fetchedOrders)

  //     const uniqueNewOrderIds = Object.keys(fetchedOrders).filter(
  //       (orderId) => !existingOrdersArray.includes(orderId)
  //     )

  //     existingOrdersArray.push(...uniqueNewOrderIds)
  //     const updatedOrders = existingOrdersArray.join(",")

  //     safeLocalStorageSetItem(`orders-${accountId}`, updatedOrders)
  //   }, 1000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [accountId])

  // return orders
  const { orders } = useRenegade()
  return orders
}
