"use client"

import React, { useMemo } from "react"
import { useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import { LockIcon, SmallCloseIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { OrderId } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { ADDR_TO_TICKER, KATANA_ADDRESS_TO_TICKER } from "@/lib/tokens"
import { getNetwork, safeLocalStorageGetItem } from "@/lib/utils"
import { GlobalOrder, useGlobalOrders } from "@/hooks/use-global-orders"
import { useOrders } from "@/hooks/use-order"
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "@/components/panels/panels"
import { LocalOrder } from "@/components/steppers/order-stepper/steps/confirm-step"
import { renegade } from "@/app/providers"

dayjs.extend(relativeTime)

interface SingleOrderProps {
  amount: string
  baseAddr: string
  id: OrderId
  quoteAddr: string
  side: string
  matched?: boolean
}
function SingleOrder({
  amount,
  baseAddr,
  id,
  quoteAddr,
  side,
  matched,
}: SingleOrderProps) {
  const { tokenIcons } = useApp()
  const { accountId, setTask } = useRenegade()

  const base =
    getNetwork() === "katana"
      ? KATANA_ADDRESS_TO_TICKER["0x" + baseAddr]
      : ADDR_TO_TICKER["0x" + baseAddr]

  const quote =
    getNetwork() === "katana"
      ? KATANA_ADDRESS_TO_TICKER["0x" + quoteAddr]
      : ADDR_TO_TICKER["0x" + quoteAddr]

  const handleCancel = () => {
    if (!accountId) return
    renegade.task
      .cancelOrder(accountId, id)
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
      <Text fontFamily="Favorit">{matched ? "Matched" : "Open"}</Text>
      <Box position="relative" width="45px" height="40px">
        <Image
          width="25px"
          height="25px"
          alt="Quote logo"
          src={tokenIcons[quote]}
        />
        <Image
          position="absolute"
          right="1"
          bottom="1"
          width="25px"
          height="25px"
          alt="Base logo"
          src={tokenIcons[base]}
        />
      </Box>
      <Flex alignItems="flex-start" flexDirection="column" fontFamily="Favorit">
        <Text fontSize="1.1em" lineHeight="1">
          {amount} {base}
        </Text>
        <Text fontFamily="Favorit Extended" fontSize="0.9em" fontWeight="200">
          {side.toUpperCase()}
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
      {!matched ? (
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
  )
}

interface OrdersPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function OrdersPanel(props: OrdersPanelProps) {
  const globalOrders = useGlobalOrders()
  const orders = useOrders()
  const { accountId } = useRenegade()
  let panelBody: React.ReactElement

  const [filteredOrders, filteredMatchedOrders] = useMemo(() => {
    const matchedOrders = safeLocalStorageGetItem(`order-details-${accountId}`)
    const parsedMatchedOrders: LocalOrder[] = matchedOrders
      ? JSON.parse(matchedOrders)
      : []
    const filteredMatchedOrders = parsedMatchedOrders.filter(
      (order) =>
        order.id in globalOrders && globalOrders[order.id].state === "Cancelled"
    )
    const filteredOrders = Object.values(orders).filter(
      ({ amount, orderId }) =>
        amount > 0 && !filteredMatchedOrders.some(({ id }) => id === orderId)
    )
    return [filteredOrders, filteredMatchedOrders]
  }, [accountId, globalOrders, orders])

  if (
    !accountId ||
    !orders ||
    (filteredOrders.length === 0 && filteredMatchedOrders.length === 0)
  ) {
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
        {filteredMatchedOrders.map((order) => (
          <Box key={order.id} width="100%">
            <SingleOrder
              amount={order.amount}
              baseAddr={order.base}
              id={order.id as OrderId}
              quoteAddr={order.quote}
              side={order.side}
              matched
            />
          </Box>
        ))}
        {filteredOrders.map(
          ({ amount, baseToken, orderId, quoteToken, side }) => (
            <Box key={orderId} width="100%">
              <SingleOrder
                amount={amount.toString()}
                baseAddr={baseToken.address}
                id={orderId}
                quoteAddr={quoteToken.address}
                side={side}
              />
            </Box>
          )
        )}
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

  const savedOrders: LocalOrder[] = useMemo(() => {
    const matchedOrders = safeLocalStorageGetItem(`order-details-${accountId}`)
    const parsed = matchedOrders ? JSON.parse(matchedOrders) : []
    return parsed
  }, [accountId])

  const seen = savedOrders.some(({ id }) => id in orders)

  const globalOrdersSorted = useMemo(() => {
    const res: GlobalOrder[] = []
    Object.entries(globalOrders).forEach(([orderId, order]) => {
      if (orderId in orders || seen) {
        res.unshift(order)
      } else {
        res.push(order)
      }
    })
    return res
  }, [globalOrders, orders, seen])

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
          const title = orders[counterpartyOrder.id]
            ? `${
                orders[counterpartyOrder.id].side === "buy" ? "Buy" : "Sell"
              } ${orders[counterpartyOrder.id].amount} ${
                // TODO: Should use helper function to get ticker
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
            : `Unknown order hash: ${counterpartyOrder.id
                .split("-")[0]
                .toString()}`

          const status =
            counterpartyOrder.id in orders
              ? "ACTIVE"
              : counterpartyOrder.state === "Cancelled" &&
                !(counterpartyOrder.id in orders) &&
                savedOrders.some(({ id }) => id === counterpartyOrder.id)
              ? "MATCHED"
              : counterpartyOrder.state === "Cancelled"
              ? "PENDING"
              : counterpartyOrder.state.toUpperCase()

          const ago = dayjs(
            counterpartyOrder.id in orders
              ? orders[counterpartyOrder.id].timestamp ||
                  savedOrders.find(({ id }) => id === counterpartyOrder.id)
                    ?.timestamp
              : counterpartyOrder.timestamp
          ).fromNow()

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
            >
              <Flex flexDirection="column">
                <Flex alignItems="center">
                  <Text
                    color={textColor}
                    fontFamily="Favorit Expanded"
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
                    {ago}
                  </Text>
                </Flex>
                <Text color="white.80" fontSize="0.8em">
                  {title}
                </Text>
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