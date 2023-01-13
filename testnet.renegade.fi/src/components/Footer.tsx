import { HStack, Text, Box, Flex, Image, Spacer } from "@chakra-ui/react";
import React from "react";

import logoDark from "../icons/logo_dark.svg";

export default function Footer() {
  return (
    <Flex alignItems="center" width="100%" height="120px">
      <Box width="20%">
        <Image height="30px" paddingLeft="10%" src={logoDark} />
      </Box>
      <Spacer />
      <Text fontFamily="Favorit Expanded" fontWeight="300" color="white.60">
        TESTNET
      </Text>
      <Spacer />
      <Box width="20%" />
    </Flex>
  );
}
