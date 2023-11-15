import React from "react"
import Image from "next/image"
import backgroundPattern from "@/icons/background_pattern.svg"
import dragonflyLogo from "@/icons/dragonfly_logo.svg"
import logoDarkVertical from "@/icons/logo_dark_vertical.svg"
import {
  Box,
  Button,
  Image as ChakraImage,
  Flex,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react"

function FancyUnderline(props: {
  padding?: string
  children: React.ReactElement
}) {
  const [isHovering, setIsHovering] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [delay, setDelay] = React.useState<NodeJS.Timeout | null>(null)
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      padding={props.padding}
      onMouseEnter={() => {
        setIsHovering(true)
        setIsCompleted(false)
        if (delay) clearTimeout(delay)
        setDelay(setTimeout(() => setIsCompleted(true), 250))
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        if (delay) clearTimeout(delay)
        setDelay(setTimeout(() => setIsCompleted(false), 250))
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
          position="absolute"
          bottom="2px"
          left="0"
          width="100%"
          height="1.5px"
          opacity={isCompleted ? "0" : "1"}
          transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
          transformOrigin="left"
          transition="transform 0.25s"
          backgroundColor={props.children.props.color || "#ccc"}
        />
        <Box
          position="absolute"
          right="0"
          bottom="2px"
          width="100%"
          height="1.5px"
          opacity={isCompleted ? "1" : "0"}
          transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
          transformOrigin="right"
          transition="transform 0.25s"
          backgroundColor={props.children.props.color || "#ccc"}
        />
      </Box>
    </Flex>
  )
}

function AllLinks() {
  return (
    <Flex
      alignItems="end"
      justifyContent="space-between"
      flexDirection="column"
      lineHeight="115%"
    >
      <Flex
        className="fade-in-left"
        alignItems="end"
        flexDirection="column"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <FancyUnderline>
          <Link
            color="white"
            fontSize="1.2em"
            fontWeight="700"
            href="https://renegadefi.typeform.com/access"
            isExternal
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
        sx={{ animationDelay: "0.15s" }}
        alignItems="end"
        flexDirection="column"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <Text color="white" fontSize="1.2em" fontWeight="700">
          Our Investors
        </Text>
        <Flex
          alignItems="end"
          flexDirection="column"
          fontSize="0.9em"
          lineHeight="125%"
        >
          <FancyUnderline>
            <Link href="https://twitter.com/dragonfly_xyz" isExternal>
              <HStack spacing="5px">
                <Text>Dragonfly</Text>
                <Image
                  alt="Dragonfly Logo"
                  src={dragonflyLogo}
                  height={13}
                  style={{ paddingTop: "1px", opacity: "80%" }}
                />
              </HStack>
            </Link>
          </FancyUnderline>
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
        sx={{ animationDelay: "0.3s" }}
        alignItems="end"
        flexDirection="column"
        marginBottom="8px"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <FancyUnderline>
          <Link
            color="white"
            fontSize="1.2em"
            fontWeight="700"
            href="https://twitter.com/renegade_fi"
            isExternal
          >
            Follow on Twitter
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://substack.renegade.fi" isExternal>
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
  )
}

interface VerticalLogoProps {
  clickX: number
  clickY: number
  showMenu: boolean
  setShowMenu: (showMenu: boolean) => void
  logoRef: React.RefObject<HTMLDivElement>
}
function VerticalLogo(props: VerticalLogoProps) {
  return (
    <Box
      ref={props.logoRef}
      position="relative"
      height="100%"
      marginRight="50px"
    >
      <ChakraImage
        minWidth={111}
        height="100%"
        alt="Renegade Logo"
        src={logoDarkVertical.src}
      />
      <Box
        className="translate-up"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="96.9%"
        background="black"
      />
      <Button
        position="fixed"
        zIndex="2"
        top={props.clickY - 20}
        left={props.clickX + 2}
        padding="0"
        fontSize="0.7em"
        background="black"
        opacity={props.showMenu ? 1 : 0}
        border="1px"
        borderColor="#aaa"
        borderRadius="0px"
        _hover={{
          backgroundColor: "black",
        }}
        cursor={props.showMenu ? "pointer" : "default"}
        transition="opacity 0.2s ease"
        onClick={() => {
          if (!props.showMenu) {
            return
          }
          props.setShowMenu(false)
          window.open("/logos.zip", "_blank")
        }}
      >
        <FancyUnderline padding="10px">
          <Text>Download Logo Pack</Text>
        </FancyUnderline>
      </Button>
    </Box>
  )
}

interface OverlayProps {
  showMenu: boolean
  setShowMenu: (showMenu: boolean) => void
}
function Overlay(props: OverlayProps) {
  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      userSelect="none"
      pointerEvents={props.showMenu ? "auto" : "none"}
      transition="0.3s ease"
      backdropFilter={props.showMenu ? "brightness(50%)" : "brightness(100%)"}
      onClick={() => {
        props.setShowMenu(false)
      }}
    />
  )
}

interface LandingPageDesktopState {
  clickX: number
  clickY: number
  showMenu: boolean
  logoRef: React.RefObject<HTMLDivElement>
}
export default class LandingPageDesktop extends React.Component<
  Record<string, never>,
  LandingPageDesktopState
> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      clickX: 0,
      clickY: 0,
      showMenu: false,
      logoRef: React.createRef(),
    }
    this.handleContextMenu = this.handleContextMenu.bind(this)
    this.setShowMenu = this.setShowMenu.bind(this)
  }

  componentDidMount() {
    document.addEventListener("contextmenu", this.handleContextMenu)
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleContextMenu)
  }

  // @ts-ignore
  handleContextMenu(e) {
    if (!this.state.logoRef.current) {
      return
    }
    // If the context menu click does not intersect the logo, ignore.
    const boundingBox = this.state.logoRef.current.getBoundingClientRect()
    if (
      boundingBox.left > e.pageX ||
      boundingBox.right < e.pageX ||
      boundingBox.top > e.pageY ||
      boundingBox.bottom < e.pageY
    ) {
      return
    }
    e.preventDefault()
    this.setState({
      clickX: e.pageX,
      clickY: e.pageY,
      showMenu: true,
    })
  }

  setShowMenu(showMenu: boolean) {
    this.setState({ showMenu })
  }

  render() {
    return (
      <Flex
        width="100vw"
        maxWidth="100%"
        height="100vh"
        padding="60px"
        backgroundColor="black"
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
            position="relative"
            flexGrow="1"
            overflow="clip"
            width="100%"
            height="100%"
            backgroundImage={backgroundPattern.src}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            border="7px solid"
          >
            <Box
              className="fade-out"
              position="absolute"
              width="100%"
              height="100%"
              background="black"
            />
            <Box margin="auto">
              <Flex justifyContent="space-between" flexDirection="row">
                <Box
                  className="fade-in-right"
                  fontFamily="Aime"
                  fontSize="calc(2vw + 70px)"
                  fontWeight="700" /* 6vw */
                  lineHeight="90%"
                  letterSpacing="-1px"
                  fontStyle="normal"
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
                className="fade-in-compress"
                marginRight="calc(-0.2 * (2vw + 70px))" /* 0.8vw */
                marginLeft="calc(0.05 * (2vw + 70px))" /* 1.2vw */
                paddingTop="15px"
                fontSize="calc(0.13 * (2vw + 70px))" /* -1.2vw */
                fontWeight="300"
                letterSpacing="calc(0.2 * (2vw + 70px))"
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
    )
  }
}
