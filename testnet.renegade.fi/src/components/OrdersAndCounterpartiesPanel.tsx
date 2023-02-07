import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useModal as useModalConnectKit } from "connectkit";
import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";
import { Panel } from "./PanelCommon";

interface OrdersPanelProps {
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function OrdersPanel(props: OrdersPanelProps) {
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
      <Flex flexDirection="column" flexGrow="1">
        <Box height="10px" />
      </Flex>
    </>
  );
}

function CounterpartiesPanel() {
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
      <Flex flexDirection="column" flexGrow="1">
        <Box height="10px" />
      </Flex>
    </>
  );
}

interface OrdersAndCounterpartiesPanelExpandedProps {
  renegadeConnection: RenegadeConnection;
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function OrdersAndCounterpartiesPanelExpanded(
  props: OrdersAndCounterpartiesPanelExpandedProps,
) {
  return (
    <Flex
      width="calc(7 * var(--banner-height))"
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
      <CounterpartiesPanel renegadeConnection={props.renegadeConnection} />
    </Flex>
  );
}

interface OrdersAndCounterpartiesPanelProps {
  renegadeConnection: RenegadeConnection;
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
          renegadeConnection={props.renegadeConnection}
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
