"use client"

import { TokensBanner } from "@/app/(mobile)/m/tokens-banner"
import backgroundPattern from "@/icons/background_pattern.png"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, Flex, HStack, Text } from "@chakra-ui/react"
import { Exchange } from "@sehyunchung/renegade-react"
import Image from "next/image"

import { MedianBanner } from "@/components/banners/median-banner"

import logoDark from "@/icons/logo_dark.svg"

function BodyText() {
  return (
    <Flex
      alignItems="center"
      justifyContent="flex-start"
      flexDirection="column"
      flexGrow="1"
      paddingTop="25%"
      backgroundImage={backgroundPattern.src}
      backgroundSize="cover"
    >
      <Flex
        flexDirection="column"
        color="white.70"
        fontFamily="Aime"
        fontWeight="thin"
      >
        <Text alignSelf="flex-start" fontSize="1.6em">
          Unfortunately,
        </Text>
        <Image
          height="35"
          style={{ margin: "4px 0 8px 0" }}
          alt="Renegade Logo"
          src={logoDark}
        />
        <Text alignSelf="flex-end">is not yet available on mobile.</Text>
      </Flex>
      <Text
        width="60%"
        marginTop="80px"
        color="white.80"
        fontSize="1.1em"
        fontWeight="thin"
        lineHeight="1.1"
        textAlign="center"
      >
        Do you know an exceptional designer?
      </Text>
      <Button
        marginTop="20px"
        padding="8px 18px 8px 18px"
        color="white.80"
        fontSize="1.3em"
        fontWeight="200"
        border="var(--border)"
        borderColor="border"
        borderRadius="30px"
        onClick={() => window.open("https://jobs.renegade.fi", "_blank")}
        variant="invisible"
      >
        <HStack>
          <Text>Jobs Page</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </Flex>
  )
}

export function MobileBody({
  prices,
  report,
}: {
  prices?: number[]
  report?: Record<Exchange, number>
}) {
  return (
    <Flex
      justifyContent="center"
      flexDirection="row"
      width="100%"
      height="220vw"
    >
      <TokensBanner prices={prices} />
      <BodyText />
      <MedianBanner
        isMobile
        activeBaseTicker={"WBTC"}
        activeQuoteTicker={"USDC"}
        report={report}
      />
    </Flex>
  )
}
