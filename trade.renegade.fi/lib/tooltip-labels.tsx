import { Text } from "@chakra-ui/react"
import dayjs from "dayjs"
import { TriangleAlert } from "lucide-react"

export const ORDER_HISTORY_TOOLTIP =
  "Your private orders. Only you and your connected relayer can see these values."
export const NETWORK_ORDERS_TOOLTIP =
  "All the active hidden orders that are currently being matched."
export const TASK_HISTORY_TOOLTIP =
  "A history of your previous interactions with Renegade."
export const RENEGADE_ACCOUNT_TOOLTIP =
  "Your deposits inside of Renegade. Only you and your connected relayer can see your balances."
export const BBO_TOOLTIP =
  "All prices are streamed from centralized exchanges in real-time, and all trades clear at the middle of the Binance bid-ask spread."
export const FEES_TOOLTIP =
  "Fees are only paid on matched orders, and must be paid before you withdraw funds from Renegade."
export const RELAYER_FEE_TOOLTIP =
  "The fee you pay to your relayer. To get lower relayer fees, run your own node."
export const PROTOCOL_FEE_TOOLTIP = "The fee you pay to the protocol."
export const RELAYER_NAME_TOOLTIP =
  "Your currently connected relayer. Your relayer can view your private orders, but does not control your funds."
export const TVL_TOOLTIP =
  "The total amount that has been deposited into the Renegade pools. "
export const AIRDROP_TOOLTIP = "Click to get more testnet funds."
export const ACTIVE_ORDERS_TOOLTIP =
  "The total number of outstanding orders in Renegade."
export const ORDER_TOOLTIP = (
  base: string,
  quote: string,
  currentAmount: string,
  originalAmount: string,
  fill: string,
  side: string,
  createdAt: number,
  usdValue: string,
  insufficientBalance?: boolean
) => {
  return (
    <Text fontFamily="Favorit Mono" whiteSpace="nowrap">
      Original Size: {originalAmount} {base}
      <br />
      Remaining Size: {currentAmount} {base}
      <br />
      Fill: {fill}
      {usdValue ? (
        <>
          <br />
          Value: {usdValue}
        </>
      ) : null}
      <br />
      Side: {side}
      <br />
      Created: {dayjs.unix(createdAt).fromNow()}
      <br />
      {insufficientBalance && (
        <Text
          as="span"
          alignItems="center"
          gap="2"
          display="flex"
          marginTop="8px"
        >
          <TriangleAlert size="14" color="#fecb33" /> Insufficient{" "}
          {side === "Buy" ? quote : base} to fill order
        </Text>
      )}
    </Text>
  )
}
export const REMEMBER_ME_TOOLTIP =
  "Only use this option if you are using a secure device that you own."
export const INSUFFICIENT_BALANCE_TOOLTIP =
  "Insufficient balance to cover the entire order. Only part of the order will be filled."
export const USER_ORDER_IN_ORDERBOOK =
  "Your order information is only visible to you and your connected relayer."
export const MIDPOINT_TOOLTIP =
  "This order will clear at the middle of the Binance bid-ask spread."
export const GAS_FEE_TOOLTIP =
  "Gas fees for this transaction are paid for by your connected relayer."
export const ORDER_CONFIRMATION_PROTOCOL_FEE_TOOLTIP =
  "The fee you pay to the protocol. Only paid upon a successful match."
export const ORDER_CONFIRMATION_RELAYER_FEE_TOOLTIP =
  "The fee you pay to your relayer. Only paid upon a successful match."
