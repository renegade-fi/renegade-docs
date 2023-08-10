"use client"

import React from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import {
  EditIcon,
  LockIcon,
  SmallCloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Order } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"

import { ADDR_TO_TICKER, TICKER_TO_LOGO_URL_HANDLE } from "@/lib/tokens"
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "@/components/panels"
import { renegade } from "@/app/providers"

interface SingleOrderProps {
  order: Order
}
function SingleOrder(props: SingleOrderProps) {
  const { accountId, setTask } = useRenegade()
  const [baseLogoUrl, setBaseLogoUrl] = React.useState("DEFAULT.png")
  const [quoteLogoUrl, setQuoteLogoUrl] = React.useState("DEFAULT.png")
  React.useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setBaseLogoUrl(
        tickerToLogoUrl[ADDR_TO_TICKER["0x" + props.order.baseToken.address]]
      )
      setQuoteLogoUrl(
        tickerToLogoUrl[ADDR_TO_TICKER["0x" + props.order.quoteToken.address]]
      )
    })
  })
  return (
    <Flex
      alignItems="center"
      gap="5px"
      width="100%"
      padding="0 6% 0 6%"
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
    >
      <Text marginRight="5px" fontFamily="Favorit">
        Open
      </Text>
      <Box position="relative" width="30px" height="40px">
        <Image width="25px" height="25px" alt="Quote logo" src={quoteLogoUrl} />
        <Image
          position="absolute"
          right="0"
          bottom="0"
          width="25px"
          height="25px"
          alt="Base logo"
          src={baseLogoUrl}
        />
      </Box>
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        flexGrow="1"
        marginLeft="5px"
        padding="10px 0 10px 0"
        fontFamily="Favorit"
      >
        <Text fontSize="1.1em" lineHeight="1">
          {props.order.amount.toString()}{" "}
          {ADDR_TO_TICKER["0x" + props.order.baseToken.address]}
        </Text>
        <Text fontFamily="Favorit Extended" fontSize="0.9em" fontWeight="200">
          {props.order.side.toUpperCase()}
        </Text>
      </Flex>
      <EditIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        padding="2px"
        borderRadius="100px"
        cursor="pointer"
        _hover={{
          background: "white.10",
        }}
        onClick={() => {
          if (accountId) {
            renegade.task
              .cancelOrder(accountId, props.order.orderId)
              .then(([taskId]) => setTask(taskId, TaskType.CancelOrder))
          }
        }}
      />
      <SmallCloseIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
        _hover={{
          background: "white.10",
        }}
        onClick={() => {
          if (accountId) {
            renegade.task
              .cancelOrder(accountId, props.order.orderId)
              .then(([taskId]) => setTask(taskId, TaskType.CancelOrder))
          }
        }}
      />
    </Flex>
  )
}

interface OrdersPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function OrdersPanel(props: OrdersPanelProps) {
  const { orders, accountId } = useRenegade()
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

function CounterpartiesPanel() {
  const { counterparties } = useRenegade()
  let panelBody: React.ReactElement

  if (Object.keys(counterparties).length === 0) {
    panelBody = (
      <Text
        padding="0 10% 0 10%"
        color="white.50"
        fontSize="0.8em"
        fontWeight="100"
        textAlign="center"
      >
        No counterparties have been discovered.
      </Text>
    )
  } else {
    panelBody = (
      <>
        {Object.values(counterparties).map((counterparty) => {
          const port = counterparty.multiaddr.split("/")[4]
          const ipAddr = counterparty.multiaddr.split("/")[6]
          return (
            <Flex
              key={counterparty.peerId}
              flexDirection="column"
              gap="2px"
              width="100%"
              padding="4% 8% 4% 8%"
              borderColor="white.20"
            >
              <Text color="white.80" fontSize="0.8em">
                Peer ID: {counterparty.peerId.slice(-16)}
              </Text>
              <Text color="white.60" fontSize="0.2em">
                {ipAddr}:{port}
              </Text>
            </Flex>
          )
        })}
      </>
    )
  }
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
      <Text>42</Text>
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
      {/* <OrderBookPanel /> */}
      <CounterpartiesPanel />
    </Flex>
  )
}

export default function OrdersAndCounterpartiesPanel() {
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
