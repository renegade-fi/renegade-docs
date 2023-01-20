import { Box, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import logoDark from "../icons/logo_dark.svg";

export default function Footer() {
  return (
    <Flex alignItems="center" width="100%" height="120px">
      <Box width="20%" userSelect="none">
        <Image height="30px" marginLeft="10%" src={logoDark} />
      </Box>
      <Spacer />
      <Text fontWeight="300" fontSize="1.1em" color="white.90">
        TESTNET
      </Text>
      <Spacer />
      <Box width="20%" />
    </Flex>
  );
}
