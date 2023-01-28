import { ArrowLeftIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";

interface SingleOrdersAndCounterpartiesPanelCollapsedProps {
  displayText: string;
  isFirst: boolean;
}
function SingleOrdersAndCounterpartiesPanelCollapsed(
  props: SingleOrdersAndCounterpartiesPanelCollapsedProps,
) {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      borderBottom={props.isFirst ? "var(--border)" : "none"}
      borderColor="border"
    >
      <Text transform="rotate(90deg)" textAlign="center" minWidth="200px">
        {props.displayText}
      </Text>
    </Flex>
  );
}

interface OrdersAndCounterpartiesPanelCollapsedProps {}
function OrdersAndCounterpartiesPanelCollapsed(
  props: OrdersAndCounterpartiesPanelCollapsedProps,
) {
  return (
    <Flex
      width="calc(1.5 * var(--banner-height))"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderLeft="var(--border)"
      borderColor="border"
      userSelect="none"
      position="relative"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="9px"
        width="calc(0.6 * var(--banner-height))"
        height="calc(0.6 * var(--banner-height))"
        borderRadius="100px"
      >
        <ArrowLeftIcon boxSize="11px" color="white.80" />
      </Flex>
      <SingleOrdersAndCounterpartiesPanelCollapsed
        isFirst={true}
        displayText="Order History"
      />
      <SingleOrdersAndCounterpartiesPanelCollapsed
        isFirst={false}
        displayText="Counterparties"
      />
    </Flex>
  );
}

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

interface OrdersAndCounterpartiesPanelExpandedProps {
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
    </Flex>
  );
}

interface OrdersAndCounterpartiesPanelProps {
  renegadeConnection: RenegadeConnection;
}
interface OrdersAndCounterpartiesPanelState {
  isCollapsed: boolean;
  isLocked: boolean;
}
export default class OrdersAndCounterpartiesPanel extends React.Component<
  OrdersAndCounterpartiesPanelProps,
  OrdersAndCounterpartiesPanelState
> {
  constructor(props: OrdersAndCounterpartiesPanelProps) {
    super(props);
    this.state = {
      isCollapsed: true,
      isLocked: false,
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.toggleIsLocked = this.toggleIsLocked.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isCollapsed: false,
    });
  }

  onMouseLeave() {
    this.setState({
      isCollapsed: true,
    });
  }

  toggleIsLocked() {
    this.setState({
      isLocked: !this.state.isLocked,
    });
  }

  render() {
    let content: React.ReactElement;
    if (!this.state.isLocked && this.state.isCollapsed) {
      content = <OrdersAndCounterpartiesPanelCollapsed />;
    } else {
      content = (
        <OrdersAndCounterpartiesPanelExpanded
          isLocked={this.state.isLocked}
          toggleIsLocked={this.toggleIsLocked}
        />
      );
    }
    return (
      <Flex onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {content}
      </Flex>
    );
  }
}
