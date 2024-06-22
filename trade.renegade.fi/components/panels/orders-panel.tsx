"use client"

import { useApp } from "@/contexts/App/app-context"
import {
  RENEGADE_PROTOCOL_FEE_RATE,
  RENEGADE_RELAYER_FEE_RATE,
} from "@/lib/constants"
import {
  FAILED_CANCEL_ORDER_MSG,
  QUEUED_CANCEL_ORDER_MSG,
  getReadableState,
} from "@/lib/task"
import {
  ACTIVE_ORDERS_TOOLTIP,
  NETWORK_ORDERS_TOOLTIP,
  ORDER_HISTORY_TOOLTIP,
  ORDER_TOOLTIP,
} from "@/lib/tooltip-labels"
import { formatNumber } from "@/lib/utils"
import { Icon } from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import {
  OrderMetadata,
  OrderState,
  Token,
  useBalances,
  useConfig,
  useNetworkOrders,
  useOrderHistory,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { cancelOrder } from "@renegade-fi/react/actions"
import { useModal as useModalConnectKit } from "connectkit"
import { X } from "lucide-react"
import numeral from "numeral"
import React, { useMemo } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"
import { formatUnits } from "viem/utils"

import { useSavingsPerFill } from "@/hooks/use-savings"
import { useUSDPrice } from "@/hooks/use-usd-price"

import { NetworkOrderItem } from "@/components/panels/network-order"
import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { UserOrder } from "@/components/panels/user-order"

import { Tooltip } from "../tooltip"

function SingleOrder({
  order,
  sendBalance,
}: {
  order: OrderMetadata
  sendBalance: bigint
}) {
  const {
    id,
    state,
    fills,
    created,
    data: { amount, base_mint, quote_mint, side },
  } = order
  const { tokenIcons } = useApp()
  const config = useConfig()

  const base = Token.findByAddress(base_mint)
  const quote = Token.findByAddress(quote_mint)
  const formattedAmount = formatNumber(amount, base.decimals)
  const formattedAmountLong = formatNumber(amount, base.decimals, true)
  const sortedFills = fills.sort((a, b) =>
    a.price.timestamp > b.price.timestamp ? 1 : -1
  )
  const fillAmount = sortedFills.reduce(
    (acc, fill) => acc + BigInt(fill.amount),
    BigInt(0)
  )
  const remaining = BigInt(amount) - fillAmount
  const formattedRemaining = formatNumber(remaining, base.decimals)
  const formattedRemainingLong = formatNumber(
    BigInt(amount) - fillAmount,
    base.decimals,
    true
  )
  const amountLabel =
    state === OrderState.Filled ? formattedAmount : formattedRemaining
  const amountLabelLong =
    state === OrderState.Filled ? formattedAmountLong : formattedRemainingLong
  const formattedState = getReadableState(state)
  const fillLabel = `${Math.round(
    (Number(fillAmount) / Number(amount)) * 100
  )}%`
  const isCancellable = [OrderState.Created, OrderState.Matching].includes(
    state
  )
  const formattedSendBalance = parseFloat(
    formatUnits(
      sendBalance || BigInt(0),
      side === "Buy" ? quote.decimals : base.decimals
    )
  )
  const costInUsd = useUSDPrice(base, remaining)
  const formattedQuoteValue = numeral(costInUsd).format("$0,0.00")
  let insufficientSendBalance = false
  if (side === "Buy" && costInUsd > formattedSendBalance) {
    insufficientSendBalance = true
  } else if (side === "Sell" && remaining > sendBalance) {
    insufficientSendBalance = true
  }

  const isColored = isCancellable || state === OrderState.SettlingMatch

  const { data: taskHistory } = useTaskHistory()
  const isQueue = Array.from(taskHistory?.values() || []).find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )

  const totalSavings = useSavingsPerFill(
    order,
    RENEGADE_PROTOCOL_FEE_RATE + RENEGADE_RELAYER_FEE_RATE
  ).reduce((acc, curr) => acc + curr, 0)

  const handleCancel = async () => {
    if (isQueue) {
      toast.message(QUEUED_CANCEL_ORDER_MSG(base, amount, side))
    }
    await cancelOrder(config, { id }).catch((e) => {
      console.error(`Error cancelling order ${e.response?.data ?? e.message}`)
      toast.error(FAILED_CANCEL_ORDER_MSG(base, amount, side))
    })
  }

  return (
    <Tooltip
      placement="left"
      paddingX={3}
      paddingY={2.8}
      // @ts-ignore
      label={ORDER_TOOLTIP(
        base.ticker,
        quote.ticker,
        formattedRemainingLong,
        formattedAmountLong,
        fillLabel,
        side,
        Number(created) / 1000,
        formattedQuoteValue,
        totalSavings,
        insufficientSendBalance
      )}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="4%"
        width="100%"
        padding="5%"
        color={isCancellable ? "text.secondary" : "text.muted"}
        fontSize="0.8em"
        borderBottom="var(--secondary-border)"
        _hover={{
          filter: "inherit",
          color: "text.primary",
        }}
        whiteSpace="nowrap"
        transition="filter 0.3s ease"
        filter={isColored ? "inherit" : "grayscale(1)"}
      >
        <Text fontFamily="Favorit" fontSize="1.3em">
          {formattedState}
        </Text>
        <Box position="relative" width="45px" height="40px">
          <Image
            width="25px"
            height="25px"
            alt=""
            src={tokenIcons[quote.ticker]}
          />
          <Image
            position="absolute"
            right="1"
            bottom="1"
            width="25px"
            height="25px"
            alt=""
            src={tokenIcons[base.ticker]}
          />
        </Box>
        <Flex alignItems="flex-start" flexDirection="column" lineHeight="1">
          <Tooltip
            placement="bottom"
            label={`${amountLabelLong} ${base.ticker}`}
          >
            <Text fontFamily="Favorit" fontSize="1.4em">
              {amountLabel} {base.ticker}
            </Text>
          </Tooltip>
          <Text>{side.toUpperCase()}</Text>
        </Flex>
        {isCancellable ? (
          <Tooltip label="Cancel Order">
            <Icon
              as={X}
              boxSize="1.4em"
              color="text.secondary"
              cursor="pointer"
              _hover={{
                color: "text.muted",
              }}
              onClick={handleCancel}
            />
          </Tooltip>
        ) : null}
      </Flex>
    </Tooltip>
  )
}

function OrdersPanel() {
  const balances = useBalances()
  const { data } = useOrderHistory()
  const status = useStatus()
  const isConnected = status === "in relayer"
  const orderHistory = Array.from(data?.values() || []).sort(
    (a, b) => Number(b.created) - Number(a.created)
  )

  const Content = useMemo(() => {
    if (!isConnected || !orderHistory.length) {
      return (
        <Text
          margin="auto"
          padding="0 10%"
          color="text.secondary"
          fontSize="0.8em"
          fontWeight="100"
          textAlign="center"
        >
          {isConnected
            ? "No orders. Submit an order to broadcast it to the dark pool."
            : "Sign in to create a Renegade account and view your orders."}
        </Text>
      )
    }

    return (
      <SimpleBar
        style={{
          height: "calc(100% - 30vh - (3 * var(--banner-height)))",
          width: "100%",
          padding: "0 8px",
        }}
      >
        {orderHistory.map((order) => {
          const sendBalance =
            balances.find(({ mint }) =>
              order.data.side === "Buy"
                ? mint === order.data.quote_mint
                : mint === order.data.base_mint
            )?.amount || BigInt(0)
          return (
            <SingleOrder
              key={order.id}
              order={order}
              sendBalance={sendBalance}
            />
          )
        })}
      </SimpleBar>
    )
  }, [balances, isConnected, orderHistory])

  return (
    <>
      <Tooltip placement="left" label={ORDER_HISTORY_TOOLTIP}>
        <Box
          display="grid"
          height="var(--banner-height)"
          color="text.primary"
          borderBottom="var(--border)"
          placeContent="center"
        >
          <Text>Orders</Text>
        </Box>
      </Tooltip>
      {Content}
    </>
  )
}

function OrderBookPanel() {
  const { data } = useNetworkOrders()
  const networkOrders = Array.from(data?.values() || []).sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  )
  const orderHistory = useOrderHistory()

  let panelBody: React.ReactElement

  if (!networkOrders.length) {
    panelBody = (
      <Box display="grid" height="30vh" placeContent="center">
        <Text
          padding="0 10%"
          color="text.secondary"
          fontSize="0.8em"
          fontWeight="100"
          textAlign="center"
        >
          No counterparty orders have been received.
        </Text>
      </Box>
    )
  } else {
    panelBody = (
      <SimpleBar
        style={{
          height: "30vh",
          width: "100%",
          padding: "0 8px",
        }}
      >
        {Object.values(networkOrders).map((networkOrder) => {
          const userOrder = orderHistory.data?.get(networkOrder.id)
          if (userOrder) {
            return (
              <UserOrder
                key={userOrder.id}
                order={userOrder}
                timestamp={networkOrder.timestamp}
              />
            )
          }
          return <NetworkOrderItem key={networkOrder.id} order={networkOrder} />
        })}
      </SimpleBar>
    )
  }

  return (
    <>
      <Tooltip placement="left" label={NETWORK_ORDERS_TOOLTIP}>
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          width="100%"
          minHeight="var(--banner-height)"
          borderColor="border"
          borderTop="var(--border)"
          borderBottom="var(--border)"
        >
          <Text color="text.primary">Order Book</Text>
        </Flex>
      </Tooltip>
      {panelBody}
    </>
  )
}

function CounterpartiesPanel() {
  const { data } = useNetworkOrders()
  return (
    <Tooltip placement="left" label={ACTIVE_ORDERS_TOOLTIP}>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        minHeight="var(--banner-height)"
        color="text.primary"
        borderColor="border"
        borderTop="var(--border)"
      >
        <Text>Active Orders:&nbsp;</Text>
        <Text>{Array.from(data?.values() || []).length || "..."}</Text>
      </Flex>
    </Tooltip>
  )
}

function OrdersAndCounterpartiesPanelExpanded() {
  return (
    <Flex
      flexDirection="column"
      width={expandedPanelWidth}
      borderLeft="var(--border)"
      backdropFilter="blur(8px)"
    >
      <OrdersPanel />
      <OrderBookPanel />
      <CounterpartiesPanel />
    </Flex>
  )
}

export function OrdersAndCounterpartiesPanel() {
  const { open } = useModalConnectKit()
  return (
    <Panel
      panelExpanded={() => <OrdersAndCounterpartiesPanelExpanded />}
      panelCollapsedDisplayTexts={["Orders", "Counterparties"]}
      isOpenConnectKitModal={open}
      flipDirection={true}
    />
  )
}
