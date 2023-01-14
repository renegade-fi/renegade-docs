import { Box, Text, Flex, HStack } from "@chakra-ui/react";
import React from "react";

import { BannerSeparator, PulsingConnection } from "./BannerCommon";

interface RelayerStatusBannerProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
export default function RelayerStatusBanner(props: RelayerStatusBannerProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      width="100%"
      height="var(--banner-height)"
      borderBottom="var(--border)"
      borderColor="border"
      color="white.80"
      userSelect="text"
    >
      <HStack spacing="17px">
        <Text>Liquidity</Text>
        <BannerSeparator size="small" />
        <Text>420.69 {props.activeBaseTicker}</Text>
        <BannerSeparator size="small" />
        <Text>69,000.34 {props.activeQuoteTicker}</Text>
      </HStack>
      <BannerSeparator size="medium" />
      <HStack spacing="17px">
        <Text>Relayer Status</Text>
        <BannerSeparator size="small" />
        <Text>renegade-relayer.eth</Text>
        <BannerSeparator size="small" />
        <HStack>
          <Text variant="status-green">LIVE</Text>
          <PulsingConnection state="live" />
        </HStack>
      </HStack>
      <BannerSeparator size="medium" />
      <HStack spacing="17px">
        <Text>Relayer Fee</Text>
        <BannerSeparator size="small" />
        <Text>0.09%</Text>
      </HStack>
      <BannerSeparator size="medium" />
      <HStack spacing="17px">
        <Text>Protocol Fee</Text>
        <BannerSeparator size="small" />
        <Text>0.01%</Text>
      </HStack>
    </Flex>
  );
}
