import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { TICKER_TO_ADDR, TICKER_TO_DEFAULT_DECIMALS } from "../../tokens";
import RenegadeConnection, {
  DEFAULT_PRICE_REPORT,
  PriceReport,
} from "../connections/RenegadeConnection";
import { BannerSeparator, PulsingConnection } from "./BannerCommon";

const UPDATE_THRESHOLD_MS = 50;

type Exchange =
  | "median"
  | "binance"
  | "coinbase"
  | "kraken"
  | "okx"
  | "uniswapv3";
type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation";

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
  exchange: Exchange;
  healthState: HealthState;
  fallbackPriceReport: PriceReport;
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
      },
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
      if (this.props.fallbackPriceReport === DEFAULT_PRICE_REPORT) {
        price = 0;
      } else {
        price = this.props.fallbackPriceReport.midpointPrice;
      }
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
    if (price == 0 && healthState === "live") {
      healthState = "no-data";
    }

    let showPrice: boolean;
    let connectionText: string;
    let textVariant: string;
    if (healthState === "connecting") {
      showPrice = false;
      connectionText = "CONNECTING";
      textVariant = "status-gray";
    } else if (healthState === "unsupported") {
      showPrice = false;
      connectionText = "UNSUPPORTED";
      textVariant = "status-gray";
    } else if (healthState === "live") {
      showPrice = true;
      connectionText = "LIVE";
      textVariant = "status-green";
    } else if (healthState === "no-data") {
      showPrice = false;
      connectionText = "NO DATA";
      textVariant = "status-gray";
    } else if (healthState === "too-stale") {
      showPrice = false;
      connectionText = "TOO STALE";
      textVariant = "status-red";
    } else if (healthState === "not-enough-data") {
      showPrice = false;
      connectionText = "NOT ENOUGH DATA";
      textVariant = "status-gray";
    } else if (healthState === "too-much-deviation") {
      showPrice = false;
      connectionText = "TOO MUCH DEVIATION";
      textVariant = "status-red";
    } else {
      throw new Error("Invalid health state: " + this.props.healthState);
    }

    const pulseState = {
      "status-green": "live",
      "status-gray": "loading",
      "status-red": "dead",
    }[textVariant] as "live" | "loading" | "dead";

    return (
      <>
        <LinkWrapper link={link}>
          <Text>
            {this.props.exchange[0].toUpperCase() +
              this.props.exchange.slice(1)}
          </Text>
        </LinkWrapper>
        <BannerSeparator size="small" link={link} />
        {showPrice && (
          <LinkWrapper link={link}>
            <HStack paddingRight="8px">
              <Text
                fontFamily="Favorit Mono"
                color="white.80"
                opacity={textVariant === "status-gray" ? "20%" : "100%"}
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
        )}
        <LinkWrapper link={link}>
          <HStack>
            <Text variant={textVariant}>{connectionText}</Text>
            <PulsingConnection state={pulseState} />
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
    [exchange: string]: HealthState;
  };
  priceReporterFallbacks: {
    [exchange: string]: PriceReport;
  };
}
export default class ExchangeConnectionsBanner extends React.Component<
  ExchangeConnectionsBannerProps,
  ExchangeConnectionsBannerState
> {
  constructor(props: ExchangeConnectionsBannerProps) {
    super(props);
    this.state = this.defaultState();
    this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this);
  }

  async componentDidMount() {
    // Await the connection to the relayer
    await this.props.renegadeConnection.awaitConnection();
    // Periodically check for health, setting live/dead appropriately
    setTimeout(this.checkExchangeHealthStates, 2000);
  }

  componentDidUpdate(prevProps: ExchangeConnectionsBannerProps) {
    if (
      prevProps.activeBaseTicker === this.props.activeBaseTicker &&
      prevProps.activeQuoteTicker === this.props.activeQuoteTicker
    ) {
      return;
    }
    this.setState(this.defaultState());
  }

  defaultState(): ExchangeConnectionsBannerState {
    return {
      priceReporterHealthStates: {
        median: "connecting",
        binance: "connecting",
        coinbase: "connecting",
        kraken: "connecting",
        okx: "connecting",
        uniswapv3: "connecting",
      },
      priceReporterFallbacks: {
        median: DEFAULT_PRICE_REPORT,
        binance: DEFAULT_PRICE_REPORT,
        coinbase: DEFAULT_PRICE_REPORT,
        kraken: DEFAULT_PRICE_REPORT,
        okx: DEFAULT_PRICE_REPORT,
        uniswapv3: DEFAULT_PRICE_REPORT,
      },
    };
  }

  async checkExchangeHealthStates() {
    const healthStates =
      await this.props.renegadeConnection.checkExchangeHealthStates(
        TICKER_TO_ADDR[this.props.activeBaseTicker],
        TICKER_TO_ADDR[this.props.activeQuoteTicker],
      );
    function getHealthState(
      priceReport: string | Record<string, PriceReport>,
    ): HealthState {
      if (priceReport === "Unsupported") {
        return "unsupported";
      }
      if (priceReport["Nominal"] !== undefined) {
        return "live";
      }
      if (priceReport === "NoDataReported") {
        return "no-data";
      }
      if (priceReport["DataTooStale"] !== undefined) {
        return "too-stale";
      }
      if (priceReport["NotEnoughDataReported"] !== undefined) {
        return "not-enough-data";
      }
      if (priceReport["TooMuchDeviation"] !== undefined) {
        return "too-much-deviation";
      }
      throw new Error("Invalid priceReport: " + priceReport);
    }
    const newPriceReporterHealthStates = {
      median: getHealthState(healthStates["median"]),
      binance: getHealthState(healthStates["all_exchanges"]["Binance"]),
      coinbase: getHealthState(healthStates["all_exchanges"]["Coinbase"]),
      kraken: getHealthState(healthStates["all_exchanges"]["Kraken"]),
      okx: getHealthState(healthStates["all_exchanges"]["Okx"]),
      uniswapv3: getHealthState(healthStates["all_exchanges"]["UniswapV3"]),
    };
    const newPriceReporterFallbacks = {
      median: healthStates["median"]["Nominal"] || DEFAULT_PRICE_REPORT,
      binance:
        healthStates["all_exchanges"]["Binance"]["Nominal"] ||
        DEFAULT_PRICE_REPORT,
      coinbase:
        healthStates["all_exchanges"]["Coinbase"]["Nominal"] ||
        DEFAULT_PRICE_REPORT,
      kraken:
        healthStates["all_exchanges"]["Kraken"]["Nominal"] ||
        DEFAULT_PRICE_REPORT,
      okx:
        healthStates["all_exchanges"]["Okx"]["Nominal"] || DEFAULT_PRICE_REPORT,
      uniswapv3:
        healthStates["all_exchanges"]["UniswapV3"]["Nominal"] ||
        DEFAULT_PRICE_REPORT,
    };
    this.setState({
      priceReporterHealthStates: newPriceReporterHealthStates,
      priceReporterFallbacks: newPriceReporterFallbacks,
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
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
      >
        <Spacer flexGrow="3" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="binance"
          healthState={this.state.priceReporterHealthStates["binance"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["binance"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="coinbase"
          healthState={this.state.priceReporterHealthStates["coinbase"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["coinbase"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="kraken"
          healthState={this.state.priceReporterHealthStates["kraken"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["kraken"]}
        />
        <BannerSeparator size="large" />
        <Text>NBBO Feed</Text>
        <BannerSeparator size="large" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="okx"
          healthState={this.state.priceReporterHealthStates["okx"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["okx"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="uniswapv3"
          healthState={this.state.priceReporterHealthStates["uniswapv3"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["uniswapv3"]}
        />
        <BannerSeparator size="medium" />
        <ExchangeConnectionTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          exchange="median"
          healthState={this.state.priceReporterHealthStates["median"]}
          fallbackPriceReport={this.state.priceReporterFallbacks["median"]}
        />
        <Spacer flexGrow="3" />
      </Flex>
    );
  }
}
