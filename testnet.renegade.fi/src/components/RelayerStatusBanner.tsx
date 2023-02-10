import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";
import { BannerSeparator, PulsingConnection } from "./BannerCommon";

interface RelayerStatusBannerProps {
  renegadeConnection: RenegadeConnection;
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
interface RelayerStatusBannerState {
  connectionState: "live" | "dead" | "loading";
  isScrolling: boolean;
  scrollDirection: "left" | "right";
  isHovered: boolean;
  isClicked: boolean;
}
export default class RelayerStatusBanner extends React.Component<
  RelayerStatusBannerProps,
  RelayerStatusBannerState
> {
  constructor(props: RelayerStatusBannerProps) {
    super(props);
    this.state = {
      connectionState: "loading",
      isScrolling: true,
      scrollDirection: "left",
      isHovered: false,
      isClicked: false,
    };
    this.pingRelayer = this.pingRelayer.bind(this);
    this.performScroll = this.performScroll.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async componentDidMount() {
    // Periodically ping, setting live/dead appropriately
    setTimeout(this.pingRelayer, 500);
    // Add listeners for mouse events
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
    // Animate scroll if banner is compressed
    this.performScroll();
  }

  async pingRelayer() {
    const isOk = await this.props.renegadeConnection.ping();
    if (isOk) {
      this.setState({ connectionState: "live" });
    } else {
      this.setState({ connectionState: "dead" });
    }
    setTimeout(this.pingRelayer, 5000);
  }

  getRelayerStatusBanner() {
    return document.getElementsByClassName("relayer-status-banner")[0];
  }

  performScroll() {
    const relayerStatusBanner = this.getRelayerStatusBanner();
    if (
      relayerStatusBanner &&
      this.state.isScrolling &&
      !this.state.isHovered &&
      !this.state.isClicked
    ) {
      let scrollDest =
        relayerStatusBanner.scrollLeft +
        (this.state.scrollDirection === "left" ? 1 : -1);
      const maxScroll =
        relayerStatusBanner.scrollWidth - relayerStatusBanner.clientWidth;
      if (maxScroll > 0) {
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
        relayerStatusBanner.scrollTo(scrollDest, 0);
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

  onMouseDown() {
    this.setState({
      isClicked: true,
    });
  }

  onMouseUp() {
    this.setState({
      isClicked: false,
    });
  }

  onMouseMove(event: React.MouseEvent) {
    if (this.state.isClicked) {
      const relayerStatusBanner = this.getRelayerStatusBanner();
      relayerStatusBanner.scrollBy(
        -event.movementX / window.devicePixelRatio,
        0,
      );
    }
  }

  render() {
    let connectionText: React.ReactElement;
    if (this.state.connectionState === "loading") {
      connectionText = <Text variant="status-gray">CONNECTING</Text>;
    } else if (this.state.connectionState === "live") {
      connectionText = <Text variant="status-green">CONNECTED</Text>;
    } else if (this.state.connectionState === "dead") {
      connectionText = <Text variant="status-red">DISCONNECTED</Text>;
    } else {
      throw new Error(
        "Invalid connection state: " + this.state.connectionState,
      );
    }
    return (
      <Box
        height="var(--banner-height)"
        overflowX="hidden"
        borderBottom="var(--border)"
        borderColor="border"
        color="white.80"
        userSelect="none"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        className="relayer-status-banner"
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
          <Text>69,000.00 {this.props.activeQuoteTicker}</Text>
          <BannerSeparator flexGrow={3} />
          <Text>Relayer</Text>
          <BannerSeparator flexGrow={1} />
          <Text>renegade-relayer.eth</Text>
          <BannerSeparator flexGrow={1} />
          <HStack>
            {connectionText}
            <PulsingConnection state={this.state.connectionState} />
          </HStack>
          <BannerSeparator flexGrow={3} />
          <Text>Fees</Text>
          <BannerSeparator flexGrow={1} />
          <Text>Relayer 0.08%</Text>
          <BannerSeparator flexGrow={1} />
          <Text>Protocol 0.02%</Text>
          <BannerSeparator flexGrow={3} />
          <Text>Debug</Text>
          <Spacer flexGrow="2" />
        </Flex>
      </Box>
    );
  }
}
