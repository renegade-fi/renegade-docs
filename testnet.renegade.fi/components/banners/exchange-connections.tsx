"use client"

import React from "react"
import RenegadeContext, {
  PriceReport,
  RenegadeContextType,
} from "@/contexts/RenegadeContext"
import { ExchangeData } from "@/types"
import { Box, Flex, Spacer, Stack } from "@chakra-ui/react"
import { Exchange, Token } from "@renegade-fi/renegade-js"

import { BannerSeparator } from "./banner-separator"
import { ExchangeConnectionTriple } from "./exchange-connection-triple"
import { MedianTriple } from "./median-triple"

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation"

interface ExchangeConnectionsBannerProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  isMobile?: boolean
  priceReport: ExchangeData
}
interface ExchangeConnectionsBannerState {
  exchangeConnectionsBannerRef: React.RefObject<HTMLDivElement>
  priceReporterHealthStates: {
    [exchange: string]: HealthState
  }
  isTooShort: boolean
  isScrolling: boolean
  scrollDirection: "left" | "right"
  isHovered: boolean
  isClicked: boolean
  mouseDownX: number
}
export default class ExchangeConnectionsBanner extends React.Component<
  ExchangeConnectionsBannerProps,
  ExchangeConnectionsBannerState
> {
  static contextType = RenegadeContext

  constructor(props: ExchangeConnectionsBannerProps) {
    super(props)
    this.state = this.defaultState()
    this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this)
    this.performScroll = this.performScroll.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  async componentDidMount() {
    // Periodically check for health, setting live/dead appropriately
    this.checkExchangeHealthStates()
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
    }
  }

  async checkExchangeHealthStates() {
    if (this.props.activeBaseTicker === this.props.activeQuoteTicker) {
      return
    }
    const { renegade } = this.context as RenegadeContextType
    const healthStates = await renegade?.queryExchangeHealthStates(
      new Token({ ticker: this.props.activeBaseTicker }),
      new Token({ ticker: this.props.activeQuoteTicker })
    )
    function getHealthState(
      priceReport: string | Record<string, PriceReport>
    ): HealthState {
      if (!priceReport || priceReport === "Unsupported") {
        return "unsupported"
      }
      if (
        typeof priceReport === "object" &&
        priceReport["Nominal"] !== undefined
      ) {
        return "live"
      }
      if (priceReport === "NoDataReported") {
        return "no-data"
      }
      if (
        typeof priceReport === "object" &&
        priceReport["DataTooStale"] !== undefined
      ) {
        return "too-stale"
      }
      if (
        typeof priceReport === "object" &&
        priceReport["NotEnoughDataReported"] !== undefined
      ) {
        return "not-enough-data"
      }
      if (
        typeof priceReport === "object" &&
        priceReport["TooMuchDeviation"] !== undefined
      ) {
        return "too-much-deviation"
      }
      throw new Error("Invalid priceReport: " + priceReport)
    }
    const newPriceReporterHealthStates = {
      median: getHealthState(healthStates["median"]),
      binance: getHealthState(healthStates["all_exchanges"]["Binance"]),
      coinbase: getHealthState(healthStates["all_exchanges"]["Coinbase"]),
      kraken: getHealthState(healthStates["all_exchanges"]["Kraken"]),
      okx: getHealthState(healthStates["all_exchanges"]["Okx"]),
      uniswapv3: getHealthState(healthStates["all_exchanges"]["UniswapV3"]),
    }
    this.setState({
      priceReporterHealthStates: newPriceReporterHealthStates,
    })
    setTimeout(this.checkExchangeHealthStates, 1000)
  }

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
          priceReport={this.props.priceReport["median"]}
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
                e.preventDefault()
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
                priceReport={this.props.priceReport["binance"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Coinbase}
                healthState={this.state.priceReporterHealthStates["coinbase"]}
                isMobile={this.props.isMobile}
                priceReport={this.props.priceReport["binance"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Kraken}
                healthState={this.state.priceReporterHealthStates["kraken"]}
                isMobile={this.props.isMobile}
                priceReport={this.props.priceReport["kraken"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Okx}
                healthState={this.state.priceReporterHealthStates["okx"]}
                isMobile={this.props.isMobile}
                priceReport={this.props.priceReport["okx"]}
              />
              <BannerSeparator flexGrow={4} />
              <ExchangeConnectionTriple
                activeBaseTicker={this.props.activeBaseTicker}
                activeQuoteTicker={this.props.activeQuoteTicker}
                exchange={Exchange.Uniswapv3}
                healthState={this.state.priceReporterHealthStates["uniswapv3"]}
                isMobile={this.props.isMobile}
                priceReport={this.props.priceReport["uniswapv3"]}
              />
              <Spacer flexGrow="3" />
            </Flex>
          </Box>
        </Flex>
      </Stack>
    )
  }
}
