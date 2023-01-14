import { Box, Text, Flex } from "@chakra-ui/react";
import React from "react";

interface SingleWalletsPanelCollapsedProps {
  displayText: string;
  isFirst: boolean;
}
function SingleWalletsPanelCollapsed(props: SingleWalletsPanelCollapsedProps) {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      borderBottom={props.isFirst ? "var(--border)" : "none"}
      borderColor="border"
    >
      <Text transform="rotate(-90deg)" textAlign="center" minWidth="200px">
        {props.displayText}
      </Text>
    </Flex>
  );
}

interface WalletsPanelCollapsedProps {
  toggleIsCollapsed: () => void;
}
function WalletsPanelCollapsed(props: WalletsPanelCollapsedProps) {
  return (
    <Flex
      width="calc(1.5 * var(--banner-height))"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderRight="var(--border)"
      borderColor="border"
      onClick={props.toggleIsCollapsed}
      cursor="pointer"
      userSelect="none"
    >
      <SingleWalletsPanelCollapsed
        isFirst={true}
        displayText="Ethereum Wallet"
      />
      <SingleWalletsPanelCollapsed
        isFirst={false}
        displayText="Renegade Wallet"
      />
    </Flex>
  );
}

interface WalletsPanelExpandedProps {
  toggleIsCollapsed: () => void;
}
class WalletsPanelExpanded extends React.Component<WalletsPanelExpandedProps> {
  render() {
    return (
      <Flex
        width="calc(6 * var(--banner-height))"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        borderRight="var(--border)"
        borderColor="border"
        onClick={this.props.toggleIsCollapsed}
        cursor="pointer"
      >
        Expanded
      </Flex>
    );
  }
}

interface WalletsPanelState {
  isCollapsed: boolean;
}
export default class WalletsPanel extends React.Component<
  {},
  WalletsPanelState
> {
  constructor(props: {}) {
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
      <WalletsPanelCollapsed toggleIsCollapsed={this.toggleIsCollapsed} />
    ) : (
      <WalletsPanelExpanded toggleIsCollapsed={this.toggleIsCollapsed} />
    );
  }
}
