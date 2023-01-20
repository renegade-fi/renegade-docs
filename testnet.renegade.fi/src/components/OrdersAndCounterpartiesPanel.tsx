import { Flex, Text } from "@chakra-ui/react";
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
    >
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

interface OrdersAndCounterpartiesPanelExpandedProps {
  toggleIsCollapsed: () => void;
}
class OrdersAndCounterpartiesPanelExpanded extends React.Component<OrdersAndCounterpartiesPanelExpandedProps> {
  render() {
    return (
      <Flex
        width="calc(6 * var(--banner-height))"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        borderLeft="var(--border)"
        borderColor="border"
        onClick={this.props.toggleIsCollapsed}
        cursor="pointer"
      >
        Expanded
      </Flex>
    );
  }
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
