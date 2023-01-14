import { Link, HStack, Text, Box, Flex, Image, Spacer } from "@chakra-ui/react";
import React from "react";

import glyphDark from "../icons/glyph_dark.svg";

export default function Header() {
  return (
    <Flex
      alignItems="center"
      width="100%"
      height="calc(2 * var(--banner-height))"
      borderBottom="var(--border)"
      borderColor="border"
    >
      <Box width="20%" userSelect="none">
        <Image height="var(--banner-height)" marginLeft="5%" src={glyphDark} />
      </Box>
      <Spacer />
      <HStack spacing="20px" fontWeight="300" fontSize="1.1em" color="white.90">
        <Link
          href="https://twitter.com/renegade_fi"
          isExternal
          color="white.100"
        >
          Twitter
        </Link>
        <Link href="https://discord.gg/renegade-fi" isExternal>
          Discord
        </Link>
        <Link href="https://docs.renegade.fi" isExternal>
          Docs
        </Link>
        <Link href="https://whitepaper.renegade.fi" isExternal>
          Whitepaper
        </Link>
      </HStack>
      <Spacer />
      <Box width="20%">
        <Text
          textAlign="right"
          paddingRight="10%"
          fontWeight="800"
          fontSize="1.1em"
          color="white.90"
        >
          Connect Wallet
        </Text>
      </Box>
    </Flex>
  );
}
