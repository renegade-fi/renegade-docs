import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

import { BannerSeparator, PulsingConnection } from "./BannerCommon";

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

import RenegadeConnection, {
  PriceReport,
  DEFAULT_PRICE_REPORT,
} from "../connections/RenegadeConnection";
import { TICKER_TO_ADDR, TICKER_TO_DEFAULT_DECIMALS } from "../../tokens";

const UPDATE_THRESHOLD_MS = 100;

interface TokenBannerSingleProps {
  renegadeConnection: RenegadeConnection;
  setActiveTickers: (baseTicker: string, quoteTicker: string) => void;
  baseTokenTicker: string;
  quoteTokenTicker: string;
}
interface TokenBannerSingleState {
  previousPriceReport: PriceReport;
  currentPriceReport: PriceReport;
}
class TokenBannerSingle extends React.Component<
  TokenBannerSingleProps,
  TokenBannerSingleState
> {
  constructor(props: TokenBannerSingleProps) {
    super(props);
    this.state = {
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
    };
    this.handlePriceReport = this.handlePriceReport.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    // Await for websocket connection opened
    await this.props.renegadeConnection.awaitConnection();

    // Send a subscription request to the relayer
    const baseTokenAddr = TICKER_TO_ADDR[this.props.baseTokenTicker];
    const quoteTokenAddr = TICKER_TO_ADDR[this.props.quoteTokenTicker];
    const topic = `median-price-report-${baseTokenAddr}-${quoteTokenAddr}`;
    this.props.renegadeConnection.subscribeToTopic(topic);

    // Keep track of the last update timestamp
    let lastUpdate = 0;

    // Listen for topic messages
    this.props.renegadeConnection.listenToTopic(topic, (priceReport) => {
      // If the priceReport does not change the median price, ignore it
      if (
        this.state.currentPriceReport.midpointPrice ===
        priceReport.midpointPrice
      ) {
        return;
      }
      // If this price report was received too quickly after the previous, ignore it
      const now = Date.now();
      if (now - lastUpdate <= UPDATE_THRESHOLD_MS) {
        return;
      }
      lastUpdate = now;
      this.handlePriceReport(priceReport);
    });
  }

  handlePriceReport(newPriceReport: PriceReport) {
    this.setState({
      currentPriceReport: newPriceReport,
      previousPriceReport: this.state.currentPriceReport,
    });
  }

  onClick() {
    this.props.setActiveTickers(
      this.props.baseTokenTicker,
      this.props.quoteTokenTicker
    );
  }

  render() {
    // Given the previous and current price reports, determine the displayed
    // price and red/green fade class
    let price: number;
    let priceStrClass = "";
    if (this.state.currentPriceReport === DEFAULT_PRICE_REPORT) {
      price = 0;
    } else if (this.state.previousPriceReport === DEFAULT_PRICE_REPORT) {
      price = this.state.currentPriceReport.midpointPrice;
    } else {
      price = this.state.currentPriceReport.midpointPrice;
      priceStrClass =
        this.state.currentPriceReport.midpointPrice >
        this.state.previousPriceReport.midpointPrice
          ? "fade-green-to-white"
          : "fade-red-to-white";
    }

    // Format the price as a string
    let trailingDecimals: number;
    const baseDefaultDecimals =
      TICKER_TO_DEFAULT_DECIMALS[this.props.baseTokenTicker];
    if (this.props.quoteTokenTicker !== "USDC") {
      trailingDecimals = 2;
    } else if (baseDefaultDecimals >= 3) {
      trailingDecimals = 2;
    } else {
      trailingDecimals = Math.abs(baseDefaultDecimals) + 2;
    }
    let priceStr = price.toFixed(trailingDecimals);
    if (
      this.state.currentPriceReport == DEFAULT_PRICE_REPORT &&
      baseDefaultDecimals > 0
    ) {
      const leadingDecimals = priceStr.split(".")[0].length;
      priceStr =
        "0".repeat(Math.max(0, baseDefaultDecimals - leadingDecimals)) +
        priceStr;
    }
    const key = [
      this.props.baseTokenTicker,
      this.props.quoteTokenTicker,
      this.state.currentPriceReport.localTimestamp,
    ].join("_");

    // Create the icon to display next to the price
    let priceIcon: React.ReactElement;
    if (priceStrClass === "") {
      priceIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          opacity="0%"
          key={key + "_icon"}
        />
      );
    } else if (priceStrClass === "fade-green-to-white") {
      priceIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          className="fade-green-to-transparent"
          key={key + "_icon"}
        />
      );
    } else {
      priceIcon = (
        <TriangleDownIcon
          width="12px"
          height="12px"
          className="fade-red-to-transparent"
          key={key + "_icon"}
        />
      );
    }

    return (
      <HStack onClick={this.onClick}>
        <Text fontFamily="Favorit Expanded" color="white.80">
          {this.props.baseTokenTicker}
        </Text>
        <Text
          fontFamily="Favorit Mono"
          color="white.80"
          opacity={
            this.state.currentPriceReport == DEFAULT_PRICE_REPORT
              ? "20%"
              : "100%"
          }
          className={priceStrClass}
          key={key + "_price"}
        >
          ${priceStr}
        </Text>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="12px"
          position="relative"
        >
          <Box position="absolute">
            <BannerSeparator size="medium" />
          </Box>
          {priceIcon}
        </Flex>
      </HStack>
    );
  }
}

interface AllTokensBannerProps {
  renegadeConnection: RenegadeConnection;
  setActiveTickers: (baseTicker: string, quoteTicker: string) => void;
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
          setActiveTickers={this.props.setActiveTickers}
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
    if (!this.state.isHovered && !this.state.isClicked) {
      let scrollDest = tokenBanner.scrollLeft % (tokenBanner.scrollWidth / 3);
      scrollDest += tokenBanner.scrollWidth / 3;
      scrollDest += 1;
      tokenBanner.scrollTo(scrollDest, 0);
    }
    setTimeout(this.performScroll, 30);
  }

  async componentDidMount() {
    this.performScroll();
  }

  onMouseEnter(event) {
    this.setState({
      isHovered: true,
    });
  }

  onMouseLeave(event) {
    this.setState({
      isHovered: false,
    });
  }

  onMouseDown(event) {
    this.setState({
      isClicked: true,
    });
  }

  onMouseUp(event) {
    this.setState({
      isClicked: false,
    });
  }

  onMouseMove(event) {
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
