import { Box, Text, Flex, HStack } from "@chakra-ui/react";
import React from "react";

import { BannerSeparator, PulsingConnection } from "./BannerCommon";
import RenegadeConnection from "../connections/RenegadeConnection";

interface RelayerStatusBannerProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
interface RelayerStatusBannerState {
  connectionState: "live" | "dead" | "loading";
}
export default class RelayerStatusBanner extends React.Component<
  RelayerStatusBannerProps,
  RelayerStatusBannerState
> {
  constructor(props: RelayerStatusBannerProps) {
    super(props);
    this.state = {
      connectionState: "loading",
    };
    this.pingRelayer = this.pingRelayer.bind(this);
  }

  async componentDidMount() {
    // Periodically ping, setting live/dead appropriately
    setTimeout(this.pingRelayer, 500);
  }

  async pingRelayer() {
    const isOk = await this.props.renegadeConnection.ping();
    if (isOk) {
      this.setState({ connectionState: "live" });
    } else {
      this.setState({ connectionState: "dead" });
    }
    setTimeout(this.pingRelayer, 5000);
  }

  render() {
    let connectionText: React.ReactElement;
    if (this.state.connectionState === "loading") {
      connectionText = <Text variant="status-gray">CONNECTING</Text>;
    } else if (this.state.connectionState === "live") {
      connectionText = <Text variant="status-green">CONNECTED</Text>;
    } else if (this.state.connectionState === "dead") {
      connectionText = <Text variant="status-red">DISCONNECTED</Text>;
    } else {
      throw new Error(
        "Invalid connection state: " + this.state.connectionState
      );
    }
    return (
      <Flex
        alignItems="center"
        justifyContent="space-evenly"
        width="100%"
        height="var(--banner-height)"
        padding="0 4% 0 4%"
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
        userSelect="text"
      >
        <Text>Liquidity</Text>
        <BannerSeparator size="small" />
        <Text>420.00 {this.props.activeBaseTicker}</Text>
        <BannerSeparator size="small" />
        <Text>69,000.00 {this.props.activeQuoteTicker}</Text>
        <BannerSeparator size="medium" />
        <Text>Relayer Status</Text>
        <BannerSeparator size="small" />
        <Text>renegade-relayer.eth</Text>
        <BannerSeparator size="small" />
        <HStack>
          {connectionText}
          <PulsingConnection state={this.state.connectionState} />
        </HStack>
        <BannerSeparator size="medium" />
        <Text>Relayer Fee</Text>
        <BannerSeparator size="small" />
        <Text>0.08%</Text>
        <BannerSeparator size="small" />
        <Text>Protocol Fee</Text>
        <BannerSeparator size="small" />
        <Text>0.02%</Text>
        <BannerSeparator size="medium" />
        <Text>Debug Info</Text>
      </Flex>
    );
  }
}
