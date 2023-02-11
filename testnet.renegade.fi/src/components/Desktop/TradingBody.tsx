import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  keyframes,
} from "@chakra-ui/react";
import React from "react";

import { TICKER_TO_LOGO_URL_HANDLE } from "../../../tokens";
import RenegadeConnection from "../../connections/RenegadeConnection";
import { LivePrices } from "../Common/Banner";

function snapAnimation(translateY: number) {
  return keyframes`
    0% {
      transform: translateY(${translateY}%);
      opacity: 0;
    }
    80% {
      transform: translateY(${-translateY / 6}%);
      opacity: 0.4;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  `;
}

function popAnimation(maxScale: number) {
  return keyframes`
    0% {
      transform: scale(0.95);
      opacity: 0;
    }
    75% {
      transform: scale(${maxScale});
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `;
}

interface BlurredOverlayProps {
  activeModal: null | "buy-sell" | "base-token" | "quote-token";
  setActiveModal: (
    modal: null | "buy-sell" | "base-token" | "quote-token",
  ) => void;
  buySellSelectableCoords: [number, number];
  baseTokenSelectableCoords: [number, number];
  quoteTokenSelectableCoords: [number, number];
  setDirectionAndTickers: (
    buyOrSell?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
  ) => void;
}
function BlurredOverlay(props: BlurredOverlayProps) {
  function OrText() {
    return (
      <Text
        margin="-10px 0 -5px 0"
        fontFamily="Aime"
        fontSize="0.8em"
        color="white.70"
      >
        or
      </Text>
    );
  }

  function BuySellMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        hidden={props.activeModal !== "buy-sell"}
        position="absolute"
        left={props.buySellSelectableCoords[0]}
        top={props.buySellSelectableCoords[1]}
        transform="translate(-50%, -50%) translateX(-20px)"
        fontSize="1.9em"
      >
        <Text
          variant="trading-body-button"
          cursor="pointer"
          animation={`${snapAnimation(70)} 0.15s ease both`}
          onClick={() => {
            props.setActiveModal(null);
            props.setDirectionAndTickers("buy");
          }}
        >
          BUY
        </Text>
        <OrText />
        <Text
          variant="trading-body-button"
          cursor="pointer"
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          onClick={() => {
            props.setActiveModal(null);
            props.setDirectionAndTickers("sell");
          }}
        >
          SELL
        </Text>
      </Flex>
    );
  }

  interface SingleBaseTokenProps {
    ticker: string;
  }
  interface SingleBaseTokenState {
    imageUrl: string;
  }
  class SingleBaseToken extends React.Component<
    SingleBaseTokenProps,
    SingleBaseTokenState
  > {
    constructor(props: SingleBaseTokenProps) {
      super(props);
      this.state = {
        imageUrl: "DEFAULT.png", // TODO: Replace this with real default>
      };
    }

    async componentDidMount() {
      const TICKER_TO_LOGO_URL = await TICKER_TO_LOGO_URL_HANDLE;
      this.setState({
        imageUrl: TICKER_TO_LOGO_URL[this.props.ticker],
      });
    }

    render() {
      return (
        <HStack
          as={Button}
          margin="5px"
          padding="8px"
          border="var(--border)"
          borderRadius="5px"
          color="border"
          onClick={() => {
            props.setActiveModal(null);
            props.setDirectionAndTickers(undefined, this.props.ticker);
          }}
        >
          <Image src={this.state.imageUrl} width="20px" height="20px" />
          <Text fontSize="0.8em" color="white.90">
            {this.props.ticker}
          </Text>
        </HStack>
      );
    }
  }

  function BaseTokenMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        padding="25px"
        maxWidth="25%"
        minHeight="75%"
        hidden={props.activeModal !== "base-token"}
        fontSize="1.5em"
        backgroundColor="white.5"
        border="var(--border)"
        borderColor="white.30"
        borderRadius="15px"
        animation={`${popAnimation(1.015)} 0.1s ease both`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Text width="100%" fontSize="0.8em" textAlign="left" color="white.80">
          Select a Token
        </Text>
        <Input
          width="100%"
          margin="15px 10px 0 10px"
          fontFamily="Favorit"
          fontSize="0.8em"
          placeholder="Search name or paste ERC-20 address"
          borderRadius="10px"
          type="text"
        />
        <Flex flexWrap="wrap" margin="15px 0 0 0">
          {["WBTC", "WETH", "UNI", "CRV", "AAVE", "LDO"].map((ticker) => {
            return <SingleBaseToken key={ticker} ticker={ticker} />;
          })}
        </Flex>
      </Flex>
    );
  }

  function QuoteTokenMenu() {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        hidden={props.activeModal !== "quote-token"}
        position="absolute"
        left={props.quoteTokenSelectableCoords[0]}
        top={props.quoteTokenSelectableCoords[1]}
        transform="translate(-50%, -50%) translateX(-20px)"
        fontSize="1.9em"
      >
        <Text
          variant="trading-body-button"
          cursor="pointer"
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(70)} 0.15s ease both`}
          onClick={() => {
            props.setActiveModal(null);
            props.setDirectionAndTickers(undefined, undefined, "USDC");
          }}
        >
          USDC
        </Text>
        <OrText />
        <Text
          variant="trading-body-button"
          cursor="pointer"
          margin="-5px 0 -5px 0"
          animation={`${snapAnimation(-70)} 0.15s ease both`}
          onClick={() => {
            props.setActiveModal(null);
            props.setDirectionAndTickers(undefined, undefined, "USDT");
          }}
        >
          USDT
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      backdropFilter={props.activeModal ? "blur(8px)" : ""}
      transition="0.1s"
      userSelect="none"
      onClick={() => {
        props.setActiveModal(null);
      }}
      pointerEvents={props.activeModal ? "auto" : "none"}
    >
      <BuySellMenu />
      <BaseTokenMenu />
      <QuoteTokenMenu />
    </Flex>
  );
}

interface SelectableProps {
  text: string;
  onClick: () => void;
  activeModal: null | "buy-sell" | "base-token" | "quote-token";
}
const Selectable = React.forwardRef(
  (props: SelectableProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <HStack
        ref={ref}
        onClick={props.onClick}
        cursor="pointer"
        userSelect="none"
      >
        <Text
          variant={
            props.activeModal
              ? "trading-body-button-blurred"
              : "trading-body-button"
          }
        >
          {props.text}
        </Text>
        <ChevronDownIcon boxSize="20px" viewBox="6 6 12 12" color="white.100" />
      </HStack>
    );
  },
);
Selectable.displayName = "selectable";

interface TradingBodyProps {
  renegadeConnection: RenegadeConnection;
  activeBuyOrSell: "buy" | "sell";
  activeBaseTicker: string;
  activeQuoteTicker: string;
  setDirectionAndTickers: (
    buyOrSell?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
  ) => void;
}
interface TradingBodyState {
  activeModal: null | "buy-sell" | "base-token" | "quote-token";
  baseTokenAmount: number;
  buySellSelectableRef: React.RefObject<HTMLDivElement>;
  baseTokenSelectableRef: React.RefObject<HTMLDivElement>;
  quoteTokenSelectableRef: React.RefObject<HTMLDivElement>;
  buySellSelectableCoords: [number, number];
  baseTokenSelectableCoords: [number, number];
  quoteTokenSelectableCoords: [number, number];
}
export default class TradingBody extends React.Component<
  TradingBodyProps,
  TradingBodyState
> {
  constructor(props: TradingBodyProps) {
    super(props);
    this.state = {
      activeModal: null,
      baseTokenAmount: 0,
      buySellSelectableRef: React.createRef(),
      baseTokenSelectableRef: React.createRef(),
      quoteTokenSelectableRef: React.createRef(),
      buySellSelectableCoords: [0, 0],
      baseTokenSelectableCoords: [0, 0],
      quoteTokenSelectableCoords: [0, 0],
    };
    this.setActiveModal = this.setActiveModal.bind(this);
    this.setBaseTokenAmount = this.setBaseTokenAmount.bind(this);
  }

  shouldComponentUpdate(
    nextProps: TradingBodyProps,
    nextState: TradingBodyState,
  ): boolean {
    if (
      nextProps !== this.props ||
      nextState.activeModal !== this.state.activeModal ||
      nextState.baseTokenAmount !== this.state.baseTokenAmount
    ) {
      return true;
    }
    if (
      JSON.stringify(nextState.buySellSelectableCoords) ===
        JSON.stringify(this.state.buySellSelectableCoords) &&
      JSON.stringify(nextState.baseTokenSelectableCoords) ===
        JSON.stringify(this.state.baseTokenSelectableCoords) &&
      JSON.stringify(nextState.quoteTokenSelectableCoords) ===
        JSON.stringify(this.state.quoteTokenSelectableCoords)
    ) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.setAllRefCoords();
  }

  componentDidUpdate() {
    this.setAllRefCoords();
  }

  setAllRefCoords() {
    const buySellSelectableCoords = this.getRefCoords(
      this.state.buySellSelectableRef,
    );
    const baseTokenSelectableCoords = this.getRefCoords(
      this.state.baseTokenSelectableRef,
    );
    const quoteTokenSelectableCoords = this.getRefCoords(
      this.state.quoteTokenSelectableRef,
    );
    this.setState({
      buySellSelectableCoords,
      baseTokenSelectableCoords,
      quoteTokenSelectableCoords,
    });
  }

  getRefCoords(ref: React.RefObject<HTMLDivElement>): [number, number] {
    if (!ref.current) {
      return [0, 0];
    }
    return [
      ref.current.offsetLeft + ref.current.offsetWidth / 2,
      ref.current.offsetTop + ref.current.offsetHeight / 2,
    ];
  }

  setActiveModal(
    activeModal: null | "buy-sell" | "base-token" | "quote-token",
  ) {
    this.setState({
      activeModal: activeModal,
    });
  }

  setBaseTokenAmount(baseTokenAmount: number) {
    this.setState({
      baseTokenAmount: baseTokenAmount ? baseTokenAmount : 0,
    });
  }

  render() {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        position="relative"
        flexGrow="1"
      >
        <HStack fontFamily="Aime" fontSize="1.8em" spacing="20px">
          <Selectable
            text={this.props.activeBuyOrSell.toUpperCase()}
            onClick={() => this.setActiveModal("buy-sell")}
            activeModal={this.state.activeModal}
            ref={this.state.buySellSelectableRef}
          />
          <Input
            fontFamily="Favorit"
            fontSize="0.8em"
            placeholder="0.00"
            width="200px"
            borderRadius="100px"
            type="number"
            onChange={(e) =>
              this.setBaseTokenAmount(parseFloat(e.target.value))
            }
          />
          <Selectable
            text={this.props.activeBaseTicker}
            onClick={() => this.setActiveModal("base-token")}
            activeModal={this.state.activeModal}
            ref={this.state.baseTokenSelectableRef}
          />
          <Text
            fontFamily="Favorit"
            fontWeight="200"
            fontSize="0.9em"
            color="white.50"
          >
            {this.props.activeBuyOrSell === "buy" ? "with" : "for"}
          </Text>
          <Selectable
            text={this.props.activeQuoteTicker}
            onClick={() => this.setActiveModal("quote-token")}
            activeModal={this.state.activeModal}
            ref={this.state.quoteTokenSelectableRef}
          />
        </HStack>
        <HStack
          display={this.state.baseTokenAmount ? "none" : "inherit"}
          marginTop="5px"
          color="white.50"
          fontFamily="Favorit Extended"
          fontWeight="100"
          spacing="0"
        >
          <Text marginRight="4px">
            Trades are end-to-end encrypted and always clear at the real-time
            midpoint of
          </Text>
          <Box fontFamily="Favorit Mono">
            <LivePrices
              renegadeConnection={this.props.renegadeConnection}
              baseTicker={this.props.activeBaseTicker}
              quoteTicker={this.props.activeQuoteTicker}
              exchange="median"
              onlyShowPrice
            />
          </Box>
          <Text>.</Text>
        </HStack>
        <Button
          display={this.state.baseTokenAmount ? "inherit" : "none"}
          marginTop="10px"
          width="38vw"
          padding="20px"
          backgroundColor="transparent"
          fontSize="1.3em"
          fontWeight="200"
          color="white.80"
          border="var(--border)"
          borderRadius="15px"
          borderColor="border"
          opacity={this.state.baseTokenAmount ? "1" : "0.3"}
        >
          <HStack>
            <Text>Place Order</Text>
            {this.state.baseTokenAmount ? <ArrowForwardIcon /> : null}
          </HStack>
        </Button>
        <BlurredOverlay
          activeModal={this.state.activeModal}
          setActiveModal={this.setActiveModal}
          buySellSelectableCoords={this.state.buySellSelectableCoords}
          baseTokenSelectableCoords={this.state.baseTokenSelectableCoords}
          quoteTokenSelectableCoords={this.state.quoteTokenSelectableCoords}
          setDirectionAndTickers={this.props.setDirectionAndTickers}
        />
      </Flex>
    );
  }
}
