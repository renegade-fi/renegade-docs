"use client"

import { Box, Flex, Link, Spacer, Stack, Text } from "@chakra-ui/react"
import { Exchange, Token } from "@renegade-fi/renegade-js"
import React from "react"

import { BannerSeparator } from "@/components/banner-separator"
import { LivePrices } from "@/components/live-price"
import { PulsingConnection } from "@/components/pulsing-connection-indicator"
import { useExchangePrice } from "@/hooks/use-price"

function LinkWrapper(props: {
  link?: string
  isMobile?: boolean
  children: React.ReactNode
}) {
  if (props.link) {
    return (
      <Flex
        as={Link}
        alignItems="center"
        justifyContent="center"
        flexDirection={props.isMobile ? "column-reverse" : "row"}
        flexGrow="1"
        gap="8px"
        height="100%"
        _hover={{ textDecoration: "none" }}
        userSelect="none"
        cursor={props.link ? undefined : "inherit"}
        href={props.link}
        isExternal
      >
        {props.children}
      </Flex>
    )
  }
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection={props.isMobile ? "column-reverse" : "row"}
      flexGrow="1"
      gap="8px"
      height="100%"
      _hover={{ textDecoration: "none" }}
      userSelect="none"
      cursor={props.link ? undefined : "inherit"}
    >
      {props.children}
    </Flex>
  )
}

interface ExchangeConnectionTripleProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  exchange: Exchange
  initialPrice?: number
  isMobile?: boolean
}
function ExchangeConnectionTriple(props: ExchangeConnectionTripleProps) {
  // Remap some tickers, as different exchanges use different names
  let renamedBaseTicker = props.activeBaseTicker
  let renamedQuoteTicker = props.activeQuoteTicker
  if (renamedBaseTicker === "WBTC") {
    renamedBaseTicker = "BTC"
  }
  if (renamedBaseTicker === "WETH") {
    renamedBaseTicker = "ETH"
  }
  if (renamedQuoteTicker === "USDC") {
    renamedQuoteTicker = {
      binance: "BUSD",
      coinbase: "USD",
      kraken: "USD",
      okx: "USDT",
    }[props.exchange.toString()] as string // TODO: This is wrong?
  }

  // Construct the link
  const link = {
    binance: `https://www.binance.com/en/trade/${renamedBaseTicker}_${renamedQuoteTicker}`,
    coinbase: `https://www.coinbase.com/advanced-trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    kraken: `https://pro.kraken.com/app/trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
    okx: `https://www.okx.com/trade-swap/${renamedBaseTicker}-${renamedQuoteTicker}-swap`,
    uniswapv3: `https://info.uniswap.org/#/tokens/${Token.findAddressByTicker(
      props.activeBaseTicker
    )}`,
    median: "",
  }[props.exchange]

  // Test if price state is accurate
  const { state } = useExchangePrice(
    props.exchange,
    props.activeBaseTicker,
    props.activeQuoteTicker
  )

  // let healthState = props.priceReport.healthState
  let showPrice = true
  let connectionText: string = state === "stale" ? "STALE" : "LIVE"
  let textVariant: string = state === "stale" ? "status-red" : "status-green"
  // If exchange is not supported, modify accordingly
  // if (props.exchange === Exchange.Uniswapv3) {
  //   showPrice = false
  //   connectionText = "UNSUPPORTED"
  //   textVariant = "status-gray"
  // }
  // If incoming price is stale (longer than 1 minute), modify accordingly

  // if (healthState === HealthState.enum.Connecting) {
  //   showPrice = true
  //   connectionText = "LIVE"
  //   textVariant = "status-green"
  // } else if (healthState === HealthState.enum.Unsupported) {
  //   showPrice = false
  //   connectionText = "UNSUPPORTED"
  //   textVariant = "status-gray"
  // } else if (healthState === HealthState.enum.Live) {
  //   showPrice = true
  //   connectionText = "LIVE"
  //   textVariant = "status-green"
  // } else if (healthState === HealthState.enum.NoDataReported) {
  //   showPrice = false
  //   connectionText = "NO DATA"
  //   textVariant = "status-gray"
  // } else if (healthState === HealthState.enum.TooStale) {
  //   showPrice = false
  //   connectionText = "TOO STALE"
  //   textVariant = "status-red"
  // } else if (healthState === HealthState.enum.NotEnoughData) {
  //   showPrice = false
  //   connectionText = "NOT ENOUGH DATA"
  //   textVariant = "status-gray"
  // } else if (healthState === HealthState.enum.TooMuchDeviation) {
  //   showPrice = false
  //   connectionText = "TOO MUCH DEVIATION"
  //   textVariant = "status-red"
  // } else {
  //   throw new Error("Invalid health state: " + healthState)
  // }

  const pulseState = {
    "status-green": "live",
    "status-gray": "loading",
    "status-red": "dead",
  }[textVariant] as "live" | "loading" | "dead"

  return (
    <LinkWrapper link={link} isMobile={props.isMobile}>
      <Text variant={props.isMobile ? "rotate-right" : undefined}>
        {props.exchange[0].toUpperCase() + props.exchange.slice(1)}
      </Text>
      <BannerSeparator flexGrow={1} />
      {showPrice && (
        <LivePrices
          baseTicker={props.activeBaseTicker}
          quoteTicker={props.activeQuoteTicker}
          exchange={props.exchange}
          isMobile={props.isMobile}
          initialPrice={props.initialPrice}
        />
      )}
      <Stack
        alignItems="center"
        justifyContent="center"
        direction={props.isMobile ? "column" : "row"}
        spacing={props.isMobile ? "8px" : "5px"}
      >
        <Text
          sx={
            props.isMobile
              ? {
                  writingMode: "vertical-rl",
                  textOrientation: "sideways",
                }
              : undefined
          }
          lineHeight="1"
          variant={textVariant}
        >
          {connectionText}
        </Text>
        <PulsingConnection state={pulseState} />
      </Stack>
    </LinkWrapper>
  )
}

interface ExchangeConnectionsBannerProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  isMobile?: boolean
  report?: Record<Exchange, number>
}
interface ExchangeConnectionsBannerState {
  exchangeConnectionsBannerRef: React.RefObject<HTMLDivElement>
  // priceReporterHealthStates: {
  //   [exchange: string]: HealthState
  // }
  isTooShort: boolean
  isScrolling: boolean
  scrollDirection: "left" | "right"
  isHovered: boolean
  isClicked: boolean
  mouseDownX: number
}
export class MedianBanner extends React.Component<
  ExchangeConnectionsBannerProps,
  ExchangeConnectionsBannerState
> {
  constructor(props: ExchangeConnectionsBannerProps) {
    super(props)
    this.state = this.defaultState()
    // this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this)
    this.performScroll = this.performScroll.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  async componentDidMount() {
    // Periodically check for health, setting live/dead appropriately
    // this.checkExchangeHealthStates()
    // Add listeners for mouse events
    window.addEventListener("mouseup", this.onMouseUp)
    // @ts-ignore
    window.addEventListener("mousemove", this.onMouseMove)
    // Animate scroll if banner is compressed
    this.performScroll()
  }

  componentDidUpdate(prevProps: ExchangeConnectionsBannerProps) {
    if (
      prevProps.activeBaseTicker === this.props.activeBaseTicker &&
      prevProps.activeQuoteTicker === this.props.activeQuoteTicker
    ) {
      return
    }
    this.setState(this.defaultState())
  }

  defaultState(): ExchangeConnectionsBannerState {
    return {
      exchangeConnectionsBannerRef: React.createRef(),
      isTooShort: false,
      isScrolling: true,
      scrollDirection: "left",
      isHovered: false,
      isClicked: false,
      mouseDownX: 0,
    }
  }

  // async checkExchangeHealthStates() {
  //   if (this.props.activeBaseTicker === this.props.activeQuoteTicker) {
  //     return
  //   }
  //   const healthStates = await renegade.queryExchangeHealthStates(
  //     new Token({ ticker: this.props.activeBaseTicker }),
  //     new Token({ ticker: this.props.activeQuoteTicker })
  //   )
  //   function getHealthState(
  //     priceReport: string | Record<string, PriceReport>
  //   ): HealthState {
  //     if (!priceReport || priceReport === "Unsupported") {
  //       return "unsupported"
  //     }
  //     if (priceReport["Nominal"] !== undefined) {
  //       return "live"
  //     }
  //     if (priceReport === "NoDataReported") {
  //       return "no-data"
  //     }
  //     if (priceReport["DataTooStale"] !== undefined) {
  //       return "too-stale"
  //     }
  //     if (priceReport["NotEnoughDataReported"] !== undefined) {
  //       return "not-enough-data"
  //     }
  //     if (priceReport["TooMuchDeviation"] !== undefined) {
  //       return "too-much-deviation"
  //     }
  //     throw new Error("Invalid priceReport: " + priceReport)
  //   }
  //   const newPriceReporterHealthStates = {
  //     median: getHealthState(healthStates["median"]),
  //     binance: getHealthState(healthStates["all_exchanges"]["Binance"]),
  //     coinbase: getHealthState(healthStates["all_exchanges"]["Coinbase"]),
  //     kraken: getHealthState(healthStates["all_exchanges"]["Kraken"]),
  //     okx: getHealthState(healthStates["all_exchanges"]["Okx"]),
  //     uniswapv3: getHealthState(healthStates["all_exchanges"]["UniswapV3"]),
  //   }
  //   this.setState({
  //     priceReporterHealthStates: newPriceReporterHealthStates,
  //   })
  //   setTimeout(this.checkExchangeHealthStates, 1000)
  // }

  performScroll() {
    const exchangeConnectionsBanner =
      this.state.exchangeConnectionsBannerRef.current
    if (exchangeConnectionsBanner && this.state.isScrolling) {
      let scrollDest = this.props.isMobile
        ? exchangeConnectionsBanner.scrollTop
        : exchangeConnectionsBanner.scrollLeft
      scrollDest += this.state.scrollDirection === "left" ? 1 : -1
      const maxScroll = this.props.isMobile
        ? exchangeConnectionsBanner.scrollHeight -
          exchangeConnectionsBanner.clientHeight
        : exchangeConnectionsBanner.scrollWidth -
          exchangeConnectionsBanner.clientWidth
      this.setState({ isTooShort: maxScroll > 5 })
      if (maxScroll > 5 && !this.state.isHovered && !this.state.isClicked) {
        if (scrollDest <= 0) {
          scrollDest = 0
          this.setState({
            isScrolling: false,
            scrollDirection: "left",
          })
          setTimeout(() => this.setState({ isScrolling: true }), 1000)
        } else if (scrollDest >= maxScroll) {
          scrollDest = maxScroll
          this.setState({
            isScrolling: false,
            scrollDirection: "right",
          })
          setTimeout(() => this.setState({ isScrolling: true }), 1000)
        }
        exchangeConnectionsBanner.scrollTo(
          this.props.isMobile ? 0 : scrollDest,
          this.props.isMobile ? scrollDest : 0
        )
      }
    }
    setTimeout(this.performScroll, 50)
  }

  onMouseEnter() {
    this.setState({
      isHovered: true,
    })
  }

  onMouseLeave() {
    this.setState({
      isHovered: false,
    })
  }

  onMouseDown(event: React.MouseEvent) {
    this.setState({
      isClicked: true,
      mouseDownX: event.clientX,
    })
  }

  onMouseUp() {
    this.setState({
      isClicked: false,
    })
  }

  onMouseMove(event: React.MouseEvent) {
    const exchangeConnectionsBanner =
      this.state.exchangeConnectionsBannerRef.current
    if (exchangeConnectionsBanner && this.state.isClicked) {
      exchangeConnectionsBanner.scrollBy(
        -event.movementX / window.devicePixelRatio,
        0
      )
    }
  }

  render() {
    if (this.props.activeBaseTicker === "USDC") {
      // TODO: Better solution for USDC deposit that does't vertically shift layout
      return <></>
    }

    return (
      <Stack
        alignItems="center"
        justifyContent="flex-start"
        direction={this.props.isMobile ? "column" : "row"}
        width={
          this.props.isMobile ? "calc(0.75 * var(--banner-height))" : "100%"
        }
        height={this.props.isMobile ? "220vw" : "var(--banner-height)"}
        color="white.80"
        fontSize={this.props.isMobile ? "0.8em" : undefined}
        borderColor="border"
        borderBottom={this.props.isMobile ? undefined : "var(--border)"}
        borderLeft={this.props.isMobile ? "var(--border)" : undefined}
        userSelect="none"
        spacing="0px"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          width="13%"
          minWidth="125px"
          height="100%"
        >
          BBO Feeds
        </Flex>
        <BannerSeparator flexGrow={1} />
        <Flex
          position="relative"
          flexDirection={this.props.isMobile ? "column" : "row"}
          width={this.props.isMobile ? undefined : "87%"}
          height={this.props.isMobile ? "60%" : undefined}
        >
          <Box
            position="absolute"
            zIndex="1"
            top={this.props.isMobile ? "0px" : "1px"}
            right={this.props.isMobile ? "1px" : undefined}
            bottom={this.props.isMobile ? undefined : "1px"}
            left={this.props.isMobile ? "1px" : "0px"}
            width={this.props.isMobile ? undefined : "10px"}
            height={this.props.isMobile ? "10px" : undefined}
            background={`linear-gradient(${
              this.props.isMobile ? "180deg" : "90deg"
            }, rgba(0,0,0,1), rgba(0,0,0,0))`}
            visibility={this.state.isTooShort ? undefined : "hidden"}
          ></Box>
          <Box
            ref={this.state.exchangeConnectionsBannerRef}
            position="relative"
            overflowX="hidden"
            overflowY="hidden"
            width="100%"
            height="100%"
            onClick={(e) => {
              if (
                this.props.isMobile ||
                Math.abs(e.clientX - this.state.mouseDownX) > 5
              ) {
                e.preventDefault()
              }
            }}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={this.props.isMobile ? undefined : this.onMouseDown}
            onMouseEnter={this.props.isMobile ? undefined : this.onMouseEnter}
            onMouseLeave={this.props.isMobile ? undefined : this.onMouseLeave}
            onMouseMove={this.props.isMobile ? undefined : this.onMouseMove}
            onMouseUp={this.props.isMobile ? undefined : this.onMouseUp}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection={this.props.isMobile ? "column" : "row"}
              gap="16px"
              minWidth={this.props.isMobile ? undefined : "1200px"}
              minHeight={this.props.isMobile ? "310vw" : "var(--banner-height)"}
            >
              <Spacer flexGrow="2" />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Binance}
                initialPrice={this.props.report?.[Exchange.Binance]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Coinbase}
                initialPrice={this.props.report?.[Exchange.Coinbase]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Kraken}
                initialPrice={this.props.report?.[Exchange.Kraken]}
                isMobile={this.props.isMobile}
              />
              <BannerSeparator />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Okx}
                initialPrice={this.props.report?.[Exchange.Okx]}
                isMobile={this.props.isMobile}
              />
              <Spacer flexGrow="2" />
            </Flex>
          </Box>
        </Flex>
      </Stack>
    )
  }
}
