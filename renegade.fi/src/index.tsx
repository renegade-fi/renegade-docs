import React from 'react'
import ReactDOM from 'react-dom/client'
import mixpanel from 'mixpanel-browser'
import { useInView } from 'react-intersection-observer'

import './animations.css'
import './fonts.css'

import logoDark from './icons/logo_dark.svg'
import logoDarkVertical from './icons/logo_dark_vertical.svg'
import backgroundPattern from './icons/background_pattern.svg'
import backgroundPatternVertical from './icons/background_pattern_vertical.svg'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import {
  extendTheme,
  ChakraProvider,
  ColorModeScript,
  Box,
  Flex,
  Image,
  Link,
  Text,
  type ThemeConfig
} from '@chakra-ui/react'

import { ArrowDownIcon } from '@chakra-ui/icons'

mixpanel.init('91787e297d629eae158b8fcf156c845f')
mixpanel.track('Initialization')

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true
}
const styles = {
  global: {
    body: {
      fontFamily: 'Favorit Extended',
      fontWeight: '400',
      fontSize: 'calc(0.2 * (2vw + 70px))', /* 1.4vw */
      color: 'white',
      bg: 'black'
    }
  }
}
const theme = extendTheme({ config, styles })
const linksThinUnderline = {
  '.links:hover &': {
    textDecorationThickness: '0.05em'
  }
}

function LandingPageDesktop () {
  return (
    <Flex
      w="100vw"
      maxW="100%"
      h="100vh"
      bg="black"
      padding="60px"
    >
      <Box
        h="100%"
        marginRight="50px"
        position="relative"
      >
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
      </Box>
      <Box flexGrow="1">
        <Flex
          w="100%"
          h="100%"
          position="relative"
          border="7px solid white"
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
            <Flex
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box
                fontFamily="Aime"
                fontWeight="700"
                fontStyle="normal"
                fontSize="calc(2vw + 70px)" /* 6vw */
                letterSpacing="-1px"
                lineHeight="90%"
                className="fade-in-right"
              >
                <Text
                  className="fade-in-right"
                >
                  On.
                </Text>
                <Text
                  className="fade-in-right"
                  sx={{ animationDelay: '0.1s' }}
                >
                  Chain.
                </Text>
                <Text
                  className="fade-in-right"
                  sx={{ animationDelay: '0.2s' }}
                >
                  Dark.
                </Text>
                <Text
                  className="fade-in-right"
                  sx={{ animationDelay: '0.3s' }}
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
                  sx={{ animationDelay: '0.15s' }}
                >
                  <Text fontWeight="700">
                    Our Investors
                  </Text>
                  <Flex
                    flexDirection="column"
                    alignItems="end"
                    fontWeight="300"
                    fontSize="calc(0.16 * (2vw + 70px))" /* 1vw */
                    opacity="80%"
                    lineHeight="125%"
                  >
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://twitter.com/dragonfly_xyz"
                    >
                      Dragonfly Capital
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://twitter.com/naval"
                    >
                      Naval Ravikant
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://twitter.com/balajis"
                    >
                      Balaji Srinivasan
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://twitter.com/robotventures"
                    >
                      Robot Ventures
                    </Link>
                    <Link
                      isExternal
                      sx={linksThinUnderline}
                      href="https://symbolic.partners"
                    >
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
                  sx={{ animationDelay: '0.3s' }}
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
    </Flex>
  )
}

function LandingPageMobile () {
  const useInViewOptions = {
    threshold: 0.5,
    triggerOnce: true
  }
  const [refIcon, inViewIcon] = useInView({ initialInView: true })
  const [refLinksFirst, inViewLinksFirst] = useInView(useInViewOptions)
  const [refLinksSecond, inViewLinksSecond] = useInView(useInViewOptions)
  const [refLinksThird, inViewLinksThird] = useInView(useInViewOptions)

  return (
    <Flex
      w="100vw"
      maxW="100%"
      minH="100vh"
      overflowX="hidden"
      overflowY="scroll"
      bg="black"
      backgroundImage={backgroundPatternVertical}
      backgroundSize="cover"
      backgroundPosition="top"
      backgroundRepeat="no-repeat"
      flexDirection="column"
      alignItems="center"
      paddingBottom="200px"
      fontSize="5vw"
    >
      <Box
        w="100%"
        h="0px"
        ref={refIcon}
        display={inViewIcon ? '' : 'none'}
       />
      <Flex
        height="150vw"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
          <Image
            src={logoDark}
            alt="Renegade Logo"
            padding="0 50px 0 50px"
            w="100%"
            maxW="400px"
            h="auto"
            htmlWidth="2467"
            htmlHeight="385"
            className="fade-in-right"
          />
          <Box
            paddingTop="10px"
            fontFamily="Aime"
            fontSize="6vw"
            fontWeight="600"
            className="fade-in-left"
          >
            On-Chain Dark Pool
          </Box>
      </Flex>
      <Box className={inViewIcon ? '' : 'fade-out'}>
        <Box className="bounce">
          <ArrowDownIcon boxSize="2em" />
        </Box>
      </Box>
      <Flex
        paddingTop="80px"
        flexDirection="column"
        alignItems="center"
        fontWeight="300"
        className={inViewLinksFirst ? 'fade-in-right' : 'pre-animation'}
        ref={refLinksFirst}
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
        paddingTop="50px"
        flexDirection="column"
        alignItems="center"
        fontWeight="300"
        className={inViewLinksSecond ? 'fade-in-left' : 'pre-animation'}
        ref={refLinksSecond}
        sx={{ animationDelay: '0.15s' }}
      >
        <Text fontWeight="700">
          Our Investors
        </Text>
        <Flex
          flexDirection="column"
          alignItems="center"
          fontSize="4vw"
          lineHeight="140%"
          opacity="80%"
        >
          <Link
            isExternal
            sx={linksThinUnderline}
            href="https://twitter.com/dragonfly_xyz"
          >
            Dragonfly Capital
          </Link>
          <Link
            isExternal
            sx={linksThinUnderline}
            href="https://twitter.com/naval"
          >
            Naval Ravikant
          </Link>
          <Link
            isExternal
            sx={linksThinUnderline}
            href="https://twitter.com/balajis"
          >
            Balaji Srinivasan
          </Link>
          <Link
            isExternal
            sx={linksThinUnderline}
            href="https://twitter.com/robotventures"
          >
            Robot Ventures
          </Link>
          <Link
            isExternal
            sx={linksThinUnderline}
            href="https://symbolic.partners"
          >
            Symbolic Partners
          </Link>
        </Flex>
      </Flex>
      <Flex
        paddingTop="50px"
        flexDirection="column"
        alignItems="center"
        fontWeight="300"
        className={inViewLinksThird ? 'fade-in-right' : 'pre-animation'}
        ref={refLinksThird}
        sx={{ animationDelay: '0.3s' }}
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
  )
}

function LandingPage () {
  const [width, setWidth] = React.useState<number>(window.innerWidth)
  function handleWindowSizeChange () {
    setWidth(window.innerWidth)
  }
  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])
  return width <= 768 ? <LandingPageMobile /> : <LandingPageDesktop />
}

interface ExternalNavigateProps {
  to: string
}
class ExternalNavigate extends React.Component<ExternalNavigateProps> {
  componentDidMount () {
    window.open(this.props.to, '_self')
  }

  render () {
    return null
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/whitepaper" element={<ExternalNavigate to="/whitepaper.pdf" />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
