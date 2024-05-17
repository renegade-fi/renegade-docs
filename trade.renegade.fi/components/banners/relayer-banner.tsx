"use client"

import {
  FEES_TOOLTIP,
  PROTOCOL_FEE_TOOLTIP,
  RELAYER_FEE_TOOLTIP,
  RELAYER_NAME_TOOLTIP,
  TVL_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react"
import React from "react"

import { Tooltip } from "@/components/tooltip"

import { BannerSeparator } from "../banner-separator"
import { PulsingConnection } from "../pulsing-connection-indicator"

interface RelayerStatusBannerProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  connectionState?: "live" | "dead" | "loading"
}
interface RelayerStatusBannerState {
  relayerStatusBannerRef: React.RefObject<HTMLDivElement>
  //   connectionState: "live" | "dead" | "loading"
  isScrolling: boolean
  scrollDirection: "left" | "right"
  isHovered: boolean
  isClicked: boolean
}
export class RelayerStatusBanner extends React.Component<
  RelayerStatusBannerProps,
  RelayerStatusBannerState
> {
  constructor(props: RelayerStatusBannerProps) {
    super(props)
    this.state = {
      relayerStatusBannerRef: React.createRef(),
      //   connectionState: "loading",
      isScrolling: true,
      scrollDirection: "left",
      isHovered: false,
      isClicked: false,
    }
    // this.pingRelayer = this.pingRelayer.bind(this)
    this.performScroll = this.performScroll.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  async componentDidMount() {
    // Periodically ping, setting live/dead appropriately
    // setTimeout(this.pingRelayer, 500)
    // Add listeners for mouse events
    window.addEventListener("mouseup", this.onMouseUp)
    // @ts-ignore
    window.addEventListener("mousemove", this.onMouseMove)
    // Animate scroll if banner is compressed
    this.performScroll()
  }

  //   async pingRelayer() {
  //     const { renegade } = this.context as RenegadeContextType
  //     try {
  //       await renegade?.ping()
  //       this.setState({ connectionState: "live" })
  //     } catch (e) {
  //       this.setState({ connectionState: "dead" })
  //     }
  //     setTimeout(this.pingRelayer, 5000)
  //   }

  performScroll() {
    const relayerStatusBanner = this.state.relayerStatusBannerRef.current
    if (
      relayerStatusBanner &&
      this.state.isScrolling &&
      !this.state.isHovered &&
      !this.state.isClicked
    ) {
      let scrollDest =
        relayerStatusBanner.scrollLeft +
        (this.state.scrollDirection === "left" ? 1 : -1)
      const maxScroll =
        relayerStatusBanner.scrollWidth - relayerStatusBanner.clientWidth
      if (maxScroll > 0) {
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
        relayerStatusBanner.scrollTo(scrollDest, 0)
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
    const relayerStatusBanner = this.state.relayerStatusBannerRef.current
    if (relayerStatusBanner && this.state.isClicked) {
      relayerStatusBanner.scrollBy(
        -event.movementX / window.devicePixelRatio,
        0
      )
    }
  }

  render() {
    let connectionText: React.ReactElement
    if (this.props.connectionState === "loading") {
      connectionText = <Text variant="status-gray">CONNECTING</Text>
    } else if (this.props.connectionState === "live") {
      connectionText = <Text variant="status-green">CONNECTED</Text>
    } else if (this.props.connectionState === "dead") {
      connectionText = <Text variant="status-red">DISCONNECTED</Text>
    } else {
      throw new Error("Invalid connection state: " + this.props.connectionState)
    }
    return (
      <Box
        ref={this.state.relayerStatusBannerRef}
        overflow="hidden"
        height="var(--banner-height)"
        color="text.primary"
        borderBottom="var(--border)"
        userSelect="text"
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          minWidth="1200px"
          height="var(--banner-height)"
        >
          <Spacer flexGrow="2" />
          <Tooltip placement="bottom" label={TVL_TOOLTIP}>
            <Flex alignItems="center" gap="3">
              <Text>TVL</Text>
              <BannerSeparator flexGrow={1} />
              <Text>123.456 {this.props.activeBaseTicker}</Text>
              <BannerSeparator flexGrow={1} />
              <Text>123456.78 {this.props.activeQuoteTicker}</Text>
            </Flex>
          </Tooltip>
          <BannerSeparator flexGrow={3} />
          <Tooltip placement="bottom" label={RELAYER_NAME_TOOLTIP}>
            <Flex alignItems="center" gap="3">
              <Text>Relayer</Text>
              <BannerSeparator flexGrow={1} />
              <Text>renegade-relayer.eth</Text>
              <BannerSeparator flexGrow={1} />
              <HStack>
                {connectionText}
                <PulsingConnection
                  state={this.props.connectionState || "dead"}
                />
              </HStack>
            </Flex>
          </Tooltip>
          <BannerSeparator flexGrow={3} />
          <Tooltip placement="bottom" label={FEES_TOOLTIP}>
            <Text>Fees</Text>
          </Tooltip>
          <BannerSeparator flexGrow={1} />
          <Tooltip placement="bottom" label={RELAYER_FEE_TOOLTIP}>
            <Text>Relayer 0.08%</Text>
          </Tooltip>
          <BannerSeparator flexGrow={1} />
          <Tooltip placement="bottom" label={PROTOCOL_FEE_TOOLTIP}>
            <Text>Protocol 0.02%</Text>
          </Tooltip>
          <Spacer flexGrow="2" />
        </Flex>
      </Box>
    )
  }
}
