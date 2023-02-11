import { Box, Flex, Image, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import logoDark from "../../icons/logo_dark.svg";

interface FooterState {
  logoRef: React.RefObject<HTMLDivElement>;
  showDownloadPrompt: boolean;
}
export default class Footer extends React.Component<
  Record<string, never>,
  FooterState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      logoRef: React.createRef(),
      showDownloadPrompt: false,
    };
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  componentDidMount() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu(e: MouseEvent) {
    if (!this.state.logoRef.current) {
      return;
    }
    // If the context menu click does not intersect the logo, ignore.
    const boundingBox = this.state.logoRef.current.getBoundingClientRect();
    if (
      boundingBox.left > e.pageX ||
      boundingBox.right < e.pageX ||
      boundingBox.top > e.pageY ||
      boundingBox.bottom < e.pageY
    ) {
      return;
    }
    e.preventDefault();
    this.setState({ showDownloadPrompt: true });
  }

  render() {
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="120px"
        onClick={() => this.setState({ showDownloadPrompt: false })}
      >
        <Flex
          alignItems="center"
          width="30%"
          marginLeft="2%"
          userSelect="none"
          gap="30px"
        >
          <Box ref={this.state.logoRef}>
            <Image height="30px" src={logoDark} />
          </Box>
          <Link
            opacity={this.state.showDownloadPrompt ? 1 : 0}
            transform={
              this.state.showDownloadPrompt
                ? "translateX(0px)"
                : "translateX(-15px)"
            }
            pointerEvents={this.state.showDownloadPrompt ? undefined : "none"}
            transition="0.2s"
            fontSize="1.1em"
            fontWeight="300"
            color="white.90"
            href="https://renegade.fi/logos.zip"
            isExternal
          >
            Download Logo Pack
          </Link>
        </Flex>
        <Spacer />
        <Text fontWeight="300" fontSize="1.1em" color="white.90">
          TESTNET
        </Text>
        <Spacer />
        <Box width="30%" />
      </Flex>
    );
  }
}
