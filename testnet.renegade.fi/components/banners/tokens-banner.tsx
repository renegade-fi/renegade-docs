"use client"

import React from "react"
import { Stack, Text } from "@chakra-ui/react"
import { Exchange, PriceReport } from "@renegade-fi/renegade-js"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { LivePrices } from "@/components/banners/live-price"

interface TokenBannerSingleProps {
  price?: number
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
      alignItems="center"
      direction={props.isMobile ? "column-reverse" : "row"}
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
        color="white.80"
        fontFamily="Favorit Expanded"
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
        price={props.price}
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
  prices: (PriceReport | undefined)[]
}
interface AllTokensBannerState {
  allTokensBannerRef: React.RefObject<HTMLDivElement>
  isHovered: boolean
  isClicked: boolean
}
export class TokensBanner extends React.Component<
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
    const allTokenBannerSingle = selectedDisplayedTickers.map((tickers, i) => {
      const price = this.props.prices[i]?.midpointPrice
      return (
        <TokenBannerSingle
          baseTokenTicker={tickers[0]}
          quoteTokenTicker={tickers[1]}
          setOrderInfo={this.props.setOrderInfo}
          isMobile={this.props.isMobile}
          key={tickers.toString() + "_" + key.toString()}
          price={price}
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
        ref={this.state.allTokensBannerRef}
        alignItems="center"
        direction={this.props.isMobile ? "column" : "row"}
        overflowX="hidden"
        overflowY="hidden"
        width={
          this.props.isMobile ? "calc(0.75 * var(--banner-height))" : "100%"
        }
        height={this.props.isMobile ? "100%" : "var(--banner-height)"}
        fontSize={this.props.isMobile ? "0.8em" : undefined}
        borderColor="border"
        borderTop={this.props.isMobile ? undefined : "var(--border)"}
        borderRight={this.props.isMobile ? "var(--border)" : undefined}
        borderBottom={this.props.isMobile ? undefined : "var(--border)"}
        userSelect="none"
        cursor="pointer"
        onMouseDown={this.props.isMobile ? undefined : this.onMouseDown}
        onMouseEnter={this.props.isMobile ? undefined : this.onMouseEnter}
        onMouseLeave={this.props.isMobile ? undefined : this.onMouseLeave}
        onMouseMove={this.props.isMobile ? undefined : this.onMouseMove}
        onMouseUp={this.props.isMobile ? undefined : this.onMouseUp}
      >
        {allTokenBannerSingle}
      </Stack>
    )
  }
}
