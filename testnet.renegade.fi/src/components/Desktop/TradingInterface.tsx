import { Box, Flex } from "@chakra-ui/react";
import React from "react";

// @ts-ignore
import backgroundPattern from "../../icons/background_pattern.png";
import AllTokensBanner from "../Common/Banners/AllTokens";
import ExchangeConnectionsBanner from "../Common/Banners/ExchangeConnections";
import RelayerStatusBanner from "./Banners/RelayerStatus";
import { GlobalModalState } from "./GlobalModal";
import OrdersAndCounterpartiesPanel from "./Panels/OrdersAndCounterparties";
import WalletsPanel from "./Panels/Wallets";
import { TaskStatus } from "./TaskStatus";
import TradingBody from "./TradingBody";

interface TradingInterfaceProps {
  onOpenGlobalModal: () => void;
  isOpenGlobalModal: boolean;
  setGlobalModalState: (state: GlobalModalState) => void;
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
export default function TradingInterface(props: TradingInterfaceProps) {
  return (
    <Flex
      flexDirection="column"
      flexGrow="1"
      backgroundImage={backgroundPattern}
      backgroundSize="cover"
    >
      <ExchangeConnectionsBanner
        activeBaseTicker={props.activeBaseTicker}
        activeQuoteTicker={props.activeQuoteTicker}
      />
      <Flex flexGrow="1">
        <WalletsPanel
          onOpenGlobalModal={props.onOpenGlobalModal}
          isOpenGlobalModal={props.isOpenGlobalModal}
          setGlobalModalState={props.setGlobalModalState}
        />
        <Flex flexDirection="column" flexGrow="1" overflowX="hidden">
          <RelayerStatusBanner
            activeBaseTicker={props.activeBaseTicker}
            activeQuoteTicker={props.activeQuoteTicker}
          />
          <Flex position="relative" flexDirection="column" flexGrow="1">
            <TradingBody
              onOpenGlobalModal={props.onOpenGlobalModal}
              activeDirection={props.activeDirection}
              activeBaseTicker={props.activeBaseTicker}
              activeQuoteTicker={props.activeQuoteTicker}
              activeBaseTokenAmount={props.activeBaseTokenAmount}
              setOrderInfo={props.setOrderInfo}
              setGlobalModalState={props.setGlobalModalState}
            />
            <Box position="absolute" right="0" bottom="0">
              <TaskStatus />
            </Box>
          </Flex>
        </Flex>
        <OrdersAndCounterpartiesPanel
          isOpenGlobalModal={props.isOpenGlobalModal}
        />
      </Flex>
      <AllTokensBanner setOrderInfo={props.setOrderInfo} />
    </Flex>
  );
}
