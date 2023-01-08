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

const UPDATE_THRESHOLD_MS = 10;

interface TokenInfoProps {
  renegadeConnection: RenegadeConnection;
  baseTokenTicker: string;
  quoteTokenTicker: string;
}
interface TokenInfoState {
  previousPriceReport: PriceReport;
  currentPriceReport: PriceReport;
  baseTokenLogoUrl: string;
  quoteTokenLogoUrl: string;
}
export default class TokenInfo extends React.Component<
  TokenInfoProps,
  TokenInfoState
> {
  constructor(props: TokenInfoProps) {
    super(props);
    this.state = {
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
      baseTokenLogoUrl: "DEFAULT.png", // TODO
      quoteTokenLogoUrl: "DEFAULT.png", // TODO
    };
    this.handlePriceReport = this.handlePriceReport.bind(this);
  }

  async componentDidMount() {
    // Await the token URLs
    const TICKER_TO_LOGO_URL = await TICKER_TO_LOGO_URL_HANDLE;
    this.setState({
      baseTokenLogoUrl: TICKER_TO_LOGO_URL[this.props.baseTokenTicker],
      quoteTokenLogoUrl: TICKER_TO_LOGO_URL[this.props.quoteTokenTicker],
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
    let triangleIcon: null | React.ReactElement;
    if (priceStrClass === "") {
      triangleIcon = null;
    } else if (priceStrClass === "fade-green-to-white") {
      triangleIcon = (
        <TriangleUpIcon
          className="fade-green-to-transparent"
          key={key + "_icon"}
        />
      );
    } else {
      triangleIcon = (
        <TriangleDownIcon
          className="fade-red-to-transparent"
          key={key + "_icon"}
        />
      );
    }

    return (
      <Box width="300px" padding="20px">
        <HStack alignItems="center">
          <Box height="28px" width="28px" position="relative">
            <Image
              width="20px"
              height="20px"
              position="absolute"
              src={this.state.baseTokenLogoUrl}
              zIndex="1"
            />
            <Image
              width="20px"
              height="20px"
              position="absolute"
              top="8px"
              left="8px"
              src={this.state.quoteTokenLogoUrl}
              zIndex="0"
            />
          </Box>
          <Box paddingLeft="10px">
            <Text fontWeight="400" fontSize="1.1em" lineHeight="105%">
              {`${this.props.baseTokenTicker}-${this.props.quoteTokenTicker}`}
            </Text>
            <Text fontWeight="200" fontSize="0.8em" opacity="40%">
              {`${TICKER_TO_NAME[this.props.baseTokenTicker]} / ${
                TICKER_TO_NAME[this.props.quoteTokenTicker]
              }`}
            </Text>
          </Box>
        </HStack>
        <HStack paddingTop="2px" alignItems="center">
          <Text
            paddingRight="5px"
            fontWeight="400"
            fontSize="1.3em"
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
      </Box>
    );
  }
}
