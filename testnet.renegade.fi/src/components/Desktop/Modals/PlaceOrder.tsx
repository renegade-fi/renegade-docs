import { Button, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import React from "react";

import { TICKER_TO_ADDR } from "../../../../tokens";
import RenegadeConnection from "../../../connections/RenegadeConnection";
import {
  DEFAULT_PRICE_REPORT,
  PriceReport,
} from "../../../connections/RenegadeConnection";
import RenegadeConnectionContext from "../../../contexts/RenegadeConnection";

const SLIPPAGE_TOLERANCE = 1.05;

interface ConfirmButtonProps {
  isPlacingOrder: boolean;
  placeOrder: () => void;
  onClose: () => void;
}
function ConfirmButton(props: ConfirmButtonProps) {
  return (
    <Button
      width="100%"
      height={props.isPlacingOrder ? "50px" : "40px"}
      transition="0.2s"
      fontWeight="800"
      backgroundColor="brown.light"
      color="white.90"
      onClick={() => props.placeOrder()}
    >
      <HStack spacing="10px">
        <Spinner
          width={props.isPlacingOrder ? "17px" : "0px"}
          height={props.isPlacingOrder ? "17px" : "0px"}
          opacity={props.isPlacingOrder ? 1 : 0}
          transition="0.2s"
          speed="0.8s"
        />
        <Text>Confirm and Send</Text>
      </HStack>
    </Button>
  );
}

interface PlaceOrderModalProps {
  onClose: () => void;
  activeDirection: "buy" | "sell";
  activeBaseTicker: string;
  activeQuoteTicker: string;
  activeBaseTokenAmount: number;
  setOrderInfo: (
    direction?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
    baseTokenAmount?: number,
  ) => void;
}
interface PlaceOrderModalState {
  medianPriceReport: PriceReport;
  isPlacingOrder: boolean;
}
export default class PlaceOrderModal extends React.Component<
  PlaceOrderModalProps,
  PlaceOrderModalState
> {
  static contextType = RenegadeConnectionContext;

  constructor(props: PlaceOrderModalProps) {
    super(props);
    this.state = {
      medianPriceReport: DEFAULT_PRICE_REPORT,
      isPlacingOrder: false,
    };
    this.placeOrder = this.placeOrder.bind(this);
  }

  async componentDidMount() {
    await this.queryMedianPrice();
  }

  async queryMedianPrice() {
    const healthStates = await (
      this.context as RenegadeConnection
    ).checkExchangeHealthStates(
      TICKER_TO_ADDR[this.props.activeBaseTicker],
      TICKER_TO_ADDR[this.props.activeQuoteTicker],
    );
    if (healthStates["median"]["Nominal"]) {
      this.setState({ medianPriceReport: healthStates["median"]["Nominal"] });
    }
  }

  placeOrder() {
    // TODO: Actually submit the order to the relayer
    this.setState({ isPlacingOrder: true });
    setTimeout(() => {
      this.props.setOrderInfo(undefined, undefined, undefined, 0);
      this.props.onClose();
      setTimeout(() => this.setState({ isPlacingOrder: false }), 100);
    }, 1000);
  }

  render() {
    let limitAmount =
      this.props.activeBaseTokenAmount *
      this.state.medianPriceReport.midpointPrice;
    if (this.props.activeDirection === "buy") {
      limitAmount *= SLIPPAGE_TOLERANCE;
    } else {
      limitAmount /= SLIPPAGE_TOLERANCE;
    }
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          width="100%"
          marginBottom="10px"
          fontSize="0.9em"
          color="white.60"
        >
          <Text>Submit your order for MPC matching to relayer</Text>
          <Text fontFamily="Favorit Mono">renegade-relayer.eth</Text>
          <Flex
            opacity={this.state.isPlacingOrder ? 0 : 1}
            height={this.state.isPlacingOrder ? "0px" : "110px"}
            marginTop={this.state.isPlacingOrder ? "0px" : "10px"}
            marginBottom="10px"
            marginLeft="10px"
            transition="0.2s"
            flexDirection="column"
            fontFamily="Favorit Mono"
            fontSize="1.2em"
            gap="3px"
          >
            <Flex gap="8px">
              <Text>Buying</Text>
              <Text color="white">
                {this.props.activeDirection === "buy"
                  ? this.props.activeBaseTokenAmount +
                    " " +
                    this.props.activeBaseTicker
                  : this.props.activeQuoteTicker}
              </Text>
            </Flex>
            <Flex gap="8px">
              <Text>Selling</Text>
              <Text color="white">
                {this.props.activeDirection === "buy"
                  ? this.props.activeQuoteTicker
                  : this.props.activeBaseTokenAmount +
                    " " +
                    this.props.activeBaseTicker}
              </Text>
            </Flex>
            <Flex gap="8px">
              <Text>Type</Text>
              <Text color="white">Midpoint Peg</Text>
            </Flex>
            <Flex gap="8px">
              <Text>
                {this.props.activeDirection === "buy"
                  ? "Pay at Most"
                  : "Receive at Least"}
              </Text>
              <Text color="white">
                {this.state.medianPriceReport === DEFAULT_PRICE_REPORT
                  ? "?????"
                  : limitAmount.toFixed(2) + " " + this.props.activeQuoteTicker}
              </Text>
            </Flex>
          </Flex>
          <ConfirmButton
            isPlacingOrder={this.state.isPlacingOrder}
            placeOrder={this.placeOrder}
            onClose={this.props.onClose}
          />
        </Flex>
      </Flex>
    );
  }
}
