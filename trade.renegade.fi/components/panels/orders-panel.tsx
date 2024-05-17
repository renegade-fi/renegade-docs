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
import { LockIcon, SmallCloseIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import {
  NetworkOrder,
  OrderMetadata,
  OrderState,
  Token,
  UseOrdersReturnType,
  cancelOrder,
  formatAmount,
  useConfig,
  useOrderBook,
  useOrderHistory,
  useOrders,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { useModal as useModalConnectKit } from "connectkit"
import dayjs from "dayjs"
import React, { useMemo } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"

import { useMatchedOrders } from "@/hooks/use-matched-orders"

import { Panel, expandedPanelWidth } from "@/components/panels/panels"

import { Tooltip } from "../tooltip"

function SingleOrder({ order }: { order: OrderMetadata }) {
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
  const formattedRemaining = formatNumber(
    BigInt(amount) - BigInt(filled),
    base.decimals
  )
  const formattedState = getReadableState(state)

  const fillLabel = `${Math.round((Number(filled) / Number(amount)) * 100)}%`

  const isCancellable = [OrderState.Created, OrderState.Matching].includes(
    state
  )

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
      // @ts-ignore
      label={ORDER_TOOLTIP(
        base.ticker,
        formattedRemaining,
        formattedAmount,
        fillLabel,
        side,
        Number(created) / 1000
      )}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="4%"
        width="100%"
        padding="5%"
        color="white.60"
        borderColor="white.20"
        borderBottom="var(--secondary-border)"
        _hover={{
          filter: "inherit",
          color: "white.90",
        }}
        transition="all 0.2s"
        filter={isCancellable ? "inherit" : "grayscale(1)"}
      >
        <Text fontFamily="Favorit">{formattedState}</Text>
        <Box position="relative" width="45px" height="40px">
          <Image
            width="25px"
            height="25px"
            alt="Quote logo"
            src={tokenIcons[quote.ticker]}
          />
          <Image
            position="absolute"
            right="1"
            bottom="1"
            width="25px"
            height="25px"
            alt="Base logo"
            src={tokenIcons[base.ticker]}
          />
        </Box>
        <Flex
          alignItems="flex-start"
          flexDirection="column"
          fontFamily="Favorit"
        >
          <Text lineHeight="1">
            {formattedAmount} {base.ticker}
          </Text>
          <Text fontFamily="Favorit Extended" fontSize="0.9em" fontWeight="200">
            {side.toUpperCase()}
          </Text>
        </Flex>
        {isCancellable ? (
          <SmallCloseIcon
            width="calc(0.5 * var(--banner-height))"
            height="calc(0.5 * var(--banner-height))"
            borderRadius="100px"
            cursor="pointer"
            _hover={{
              background: "white.10",
            }}
            onClick={handleCancel}
          />
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
  const orderHistory = useOrderHistory({ sort: "desc" })
  const status = useStatus()
  const isConnected = status === "in relayer"

  const Content = useMemo(() => {
    if (!isConnected || !orderHistory.length) {
      return (
        <Text
          margin="auto"
          padding="0 10%"
          color="white.50"
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
          height: "calc(100% - 30vh -  (3 * var(--banner-height)))",
          width: "100%",
          padding: "0 8px",
        }}
      >
        {orderHistory.map((order) => {
          return <SingleOrder key={order.id} order={order} />
        })}
      </SimpleBar>
    )
  }, [isConnected, orderHistory])

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
            left="10px"
            alignItems="center"
            justifyContent="center"
            width="calc(0.6 * var(--banner-height))"
            height="calc(0.6 * var(--banner-height))"
            borderRadius="100px"
            _hover={{
              background: "white.10",
            }}
            cursor="pointer"
            onClick={props.toggleIsLocked}
          >
            {props.isLocked ? (
              <LockIcon boxSize="11px" color="white.80" />
            ) : (
              <UnlockIcon boxSize="11px" color="white.80" />
            )}
          </Flex>
          <Text>Order History</Text>
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
          color="white.50"
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
            ? "ACTIVE"
            : matchedOrders.some(({ id }) => id === counterpartyOrder.id)
            ? "MATCHED"
            : counterpartyOrder.state === "Cancelled"
            ? "VERIFIED"
            : counterpartyOrder.state.toUpperCase()

          const timestamp = counterpartyOrder.timestamp
          const textColor =
            status === "ACTIVE" || status === "MATCHED"
              ? "green"
              : status === "CANCELLED"
              ? "red"
              : "white.60"

          return (
            <Box
              key={counterpartyOrder.id}
              padding="5%"
              borderBottom="var(--secondary-border)"
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                minWidth="100%"
              >
                <Text
                  color={textColor}
                  fontFamily="Favorit Extended"
                  fontWeight="500"
                >
                  {status}&nbsp;
                </Text>
                <Text
                  color="white.60"
                  fontFamily="Favorit Expanded"
                  fontSize="0.7em"
                  fontWeight="500"
                >
                  {dayjs.unix(Number(timestamp)).fromNow()}
                </Text>
              </Flex>
              <Text color="white.80" fontSize="0.8em">
                {title}
              </Text>
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
          <Text>Order Book</Text>
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
