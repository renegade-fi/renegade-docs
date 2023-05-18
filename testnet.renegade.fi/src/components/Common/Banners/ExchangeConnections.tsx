import { Box, Flex, Link, Spacer, Stack, Text } from "@chakra-ui/react";
import { Exchange, Token } from "@renegade-fi/renegade-js";
import React from "react";

import { TICKER_TO_ADDR } from "../../../../tokens";
import RenegadeContext, {
  PriceReport,
  RenegadeContextType,
} from "../../../contexts/RenegadeContext";
import { BannerSeparator, LivePrices, PulsingConnection } from "../Banner";

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
  activeBaseTicker: string;
  activeQuoteTicker: string;
  exchange: Exchange;
  healthState: HealthState;
  isMobile?: boolean;
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
    }[props.exchange.toString()] as string; // TODO: This is wrong?
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
        <Text variant={props.isMobile ? "rotate-right" : undefined}>
          {props.exchange[0].toUpperCase() + props.exchange.slice(1)}
        </Text>
      </LinkWrapper>
      <BannerSeparator flexGrow={1} link={link} />
      {showPrice && (
        <LivePrices
          baseTicker={props.activeBaseTicker}
          quoteTicker={props.activeQuoteTicker}
          exchange={props.exchange}
          link={link}
          isMobile={props.isMobile}
        />
      )}
      <LinkWrapper link={link}>
        <Stack
          direction={props.isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          spacing={props.isMobile ? "8px" : "5px"}
        >
          <Text
            variant={textVariant}
            lineHeight="1"
            sx={
              props.isMobile
                ? {
                    writingMode: "vertical-rl",
                    textOrientation: "sideways",
                  }
                : undefined
            }
          >
            {connectionText}
          </Text>
          <PulsingConnection state={pulseState} />
        </Stack>
      </LinkWrapper>
    </>
  );
}

interface MedianTripleProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
  healthState: HealthState;
  isMobile?: boolean;
}
function MedianTriple(props: MedianTripleProps) {
  return (
    <Flex
      flexDirection={props.isMobile ? "column" : "row"}
      height={props.isMobile ? "40%" : "100%"}
      width={props.isMobile ? "100%" : "24%"}
      minWidth={props.isMobile ? undefined : "400px"}
      paddingTop={props.isMobile ? "10px" : undefined}
      alignItems="center"
      justifyContent="center"
    >
      <Spacer flexGrow="3" />
      <Text
        variant={props.isMobile ? "rotate-right" : undefined}
        whiteSpace="nowrap"
      >
        NBBO Feed
      </Text>
      <BannerSeparator flexGrow={4} />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange={Exchange.Median}
        healthState={props.healthState}
        isMobile={props.isMobile}
      />
      <BannerSeparator flexGrow={4} />
    </Flex>
  );
}

interface ExchangeConnectionsBannerProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
  isMobile?: boolean;
}
interface ExchangeConnectionsBannerState {
  exchangeConnectionsBannerRef: React.RefObject<HTMLDivElement>;
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
  static contextType = RenegadeContext;

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
    // Periodically check for health, setting live/dead appropriately
    this.checkExchangeHealthStates();
    // Add listeners for mouse events
    window.addEventListener("mouseup", this.onMouseUp);
    // @ts-ignore
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
      exchangeConnectionsBannerRef: React.createRef(),
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
    const { renegade } = this.context as RenegadeContextType;
    const healthStates = await renegade?.queryExchangeHealthStates(
      new Token({ ticker: this.props.activeBaseTicker }),
      new Token({ ticker: this.props.activeQuoteTicker }),
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

  performScroll() {
    const exchangeConnectionsBanner =
      this.state.exchangeConnectionsBannerRef.current;
    if (exchangeConnectionsBanner && this.state.isScrolling) {
      let scrollDest = this.props.isMobile
        ? exchangeConnectionsBanner.scrollTop
        : exchangeConnectionsBanner.scrollLeft;
      scrollDest += this.state.scrollDirection === "left" ? 1 : -1;
      const maxScroll = this.props.isMobile
        ? exchangeConnectionsBanner.scrollHeight -
          exchangeConnectionsBanner.clientHeight
        : exchangeConnectionsBanner.scrollWidth -
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
        exchangeConnectionsBanner.scrollTo(
          this.props.isMobile ? 0 : scrollDest,
          this.props.isMobile ? scrollDest : 0,
        );
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

  onMouseDown(event: React.MouseEvent) {
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
    const exchangeConnectionsBanner =
      this.state.exchangeConnectionsBannerRef.current;
    if (exchangeConnectionsBanner && this.state.isClicked) {
      exchangeConnectionsBanner.scrollBy(
        -event.movementX / window.devicePixelRatio,
        0,
      );
    }
  }

  render() {
    return (
      <Stack
        direction={this.props.isMobile ? "column" : "row"}
        width={
          this.props.isMobile ? "calc(0.75 * var(--banner-height))" : "100%"
        }
        height={this.props.isMobile ? "220vw" : "var(--banner-height)"}
        alignItems="center"
        justifyContent="flex-start"
        fontSize={this.props.isMobile ? "0.8em" : undefined}
        borderBottom={this.props.isMobile ? undefined : "var(--border)"}
        borderLeft={this.props.isMobile ? "var(--border)" : undefined}
        borderColor="border"
        color="white.80"
        userSelect="none"
        spacing="0px"
      >
        <MedianTriple
          activeBaseTicker={this.props.activeBaseTicker}
          activeQuoteTicker={this.props.activeQuoteTicker}
          healthState={this.state.priceReporterHealthStates["median"]}
          isMobile={this.props.isMobile}
        />
        <Flex
          flexDirection={this.props.isMobile ? "column" : "row"}
          height={this.props.isMobile ? "60%" : undefined}
          width={this.props.isMobile ? undefined : "76%"}
          position="relative"
        >
          <Box
            height={this.props.isMobile ? "10px" : undefined}
            width={this.props.isMobile ? undefined : "10px"}
            position="absolute"
            top={this.props.isMobile ? "0px" : "1px"}
            bottom={this.props.isMobile ? undefined : "1px"}
            left={this.props.isMobile ? "1px" : "0px"}
            right={this.props.isMobile ? "1px" : undefined}
            visibility={this.state.isTooShort ? undefined : "hidden"}
            bg={`linear-gradient(${
              this.props.isMobile ? "180deg" : "90deg"
            }, rgba(0,0,0,1), rgba(0,0,0,0))`}
            zIndex="1"
          ></Box>
          <Box
            height="100%"
            width="100%"
            overflowX="hidden"
            overflowY="hidden"
            onMouseEnter={this.props.isMobile ? undefined : this.onMouseEnter}
            onMouseLeave={this.props.isMobile ? undefined : this.onMouseLeave}
            onMouseDown={this.props.isMobile ? undefined : this.onMouseDown}
            onMouseUp={this.props.isMobile ? undefined : this.onMouseUp}
            onMouseMove={this.props.isMobile ? undefined : this.onMouseMove}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => {
              if (
                this.props.isMobile ||
                Math.abs(e.clientX - this.state.mouseDownX) > 5
              ) {
                e.preventDefault();
              }
            }}
            position="relative"
            ref={this.state.exchangeConnectionsBannerRef}
          >
            <Flex
              flexDirection={this.props.isMobile ? "column" : "row"}
              alignItems="center"
              justifyContent="center"
              minHeight={this.props.isMobile ? "310vw" : "var(--banner-height)"}
              minWidth={this.props.isMobile ? undefined : "1200px"}
            >
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Binance}
                healthState={this.state.priceReporterHealthStates["binance"]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Coinbase}
                healthState={this.state.priceReporterHealthStates["coinbase"]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Kraken}
                healthState={this.state.priceReporterHealthStates["kraken"]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Okx}
                healthState={this.state.priceReporterHealthStates["okx"]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Uniswapv3}
                healthState={this.state.priceReporterHealthStates["uniswapv3"]}
                isMobile={this.props.isMobile}
              />
              <Spacer flexGrow="3" />
            </Flex>
          </Box>
        </Flex>
      </Stack>
    );
  }
}
