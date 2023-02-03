import { Box, Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import React from "react";

import backgroundPattern from "../icons/background_pattern.svg";
import logoDarkVertical from "../icons/logo_dark_vertical.svg";
import { linksThinUnderline } from "./LandingPageCommon";

interface VerticalLogoProps {
  clickX: number;
  clickY: number;
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
  logoRef: React.RefObject<HTMLDivElement>;
}
function VerticalLogo(props: VerticalLogoProps) {
  return (
    <Box h="100%" marginRight="50px" position="relative" ref={props.logoRef}>
      <Image
        src={logoDarkVertical}
        alt="Renegade Logo"
        w="auto"
        h="100%"
        htmlWidth="385"
        htmlHeight="2467"
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="96.9%"
        bg="black"
        className="translate-up"
      />
      <Button
        opacity={props.showMenu ? 1 : 0}
        cursor={props.showMenu ? "pointer" : "default"}
        transition="opacity 0.2s ease"
        position="fixed"
        zIndex="2"
        bg="black"
        left={props.clickX + 2}
        top={props.clickY - 20}
        padding="10px"
        border="1px"
        borderColor="#888"
        borderRadius="5px"
        fontSize="0.7em"
        onClick={() => {
          if (!props.showMenu) {
            return;
          }
          props.setShowMenu(false);
          window.open("/logos.zip", "_blank");
        }}
        _hover={{
          backgroundColor: "#333",
        }}
      >
        Download Logo Pack
      </Button>
    </Box>
  );
}

interface OverlayProps {
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
}
function Overlay(props: OverlayProps) {
  return (
    <Box
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      backdropFilter={props.showMenu ? "brightness(50%)" : ""}
      transition="0.3s ease"
      userSelect="none"
      onClick={() => {
        props.setShowMenu(false);
      }}
      pointerEvents={props.showMenu ? "auto" : "none"}
    />
  );
}

interface LandingPageDesktopState {
  clickX: number;
  clickY: number;
  showMenu: boolean;
  logoRef: React.RefObject<HTMLDivElement>;
}
export default class LandingPageDesktop extends React.Component<
  Record<string, never>,
  LandingPageDesktopState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      clickX: 0,
      clickY: 0,
      showMenu: false,
      logoRef: React.createRef(),
    };
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.setShowMenu = this.setShowMenu.bind(this);
  }

  componentDidMount() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu(e) {
    e.preventDefault();
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
    this.setState({
      clickX: e.pageX,
      clickY: e.pageY,
      showMenu: true,
    });
  }

  setShowMenu(showMenu: boolean) {
    this.setState({ showMenu });
  }

  render() {
    return (
      <Flex
        width="100vw"
        maxWidth="100%"
        height="100vh"
        backgroundColor="black"
        padding="60px"
        onClick={() => this.setState({ showMenu: false })}
      >
        <VerticalLogo
          clickX={this.state.clickX}
          clickY={this.state.clickY}
          showMenu={this.state.showMenu}
          setShowMenu={this.setShowMenu}
          logoRef={this.state.logoRef}
        />
        <Box flexGrow="1">
          <Flex
            width="100%"
            height="100%"
            flexGrow="1"
            position="relative"
            border="7px solid"
            overflow="clip"
            backgroundImage={backgroundPattern}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
          >
            <Box
              position="absolute"
              width="100%"
              height="100%"
              bg="black"
              className="fade-out"
            />
            <Box margin="auto">
              <Flex flexDirection="row" justifyContent="space-between">
                <Box
                  fontFamily="Aime"
                  fontWeight="700"
                  fontStyle="normal"
                  fontSize="calc(2vw + 70px)" /* 6vw */
                  letterSpacing="-1px"
                  lineHeight="90%"
                  className="fade-in-right"
                >
                  <Text className="fade-in-right">On.</Text>
                  <Text
                    className="fade-in-right"
                    sx={{ animationDelay: "0.1s" }}
                  >
                    Chain.
                  </Text>
                  <Text
                    className="fade-in-right"
                    sx={{ animationDelay: "0.2s" }}
                  >
                    Dark.
                  </Text>
                  <Text
                    className="fade-in-right"
                    sx={{ animationDelay: "0.3s" }}
                  >
                    Pool.
                  </Text>
                </Box>
                <Flex
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="end"
                  lineHeight="125%"
                  className="links"
                >
                  <Flex
                    flexDirection="column"
                    alignItems="end"
                    fontWeight="300"
                    className="fade-in-left"
                  >
                    <Link
                      isExternal
                      fontWeight="700"
                      href="https://renegadefi.typeform.com/access"
                    >
                      Get Network Access
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://whitepaper.renegade.fi"
                    >
                      See the Whitepaper
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://docs.renegade.fi"
                    >
                      Read the Docs
                    </Link>
                  </Flex>
                  <Flex
                    flexDirection="column"
                    alignItems="end"
                    className="fade-in-left"
                    sx={{ animationDelay: "0.15s" }}
                  >
                    <Text fontWeight="700">Our Investors</Text>
                    <Flex
                      flexDirection="column"
                      alignItems="end"
                      fontWeight="300"
                      fontSize="calc(0.16 * (2vw + 70px))" /* 1vw */
                      opacity="80%"
                      lineHeight="125%"
                      sx={linksThinUnderline}
                    >
                      <Box>
                        <Link
                          isExternal
                          href="https://twitter.com/dragonfly_xyz"
                        >
                          Dragonfly
                        </Link>
                        {" & "}
                        <Link isExternal href="https://twitter.com/naval">
                          Naval
                        </Link>
                      </Box>
                      <Link isExternal href="https://twitter.com/robotventures">
                        Robot Ventures
                      </Link>
                      <Link isExternal href="https://twitter.com/balajis">
                        Balaji Srinivasan
                      </Link>
                      <Link isExternal href="https://symbolic.partners">
                        Symbolic Partners
                      </Link>
                    </Flex>
                  </Flex>
                  <Flex
                    flexDirection="column"
                    alignItems="end"
                    fontWeight="300"
                    paddingBottom="8px"
                    className="fade-in-left"
                    sx={{ animationDelay: "0.3s" }}
                  >
                    <Link
                      isExternal
                      fontWeight="700"
                      href="https://twitter.com/renegade_fi"
                    >
                      Follow us on Twitter
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://renegadefi.substack.com"
                    >
                      Read our Substack
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://discord.gg/renegade-fi"
                    >
                      Join the Discord
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://jobs.renegade.fi"
                    >
                      Work with Us
                    </Link>
                  </Flex>
                </Flex>
              </Flex>
              <Box
                fontWeight="300"
                fontSize="calc(0.13 * (2vw + 70px))" /* 0.8vw */
                letterSpacing="calc(0.2 * (2vw + 70px))" /* 1.2vw */
                marginRight="calc(-0.2 * (2vw + 70px))" /* -1.2vw */
                paddingTop="15px"
                className="fade-in-compress"
              >
                EVERYWHERE NOWHERE
              </Box>
            </Box>
          </Flex>
        </Box>
        <Overlay
          showMenu={this.state.showMenu}
          setShowMenu={this.setShowMenu}
        />
      </Flex>
    );
  }
}
