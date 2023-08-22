import React from "react"
import { PriceReport } from "@/types"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { CallbackId, Exchange, Token } from "@renegade-fi/renegade-js"

import { TICKER_TO_DEFAULT_DECIMALS } from "@/lib/tokens"
import { renegade } from "@/app/providers"

import { BannerSeparator } from "./banner-separator"

const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  topic: "",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
}

const UPDATE_THRESHOLD_MS = 50
interface LivePricesProps {
  baseTicker: string
  quoteTicker: string
  exchange: Exchange
  onlyShowPrice?: boolean
  withCommas?: boolean
  scaleBy?: number
  isMobile?: boolean
  shouldRotate?: boolean
  price?: number
}
interface LivePricesState {
  fallbackPriceReport: PriceReport
  previousPriceReport: PriceReport
  currentPriceReport: PriceReport
  callbackId?: CallbackId
}
// TODO: Initial price comes top down (data fetch server components), live price comes from leaves (this component)
export class LivePrices extends React.Component<
  LivePricesProps,
  LivePricesState
> {
  constructor(props: LivePricesProps) {
    super(props)
    this.state = {
      fallbackPriceReport: DEFAULT_PRICE_REPORT,
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
    }
    this.streamPriceReports = this.streamPriceReports.bind(this)
    this.handlePriceReport = this.handlePriceReport.bind(this)
  }

  async componentDidMount() {
    await this.queryFallbackPriceReport()
    await this.streamPriceReports()
  }

  async componentDidUpdate(prevProps: LivePricesProps) {
    if (
      prevProps.baseTicker === this.props.baseTicker &&
      prevProps.quoteTicker === this.props.quoteTicker
    ) {
      return
    }
    if (!this.state.callbackId) {
      return
    }
    renegade.releaseCallback(this.state.callbackId)
    this.setState({
      fallbackPriceReport: DEFAULT_PRICE_REPORT,
      previousPriceReport: DEFAULT_PRICE_REPORT,
      currentPriceReport: DEFAULT_PRICE_REPORT,
    })
    await this.queryFallbackPriceReport()
    await this.streamPriceReports()
  }

  async queryFallbackPriceReport() {
    if (this.props.baseTicker === this.props.quoteTicker) {
      return
    }
    const healthStates = await renegade.queryExchangeHealthStates(
      new Token({ ticker: this.props.baseTicker }),
      new Token({ ticker: this.props.quoteTicker })
    )
    let medianPriceReport = null
    if (healthStates["median"]["Nominal"]) {
      medianPriceReport = healthStates["median"]["Nominal"]
    } else if (healthStates["median"]["DataTooStale"]) {
      medianPriceReport = healthStates["median"]["DataTooStale"][0]
    } else if (healthStates["median"]["TooMuchDeviation"]) {
      medianPriceReport = healthStates["median"]["TooMuchDeviation"][0]
    }
    const healthStatesExchanges = healthStates["all_exchanges"]
    const fallbackPriceReport =
      {
        median: medianPriceReport,
        binance:
          healthStatesExchanges["Binance"] &&
          healthStatesExchanges["Binance"]["Nominal"],
        coinbase:
          healthStatesExchanges["Coinbase"] &&
          healthStatesExchanges["Coinbase"]["Nominal"],
        kraken:
          healthStatesExchanges["Kraken"] &&
          healthStatesExchanges["Kraken"]["Nominal"],
        okx:
          healthStatesExchanges["Okx"] &&
          healthStatesExchanges["Okx"]["Nominal"],
        uniswapv3:
          healthStatesExchanges["UniswapV3"] &&
          healthStatesExchanges["UniswapV3"]["Nominal"],
      }[this.props.exchange] || DEFAULT_PRICE_REPORT
    this.setState({ fallbackPriceReport })
  }

  async streamPriceReports() {
    if (this.props.baseTicker === "USDC" || this.props.baseTicker === "USDT") {
      return
    }

    // Keep track of the last update timestamp
    let lastUpdate = 0

    // Create a price report callback
    const callback = (message: string) => {
      const priceReport = JSON.parse(message) as PriceReport
      // If the priceReport does not change the median price, ignore it
      if (
        this.state.currentPriceReport.midpointPrice ===
        priceReport.midpointPrice
      ) {
        return
      }
      // If this price report was received too quickly after the previous, ignore it
      const now = Date.now()
      if (now - lastUpdate <= UPDATE_THRESHOLD_MS) {
        return
      }
      lastUpdate = now
      this.handlePriceReport(priceReport)
    }
    const callbackId = await renegade.registerPriceReportCallback(
      callback,
      this.props.exchange,
      new Token({ ticker: this.props.baseTicker }),
      new Token({ ticker: this.props.quoteTicker })
    )
    this.setState({ callbackId })
  }

  handlePriceReport(newPriceReport: PriceReport) {
    this.setState({
      currentPriceReport: newPriceReport,
      previousPriceReport: this.state.currentPriceReport,
    })
  }

  render() {
    // Given the previous and current price reports, determine the displayed
    // price and red/green fade class
    let price = this.props.price
    let priceStrClass = ""
    if (this.state.currentPriceReport === DEFAULT_PRICE_REPORT) {
      if (this.state.fallbackPriceReport !== DEFAULT_PRICE_REPORT) {
        price = this.state.fallbackPriceReport.midpointPrice
      }
      // else if (
      //   this.props.baseTicker === "USDC" ||
      //   this.props.baseTicker === "USDT"
      // ) {
      //   price = 1
      // } else {
      //   price = 0
      // }
    } else if (this.state.previousPriceReport === DEFAULT_PRICE_REPORT) {
      price = this.state.currentPriceReport.midpointPrice
    } else {
      price = this.state.currentPriceReport.midpointPrice
      priceStrClass =
        this.state.currentPriceReport.midpointPrice >
        this.state.previousPriceReport.midpointPrice
          ? "fade-green-to-white"
          : "fade-red-to-white"
    }
    price = price || 0

    // If the caller supplied a scaleBy prop, scale the price appropriately
    if (this.props.scaleBy !== undefined) {
      price *= this.props.scaleBy
    }

    // Format the price as a string
    let trailingDecimals: number
    const baseDefaultDecimals =
      TICKER_TO_DEFAULT_DECIMALS[this.props.baseTicker]
    if (this.props.quoteTicker !== "USDC") {
      trailingDecimals = 2
    } else if (baseDefaultDecimals >= 3) {
      trailingDecimals = 2
    } else {
      trailingDecimals = Math.abs(baseDefaultDecimals) + 2
    }
    let priceStr = price?.toFixed(trailingDecimals) || ""
    if (
      (this.state.currentPriceReport == DEFAULT_PRICE_REPORT ||
        this.props.scaleBy === 0) &&
      baseDefaultDecimals > 0
    ) {
      const leadingDecimals = priceStr.split(".")[0].length
      priceStr =
        "0".repeat(Math.max(0, baseDefaultDecimals - leadingDecimals)) +
        priceStr
    }
    // Add commmas to the price string
    if (this.props.withCommas) {
      const priceStrParts = priceStr.split(".")
      priceStrParts[0] = priceStrParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      priceStr = priceStrParts.join(".")
    }

    if (this.props.onlyShowPrice) {
      return <Text opacity={price == 0 ? "40%" : "inherit"}>${priceStr}</Text>
    }

    const key = [
      this.props.baseTicker,
      this.props.quoteTicker,
      this.state.currentPriceReport.localTimestamp,
    ].join("_")

    // Create the icon to display next to the price
    let priceIcon: React.ReactElement
    if (priceStrClass === "") {
      priceIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          opacity="0%"
          key={key + "_icon"}
        />
      )
    } else if (priceStrClass === "fade-green-to-white") {
      priceIcon = (
        <TriangleUpIcon
          width="12px"
          height="12px"
          className="fade-green-to-transparent"
          key={key + "_icon"}
        />
      )
    } else {
      priceIcon = (
        <TriangleDownIcon
          width="12px"
          height="12px"
          className="fade-red-to-transparent"
          key={key + "_icon"}
        />
      )
    }

    return (
      <>
        <Flex
          className={priceStrClass}
          key={key + "_price"}
          sx={
            this.props.isMobile
              ? {
                  writingMode: "vertical-rl",
                  textOrientation: "sideways",
                }
              : undefined
          }
          alignItems="center"
          justifyContent="center"
          flexGrow="1"
          width={this.props.isMobile ? "100%" : undefined}
          color="white.80"
          fontFamily="Favorit Mono"
          lineHeight="1"
          opacity={price == 0 ? "20%" : "100%"}
          _hover={{ textDecoration: "none" }}
          transform={
            this.props.isMobile && this.props.shouldRotate
              ? "rotate(180deg)"
              : undefined
          }
        >
          ${priceStr}
        </Flex>
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          width={this.props.isMobile ? "100%" : undefined}
          height="100%"
          _hover={{ textDecoration: "none" }}
        >
          <Box position="absolute">
            <BannerSeparator />
          </Box>
          {priceIcon}
        </Flex>
      </>
    )
  }
}
