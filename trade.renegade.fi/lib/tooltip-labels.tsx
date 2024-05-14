import { Text } from "@chakra-ui/react"
import dayjs from "dayjs"

export const ORDER_HISTORY_TOOLTIP =
  "These are the orders in your Renegade Wallet. Only you and the node you're connected to can see your orders."
export const NETWORK_ORDERS_TOOLTIP =
  "These are all the orders in the orderbook of the node you are connected to."
export const TASK_HISTORY_TOOLTIP = "These are tasks you've executed."
export const RENEGADE_ACCOUNT_TOOLTIP =
  "These are the balances in your Renegade Wallet. Only you and the node you're connected to can see your balances."
export const BBO_TOOLTIP =
  "We source prices from various markets to ensure quotes are accurate. Orders are executed at the Best Bid Offer price directly from Binance."
export const QUOTE_TOOLTIP =
  "For testnet, we only allow setting USDC as the quote currency."
export const TRADE_HELPER_TOOLTIP =
  "Your order will be filled at the realtime BBO price set by Binance."
export const FEES_TOOLTIP =
  "Fees accrue in your wallet as orders are filled. These fees are paid out when you withdraw funds from the protocol."
export const RELAYER_FEE_TOOLTIP =
  "This is the fee paid to the node you are connected to. It can vary from node to node."
export const PROTOCOL_FEE_TOOLTIP =
  "This is the fee paid to the protocol. It is a static fee set on the smart contract."
export const RELAYER_NAME_TOOLTIP =
  "This is the name of the node you are connected to. Currently, you are connected to the Renegade public node."
export const TVL_TOOLTIP =
  "This is the total value locked in the protocol. It is the sum of the balances in all wallets."
export const AIRDROP_TOOLTIP =
  "Get more testnet funds here. NOTE: These are not real funds and hold no value."
export const ACTIVE_ORDERS_TOOLTIP =
  "The total number of active orders in the network."
export const ORDER_TOOLTIP = (
  base: string,
  currentAmount: string,
  originalAmount: string,
  fill: string,
  state: string,
  side: string,
  createdAt: number
) => {
  return (
    <Text>
      Size: {currentAmount} {base}
      <br />
      Original Size: {originalAmount} {base}
      <br />
      Fill: {fill}
      <br />
      State: {state}
      <br />
      Side: {side}
      <br />
      Created: {dayjs.unix(createdAt).fromNow()}
    </Text>
  )
}
