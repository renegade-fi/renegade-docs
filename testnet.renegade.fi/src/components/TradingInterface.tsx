import { Box, Flex } from "@chakra-ui/react";
import React from "react";

import OrdersAndCounterpartiesPanel from "./OrdersAndCounterpartiesPanel";
import ExchangeConnectionsBanner from "./ExchangeConnectionsBanner";
import RenegadeConnection from "../connections/RenegadeConnection";
import RelayerStatusBanner from "./RelayerStatusBanner";
import AllTokensBanner from "./AllTokensBanner";
import WalletsPanel from "./WalletsPanel";
import TradingBody from "./TradingBody";

import backgroundPattern from "../icons/background_pattern.png";

// Create a connection to a relayer
const renegadeConnection = new RenegadeConnection({
  relayerUrl: "127.0.0.1",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
});

interface TradingInterfaceState {
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
export default class TradingInterface extends React.Component<
  {},
  TradingInterfaceState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeBaseTicker: "WETH",
      activeQuoteTicker: "USDC",
    };
    this.setBaseTicker = this.setBaseTicker.bind(this);
    this.setQuoteTicker = this.setQuoteTicker.bind(this);
    this.setActiveTickers = this.setActiveTickers.bind(this);
  }

  setBaseTicker(baseTicker: string) {
    this.setState({
      activeBaseTicker: baseTicker,
    });
  }

  setQuoteTicker(quoteTicker: string) {
    this.setState({
      activeQuoteTicker: quoteTicker,
    });
  }

  setActiveTickers(baseTicker: string, quoteTicker: string) {
    this.setBaseTicker(baseTicker);
    this.setQuoteTicker(quoteTicker);
  }

  render() {
    return (
      <Flex
        flexDirection="column"
        flexGrow="1"
        backgroundImage={backgroundPattern}
        backgroundSize="cover"
      >
        <ExchangeConnectionsBanner
          activeBaseTicker={this.state.activeBaseTicker}
          activeQuoteTicker={this.state.activeQuoteTicker}
        />
        <Flex flexGrow="1">
          <WalletsPanel />
          <Flex flexDirection="column" flexGrow="1">
            <RelayerStatusBanner
              renegadeConnection={renegadeConnection}
              activeBaseTicker={this.state.activeBaseTicker}
              activeQuoteTicker={this.state.activeQuoteTicker}
            />
            <TradingBody
              activeBaseTicker={this.state.activeBaseTicker}
              activeQuoteTicker={this.state.activeQuoteTicker}
              setBaseTicker={this.setBaseTicker}
              setQuoteTicker={this.setQuoteTicker}
            />
          </Flex>
          <OrdersAndCounterpartiesPanel />
        </Flex>
        <AllTokensBanner
          renegadeConnection={renegadeConnection}
          setActiveTickers={this.setActiveTickers}
        />
      </Flex>
    );
  }
}
