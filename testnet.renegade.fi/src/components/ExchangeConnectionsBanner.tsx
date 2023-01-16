import { BannerSeparator, PulsingConnection } from "./BannerCommon";
import { Box, Text, Flex, HStack } from "@chakra-ui/react";
import React from "react";

interface ExchangeConnectionTripleProps {
  exchange: string;
}
class ExchangeConnectionTriple extends React.Component<ExchangeConnectionTripleProps> {
  constructor(props: ExchangeConnectionTripleProps) {
    super(props);
  }

  render() {
    return (
      <HStack>
        <Text>
          {this.props.exchange[0].toUpperCase() + this.props.exchange.slice(1)}
        </Text>
        <BannerSeparator size="small" />
        <Text fontFamily="Favorit Mono">$1250.00</Text>
        <BannerSeparator size="small" />
        <HStack>
          <Text variant="status-green">LIVE</Text>
          <PulsingConnection state="live" />
        </HStack>
      </HStack>
    );
  }
}

interface PriceReporterTripleProps {}
class PriceReporterTriple extends React.Component<PriceReporterTripleProps> {
  constructor(props: PriceReporterTripleProps) {
    super(props);
  }

  render() {
    return (
      <HStack>
        <Text>Average</Text>
        <BannerSeparator size="small" />
        <Text fontFamily="Favorit Mono">$1250.00</Text>
        <BannerSeparator size="small" />
        <HStack>
          <Text variant="status-green">LIVE</Text>
          <PulsingConnection state="live" />
        </HStack>
      </HStack>
    );
  }
}

interface ExchangeConnectionsBannerProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
export default function ExchangeConnectionsBanner(
  props: ExchangeConnectionsBannerProps
) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-evenly"
      width="100%"
      height="var(--banner-height)"
      borderBottom="var(--border)"
      borderColor="border"
      color="white.80"
    >
      <Text>NBBO Feed</Text>
      <BannerSeparator size="medium" />
      <PriceReporterTriple />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple exchange="binance" />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple exchange="coinbase" />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple exchange="kraken" />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple exchange="okx" />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple exchange="uniswap" />
    </Flex>
  );
}
