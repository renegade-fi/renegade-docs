import React from "react";
import { Flex, Spacer } from "@chakra-ui/react";

import RenegadeConnection from "../connections/RenegadeConnection";
import TokenInfo from "./TokenInfo";
import TokenBanner from "./TokenBanner";

import backgroundPattern from "../icons/background_pattern.svg";

const DISPLAYED_TICKERS: [string, string][] = [
  ["WBTC", "USDC"],
  ["WETH", "USDC"],
  ["BNB", "USDC"],
  ["MATIC", "USDC"],
  ["FTM", "USDC"],
  ["GNO", "USDC"],
  ["CBETH", "USDC"],
  ["LDO", "USDC"],
  ["BAND", "USDC"],
  ["LINK", "USDC"],
  ["UNI", "USDC"],
  ["CRV", "USDC"],
  ["DYDX", "USDC"],
  ["SUSHI", "USDC"],
  ["1INCH", "USDC"],
  ["BAL", "USDC"],
  ["HFT", "USDC"],
  ["PERP", "USDC"],
  // ["WOO", "USDC"],
  ["ZRX", "USDC"],
  ["AAVE", "USDC"],
  ["COMP", "USDC"],
  ["MKR", "USDC"],
  ["YFI", "USDC"],
  ["SPELL", "USDC"],
  ["TRU", "USDC"],
  ["MPL", "USDC"],
  ["SNX", "USDC"],
  ["REP", "USDC"],
  ["TORN", "USDC"],
  // ["REN", "USDC"],
  // ["STG", "USDC"],
  // ["QNT", "USDC"],
  // ["LRC", "USDC"],
  // ["BOBA", "USDC"],
  // ["APE", "USDC"],
  // ["AXS", "USDC"],
  // ["ENJ", "USDC"],
  // ["RARE", "USDC"],
  // ["SHIB", "USDC"],
  // ["PEOPLE", "USDC"],
  // ["OMG", "USDC"],
  // ["GRT", "USDC"],
  // ["ENS", "USDC"],
  // ["MANA", "USDC"],
  // ["GALA", "USDC"],
  // ["RAD", "USDC"],
  // ["AUDIO", "USDC"],
  // ["BAT", "USDC"],
];

// Create a connection to a relayer
const renegadeConnection = new RenegadeConnection({
  relayerUrl: "127.0.0.1",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
});

export default class TradingInterface extends React.Component {
  render() {
    const tokenBannerRef = React.createRef();
    return (
      <Flex
        height="100vh"
        width="100vw"
        flexDirection="column"
        backgroundImage={backgroundPattern}
        backgroundSize="cover"
        borderRadius="10px"
        onMouseUp={(event) => tokenBannerRef.current.onMouseUp(event)}
        onMouseMove={(event) => tokenBannerRef.current.onMouseMove(event)}
      >
        <TokenInfo
          renegadeConnection={renegadeConnection}
          baseTokenTicker="WETH"
          quoteTokenTicker="USDC"
        />
        <Spacer />
        <TokenBanner
          ref={tokenBannerRef}
          renegadeConnection={renegadeConnection}
          displayedTickers={DISPLAYED_TICKERS}
        />
      </Flex>
    );
  }
}
