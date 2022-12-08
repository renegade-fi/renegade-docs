import React from 'react'

import { linksThinUnderline } from './LandingPageCommon.tsx'

import {
  Box,
  Flex,
  Image,
  Link,
  Text
} from '@chakra-ui/react'

import logoDarkVertical from '../icons/logo_dark_vertical.svg'
import backgroundPattern from '../icons/background_pattern.svg'

export default function LandingPageDesktop () {
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
                    sx={linksThinUnderline}
                  >
                    <Box>
                      <Link
                        isExternal
                        href="https://twitter.com/dragonfly_xyz"
                      >
                        Dragonfly
                      </Link>
                      {' & '}
                      <Link
                        isExternal
                        href="https://twitter.com/naval"
                      >
                        Naval
                      </Link>
                    </Box>
                    <Link
                      isExternal
                      href="https://twitter.com/robotventures"
                    >
                      Robot Ventures
                    </Link>
                    <Link
                      isExternal
                      href="https://twitter.com/balajis"
                    >
                      Balaji Srinivasan
                    </Link>
                    <Link
                      isExternal
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
