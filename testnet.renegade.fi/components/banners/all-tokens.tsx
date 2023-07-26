"use client"

import React from "react"
import { PriceReport } from "@/contexts/RenegadeContext"
import { Stack, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "./all-tokens-data"
import { LivePrices } from "./live-price"

interface TokenBannerSingleProps {
  baseTokenTicker: string
  quoteTokenTicker: string
  setOrderInfo?: (
    direction?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
    baseTokenAmount?: number
  ) => void
  isMobile?: boolean
}
function TokenBannerSingle(props: TokenBannerSingleProps) {
  return (
    <Stack
      direction={props.isMobile ? "column-reverse" : "row"}
      alignItems="center"
      onClick={() => {
        if (!props.setOrderInfo) {
          return
        }
        props.setOrderInfo(
          undefined,
          props.baseTokenTicker,
          props.quoteTokenTicker
        )
      }}
    >
      <Text
        fontFamily="Favorit Expanded"
        color="white.80"
        variant={props.isMobile ? "rotate-left" : undefined}
      >
        {props.baseTokenTicker}
      </Text>
      <LivePrices
        baseTicker={props.baseTokenTicker}
        quoteTicker={props.quoteTokenTicker}
        exchange={Exchange.Median}
        isMobile={props.isMobile}
        shouldRotate={props.isMobile}
      />
    </Stack>
  )
}

interface AllTokensBannerProps {
  setOrderInfo?: (
    direction?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
    baseTokenAmount?: number
  ) => void
  isMobile?: boolean
  priceReports: PriceReport[]
}
interface AllTokensBannerState {
  allTokensBannerRef: React.RefObject<HTMLDivElement>
  isHovered: boolean
  isClicked: boolean
}
export default class AllTokensBanner extends React.Component<
  AllTokensBannerProps,
  AllTokensBannerState
> {
  constructor(props: AllTokensBannerProps) {
    super(props)
    this.state = {
      allTokensBannerRef: React.createRef(),
      isHovered: false,
      isClicked: false,
    }
    this.getAllTokenBannerSingle = this.getAllTokenBannerSingle.bind(this)
    this.performScroll = this.performScroll.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  getAllTokenBannerSingle(key: number) {
    const selectedDisplayedTickers = this.props.isMobile
      ? [
          ["WBTC", "USDC"],
          ["WETH", "USDC"],
          ["UNI", "USDC"],
          ["AAVE", "USDC"],
        ]
      : DISPLAYED_TICKERS
    const allTokenBannerSingle = selectedDisplayedTickers.map((tickers) => {
      return (
        <TokenBannerSingle
          baseTokenTicker={tickers[0]}
          quoteTokenTicker={tickers[1]}
          setOrderInfo={this.props.setOrderInfo}
          isMobile={this.props.isMobile}
          key={tickers.toString() + "_" + key.toString()}
        />
      )
    })
    return allTokenBannerSingle
  }

  performScroll() {
    const allTokensBanner = this.state.allTokensBannerRef.current
    if (allTokensBanner && !this.state.isHovered && !this.state.isClicked) {
      let scrollDest: number
      if (this.props.isMobile) {
        scrollDest =
          allTokensBanner.scrollTop % (allTokensBanner.scrollHeight / 3)
        scrollDest += allTokensBanner.scrollHeight / 3
      } else {
        scrollDest =
          allTokensBanner.scrollLeft % (allTokensBanner.scrollWidth / 3)
        scrollDest += allTokensBanner.scrollWidth / 3
      }
      scrollDest += 1
      allTokensBanner.scrollTo(
        this.props.isMobile ? 0 : scrollDest,
        this.props.isMobile ? scrollDest : 0
      )
    }
    setTimeout(this.performScroll, 30)
  }

  async componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp)
    // @ts-ignore
    window.addEventListener("mousemove", this.onMouseMove)
    if (!this.props.isMobile) {
      this.performScroll()
    }
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

  onMouseDown() {
    this.setState({
      isClicked: true,
    })
  }

  onMouseUp() {
    this.setState({
      isClicked: false,
    })
  }

  onMouseMove(event: React.MouseEvent) {
    const allTokensBanner = this.state.allTokensBannerRef.current
    if (allTokensBanner && this.state.isClicked) {
      allTokensBanner.scrollBy(-event.movementX / window.devicePixelRatio, 0)
    }
  }

  render() {
    const allTokenBannerSingle = this.getAllTokenBannerSingle(1)
      .concat(this.getAllTokenBannerSingle(2))
      .concat(this.getAllTokenBannerSingle(3))
    return (
      <Stack
        direction={this.props.isMobile ? "column" : "row"}
        alignItems="center"
        width={
          this.props.isMobile ? "calc(0.75 * var(--banner-height))" : "100%"
        }
        height={this.props.isMobile ? "100%" : "var(--banner-height)"}
        fontSize={this.props.isMobile ? "0.8em" : undefined}
        cursor="pointer"
        userSelect="none"
        overflowX="hidden"
        overflowY="hidden"
        borderTop={this.props.isMobile ? undefined : "var(--border)"}
        borderBottom={this.props.isMobile ? undefined : "var(--border)"}
        borderRight={this.props.isMobile ? "var(--border)" : undefined}
        borderColor="border"
        onMouseEnter={this.props.isMobile ? undefined : this.onMouseEnter}
        onMouseLeave={this.props.isMobile ? undefined : this.onMouseLeave}
        onMouseDown={this.props.isMobile ? undefined : this.onMouseDown}
        onMouseUp={this.props.isMobile ? undefined : this.onMouseUp}
        onMouseMove={this.props.isMobile ? undefined : this.onMouseMove}
        ref={this.state.allTokensBannerRef}
      >
        {/* {allTokenBannerSingle} */}
        {this.props.priceReports.map((priceReport, index) => {
          return (
            <Stack
              direction={this.props.isMobile ? "column-reverse" : "row"}
              key={`${DISPLAYED_TICKERS[index][0]}_${DISPLAYED_TICKERS[index][1]}`}
              alignItems="center"
              onClick={() => {
                if (!this.props.setOrderInfo) {
                  return
                }
                this.props.setOrderInfo(
                  undefined,
                  DISPLAYED_TICKERS[index][0],
                  DISPLAYED_TICKERS[index][1]
                )
              }}
            >
              <Text
                fontFamily="Favorit Expanded"
                color="white.80"
                variant={this.props.isMobile ? "rotate-left" : undefined}
              >
                {DISPLAYED_TICKERS[index][0]}
              </Text>
              <LivePrices
                baseTicker={DISPLAYED_TICKERS[index][0]}
                quoteTicker={DISPLAYED_TICKERS[index][1]}
                exchange={Exchange.Median}
                isMobile={this.props.isMobile}
                shouldRotate={this.props.isMobile}
                price={priceReport?.midpointPrice}
              />
            </Stack>
          )
        })}
      </Stack>
    )
  }
}
