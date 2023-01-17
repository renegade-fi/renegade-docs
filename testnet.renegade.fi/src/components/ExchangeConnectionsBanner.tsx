import { Box, Link, Text, Flex, HStack } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import React from "react";

import { BannerSeparator, PulsingConnection } from "./BannerCommon";

import RenegadeConnection, {
  PriceReport,
  DEFAULT_PRICE_REPORT,
} from "../connections/RenegadeConnection";
import { TICKER_TO_ADDR, TICKER_TO_DEFAULT_DECIMALS } from "../../tokens";

const UPDATE_THRESHOLD_MS = 50;

function LinkWrapper(props: { link?: string; children: React.ReactNode }) {
  if (props.link) {
    return (
      <Link href={props.link} isExternal _hover={{ textDecoration: "none" }}>
        {props.children}
      </Link>
    );
  } else {
    return <>{props.children}</>;
  }
}

interface ExchangeConnectionTripleProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
  exchange: "median" | "binance" | "coinbase" | "kraken" | "okx" | "uniswapv3";
  healthState: "live" | "dead" | "loading";
}
interface ExchangeConnectionTripleState {
  previousPriceReport: PriceReport;
  currentPriceReport: PriceReport;
  listenerId?: string;
}
class ExchangeConnectionTriple extends React.Component<
  ExchangeConnectionTripleProps,
  ExchangeConnectionTripleState
> {
  constructor(props: ExchangeConnectionTripleProps) {
    super(props);
    this.state = {
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
    };
    this.streamPriceReports = this.streamPriceReports.bind(this);
    this.handlePriceReport = this.handlePriceReport.bind(this);
  }

  async componentDidMount() {
    // Await for websocket connection opened
    await this.props.renegadeConnection.awaitConnection();
    this.streamPriceReports();
  }

  componentDidUpdate(prevProps: ExchangeConnectionTripleProps) {
    if (
      prevProps.activeBaseTicker === this.props.activeBaseTicker &&
      prevProps.activeQuoteTicker === this.props.activeQuoteTicker
    ) {
      return;
    }
    if (!this.state.listenerId) {
      return;
    }
    this.props.renegadeConnection.unlistenToTopic(this.state.listenerId);
    this.setState({
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
    });
    this.streamPriceReports();
  }

  streamPriceReports() {
    // Send a subscription request to the relayer
    const baseTokenAddr = TICKER_TO_ADDR[this.props.activeBaseTicker];
    const quoteTokenAddr = TICKER_TO_ADDR[this.props.activeQuoteTicker];
    const topic = `${this.props.exchange}-price-report-${baseTokenAddr}-${quoteTokenAddr}`;
    this.props.renegadeConnection.subscribeToTopic(topic);

    // Keep track of the last update timestamp
    let lastUpdate = 0;

    // Listen for topic messages
    const listenerId = this.props.renegadeConnection.listenToTopic(
      topic,
      (priceReport) => {
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
      }
    );
    this.setState({ listenerId });
  }

  handlePriceReport(newPriceReport: PriceReport) {
    this.setState({
      currentPriceReport: newPriceReport,
      previousPriceReport: this.state.currentPriceReport,
    });
  }

  render() {
    // Remap some tickers, as different exchanges use different names
    let renamedBaseTicker = this.props.activeBaseTicker;
    let renamedQuoteTicker = this.props.activeQuoteTicker;
    if (renamedBaseTicker === "WBTC") {
      renamedBaseTicker = "BTC";
    }
    if (renamedBaseTicker === "WETH") {
      renamedBaseTicker = "ETH";
    }
    if (renamedQuoteTicker === "USDC") {
      renamedQuoteTicker = {
        binance: "BUSD",
        coinbase: "USD",
        kraken: "USD",
        okx: "USDT",
      }[this.props.exchange] as string;
    }

    // Construct the link
    const link = {
      binance: `https://www.binance.com/en/trade/${renamedBaseTicker}_${renamedQuoteTicker}`,
      coinbase: `https://www.coinbase.com/advanced-trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
      kraken: `https://pro.kraken.com/app/trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
      okx: `https://www.okx.com/trade-swap/${renamedBaseTicker}-${renamedQuoteTicker}-swap`,
      uniswapv3: `https://info.uniswap.org/#/tokens/${
        TICKER_TO_ADDR[this.props.activeBaseTicker]
      }`,
    }[this.props.exchange];

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
      TICKER_TO_DEFAULT_DECIMALS[this.props.activeBaseTicker];
    if (this.props.activeQuoteTicker !== "USDC") {
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
      this.props.activeBaseTicker,
      this.props.activeQuoteTicker,
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

    // Modify the health state if we have not yet received a price report
    let healthState = this.props.healthState;
    if (price == 0) {
      healthState = "loading";
    }

    let connectionText: React.ReactElement;
    if (healthState === "loading") {
      connectionText = <Text variant="status-gray">DEAD</Text>;
    } else if (healthState === "live") {
      connectionText = <Text variant="status-green">LIVE</Text>;
    } else if (healthState === "dead") {
      connectionText = <Text variant="status-red">DEAD</Text>;
    } else {
      throw new Error("Invalid health state: " + this.props.healthState);
    }

    return (
      <>
        <LinkWrapper link={link}>
          <Text>
            {this.props.exchange[0].toUpperCase() +
              this.props.exchange.slice(1)}
          </Text>
        </LinkWrapper>
        <BannerSeparator size="small" link={link} />
        <LinkWrapper link={link}>
          <HStack paddingRight="8px">
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
                <BannerSeparator size="small" />
              </Box>
              {priceIcon}
            </Flex>
          </HStack>
        </LinkWrapper>
        <LinkWrapper link={link}>
          <HStack>
            {connectionText}
            <PulsingConnection state={healthState} />
          </HStack>
        </LinkWrapper>
      </>
    );
  }
}

interface ExchangeConnectionsBannerProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
interface ExchangeConnectionsBannerState {
  priceReporterHealthStates: {
    [exchange: string]: "live" | "dead" | "loading";
  };
}
export default class ExchangeConnectionsBanner extends React.Component<
  ExchangeConnectionsBannerProps,
  ExchangeConnectionsBannerState
> {
  constructor(props: ExchangeConnectionsBannerProps) {
    super(props);
    this.state = {
      priceReporterHealthStates: {
        median: "loading",
        binance: "loading",
        coinbase: "loading",
        kraken: "loading",
        okx: "loading",
        uniswapv3: "loading",
      },
    };
    this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this);
  }

  async componentDidMount() {
    // Await for websocket connection opened
    await this.props.renegadeConnection.awaitConnection();
    // Periodically check for health, setting live/dead appropriately
    setTimeout(this.checkExchangeHealthStates);
  }

  componentDidUpdate(prevProps: ExchangeConnectionsBannerProps) {
    if (
      prevProps.activeBaseTicker === this.props.activeBaseTicker &&
      prevProps.activeQuoteTicker === this.props.activeQuoteTicker
    ) {
      return;
    }
    this.setState({
      priceReporterHealthStates: {
        median: "loading",
        binance: "loading",
        coinbase: "loading",
        kraken: "loading",
        okx: "loading",
        uniswapv3: "loading",
      },
    });
  }

  async checkExchangeHealthStates() {
    const healthStates =
      await this.props.renegadeConnection.checkExchangeHealthStates(
        TICKER_TO_ADDR[this.props.activeBaseTicker],
        TICKER_TO_ADDR[this.props.activeQuoteTicker]
      );
    const newPriceReporterHealthStates = {
      median: healthStates["median"]["Nominal"] ? "live" : "dead",
      binance: healthStates["all_exchanges"]["Binance"]["Nominal"]
        ? "live"
        : "dead",
      coinbase: healthStates["all_exchanges"]["Coinbase"]["Nominal"]
        ? "live"
        : "dead",
      kraken: healthStates["all_exchanges"]["Kraken"]["Nominal"]
        ? "live"
        : "dead",
      okx: healthStates["all_exchanges"]["Okx"]["Nominal"] ? "live" : "dead",
      uniswapv3: healthStates["all_exchanges"]["UniswapV3"]["Nominal"]
        ? "live"
        : "dead",
    };
    this.setState({
      priceReporterHealthStates: newPriceReporterHealthStates,
    });
    setTimeout(this.checkExchangeHealthStates, 1000);
  }

  render() {
    return (
      <Flex
        alignItems="center"
        justifyContent="space-evenly"
        width="100%"
        height="var(--banner-height)"
        padding="0 2% 0 2%"
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
      >
        <Text>NBBO Feed</Text>
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="median"
          healthState={this.state.priceReporterHealthStates["median"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="binance"
          healthState={this.state.priceReporterHealthStates["binance"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="coinbase"
          healthState={this.state.priceReporterHealthStates["coinbase"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="kraken"
          healthState={this.state.priceReporterHealthStates["kraken"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="okx"
          healthState={this.state.priceReporterHealthStates["okx"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="uniswapv3"
          healthState={this.state.priceReporterHealthStates["uniswapv3"]}
        />
      </Flex>
    );
  }
}
