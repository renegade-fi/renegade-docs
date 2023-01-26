import { HStack, Text } from "@chakra-ui/react";
import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";
import { LivePrices } from "./BannerCommon";

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
  ["WOO", "USDC"],
  ["ZRX", "USDC"],
  ["AAVE", "USDC"],
  ["COMP", "USDC"],
  ["MKR", "USDC"],
  ["YFI", "USDC"],
  ["SPELL", "USDC"],
  ["TRU", "USDC"],
  ["MPL", "USDC"],
  ["SNX", "USDC"],
  // ["REP", "USDC"],
  // ["TORN", "USDC"],
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

interface TokenBannerSingleProps {
  renegadeConnection: RenegadeConnection;
  setDirectionAndTickers: (
    buyOrSell?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
  ) => void;
  baseTokenTicker: string;
  quoteTokenTicker: string;
}
function TokenBannerSingle(props: TokenBannerSingleProps) {
  return (
    <HStack
      onClick={() => {
        props.setDirectionAndTickers(
          undefined,
          props.baseTokenTicker,
          props.quoteTokenTicker,
        );
      }}
    >
      <Text fontFamily="Favorit Expanded" color="white.80">
        {props.baseTokenTicker}
      </Text>
      <LivePrices
        renegadeConnection={props.renegadeConnection}
        baseTicker={props.baseTokenTicker}
        quoteTicker={props.quoteTokenTicker}
        exchange="median"
      />
    </HStack>
  );
}

interface AllTokensBannerProps {
  renegadeConnection: RenegadeConnection;
  setDirectionAndTickers: (
    buyOrSell?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
  ) => void;
}
interface AllTokensBannerState {
  isHovered: boolean;
  isClicked: boolean;
}
export default class AllTokensBanner extends React.Component<
  AllTokensBannerProps,
  AllTokensBannerState
> {
  constructor(props: AllTokensBannerProps) {
    super(props);
    this.state = {
      isHovered: false,
      isClicked: false,
    };
    this.getAllTokenBannerSingle = this.getAllTokenBannerSingle.bind(this);
    this.performScroll = this.performScroll.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  getAllTokenBannerSingle(key: number) {
    const allTokenBannerSingle = DISPLAYED_TICKERS.map((tickers) => {
      return (
        <TokenBannerSingle
          renegadeConnection={this.props.renegadeConnection}
          setDirectionAndTickers={this.props.setDirectionAndTickers}
          baseTokenTicker={tickers[0]}
          quoteTokenTicker={tickers[1]}
          key={tickers.toString() + "_" + key.toString()}
        />
      );
    });
    return allTokenBannerSingle;
  }

  performScroll() {
    const tokenBanner = document.getElementsByClassName("all-tokens-banner")[0];
    if (tokenBanner && !this.state.isHovered && !this.state.isClicked) {
      let scrollDest = tokenBanner.scrollLeft % (tokenBanner.scrollWidth / 3);
      scrollDest += tokenBanner.scrollWidth / 3;
      scrollDest += 1;
      tokenBanner.scrollTo(scrollDest, 0);
    }
    setTimeout(this.performScroll, 30);
  }

  async componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
    this.performScroll();
  }

  onMouseEnter() {
    this.setState({
      isHovered: true,
    });
  }

  onMouseLeave() {
    this.setState({
      isHovered: false,
    });
  }

  onMouseDown() {
    this.setState({
      isClicked: true,
    });
  }

  onMouseUp() {
    this.setState({
      isClicked: false,
    });
  }

  onMouseMove(event: any) {
    if (this.state.isClicked) {
      const tokenBanner =
        document.getElementsByClassName("all-tokens-banner")[0];
      tokenBanner.scrollBy(-event.movementX / window.devicePixelRatio, 0);
    }
  }

  render() {
    const allTokenBannerSingle = this.getAllTokenBannerSingle(1)
      .concat(this.getAllTokenBannerSingle(2))
      .concat(this.getAllTokenBannerSingle(3));
    return (
      <HStack
        width="100%"
        height="var(--banner-height)"
        cursor="pointer"
        userSelect="none"
        overflowX="hidden"
        overflowY="hidden"
        borderTop="var(--border)"
        borderBottom="var(--border)"
        borderColor="border"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        className="all-tokens-banner"
      >
        {allTokenBannerSingle}
      </HStack>
    );
  }
}
