import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

import RenegadeConnection from "../../connections/RenegadeConnection";
import backgroundPattern from "../../icons/background_pattern.png";
import logoDark from "../../icons/logo_dark.svg";
import AllTokensBanner from "../Common/Banners/AllTokens";
import ExchangeConnectionsBanner from "../Common/Banners/ExchangeConnections";

// Create a connection to a relayer
const renegadeConnection = new RenegadeConnection({
  relayerUrl: "stage.relayer.renegade.fi",
  // relayerUrl: "127.0.0.1",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useTls: true,
  // useTls: false,
});

function BodyText() {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      paddingTop="25%"
      backgroundImage={backgroundPattern}
      backgroundSize="cover"
      flexGrow="1"
    >
      <Flex
        flexDirection="column"
        fontFamily="Aime"
        fontWeight="thin"
        color="white.70"
      >
        <Text alignSelf="flex-start" fontSize="1.6em">
          Unfortunately,
        </Text>
        <Image height="35px" margin="4px 0 8px 0" src={logoDark} />
        <Text alignSelf="flex-end">is not yet available on mobile.</Text>
      </Flex>
      <Text
        width="60%"
        marginTop="80px"
        textAlign="center"
        fontWeight="thin"
        fontSize="1.1em"
        lineHeight="1.1"
        color="white.80"
      >
        Do you know an exceptional designer?
      </Text>
      <Button
        onClick={() => window.open("https://jobs.renegade.fi", "_blank")}
        variant="invisible"
        marginTop="20px"
        padding="8px 18px 8px 18px"
        fontSize="1.3em"
        fontWeight="200"
        color="white.80"
        border="var(--border)"
        borderRadius="30px"
        borderColor="border"
      >
        <HStack>
          <Text>Jobs Page</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </Flex>
  );
}

export default function Body() {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      width="100%"
      height="220vw"
    >
      <AllTokensBanner renegadeConnection={renegadeConnection} isMobile />
      <BodyText />
      <ExchangeConnectionsBanner
        renegadeConnection={renegadeConnection}
        activeBaseTicker="WBTC"
        activeQuoteTicker="USDC"
        isMobile
      />
    </Flex>
  );
}
