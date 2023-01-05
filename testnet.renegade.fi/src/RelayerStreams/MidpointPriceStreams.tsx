import React from "react";

import {
  TICKER_TO_ADDR,
  TICKER_TO_NAME,
  TICKER_TO_DEFAULT_DECIMALS,
  TICKER_TO_LOGO_URL,
} from "../../tokens";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";

// URL information for the local relayer
const RELAYER_URL = "127.0.0.1";
const RELAYER_HTTP_PORT = 3000;
const RELAYER_WS_PORT = 4000;

// Derive HTTP and WS links
const RELAYER_HTTP_URL = `http://${RELAYER_URL}:${RELAYER_HTTP_PORT}`;
const RELAYER_WS_URL = `ws://${RELAYER_URL}:${RELAYER_WS_PORT}`;

const UPDATE_THRESHOLD_MS = 100;
const relayerConnection = new WebSocket(RELAYER_WS_URL);

interface PriceReport {
  type: string;
  baseToken: { [addr: string]: string };
  quoteToken: { [addr: string]: string };
  exchange: string;
  midpointPrice: number;
  localTimestamp: number;
  reportedTimestamp: number;
}

const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
};

interface MidpointPriceStreamProps {
  baseTokenTicker: string;
  quoteTokenTicker: string;
  previousPriceReport: PriceReport;
  currentPriceReport: PriceReport;
}
function MidpointPriceStream(props: MidpointPriceStreamProps) {
  let price: number;
  let priceStrClass = "";
  if (props.currentPriceReport === DEFAULT_PRICE_REPORT) {
    price = 0;
  } else if (props.previousPriceReport === DEFAULT_PRICE_REPORT) {
    price = props.currentPriceReport.midpointPrice;
  } else {
    price = props.currentPriceReport.midpointPrice;
    priceStrClass =
      props.currentPriceReport.midpointPrice >
      props.previousPriceReport.midpointPrice
        ? "fade-green-to-white"
        : "fade-red-to-white";
  }

  // Format the price as a string
  let trailingDecimals: number;
  const baseDefaultDecimals = TICKER_TO_DEFAULT_DECIMALS[props.baseTokenTicker];
  if (props.quoteTokenTicker !== "USDC") {
    trailingDecimals = 2;
  } else if (baseDefaultDecimals >= 3) {
    trailingDecimals = 2;
  } else {
    trailingDecimals = Math.abs(baseDefaultDecimals) + 2;
  }
  let priceStr = price.toFixed(trailingDecimals);
  if (
    props.currentPriceReport == DEFAULT_PRICE_REPORT &&
    baseDefaultDecimals > 0
  ) {
    const leadingDecimals = priceStr.split(".")[0].length;
    priceStr =
      "0".repeat(Math.max(0, baseDefaultDecimals - leadingDecimals)) + priceStr;
  }
  const key = [
    props.baseTokenTicker,
    props.quoteTokenTicker,
    props.currentPriceReport.localTimestamp,
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
    <Box minWidth="200px" maxWidth="600px" margin="5px">
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="left"
        padding="20px"
        bg="#363031"
        borderRadius="5px"
      >
        <Flex width="100%" flexDirection="row" alignItems="center">
          <Box height="28px" width="28px" position="relative">
            <Image
              width="20px"
              height="20px"
              position="absolute"
              src={TICKER_TO_LOGO_URL[props.baseTokenTicker]}
              zIndex="1"
            />
            <Image
              width="20px"
              height="20px"
              position="absolute"
              top="8px"
              left="8px"
              src={TICKER_TO_LOGO_URL[props.quoteTokenTicker]}
              zIndex="0"
            />
          </Box>
          <Box paddingLeft="10px">
            <Text fontWeight="400" fontSize="1.1em" lineHeight="105%">
              {`${props.baseTokenTicker}-${props.quoteTokenTicker}`}
            </Text>
            <Text fontWeight="200" fontSize="0.8em" opacity="40%">
              {`${TICKER_TO_NAME[props.baseTokenTicker]} / ${
                TICKER_TO_NAME[props.quoteTokenTicker]
              }`}
            </Text>
          </Box>
        </Flex>
        <Flex paddingTop="2px" alignItems="center">
          <Text
            paddingRight="5px"
            fontWeight="400"
            fontSize="1.3em"
            fontFamily="Favorit Mono"
            opacity={
              props.currentPriceReport == DEFAULT_PRICE_REPORT ? "20%" : "100%"
            }
            className={priceStrClass}
            key={key + "_price"}
          >
            {priceStr}
          </Text>
          {triangleIcon}
        </Flex>
      </Flex>
    </Box>
  );
}

interface MidpointPriceStreamsProps {
  displayedPairsTickers: [string, string][];
}
interface MidpointPriceStreamsState {
  priceReports: {
    [priceReportsKey: string]: { [previousOrCurrent: string]: PriceReport };
  };
}
export default class MidpointPriceStreams extends React.Component<
  MidpointPriceStreamsProps,
  MidpointPriceStreamsState
> {
  constructor(props: MidpointPriceStreamsProps) {
    super(props);
    const priceReports = {};
    for (const pair of props.displayedPairsTickers) {
      const priceReportsKey = TICKER_TO_ADDR[pair[0]] + TICKER_TO_ADDR[pair[1]];
      priceReports[priceReportsKey] = {
        previous: DEFAULT_PRICE_REPORT,
        current: DEFAULT_PRICE_REPORT,
      };
    }
    this.state = {
      priceReports,
    };
    this.handlePriceReport = this.handlePriceReport.bind(this);
  }

  componentDidMount() {
    relayerConnection.onopen = () => {
      // Send subscribe messages for all the displayedPairs
      for (const pair of this.props.displayedPairsTickers) {
        const topic = `price-report-${TICKER_TO_ADDR[pair[0]]}-${
          TICKER_TO_ADDR[pair[1]]
        }`;
        relayerConnection.send(
          JSON.stringify({
            type: "subscribe",
            topic,
          })
        );
      }
    };
    const lastUpdate = {};
    for (const pair of this.props.displayedPairsTickers) {
      const priceReportsKey = TICKER_TO_ADDR[pair[0]] + TICKER_TO_ADDR[pair[1]];
      lastUpdate[priceReportsKey] = 0;
    }
    relayerConnection.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type !== "pricereportmedian") {
        console.log("Received a message:", parsedMessage);
        return;
      }
      // If the priceReport does not change the median price, ignore it
      const priceReportsKey =
        parsedMessage.baseToken.addr + parsedMessage.quoteToken.addr;
      if (
        this.state.priceReports[priceReportsKey].current.midpointPrice ===
        parsedMessage.midpointPrice
      ) {
        return;
      }
      // If this message happened too quickly after the previous, ignore it
      const now = Date.now();
      if (now - lastUpdate[priceReportsKey] <= UPDATE_THRESHOLD_MS) {
        return;
      }
      lastUpdate[priceReportsKey] = now;
      this.handlePriceReport(parsedMessage);
    };
  }

  handlePriceReport(newPriceReport: PriceReport) {
    const newPriceReports = this.state.priceReports,
      priceReportsKey =
        newPriceReport.baseToken.addr + newPriceReport.quoteToken.addr;
    newPriceReports[priceReportsKey].previous =
      newPriceReports[priceReportsKey].current;
    newPriceReports[priceReportsKey].current = newPriceReport;
    this.setState({
      priceReports: newPriceReports,
    });
  }

  render() {
    return (
      <Flex flexDirection="row" padding="20px">
        {this.props.displayedPairsTickers.map((pairTickers) => {
          const priceReportsKey =
            TICKER_TO_ADDR[pairTickers[0]] + TICKER_TO_ADDR[pairTickers[1]];
          return (
            <MidpointPriceStream
              key={priceReportsKey}
              baseTokenTicker={pairTickers[0]}
              quoteTokenTicker={pairTickers[1]}
              previousPriceReport={
                this.state.priceReports[priceReportsKey].previous
              }
              currentPriceReport={
                this.state.priceReports[priceReportsKey].current
              }
            />
          );
        })}
      </Flex>
    );
  }
}
