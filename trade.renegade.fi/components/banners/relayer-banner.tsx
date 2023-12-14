"use client"

import React from "react"
import { RenegadeContext } from "@/contexts/Renegade/renegade-context"
import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react"

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
    static contextType = RenegadeContext

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
                relayerStatusBanner.scrollWidth -
                relayerStatusBanner.clientWidth
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
            throw new Error(
                `Invalid connection state: ${this.props.connectionState}`
            )
        }
        return (
            <RenegadeContext.Consumer>
                {() => (
                    <Box
                        ref={this.state.relayerStatusBannerRef}
                        overflow="hidden"
                        height="var(--banner-height)"
                        color="white.80"
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
                            <Text>Liquidity</Text>
                            <BannerSeparator flexGrow={1} />
                            <Text>420.00 {this.props.activeBaseTicker}</Text>
                            <BannerSeparator flexGrow={1} />
                            <Text>
                                69,000.00 {this.props.activeQuoteTicker}
                            </Text>
                            <BannerSeparator flexGrow={3} />
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
                            <BannerSeparator flexGrow={3} />
                            <Text>Fees</Text>
                            <BannerSeparator flexGrow={1} />
                            <Text>Relayer 0.08%</Text>
                            <BannerSeparator flexGrow={1} />
                            <Text>Protocol 0.02%</Text>
                            <Spacer flexGrow="2" />
                        </Flex>
                    </Box>
                )}
            </RenegadeContext.Consumer>
        )
    }
}
