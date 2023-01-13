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

export default class TradingInterface extends React.Component {
  render() {
    return (
      <Flex
        flexDirection="column"
        flexGrow="1"
        backgroundImage={backgroundPattern}
        backgroundSize="cover"
      >
        <ExchangeConnectionsBanner />
        <Flex flexGrow="1">
          <WalletsPanel />
          <Flex flexDirection="column" flexGrow="1">
            <RelayerStatusBanner />
            <TradingBody />
          </Flex>
          <OrdersAndCounterpartiesPanel />
        </Flex>
        <AllTokensBanner renegadeConnection={renegadeConnection} />
      </Flex>
    );
  }
}
