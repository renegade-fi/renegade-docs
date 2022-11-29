import React from 'react'
import ReactDOM from 'react-dom/client'
import mixpanel from 'mixpanel-browser'

import './animations.css'
import './fonts.css'

import logoDark from './icons/logo_dark.svg'
import logoDarkRotated from './icons/logo_dark_rotated.svg'
import backgroundPattern from './icons/background_pattern.svg'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  Box,
  Flex,
  Image,
  Link,
  Text,
  type ThemeConfig
} from '@chakra-ui/react'

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
      fontSize: '1.4rem',
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
      <Box h="100%" paddingRight="50px">
        <Image
          src={logoDarkRotated}
          alt="Renegade Logo"
          h="100%"
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
          <Box margin="auto">
            <Flex
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box
                fontFamily="Aime"
                fontWeight="700"
                fontStyle="normal"
                fontSize="6rem"
                letterSpacing="-1px"
                lineHeight="90%"
                className="fade-in-right"
              >
                <Text>On.</Text>
                <Text>Chain.</Text>
                <Text>Dark.</Text>
                <Text>Pool.</Text>
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
                  className="fade-in-left-first"
                >
                  <Link
                    isExternal
                    fontWeight="700"
                    href="TODO"
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
                <Box
                  className="fade-in-left-second"
                >
                  <Text fontWeight="700">
                    Our Investors
                  </Text>
                  <Flex
                    flexDirection="column"
                    alignItems="end"
                    fontWeight="300"
                    fontSize="1rem"
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
                </Box>
                <Flex
                  flexDirection="column"
                  alignItems="end"
                  fontWeight="300"
                  paddingBottom="8px"
                  className="fade-in-left-third"
                >
                  <Link
                    isExternal
                    fontWeight="700"
                    href="https://twitter.com/renegade_fi"
                  >
                    Follow on Twitter
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
                    href="https://jobs.renegade.fi"
                  >
                    Work with Us
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <Box
              fontWeight="300"
              fontSize="0.8rem"
              letterSpacing="20px"
              marginRight="-20px"
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

function LandingPage () {
  return <LandingPageDesktop />
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
