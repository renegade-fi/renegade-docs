"use client"

import { useApp } from "@/contexts/App/app-context"
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
import { Icon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import {
  NetworkOrder,
  OrderMetadata,
  OrderState,
  Token,
  UseOrdersReturnType,
  cancelOrder,
  formatAmount,
  useBalances,
  useConfig,
  useOrderBook,
  useOrderHistory,
  useOrders,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { useModal as useModalConnectKit } from "connectkit"
import dayjs from "dayjs"
import { X } from "lucide-react"
import numeral from "numeral"
import React, { useMemo } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"
import { formatUnits } from "viem"

import { useMatchedOrders } from "@/hooks/use-matched-orders"
import { useUSDPrice } from "@/hooks/use-usd-price"

import { Panel, expandedPanelWidth } from "@/components/panels/panels"

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
    filled,
    created,
    data: { amount, base_mint, quote_mint, side },
  } = order
  const { tokenIcons } = useApp()
  const config = useConfig()

  const base = Token.findByAddress(base_mint)
  const quote = Token.findByAddress(quote_mint)
  const formattedAmount = formatNumber(amount, base.decimals)
  const formattedAmountLong = formatNumber(amount, base.decimals, true)
  const remaining = BigInt(amount) - BigInt(filled)
  const formattedRemaining = formatNumber(remaining, base.decimals)
  const formattedRemainingLong = formatNumber(
    BigInt(amount) - BigInt(filled),
    base.decimals,
    true
  )
  const amountLabel =
    state === OrderState.Filled ? formattedAmount : formattedRemaining
  const amountLabelLong =
    state === OrderState.Filled ? formattedAmountLong : formattedRemainingLong
  const formattedState = getReadableState(state)
  const fillLabel = `${Math.round((Number(filled) / Number(amount)) * 100)}%`
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

  const taskHistory = useTaskHistory()
  const isQueue = taskHistory.find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )

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

interface OrdersPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function OrdersPanel(props: OrdersPanelProps) {
  const balances = useBalances()
  const orderHistory = useOrderHistory({ sort: "desc" })
  const status = useStatus()
  const isConnected = status === "in relayer"

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
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          width="100%"
          minHeight="var(--banner-height)"
          borderBottom="var(--border)"
        >
          <Flex
            position="absolute"
            top="12px"
            left="29px"
            alignItems="center"
            color="text.primary"
            _hover={{
              color: "text.secondary",
            }}
            cursor="pointer"
            transition="color 0.3s ease"
            onClick={props.toggleIsLocked}
          >
            {props.isLocked ? (
              <LockIcon boxSize="11px" />
            ) : (
              <UnlockIcon boxSize="11px" />
            )}
          </Flex>
          <Text color="text.primary">Orders</Text>
        </Flex>
      </Tooltip>
      {Content}
    </>
  )
}

function OrderBookPanel() {
  const networkOrders = useOrderBook()
  const orders = useOrders()

  const matchedOrders = useMatchedOrders()

  let panelBody: React.ReactElement

  if (Object.values(networkOrders).length === 0) {
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
        {Object.values(networkOrders).map((counterpartyOrder) => {
          const title = formatTitle(orders, counterpartyOrder)
          const status = orders.find(({ id }) => id === counterpartyOrder.id)
            ? "Active"
            : matchedOrders.some(({ id }) => id === counterpartyOrder.id)
            ? "Matched"
            : counterpartyOrder.state === "Cancelled"
            ? "Verified"
            : counterpartyOrder.state

          const timestamp = counterpartyOrder.timestamp
          const textColor =
            status === "Active" || status === "Matched"
              ? "green"
              : status === "Cancelled"
              ? "red"
              : undefined

          return (
            <Box
              key={counterpartyOrder.id}
              padding="5%"
              color="text.secondary"
              fontSize="0.8em"
              borderBottom="var(--secondary-border)"
              _hover={{
                filter: "inherit",
                color: "text.primary",
              }}
              role="group"
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                minWidth="100%"
                whiteSpace="nowrap"
              >
                <Text fontSize="1.3em" _groupHover={{ color: textColor }}>
                  {status}&nbsp;
                </Text>
                <Text>{dayjs.unix(Number(timestamp)).fromNow()}</Text>
              </Flex>
              <Text>{title}</Text>
            </Box>
          )
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
  const globalOrders = useOrderBook()
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
        <Text>{Object.keys(globalOrders).length || "..."}</Text>
      </Flex>
    </Tooltip>
  )
}

interface OrdersAndCounterpartiesPanelExpandedProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function OrdersAndCounterpartiesPanelExpanded(
  props: OrdersAndCounterpartiesPanelExpandedProps
) {
  return (
    <Flex
      flexDirection="column"
      width={expandedPanelWidth}
      borderLeft="var(--border)"
      backdropFilter="blur(8px)"
    >
      <OrdersPanel
        isLocked={props.isLocked}
        toggleIsLocked={props.toggleIsLocked}
      />
      <OrderBookPanel />
      <CounterpartiesPanel />
    </Flex>
  )
}

export function OrdersAndCounterpartiesPanel() {
  const { open } = useModalConnectKit()
  return (
    <Panel
      panelExpanded={(isLocked, toggleIsLocked) => (
        <OrdersAndCounterpartiesPanelExpanded
          isLocked={isLocked}
          toggleIsLocked={toggleIsLocked}
        />
      )}
      panelCollapsedDisplayTexts={["Orders", "Counterparties"]}
      isOpenConnectKitModal={open}
      flipDirection={true}
    />
  )
}

const formatTitle = (orders: UseOrdersReturnType, order: NetworkOrder) => {
  const userOrder = orders.find(({ id }) => id === order.id)
  if (userOrder) {
    const base = Token.findByAddress(userOrder.base_mint)
    const quote = Token.findByAddress(userOrder.quote_mint).ticker
    const formattedAmount = formatAmount(userOrder.amount, base)
    return `${userOrder.side} ${formattedAmount} ${base.ticker} for ${quote}`
  }

  return `Unknown order hash: ${order.id.split("-")[0].toString()}`
}
