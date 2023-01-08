import React from "react";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";

import RenegadeConnection, {
  PriceReport,
  DEFAULT_PRICE_REPORT,
} from "../connections/RenegadeConnection";
import {
  TICKER_TO_ADDR,
  TICKER_TO_NAME,
  TICKER_TO_DEFAULT_DECIMALS,
  TICKER_TO_LOGO_URL_HANDLE,
} from "../../tokens";

const UPDATE_THRESHOLD_MS = 100;

interface TokenBannerSingleProps {
  renegadeConnection: RenegadeConnection;
  baseTokenTicker: string;
  quoteTokenTicker: string;
}
interface TokenBannerSingleState {
  previousPriceReport: PriceReport;
  currentPriceReport: PriceReport;
  baseTokenLogoUrl: string;
}
class TokenBannerSingle extends React.Component<
  TokenBannerSingleProps,
  TokenBannerSingleState
> {
  ref: React.RefObject<Element | undefined>;

  constructor(props: TokenBannerSingleProps) {
    super(props);
    this.state = {
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
      baseTokenLogoUrl: "DEFAULT.png", // TODO
    };
    this.handlePriceReport = this.handlePriceReport.bind(this);
    this.ref = React.createRef();
  }

  async componentDidMount() {
    // Await the token URLs
    const TICKER_TO_LOGO_URL = await TICKER_TO_LOGO_URL_HANDLE;
    this.setState({
      baseTokenLogoUrl: TICKER_TO_LOGO_URL[this.props.baseTokenTicker],
    });

    // Await for websocket connection opened
    await this.props.renegadeConnection.awaitConnection();

    // Send a subscription request to the relayer
    const baseTokenAddr = TICKER_TO_ADDR[this.props.baseTokenTicker];
    const quoteTokenAddr = TICKER_TO_ADDR[this.props.quoteTokenTicker];
    const topic = `price-report-${baseTokenAddr}-${quoteTokenAddr}`;
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

  shouldComponentUpdate(): boolean {
    // if (this.ref) {
    //   const boundingRect = this.ref.current.getBoundingClientRect();
    //   // console.log("Bounding rect:", this.props.baseTokenTicker, boundingRect);
    //   return boundingRect.left > 0 && boundingRect.right < window.innerWidth;
    // }
    return true;
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
    let triangleIcon: React.ReactElement;
    if (priceStrClass === "") {
      triangleIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          opacity="0%"
          key={key + "_icon"}
        />
      );
    } else if (priceStrClass === "fade-green-to-white") {
      triangleIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          className="fade-green-to-transparent"
          key={key + "_icon"}
        />
      );
    } else {
      triangleIcon = (
        <TriangleDownIcon
          width="12px"
          height="12px"
          className="fade-red-to-transparent"
          key={key + "_icon"}
        />
      );
    }

    return (
      <HStack ref={this.ref} userSelect="none" pointerEvents="none">
        <Image width="20px" height="20px" src={this.state.baseTokenLogoUrl} />
        <Text whiteSpace="nowrap" fontWeight="200" fontSize="1em">
          {TICKER_TO_NAME[this.props.baseTokenTicker]}
        </Text>
        <HStack width="150px">
          <Text
            fontWeight="200"
            fontSize="1em"
            fontFamily="Favorit Mono"
            opacity={
              this.state.currentPriceReport == DEFAULT_PRICE_REPORT
                ? "20%"
                : "100%"
            }
            className={priceStrClass}
            key={key + "_price"}
          >
            {priceStr}
          </Text>
          {triangleIcon}
        </HStack>
      </HStack>
    );
  }
}

interface ConnectionStatusProps {
  renegadeConnection: RenegadeConnection;
}
interface ConnectionStatusState {}
class ConnectionStatus extends React.Component<
  ConnectionStatusProps,
  ConnectionStatusState
> {
  constructor(props: ConnectionStatusProps) {
    super(props);
  }

  render() {
    return null;
  }
}

interface TokenBannerProps {
  renegadeConnection: RenegadeConnection;
  displayedTickers: [string, string][];
}
interface TokenBannerState {
  isHovered: boolean;
  isClicked: boolean;
  hasMounted: boolean;
}
export default class TokenBanner extends React.Component<
  TokenBannerProps,
  TokenBannerState
> {
  constructor(props: TokenBannerProps) {
    super(props);
    this.state = {
      isHovered: false,
      isClicked: false,
      hasMounted: false,
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
    const allTokenBannerSingle = this.props.displayedTickers.map((tickers) => {
      return (
        <TokenBannerSingle
          key={tickers.toString() + "_" + key.toString()}
          renegadeConnection={this.props.renegadeConnection}
          baseTokenTicker={tickers[0]}
          quoteTokenTicker={tickers[1]}
        />
      );
    });
    return allTokenBannerSingle;
  }

  performScroll() {
    const tokenBanner = document.getElementsByClassName("token-banner")[0];
    if (!this.state.isHovered && !this.state.isClicked) {
      let scrollDest = tokenBanner.scrollLeft % (tokenBanner.scrollWidth / 3);
      scrollDest += tokenBanner.scrollWidth / 3;
      scrollDest += 2;
      tokenBanner.scrollTo(scrollDest, 0);
    }
    setTimeout(this.performScroll, 20);
  }

  async componentDidMount() {
    if (this.state.hasMounted) {
      return;
    }
    this.setState({
      hasMounted: true,
    });
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
      const tokenBanner = document.getElementsByClassName("token-banner")[0];
      tokenBanner.scrollBy(-event.movementX / window.devicePixelRatio, 0);
    }
  }

  render() {
    const allTokenBannerSingle = this.getAllTokenBannerSingle(1)
      .concat(this.getAllTokenBannerSingle(2))
      .concat(this.getAllTokenBannerSingle(3));
    return (
      <HStack
        overflowX="visible"
        overflowY="hidden"
        height="100px"
        cursor="pointer"
        bg="black"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        className="token-banner"
      >
        {allTokenBannerSingle}
      </HStack>
    );
  }
}
