import { Box, Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import React from "react";

import backgroundPattern from "../icons/background_pattern.svg";
import logoDarkVertical from "../icons/logo_dark_vertical.svg";

function FancyUnderline(props: {
  padding?: string;
  children: React.ReactElement;
}) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [delay, setDelay] = React.useState<NodeJS.Timeout | null>(null);
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      padding={props.padding}
      onMouseEnter={() => {
        setIsHovering(true);
        setIsCompleted(false);
        if (delay) clearTimeout(delay);
        setDelay(setTimeout(() => setIsCompleted(true), 250));
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        if (delay) clearTimeout(delay);
        setDelay(setTimeout(() => setIsCompleted(false), 250));
      }}
    >
      <Box position="relative">
        {React.cloneElement(props.children, {
          textDecoration: "none",
          _hover: {
            textDecoration: "none",
          },
        })}
        <Box
          opacity={isCompleted ? "0" : "1"}
          position="absolute"
          height="1.5px"
          width="100%"
          bottom="2px"
          left="0"
          transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
          transformOrigin="left"
          backgroundColor={props.children.props.color || "#ccc"}
          transition="transform 0.25s"
        />
        <Box
          opacity={isCompleted ? "1" : "0"}
          position="absolute"
          height="1.5px"
          width="100%"
          bottom="2px"
          right="0"
          transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
          transformOrigin="right"
          backgroundColor={props.children.props.color || "#ccc"}
          transition="transform 0.25s"
        />
      </Box>
    </Flex>
  );
}

function AllLinks() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      alignItems="end"
      lineHeight="115%"
    >
      <Flex
        className="fade-in-left"
        flexDirection="column"
        alignItems="end"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
      >
        <FancyUnderline>
          <Link
            href="https://renegadefi.typeform.com/access"
            isExternal
            fontWeight="700"
            fontSize="1.2em"
            color="white"
          >
            Get Network Access
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://whitepaper.renegade.fi" isExternal>
            Read the Whitepaper
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://docs.renegade.fi" isExternal>
            Browse the Docs
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://github.com/renegade-fi" isExternal>
            See the Code
          </Link>
        </FancyUnderline>
      </Flex>
      <Flex
        className="fade-in-left"
        flexDirection="column"
        alignItems="end"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
        sx={{ animationDelay: "0.15s" }}
      >
        <Text fontWeight="700" fontSize="1.2em" color="white">
          Our Investors
        </Text>
        <Flex
          flexDirection="column"
          alignItems="end"
          lineHeight="125%"
          fontSize="0.9em"
        >
          <Flex gap="5px">
            <FancyUnderline>
              <Link href="https://twitter.com/dragonfly_xyz" isExternal>
                Dragonfly
              </Link>
            </FancyUnderline>
            {" & "}
            <FancyUnderline>
              <Link href="https://twitter.com/naval" isExternal>
                Naval
              </Link>
            </FancyUnderline>
          </Flex>
          <FancyUnderline>
            <Link href="https://twitter.com/robotventures" isExternal>
              Robot Ventures
            </Link>
          </FancyUnderline>
          <FancyUnderline>
            <Link href="https://twitter.com/balajis" isExternal>
              Balaji Srinivasan
            </Link>
          </FancyUnderline>
          <FancyUnderline>
            <Link href="https://symbolic.partners" isExternal>
              Symbolic Partners
            </Link>
          </FancyUnderline>
        </Flex>
      </Flex>
      <Flex
        className="fade-in-left"
        flexDirection="column"
        alignItems="end"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
        marginBottom="8px"
        sx={{ animationDelay: "0.3s" }}
      >
        <FancyUnderline>
          <Link
            href="https://twitter.com/renegade_fi"
            isExternal
            fontWeight="700"
            fontSize="1.2em"
            color="white"
          >
            Follow on Twitter
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://renegadefi.substack.com" isExternal>
            Read the Substack
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://discord.gg/renegade-fi" isExternal>
            Join the Discord
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://jobs.renegade.fi" isExternal>
            Work with Us
          </Link>
        </FancyUnderline>
      </Flex>
    </Flex>
  );
}

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
        padding="0"
        left={props.clickX + 2}
        top={props.clickY - 20}
        border="1px"
        borderColor="#aaa"
        borderRadius="0px"
        fontSize="0.7em"
        onClick={() => {
          if (!props.showMenu) {
            return;
          }
          props.setShowMenu(false);
          window.open("/logos.zip", "_blank");
        }}
        _hover={{
          backgroundColor: "black",
        }}
      >
        <FancyUnderline padding="10px">
          <Text>Download Logo Pack</Text>
        </FancyUnderline>
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
                <AllLinks />
              </Flex>
              <Box
                fontWeight="300"
                fontSize="calc(0.13 * (2vw + 70px))" /* 0.8vw */
                letterSpacing="calc(0.2 * (2vw + 70px))" /* 1.2vw */
                marginLeft="calc(0.05 * (2vw + 70px))"
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
