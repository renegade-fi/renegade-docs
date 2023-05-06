import { ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Image, Link, Text } from "@chakra-ui/react";
import React from "react";
import { useInView } from "react-intersection-observer";

import backgroundPatternVertical from "../icons/background_pattern_vertical.svg";
import dragonflyLogo from "../icons/dragonfly_logo.svg";
import logoDark from "../icons/logo_dark.svg";

export default function LandingPageMobile() {
  const useInViewOptions = {
    threshold: 0.5,
    triggerOnce: true,
  };
  const [refIcon, inViewIcon] = useInView({ initialInView: true });
  const [refLinksFirst, inViewLinksFirst] = useInView(useInViewOptions);
  const [refLinksSecond, inViewLinksSecond] = useInView(useInViewOptions);
  const [refLinksThird, inViewLinksThird] = useInView(useInViewOptions);

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
      <Box w="100%" h="0px" ref={refIcon} display={inViewIcon ? "" : "none"} />
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
          fontWeight="400"
          className="fade-in-left"
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
        paddingTop="80px"
        flexDirection="column"
        alignItems="flex-start"
        alignSelf="flex-start"
        paddingLeft="10%"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
        className={inViewLinksFirst ? "fade-in-right" : "pre-animation"}
        ref={refLinksFirst}
      >
        <Link
          href="https://renegadefi.typeform.com/access"
          isExternal
          fontWeight="700"
          fontSize="1.3em"
          color="white"
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
        paddingTop="80px"
        flexDirection="column"
        alignItems="flex-end"
        alignSelf="flex-end"
        paddingRight="10%"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
        className={inViewLinksThird ? "fade-in-left" : "pre-animation"}
        ref={refLinksThird}
        sx={{ animationDelay: "0.3s" }}
      >
        <Link
          href="https://twitter.com/renegade_fi"
          isExternal
          fontWeight="700"
          fontSize="1.3em"
          color="white"
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
        paddingTop="80px"
        flexDirection="column"
        alignItems="flex-start"
        alignSelf="flex-start"
        paddingLeft="10%"
        fontWeight="300"
        fontSize="0.9em"
        color="#ccc"
        className={inViewLinksSecond ? "fade-in-right" : "pre-animation"}
        ref={refLinksSecond}
        sx={{ animationDelay: "0.15s" }}
      >
        <Text fontWeight="700" fontSize="1.3em" color="white">
          Proudly Backed By
        </Text>
        <Flex flexDirection="column" alignItems="flex-start">
          <Link href="https://twitter.com/dragonfly_xyz" isExternal>
            <HStack spacing="5px">
              <Text>Dragonfly</Text>
              <Image
                paddingTop="3px"
                src={dragonflyLogo}
                height="16px"
                opacity="80%"
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
  );
}
