import { Box, Flex, HStack, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { TICKER_TO_ADDR } from "../../tokens";
import RenegadeConnection, {
  PriceReport,
} from "../connections/RenegadeConnection";
import {
  BannerSeparator,
  Exchange,
  LivePrices,
  PulsingConnection,
} from "./BannerCommon";

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation";

function LinkWrapper(props: { link?: string; children: React.ReactNode }) {
  return (
    <Flex
      as={Link}
      cursor={props.link ? undefined : "inherit"}
      height="100%"
      alignItems="center"
      justifyContent="center"
      href={props.link}
      isExternal
      flexGrow="1"
      userSelect="none"
      _hover={{ textDecoration: "none" }}
    >
      {props.children}
    </Flex>
  );
}

interface ExchangeConnectionTripleProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
  exchange: Exchange;
  healthState: HealthState;
}
function ExchangeConnectionTriple(props: ExchangeConnectionTripleProps) {
  // Remap some tickers, as different exchanges use different names
  let renamedBaseTicker = props.activeBaseTicker;
  let renamedQuoteTicker = props.activeQuoteTicker;
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
    }[props.exchange] as string;
  }

  // Construct the link
  const link = {
    binance: `https://www.binance.com/en/trade/${renamedBaseTicker}_${renamedQuoteTicker}`,
    coinbase: `https://www.coinbase.com/advanced-trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    kraken: `https://pro.kraken.com/app/trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    okx: `https://www.okx.com/trade-swap/${renamedBaseTicker}-${renamedQuoteTicker}-swap`,
    uniswapv3: `https://info.uniswap.org/#/tokens/${
      TICKER_TO_ADDR[props.activeBaseTicker]
    }`,
  }[props.exchange];

  let showPrice: boolean;
  let connectionText: string;
  let textVariant: string;
  if (props.healthState === "connecting") {
    showPrice = false;
    connectionText = "CONNECTING";
    textVariant = "status-gray";
  } else if (props.healthState === "unsupported") {
    showPrice = false;
    connectionText = "UNSUPPORTED";
    textVariant = "status-gray";
  } else if (props.healthState === "live") {
    showPrice = true;
    connectionText = "LIVE";
    textVariant = "status-green";
  } else if (props.healthState === "no-data") {
    showPrice = false;
    connectionText = "NO DATA";
    textVariant = "status-gray";
  } else if (props.healthState === "too-stale") {
    showPrice = false;
    connectionText = "TOO STALE";
    textVariant = "status-red";
  } else if (props.healthState === "not-enough-data") {
    showPrice = false;
    connectionText = "NOT ENOUGH DATA";
    textVariant = "status-gray";
  } else if (props.healthState === "too-much-deviation") {
    showPrice = false;
    connectionText = "TOO MUCH DEVIATION";
    textVariant = "status-red";
  } else {
    throw new Error("Invalid health state: " + props.healthState);
  }

  const pulseState = {
    "status-green": "live",
    "status-gray": "loading",
    "status-red": "dead",
  }[textVariant] as "live" | "loading" | "dead";

  return (
    <>
      <LinkWrapper link={link}>
        <Text>{props.exchange[0].toUpperCase() + props.exchange.slice(1)}</Text>
      </LinkWrapper>
      <BannerSeparator flexGrow={1} link={link} />
      {showPrice && (
        <LivePrices
          renegadeConnection={props.renegadeConnection}
          baseTicker={props.activeBaseTicker}
          quoteTicker={props.activeQuoteTicker}
          exchange={props.exchange}
          link={link}
        />
      )}
      <LinkWrapper link={link}>
        <HStack spacing="5px">
          <Text variant={textVariant}>{connectionText}</Text>
          <PulsingConnection state={pulseState} />
        </HStack>
      </LinkWrapper>
    </>
  );
}

interface MedianTripleProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
  healthState: HealthState;
}
function MedianTriple(props: MedianTripleProps) {
  return (
    <Flex
      width="24%"
      minWidth="400px"
      alignItems="center"
      justifyContent="center"
    >
      <Spacer flexGrow="3" />
      <Text>NBBO Feed</Text>
      <BannerSeparator flexGrow={4} />
      <ExchangeConnectionTriple
        renegadeConnection={props.renegadeConnection}
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="median"
        healthState={props.healthState}
      />
      <BannerSeparator flexGrow={4} />
    </Flex>
  );
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
  isTooShort: boolean;
  isScrolling: boolean;
  scrollDirection: "left" | "right";
  isHovered: boolean;
  isClicked: boolean;
  mouseDownX: number;
}
export default class ExchangeConnectionsBanner extends React.Component<
  ExchangeConnectionsBannerProps,
  ExchangeConnectionsBannerState
> {
  constructor(props: ExchangeConnectionsBannerProps) {
    super(props);
    this.state = this.defaultState();
    this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this);
    this.performScroll = this.performScroll.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async componentDidMount() {
    // Await the connection to the relayer
    await this.props.renegadeConnection.awaitConnection();
    // Periodically check for health, setting live/dead appropriately
    this.checkExchangeHealthStates();
    // Add listeners for mouse events
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
    // Animate scroll if banner is compressed
    this.performScroll();
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
      isTooShort: false,
      isScrolling: true,
      scrollDirection: "left",
      isHovered: false,
      isClicked: false,
      mouseDownX: 0,
    };
  }

  async checkExchangeHealthStates() {
    if (this.props.activeBaseTicker === this.props.activeQuoteTicker) {
      return;
    }
    const healthStates =
      await this.props.renegadeConnection.checkExchangeHealthStates(
        TICKER_TO_ADDR[this.props.activeBaseTicker],
        TICKER_TO_ADDR[this.props.activeQuoteTicker],
      );
    function getHealthState(
      priceReport: string | Record<string, PriceReport>,
    ): HealthState {
      if (!priceReport || priceReport === "Unsupported") {
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
    this.setState({
      priceReporterHealthStates: newPriceReporterHealthStates,
    });
    setTimeout(this.checkExchangeHealthStates, 1000);
  }

  getExchangeConnectionsBanner() {
    return document.getElementsByClassName("exchange-connections-banner")[0];
  }

  performScroll() {
    const exchangeConnectionsBanner = this.getExchangeConnectionsBanner();
    if (exchangeConnectionsBanner && this.state.isScrolling) {
      let scrollDest =
        exchangeConnectionsBanner.scrollLeft +
        (this.state.scrollDirection === "left" ? 1 : -1);
      const maxScroll =
        exchangeConnectionsBanner.scrollWidth -
        exchangeConnectionsBanner.clientWidth;
      this.setState({ isTooShort: maxScroll > 5 });
      if (maxScroll > 5 && !this.state.isHovered && !this.state.isClicked) {
        if (scrollDest <= 0) {
          scrollDest = 0;
          this.setState({
            isScrolling: false,
            scrollDirection: "left",
          });
          setTimeout(() => this.setState({ isScrolling: true }), 1000);
        } else if (scrollDest >= maxScroll) {
          scrollDest = maxScroll;
          this.setState({
            isScrolling: false,
            scrollDirection: "right",
          });
          setTimeout(() => this.setState({ isScrolling: true }), 1000);
        }
        exchangeConnectionsBanner.scrollTo(scrollDest, 0);
      }
    }
    setTimeout(this.performScroll, 50);
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

  onMouseDown(event: MouseEvent) {
    this.setState({
      isClicked: true,
      mouseDownX: event.clientX,
    });
  }

  onMouseUp() {
    this.setState({
      isClicked: false,
    });
  }

  onMouseMove(event: React.MouseEvent) {
    if (this.state.isClicked) {
      const exchangeConnectionsBanner = this.getExchangeConnectionsBanner();
      exchangeConnectionsBanner.scrollBy(
        -event.movementX / window.devicePixelRatio,
        0,
      );
    }
  }

  render() {
    return (
      <HStack
        width="100%"
        height="var(--banner-height)"
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
        userSelect="none"
        spacing="0px"
        zIndex="-1"
      >
        <MedianTriple
          renegadeConnection={this.props.renegadeConnection}
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          healthState={this.state.priceReporterHealthStates["median"]}
        />
        <Box width="76%" position="relative">
          <Box
            visibility={this.state.isTooShort ? undefined : "hidden"}
            height="90%"
            width="10px"
            position="absolute"
            left="0"
            bg="linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0))"
            zIndex="1"
          ></Box>
          <Box
            overflowX="hidden"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => {
              if (Math.abs(e.clientX - this.state.mouseDownX) > 5) {
                e.preventDefault();
              }
            }}
            position="relative"
            className="exchange-connections-banner"
          >
            <Flex minWidth="1200px" height="var(--banner-height)">
              <ExchangeConnectionTriple
                renegadeConnection={this.props.renegadeConnection}
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange="binance"
                healthState={this.state.priceReporterHealthStates["binance"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                renegadeConnection={this.props.renegadeConnection}
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange="coinbase"
                healthState={this.state.priceReporterHealthStates["coinbase"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                renegadeConnection={this.props.renegadeConnection}
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange="kraken"
                healthState={this.state.priceReporterHealthStates["kraken"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                renegadeConnection={this.props.renegadeConnection}
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange="okx"
                healthState={this.state.priceReporterHealthStates["okx"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                renegadeConnection={this.props.renegadeConnection}
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange="uniswapv3"
                healthState={this.state.priceReporterHealthStates["uniswapv3"]}
              />
              <Spacer flexGrow="3" />
            </Flex>
          </Box>
        </Box>
      </HStack>
    );
  }
}
