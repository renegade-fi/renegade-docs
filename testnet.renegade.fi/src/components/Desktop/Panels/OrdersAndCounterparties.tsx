import {
  EditIcon,
  LockIcon,
  SmallCloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Order } from "@renegade-fi/renegade-js";
import { useModal as useModalConnectKit } from "connectkit";
import React from "react";

import { renegade } from "../../..";
import { ADDR_TO_TICKER, TICKER_TO_LOGO_URL_HANDLE } from "../../../../tokens";
import RenegadeContext, { TaskType } from "../../../contexts/RenegadeContext";
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "../../Common/Panel";

interface SingleOrderProps {
  order: Order;
}
function SingleOrder(props: SingleOrderProps) {
  const { accountId, setTask } = React.useContext(RenegadeContext);
  const [baseLogoUrl, setBaseLogoUrl] = React.useState("DEFAULT.png");
  const [quoteLogoUrl, setQuoteLogoUrl] = React.useState("DEFAULT.png");
  React.useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setBaseLogoUrl(
        tickerToLogoUrl[ADDR_TO_TICKER["0x" + props.order.baseToken.address]],
      );
      setQuoteLogoUrl(
        tickerToLogoUrl[ADDR_TO_TICKER["0x" + props.order.quoteToken.address]],
      );
    });
  });
  return (
    <Flex
      alignItems="center"
      width="100%"
      padding="0 6% 0 6%"
      color="white.60"
      gap="5px"
      borderBottom="var(--border)"
      borderColor="white.20"
      cursor="pointer"
      filter="grayscale(1)"
      transition="filter 0.1s"
      _hover={{
        filter: "inherit",
        color: "white.90",
      }}
    >
      <Text fontFamily="Favorit" marginRight="5px">
        Open
      </Text>
      <Box width="30px" height="40px" position="relative">
        <Image src={quoteLogoUrl} width="25px" height="25px" />
        <Image
          src={baseLogoUrl}
          width="25px"
          height="25px"
          position="absolute"
          bottom="0"
          right="0"
        />
      </Box>
      <Flex
        fontFamily="Favorit"
        flexDirection="column"
        alignItems="flex-start"
        padding="10px 0 10px 0"
        marginLeft="5px"
        flexGrow="1"
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
              .then(([taskId]) => setTask(taskId, TaskType.CancelOrder));
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
              .then(([taskId]) => setTask(taskId, TaskType.CancelOrder));
          }
        }}
      />
    </Flex>
  );
}

interface OrdersPanelProps {
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function OrdersPanel(props: OrdersPanelProps) {
  const { orders, accountId } = React.useContext(RenegadeContext);
  const filteredOrders = Object.values(orders).filter(
    (order) => order.amount > 0,
  );
  let panelBody: React.ReactElement;

  if (!accountId || !orders || filteredOrders.length === 0) {
    panelBody = (
      <Text
        margin="auto"
        padding="0 10% 50px 10%"
        fontSize="0.8em"
        fontWeight="100"
        color="white.50"
        textAlign="center"
      >
        {accountId
          ? "No orders. Submit an order to broadcast it to the dark pool."
          : "Sign in to create a Renegade account and view your orders."}
      </Text>
    );
  } else {
    panelBody = (
      <>
        {filteredOrders.map((order) => (
          <Box width="100%" key={order.orderId}>
            <SingleOrder order={order} />
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderBottom="var(--border)"
        borderColor="border"
        position="relative"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          position="absolute"
          left="10px"
          width="calc(0.6 * var(--banner-height))"
          height="calc(0.6 * var(--banner-height))"
          borderRadius="100px"
          onClick={props.toggleIsLocked}
          cursor="pointer"
          _hover={{
            background: "white.10",
          }}
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
        flexDirection="column"
        alignItems="center"
        width="100%"
        flexGrow="1"
        overflow="overlay"
        className="scroll scroll-orders hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll-orders");
          if (query) {
            query.classList.remove("hidden");
            callAfterTimeout(() => {
              query.classList.add("hidden");
            }, 400)();
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  );
}

function OrderBookPanel() {
  const { orderBook } = React.useContext(RenegadeContext);
  let panelBody: React.ReactElement;

  if (Object.keys(orderBook).length === 0) {
    panelBody = (
      <Text
        marginTop="120px"
        padding="0 10% 0 10%"
        fontSize="0.8em"
        fontWeight="100"
        color="white.50"
        textAlign="center"
      >
        No counterparty orders have been received.
      </Text>
    );
  } else {
    console.log(orderBook);
    panelBody = (
      <>
        {Object.values(orderBook).map((counterpartyOrder) => {
          const nullifier = counterpartyOrder.orderId.split("-")[0]; // TODO: Incorrect.
          return (
            <Flex
              flexDirection="row"
              width="100%"
              padding="4% 8% 4% 8%"
              borderBottom="var(--border)"
              borderColor="white.20"
              key={counterpartyOrder.orderId}
            >
              <Flex flexDirection="column">
                <Text fontSize="1.1em" color="white.80">
                  Nullifier: {nullifier.toString()}
                </Text>
                <Text
                  fontFamily="Favorit Expanded"
                  fontSize="0.6em"
                  fontWeight="500"
                  color="white.60"
                >
                  {counterpartyOrder.state.toUpperCase()}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </>
    );
  }
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderTop="var(--border)"
        borderBottom="var(--border)"
        borderColor="border"
        position="relative"
      >
        <Text>Order Book</Text>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxHeight="30vh"
        flexGrow="1"
        overflow="overlay"
        className="scroll scroll-order-book hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll-order-book");
          if (query) {
            query.classList.remove("hidden");
            callAfterTimeout(() => {
              query.classList.add("hidden");
            }, 400)();
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  );
}

function CounterpartiesPanel() {
  const { counterparties } = React.useContext(RenegadeContext);
  let panelBody: React.ReactElement;

  if (Object.keys(counterparties).length === 0) {
    panelBody = (
      <Text
        padding="0 10% 0 10%"
        fontSize="0.8em"
        fontWeight="100"
        color="white.50"
        textAlign="center"
      >
        No counterparties have been discovered.
      </Text>
    );
  } else {
    panelBody = (
      <>
        {Object.values(counterparties).map((counterparty) => {
          const port = counterparty.multiaddr.split("/")[4];
          const ipAddr = counterparty.multiaddr.split("/")[6];
          return (
            <Flex
              flexDirection="column"
              width="100%"
              padding="4% 8% 4% 8%"
              gap="2px"
              borderColor="white.20"
              key={counterparty.peerId}
            >
              <Text fontSize="0.8em" color="white.80">
                Peer ID: {counterparty.peerId.slice(-16)}
              </Text>
              <Text fontSize="0.2em" color="white.60">
                {ipAddr}:{port}
              </Text>
            </Flex>
          );
        })}
      </>
    );
  }
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderTop="var(--border)"
        borderBottom="var(--border)"
        borderColor="border"
        position="relative"
      >
        <Text>Counterparties</Text>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxHeight="30vh"
        padding="5% 0 5% 0"
        overflow="overlay"
        className="scroll scroll-counterparties hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll-counterparties");
          if (query) {
            query.classList.remove("hidden");
            callAfterTimeout(() => {
              query.classList.add("hidden");
            }, 400)();
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  );
}

interface OrdersAndCounterpartiesPanelExpandedProps {
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function OrdersAndCounterpartiesPanelExpanded(
  props: OrdersAndCounterpartiesPanelExpandedProps,
) {
  return (
    <Flex
      width={expandedPanelWidth}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderLeft="var(--border)"
      borderColor="border"
    >
      <OrdersPanel
        isLocked={props.isLocked}
        toggleIsLocked={props.toggleIsLocked}
      />
      <OrderBookPanel />
      <CounterpartiesPanel />
    </Flex>
  );
}

interface OrdersAndCounterpartiesPanelProps {
  isOpenGlobalModal: boolean;
}
export default function OrdersAndCounterpartiesPanel(
  props: OrdersAndCounterpartiesPanelProps,
) {
  const { open } = useModalConnectKit();
  return (
    <Panel
      panelExpanded={(isLocked, toggleIsLocked) => (
        <OrdersAndCounterpartiesPanelExpanded
          isLocked={isLocked}
          toggleIsLocked={toggleIsLocked}
        />
      )}
      panelCollapsedDisplayTexts={["Orders", "Counterparties"]}
      isOpenGlobalModal={props.isOpenGlobalModal}
      isOpenConnectKitModal={open}
      flipDirection={true}
    />
  );
}
