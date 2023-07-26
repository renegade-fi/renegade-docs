import { PriceReport } from "@/contexts/RenegadeContext"
import { Flex, Spacer, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { BannerSeparator } from "./banner-separator"
import { ExchangeConnectionTriple } from "./exchange-connection-triple"

type HealthState =
  | "connecting"
  | "unsupported"
  | "live"
  | "no-data"
  | "too-stale"
  | "not-enough-data"
  | "too-much-deviation"

interface MedianTripleProps {
  activeBaseTicker: string
  activeQuoteTicker: string
  healthState: HealthState
  isMobile?: boolean
  priceReport: PriceReport
}
export function MedianTriple(props: MedianTripleProps) {
  return (
    <Flex
      flexDirection={props.isMobile ? "column" : "row"}
      height={props.isMobile ? "40%" : "100%"}
      width={props.isMobile ? "100%" : "24%"}
      minWidth={props.isMobile ? undefined : "400px"}
      paddingTop={props.isMobile ? "10px" : undefined}
      alignItems="center"
      justifyContent="center"
    >
      <Spacer flexGrow="3" />
      <Text
        variant={props.isMobile ? "rotate-right" : undefined}
        whiteSpace="nowrap"
      >
        NBBO Feed
      </Text>
      <BannerSeparator flexGrow={4} />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange={Exchange.Median}
        healthState={props.healthState}
        isMobile={props.isMobile}
        priceReport={props.priceReport}
      />
      <BannerSeparator flexGrow={4} />
    </Flex>
  )
}
