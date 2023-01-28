import { Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";
import { BannerSeparator, PulsingConnection } from "./BannerCommon";

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
        "Invalid connection state: " + this.state.connectionState,
      );
    }
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        padding="0 4% 0 4%"
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
        userSelect="text"
      >
        <Spacer flexGrow="0" />
        <Text color="white">Liquidity</Text>
        <BannerSeparator flexGrow={1} />
        <Text>420.00 {this.props.activeBaseTicker}</Text>
        <BannerSeparator flexGrow={1} />
        <Text>69,000.00 {this.props.activeQuoteTicker}</Text>
        <BannerSeparator flexGrow={3} />
        <Text color="white">Relayer</Text>
        <BannerSeparator flexGrow={1} />
        <Text>renegade-relayer.eth</Text>
        <BannerSeparator flexGrow={1} />
        <HStack>
          {connectionText}
          <PulsingConnection state={this.state.connectionState} />
        </HStack>
        <BannerSeparator flexGrow={3} />
        <Text color="white">Fees</Text>
        <BannerSeparator flexGrow={1} />
        <Text>Relayer 0.08%</Text>
        <BannerSeparator flexGrow={1} />
        <Text>Protocol 0.02%</Text>
        <BannerSeparator flexGrow={3} />
        <Text color="white">Debug</Text>
        <Spacer flexGrow="0" />
      </Flex>
    );
  }
}
