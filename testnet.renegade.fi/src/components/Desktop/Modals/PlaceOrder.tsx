import { Button, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import { Order, Token } from "@renegade-fi/renegade-js";
import React from "react";

import { renegade } from "../../..";
import RenegadeContext, {
  DEFAULT_PRICE_REPORT,
  PriceReport,
  RenegadeContextType,
  TaskType,
} from "../../../contexts/RenegadeContext";

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
  static contextType = RenegadeContext;

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

  getLimitPrice(): number {
    let limitPrice =
      this.props.activeBaseTokenAmount *
      this.state.medianPriceReport.midpointPrice;
    if (this.props.activeDirection === "buy") {
      limitPrice *= SLIPPAGE_TOLERANCE;
    } else {
      limitPrice /= SLIPPAGE_TOLERANCE;
    }
    return limitPrice;
  }

  async queryMedianPrice() {
    const healthStates = await renegade.queryExchangeHealthStates(
      new Token({ ticker: this.props.activeBaseTicker }),
      new Token({ ticker: this.props.activeQuoteTicker }),
    );
    if (healthStates["median"]["Nominal"]) {
      this.setState({ medianPriceReport: healthStates["median"]["Nominal"] });
    }
  }

  async placeOrder() {
    this.setState({ isPlacingOrder: true });
    const { accountId, setTask } = this.context as RenegadeContextType;
    if (!accountId) {
      return;
    }
    const order = new Order({
      baseToken: new Token({ ticker: this.props.activeBaseTicker }),
      quoteToken: new Token({ ticker: this.props.activeQuoteTicker }),
      side: this.props.activeDirection,
      type: "limit",
      amount: BigInt(this.props.activeBaseTokenAmount),
      price: this.getLimitPrice(),
    });
    const [taskId] = await renegade.task.placeOrder(accountId, order);
    setTask(taskId, TaskType.PlaceOrder);
    this.props.setOrderInfo(undefined, undefined, undefined, 0);
    this.props.onClose();
    setTimeout(() => this.setState({ isPlacingOrder: false }), 100);
  }

  render() {
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
                  : this.getLimitPrice().toFixed(2) +
                    " " +
                    this.props.activeQuoteTicker}
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
