import { Box, Link, Text, Flex, HStack } from "@chakra-ui/react";
import React from "react";

import { BannerSeparator, PulsingConnection } from "./BannerCommon";
import { TICKER_TO_ADDR } from "../../tokens";

function LinkWrapper(props: { link: string; children: React.ReactNode }) {
  return (
    <Link
      href={props.link}
      isExternal
      _hover={{
        "text-decoration": "none",
      }}
    >
      {props.children}
    </Link>
  );
}

interface ExchangeConnectionTripleProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
  exchange: string;
}
class ExchangeConnectionTriple extends React.Component<ExchangeConnectionTripleProps> {
  constructor(props: ExchangeConnectionTripleProps) {
    super(props);
  }

  render() {
    // Remap some tickers, as different exchanges use different names
    let renamedBaseTicker = this.props.activeBaseTicker;
    let renamedQuoteTicker = this.props.activeQuoteTicker;
    if (renamedBaseTicker === "WBTC") {
      renamedBaseTicker = "BTC";
    }
    if (renamedBaseTicker === "WETH") {
      renamedBaseTicker = "ETH";
    }
    if (renamedQuoteTicker === "USDC") {
      renamedQuoteTicker = {
        binance: "BUSD",
        coinbase: "USD",
        kraken: "USD",
        okx: "USDT",
      }[this.props.exchange] as string;
    }

    // Construct the link
    const link = {
      binance: `https://www.binance.com/en/trade/${renamedBaseTicker}_${renamedQuoteTicker}`,
      coinbase: `https://www.coinbase.com/advanced-trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
      kraken: `https://pro.kraken.com/app/trade/${renamedBaseTicker}-${renamedQuoteTicker}`,
      okx: `https://www.okx.com/trade-swap/${renamedBaseTicker}-${renamedQuoteTicker}-swap`,
      uniswap: `https://info.uniswap.org/#/tokens/${
        TICKER_TO_ADDR[this.props.activeBaseTicker]
      }`,
    }[this.props.exchange] as string;

    return (
      <>
        <LinkWrapper link={link}>
          <Text>
            {this.props.exchange[0].toUpperCase() +
              this.props.exchange.slice(1)}
          </Text>
        </LinkWrapper>
        <BannerSeparator size="small" link={link} />
        <LinkWrapper link={link}>
          <Text fontFamily="Favorit Mono">$1250.00</Text>
        </LinkWrapper>
        <BannerSeparator size="small" link={link} />
        <LinkWrapper link={link}>
          <HStack>
            <Text variant="status-green">LIVE</Text>
            <PulsingConnection state="live" />
          </HStack>
        </LinkWrapper>
      </>
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
      <>
        <Text>Average</Text>
        <BannerSeparator size="small" />
        <Text fontFamily="Favorit Mono">$1250.00</Text>
        <BannerSeparator size="small" />
        <HStack>
          <Text variant="status-green">LIVE</Text>
          <PulsingConnection state="live" />
        </HStack>
      </>
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
      padding="0 2% 0 2%"
      borderBottom="var(--border)"
      borderColor="border"
      color="white.80"
    >
      <Text>NBBO Feed</Text>
      <BannerSeparator size="medium" />
      <PriceReporterTriple />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="binance"
      />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="coinbase"
      />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="kraken"
      />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="okx"
      />
      <BannerSeparator size="medium" />
      <ExchangeConnectionTriple
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
        exchange="uniswap"
      />
    </Flex>
  );
}
