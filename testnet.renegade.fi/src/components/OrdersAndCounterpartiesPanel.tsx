import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

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

interface OrdersAndCounterpartiesPanelCollapsedProps {
  toggleIsCollapsed: () => void;
}
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
      onClick={props.toggleIsCollapsed}
      cursor="pointer"
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
        cursor="pointer"
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
  toggleIsCollapsed: () => void;
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
          onClick={props.toggleIsCollapsed}
          cursor="pointer"
          _hover={{
            background: "white.10",
          }}
        >
          <ArrowRightIcon boxSize="11px" color="white.80" />
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
  toggleIsCollapsed: () => void;
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
      <OrdersPanel toggleIsCollapsed={props.toggleIsCollapsed} />
    </Flex>
  );
}

interface OrdersAndCounterpartiesPanelState {
  isCollapsed: boolean;
}
export default class OrdersAndCounterpartiesPanel extends React.Component<
  Record<string, never>,
  OrdersAndCounterpartiesPanelState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggleIsCollapsed = this.toggleIsCollapsed.bind(this);
  }

  toggleIsCollapsed() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render() {
    return this.state.isCollapsed ? (
      <OrdersAndCounterpartiesPanelCollapsed
        toggleIsCollapsed={this.toggleIsCollapsed}
      />
    ) : (
      <OrdersAndCounterpartiesPanelExpanded
        toggleIsCollapsed={this.toggleIsCollapsed}
      />
    );
  }
}
