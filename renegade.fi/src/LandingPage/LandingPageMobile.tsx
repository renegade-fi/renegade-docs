import React from 'react'

import { linksThinUnderline } from './LandingPageCommon.tsx'

import { useInView } from 'react-intersection-observer'
import { ArrowDownIcon } from '@chakra-ui/icons'

import logoDark from '../icons/logo_dark.svg'
import backgroundPatternVertical from '../icons/background_pattern_vertical.svg'

import {
  Box,
  Flex,
  Image,
  Link,
  Text
} from '@chakra-ui/react'

export default function LandingPageMobile () {
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
          sx={linksThinUnderline}
        >
          <Link
            isExternal
            href="https://twitter.com/dragonfly_xyz"
          >
            Dragonfly
          </Link>
          <Link
            isExternal
            href="https://twitter.com/naval"
          >
            Naval Ravikant
          </Link>
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
