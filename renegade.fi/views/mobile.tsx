import React from "react"
import backgroundPatternVertical from "@/icons/background_pattern_vertical.svg"
import dragonflyLogo from "@/icons/dragonfly_logo.svg"
import logoDark from "@/icons/logo_dark.svg"
import { ArrowDownIcon } from "@chakra-ui/icons"
import { Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react"
import { useInView } from "react-intersection-observer"

export default function LandingPageMobile() {
  const useInViewOptions = {
    threshold: 0.5,
    triggerOnce: true,
  }
  const [refIcon, inViewIcon] = useInView({ initialInView: true })
  const [refLinksFirst, inViewLinksFirst] = useInView(useInViewOptions)
  const [refLinksSecond, inViewLinksSecond] = useInView(useInViewOptions)
  const [refLinksThird, inViewLinksThird] = useInView(useInViewOptions)

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      overflowX="hidden"
      overflowY="scroll"
      width="100vw"
      maxWidth="100%"
      minHeight="100vh"
      paddingBottom="200px"
      fontSize="5vw"
      background="black"
      backgroundImage={backgroundPatternVertical.src}
      backgroundSize="cover"
      backgroundPosition="top"
      backgroundRepeat="no-repeat"
    >
      <Box
        ref={refIcon}
        display={inViewIcon ? "" : "none"}
        width="100%"
        height="0px"
      />
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="150vw"
      >
        <Image
          className="fade-in-right"
          width="100%"
          maxWidth="400px"
          height="auto"
          padding="0 50px 0 50px"
          alt="Renegade Logo"
          htmlHeight="385"
          htmlWidth="2467"
          src={logoDark.src}
        />
        <Box
          className="fade-in-left"
          paddingTop="10px"
          fontFamily="Aime"
          fontSize="6vw"
          fontWeight="400"
        >
          On-Chain Dark Pool
        </Box>
      </Flex>
      <Box className={inViewIcon ? "" : "fade-out"}>
        <Box className="bounce">
          <ArrowDownIcon boxSize="2em" />
        </Box>
      </Box>
      <Flex
        className={inViewLinksFirst ? "fade-in-right" : "pre-animation"}
        ref={refLinksFirst}
        alignItems="flex-start"
        flexDirection="column"
        alignSelf="flex-start"
        paddingTop="80px"
        paddingLeft="10%"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <Link
          color="white"
          fontSize="1.3em"
          fontWeight="700"
          href="https://renegadefi.typeform.com/access"
          isExternal
        >
          Get Network Access
        </Link>
        <Link href="https://whitepaper.renegade.fi" isExternal>
          Read the Whitepaper
        </Link>
        <Link href="https://docs.renegade.fi" isExternal>
          Browse the Docs
        </Link>
        <Link href="https://github.com/renegade-fi" isExternal>
          See the Code
        </Link>
      </Flex>
      <Flex
        className={inViewLinksThird ? "fade-in-left" : "pre-animation"}
        ref={refLinksThird}
        sx={{ animationDelay: "0.3s" }}
        alignItems="flex-end"
        flexDirection="column"
        alignSelf="flex-end"
        paddingTop="80px"
        paddingRight="10%"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <Link
          color="white"
          fontSize="1.3em"
          fontWeight="700"
          href="https://twitter.com/renegade_fi"
          isExternal
        >
          Follow on Twitter
        </Link>
        <Link href="https://substack.renegade.fi" isExternal>
          Read the Substack
        </Link>
        <Link href="https://discord.gg/renegade-fi" isExternal>
          Join the Discord
        </Link>
        <Link href="https://jobs.renegade.fi" isExternal>
          Work with Us
        </Link>
      </Flex>
      <Flex
        className={inViewLinksSecond ? "fade-in-right" : "pre-animation"}
        ref={refLinksSecond}
        sx={{ animationDelay: "0.15s" }}
        alignItems="flex-start"
        flexDirection="column"
        alignSelf="flex-start"
        paddingTop="80px"
        paddingLeft="10%"
        color="#ccc"
        fontSize="0.9em"
        fontWeight="300"
      >
        <Text color="white" fontSize="1.3em" fontWeight="700">
          Proudly Backed By
        </Text>
        <Flex alignItems="flex-start" flexDirection="column">
          <Link href="https://twitter.com/dragonfly_xyz" isExternal>
            <HStack spacing="5px">
              <Text>Dragonfly</Text>
              <Image
                height="16px"
                paddingTop="3px"
                opacity="80%"
                src={dragonflyLogo.src}
              />
            </HStack>
          </Link>
          <Link href="https://twitter.com/robotventures" isExternal>
            Robot Ventures
          </Link>
          <Link href="https://twitter.com/balajis" isExternal>
            Balaji Srinivasan
          </Link>
          <Link href="https://symbolic.partners" isExternal>
            Symbolic Partners
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}
