import { Flex } from "@chakra-ui/react";
import React from "react";
import Cookies from "universal-cookie";

import RenegadeConnection from "../connections/RenegadeConnection";
import backgroundPattern from "../icons/background_pattern.png";
import AllTokensBanner from "./AllTokensBanner";
import ExchangeConnectionsBanner from "./ExchangeConnectionsBanner";
import OrdersAndCounterpartiesPanel from "./OrdersAndCounterpartiesPanel";
import RelayerStatusBanner from "./RelayerStatusBanner";
import TradingBody from "./TradingBody";
import WalletsPanel from "./WalletsPanel";

// Create a connection to a relayer
const renegadeConnection = new RenegadeConnection({
  relayerUrl: "stage.relayer.renegade.fi",
  // relayerUrl: "127.0.0.1",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useTls: true,
  // useTls: false,
});

interface TradingInterfaceProps {
  onOpenGlobalModal: () => void;
  isOpenGlobalModal: boolean;
}
interface TradingInterfaceState {
  activeBuyOrSell: "buy" | "sell";
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
export default class TradingInterface extends React.Component<
  TradingInterfaceProps,
  TradingInterfaceState
> {
  constructor(props: TradingInterfaceProps) {
    super(props);
    const cookies = new Cookies();
    this.state = {
      // We randomly set initial buy/sell bit in order to discourage order
      // asymmetry for users who are trying the product for the first time
      activeBuyOrSell:
        cookies.get("renegade-direction") || Math.random() < 0.5
          ? "buy"
          : "sell",
      activeBaseTicker: cookies.get("renegade-base-ticker") || "WBTC",
      activeQuoteTicker: cookies.get("renegade-quote-ticker") || "USDC",
    };
    this.setDirectionAndTickers = this.setDirectionAndTickers.bind(this);
  }

  setDirectionAndTickers(
    buyOrSell?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
  ) {
    const cookies = new Cookies();
    if (buyOrSell) {
      cookies.set("renegade-direction", buyOrSell);
      this.setState({ activeBuyOrSell: buyOrSell });
    }
    if (baseTicker) {
      cookies.set("renegade-base-ticker", baseTicker);
      this.setState({ activeBaseTicker: baseTicker });
    }
    if (quoteTicker) {
      cookies.set("renegade-quote-ticker", quoteTicker);
      this.setState({ activeQuoteTicker: quoteTicker });
    }
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
          renegadeConnection={renegadeConnection}
          activeBaseTicker={this.state.activeBaseTicker}
          activeQuoteTicker={this.state.activeQuoteTicker}
        />
        <Flex flexGrow="1">
          <WalletsPanel
            renegadeConnection={renegadeConnection}
            onOpenGlobalModal={this.props.onOpenGlobalModal}
            isOpenGlobalModal={this.props.isOpenGlobalModal}
          />
          <Flex flexDirection="column" flexGrow="1">
            <RelayerStatusBanner
              renegadeConnection={renegadeConnection}
              activeBaseTicker={this.state.activeBaseTicker}
              activeQuoteTicker={this.state.activeQuoteTicker}
            />
            <TradingBody
              renegadeConnection={renegadeConnection}
              activeBuyOrSell={this.state.activeBuyOrSell}
              activeBaseTicker={this.state.activeBaseTicker}
              activeQuoteTicker={this.state.activeQuoteTicker}
              setDirectionAndTickers={this.setDirectionAndTickers}
            />
          </Flex>
          <OrdersAndCounterpartiesPanel
            renegadeConnection={renegadeConnection}
            isOpenGlobalModal={this.props.isOpenGlobalModal}
          />
        </Flex>
        <AllTokensBanner
          renegadeConnection={renegadeConnection}
          setDirectionAndTickers={this.setDirectionAndTickers}
        />
      </Flex>
    );
  }
}
