"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import { LockIcon, SmallCloseIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Order } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import {
  ADDR_TO_TICKER,
  KATANA_ADDRESS_TO_TICKER,
  TICKER_TO_LOGO_URL_HANDLE,
} from "@/lib/tokens"
import { getNetwork, safeLocalStorageGetItem } from "@/lib/utils"
import { GlobalOrder, useGlobalOrders } from "@/hooks/use-global-orders"
import { useOrders } from "@/hooks/use-order"
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "@/components/panels/panels"
import { renegade } from "@/app/providers"

dayjs.extend(relativeTime)

interface SingleOrderProps {
  order: Order
}
function SingleOrder(props: SingleOrderProps) {
  const { accountId, setTask } = useRenegade()
  const [baseLogoUrl, setBaseLogoUrl] = React.useState("")
  const [quoteLogoUrl, setQuoteLogoUrl] = React.useState("")
  const base =
    getNetwork() === "katana"
      ? KATANA_ADDRESS_TO_TICKER["0x" + props.order.baseToken.address]
      : ADDR_TO_TICKER["0x" + props.order.baseToken.address]

  const quote =
    getNetwork() === "katana"
      ? KATANA_ADDRESS_TO_TICKER["0x" + props.order.quoteToken.address]
      : ADDR_TO_TICKER["0x" + props.order.quoteToken.address]
  useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setBaseLogoUrl(tickerToLogoUrl[base])
      setQuoteLogoUrl(tickerToLogoUrl[quote])
    })
  }, [base, quote])

  const handleCancel = () => {
    if (!accountId) return
    renegade.task
      .cancelOrder(accountId, props.order.orderId)
      .then(([taskId]) => setTask(taskId, TaskType.CancelOrder))
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      gap="4px"
      color="white.60"
      borderColor="white.20"
      borderBottom="var(--border)"
      _hover={{
        filter: "inherit",
        color: "white.90",
      }}
      cursor="pointer"
      transition="filter 0.1s"
      filter="grayscale(1)"
      paddingY="10px"
    >
      <Text fontFamily="Favorit">Open</Text>
      <Box position="relative" width="45px" height="40px">
        <Image width="25px" height="25px" alt="Quote logo" src={quoteLogoUrl} />
        <Image
          position="absolute"
          right="1"
          bottom="1"
          width="25px"
          height="25px"
          alt="Base logo"
          src={baseLogoUrl}
        />
      </Box>
      <Flex alignItems="flex-start" flexDirection="column" fontFamily="Favorit">
        <Text fontSize="1.1em" lineHeight="1">
          {props.order.amount.toString()}{" "}
          {ADDR_TO_TICKER["0x" + props.order.baseToken.address]}
        </Text>
        <Text fontFamily="Favorit Extended" fontSize="0.9em" fontWeight="200">
          {props.order.side.toUpperCase()}
        </Text>
      </Flex>
      {/* <EditIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        padding="2px"
        borderRadius="100px"
        cursor="pointer"
        _hover={{
          background: "white.10",
        }}
      /> */}
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
    </Flex>
  )
}

interface OrdersPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function OrdersPanel(props: OrdersPanelProps) {
  const orders = useOrders()
  const { accountId } = useRenegade()
  const filteredOrders = Object.values(orders).filter(
    (order) => order.amount > 0
  )
  let panelBody: React.ReactElement

  if (!accountId || !orders || filteredOrders.length === 0) {
    panelBody = (
      <Text
        margin="auto"
        padding="0 10% 50px 10%"
        color="white.50"
        fontSize="0.8em"
        fontWeight="100"
        textAlign="center"
      >
        {accountId
          ? "No orders. Submit an order to broadcast it to the dark pool."
          : "Sign in to create a Renegade account and view your orders."}
      </Text>
    )
  } else {
    panelBody = (
      <>
        {filteredOrders.map((order) => (
          <Box key={order.orderId} width="100%">
            <SingleOrder order={order} />
          </Box>
        ))}
      </>
    )
  }

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderColor="border"
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
      <Flex
        className="scroll scroll-orders hidden"
        alignItems="center"
        flexDirection="column"
        flexGrow="1"
        overflow="overlay"
        width="100%"
        onWheel={() => {
          const query = document.querySelector(".scroll-orders")
          if (query) {
            query.classList.remove("hidden")
            callAfterTimeout(() => {
              query.classList.add("hidden")
            }, 400)()
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  )
}

function OrderBookPanel() {
  const globalOrders = useGlobalOrders()
  const orders = useOrders()
  const { accountId } = useRenegade()
  const [isHovering, setIsHovering] = useState(false)
  const [savedOrders, setSavedOrders] = useState<string[]>([])

  const globalOrdersSorted = useMemo(() => {
    const res: GlobalOrder[] = []
    Object.entries(globalOrders).forEach(([orderId, order]) => {
      if (orderId in orders || savedOrders.includes(orderId)) {
        res.unshift(order)
      } else {
        res.push(order)
      }
    })
    return res
  }, [globalOrders, orders, savedOrders])

  useEffect(() => {
    if (!accountId) return
    const o = safeLocalStorageGetItem(`orders-${accountId}`)
    setSavedOrders(o ? o.split(",") : [])
  }, [accountId, orders])

  let panelBody: React.ReactElement

  if (globalOrdersSorted.length === 0) {
    panelBody = (
      <Text
        marginTop="120px"
        padding="0 10% 0 10%"
        color="white.50"
        fontSize="0.8em"
        fontWeight="100"
        textAlign="center"
      >
        No counterparty orders have been received.
      </Text>
    )
  } else {
    panelBody = (
      <>
        {globalOrdersSorted.map((counterpartyOrder) => {
          const ago = orders[counterpartyOrder.id]
            ? dayjs(orders[counterpartyOrder.id].timestamp).fromNow()
            : ""
          const title =
            isHovering && orders[counterpartyOrder.id]
              ? `${
                  orders[counterpartyOrder.id].side === "buy" ? "Buy" : "Sell"
                } ${orders[counterpartyOrder.id].amount} ${
                  KATANA_ADDRESS_TO_TICKER[
                    "0x" + orders[counterpartyOrder.id].baseToken.address
                  ]
                } ${
                  orders[counterpartyOrder.id].side === "buy" ? "with" : "for"
                } ${
                  KATANA_ADDRESS_TO_TICKER[
                    "0x" + orders[counterpartyOrder.id].quoteToken.address
                  ]
                }`
              : `ID: ${counterpartyOrder.id.split("-")[0].toString()}`
          const secondaryText =
            isHovering && ago
              ? ago
              : `on cluster ${counterpartyOrder.cluster.slice(0, 6) + "..."}`

          const status =
            counterpartyOrder.id in orders
              ? "ACTIVE"
              : counterpartyOrder.state === "Cancelled" &&
                !(counterpartyOrder.id in orders) &&
                savedOrders.includes(counterpartyOrder.id) &&
                counterpartyOrder.id in globalOrders
              ? "MATCHED"
              : counterpartyOrder.state.toUpperCase()
          const textColor =
            status === "ACTIVE" || status === "MATCHED"
              ? "green"
              : status === "CANCELLED"
              ? "red"
              : "white.60"
          return (
            <Flex
              key={counterpartyOrder.id}
              flexDirection="row"
              width="100%"
              padding="4% 8% 4% 8%"
              borderColor="white.20"
              borderBottom="var(--border)"
              userSelect="none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Flex flexDirection="column">
                <Text color="white.80" fontSize="1.1em">
                  {title}
                </Text>
                <Flex>
                  <Text
                    color={textColor}
                    fontFamily="Favorit Expanded"
                    fontSize="0.6em"
                    fontWeight="500"
                  >
                    {status}&nbsp;
                  </Text>
                  <Text
                    color="white.60"
                    fontFamily="Favorit Expanded"
                    fontSize="0.6em"
                    fontWeight="500"
                  >
                    {secondaryText}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )
        })}
      </>
    )
  }
  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderColor="border"
        borderTop="var(--border)"
        borderBottom="var(--border)"
      >
        <Text>Order Book</Text>
      </Flex>
      <Flex
        className="scroll scroll-order-book hidden"
        alignItems="center"
        flexDirection="column"
        flexGrow="1"
        overflow="overlay"
        width="100%"
        maxHeight="30vh"
        onWheel={() => {
          const query = document.querySelector(".scroll-order-book")
          if (query) {
            query.classList.remove("hidden")
            callAfterTimeout(() => {
              query.classList.add("hidden")
            }, 400)()
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  )
}

function CounterpartiesPanel() {
  const { counterparties } = useRenegade()
  return (
    <Flex
      position="relative"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="var(--banner-height)"
      borderColor="border"
      borderTop="var(--border)"
      borderBottom="var(--border)"
    >
      <Text>Counterparties:&nbsp;</Text>
      <Text>{Object.keys(counterparties).length + 1}</Text>
    </Flex>
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
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width={expandedPanelWidth}
      borderColor="border"
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
