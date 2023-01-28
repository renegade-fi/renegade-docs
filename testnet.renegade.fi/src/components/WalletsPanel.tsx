import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import {
  useAccount as useAccountWagmi,
  useBalance as useBalanceWagmi,
} from "wagmi";

import { ADDR_TO_TICKER, TICKER_TO_LOGO_URL_HANDLE } from "../../tokens";
import RenegadeConnection from "../connections/RenegadeConnection";
import KeyStoreContext from "../contexts/KeyStoreContext";
import { LivePrices } from "./BannerCommon";

interface SingleWalletsPanelCollapsedProps {
  displayText: string;
  isFirst: boolean;
}
function SingleWalletsPanelCollapsed(props: SingleWalletsPanelCollapsedProps) {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      borderBottom={props.isFirst ? "var(--border)" : "none"}
      borderColor="border"
    >
      <Text transform="rotate(-90deg)" textAlign="center" minWidth="200px">
        {props.displayText}
      </Text>
    </Flex>
  );
}

interface WalletsPanelCollapsedProps {
  toggleIsCollapsed: () => void;
}
function WalletsPanelCollapsed(props: WalletsPanelCollapsedProps) {
  return (
    <Flex
      width="calc(1.5 * var(--banner-height))"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderRight="var(--border)"
      borderColor="border"
      onClick={props.toggleIsCollapsed}
      cursor="pointer"
      userSelect="none"
      position="relative"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="9px"
        width="calc(0.6 * var(--banner-height))"
        height="calc(0.6 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
      >
        <ArrowRightIcon boxSize="11px" color="white.80" />
      </Flex>
      <SingleWalletsPanelCollapsed
        isFirst={true}
        displayText="Ethereum Wallet"
      />
      <SingleWalletsPanelCollapsed
        isFirst={false}
        displayText="Renegade Wallet"
      />
    </Flex>
  );
}

interface TokenBalanceProps {
  renegadeConnection: RenegadeConnection;
  userAddr: string;
  tokenAddr: string;
}
function TokenBalance(props: TokenBalanceProps) {
  const [logoUrl, setLogoUrl] = React.useState("DEFAULT.png");
  React.useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setLogoUrl(tickerToLogoUrl[ADDR_TO_TICKER[props.tokenAddr]]);
    });
  });
  const { data } = useBalanceWagmi({
    addressOrName: props.userAddr,
    token: props.tokenAddr,
  });
  if (!data || data.value.isZero()) {
    return null;
  }
  return (
    <Flex
      alignItems="center"
      width="100%"
      color="white.80"
      gap="5px"
      borderBottom="var(--border)"
      borderColor="white.20"
    >
      <Image src={logoUrl} width="25px" height="25px" />
      <Flex
        flexDirection="column"
        alignItems="flex-end"
        padding="10px 0 10px 0"
        flexGrow="1"
      >
        <Text fontSize="1.1em" lineHeight="1">
          {data.formatted.slice(0, 6)} {ADDR_TO_TICKER[props.tokenAddr]}
        </Text>
        <Box fontSize="0.8em" color="white.50" lineHeight="1">
          <LivePrices
            renegadeConnection={props.renegadeConnection}
            baseTicker={ADDR_TO_TICKER[props.tokenAddr]}
            quoteTicker={"USDC"}
            exchange="median"
            onlyShowPrice
            scaleBy={Number.parseFloat(data.formatted)}
          />
        </Box>
      </Flex>
      <ArrowDownIcon />
      <ArrowUpIcon />
    </Flex>
  );
}

interface EthereumWalletPanelProps {
  renegadeConnection: RenegadeConnection;
  toggleIsCollapsed: () => void;
}
function EthereumWalletPanel(props: EthereumWalletPanelProps) {
  const { address } = useAccountWagmi();
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderBottom="var(--border)"
        borderColor="border"
        position="relative"
      >
        <Text>Ethereum Wallet</Text>
        <Flex
          alignItems="center"
          justifyContent="center"
          position="absolute"
          right="10px"
          width="calc(0.6 * var(--banner-height))"
          height="calc(0.6 * var(--banner-height))"
          borderRadius="100px"
          onClick={props.toggleIsCollapsed}
          cursor="pointer"
          _hover={{
            background: "white.10",
          }}
        >
          <ArrowLeftIcon boxSize="11px" color="white.80" />
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        width="100%"
        padding="0 9% 0 9%"
        flexGrow="1"
      >
        <Box height="10px" />
        {address &&
          Object.keys(ADDR_TO_TICKER).map((tokenAddr) => (
            <TokenBalance
              renegadeConnection={props.renegadeConnection}
              userAddr={address}
              tokenAddr={tokenAddr}
              key={tokenAddr}
            />
          ))}
        <Box height="10px" />
      </Flex>
    </>
  );
}

interface DepositWithdrawButtonsProps {}
function DepositWithdrawButtons(props: DepositWithdrawButtonsProps) {
  return (
    <Flex
      width="100%"
      height="calc(1.5 * var(--banner-height))"
      flexDirection="row"
      borderTop="var(--border)"
      borderBottom="var(--border)"
      borderColor="border"
    >
      <Flex
        justifyContent="center"
        gap="5px"
        alignItems="center"
        borderRight="var(--border)"
        borderColor="border"
        flexGrow="1"
      >
        <Text>Deposit</Text>
        <ArrowDownIcon />
      </Flex>
      <Flex justifyContent="center" gap="5px" alignItems="center" flexGrow="1">
        <Text>Withdraw</Text>
        <ArrowUpIcon />
      </Flex>
    </Flex>
  );
}

interface RenegadeWalletPanelProps {
  toggleIsCollapsed: () => void;
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const [keyStoreState] = React.useContext(KeyStoreContext);
  const root = keyStoreState.renegadeKeypairs.root.publicKey;
  const match = keyStoreState.renegadeKeypairs.match.publicKey;
  const settle = keyStoreState.renegadeKeypairs.settle.publicKey;
  const view = keyStoreState.renegadeKeypairs.view.publicKey;
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        fontWeight="500"
        borderBottom="var(--border)"
        borderColor="border"
        onClick={props.toggleIsCollapsed}
        cursor="pointer"
      >
        Renegade Wallet
      </Flex>
      <Flex flexDirection="column" flexGrow="1" color="white.60">
        <Box height="10px" />
        <Text display={root ? "inherit" : "none"}>
          rng-root-{root && root.toString("hex").slice(0, 12)}
        </Text>
        <Text display={match ? "inherit" : "none"}>
          rng-match-{match && match.toString("hex").slice(0, 12)}
        </Text>
        <Text display={settle ? "inherit" : "none"}>
          rng-settle-{settle && settle.toString("hex").slice(0, 12)}
        </Text>
        <Text display={view ? "inherit" : "none"}>
          rng-view-{view && view.toString("hex").slice(0, 12)}
        </Text>
      </Flex>
    </>
  );
}

interface WalletsPanelExpandedProps {
  renegadeConnection: RenegadeConnection;
  toggleIsCollapsed: () => void;
}
function WalletsPanelExpanded(props: WalletsPanelExpandedProps) {
  return (
    <Flex
      width="calc(7 * var(--banner-height))"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderRight="var(--border)"
      borderColor="border"
    >
      <EthereumWalletPanel
        renegadeConnection={props.renegadeConnection}
        toggleIsCollapsed={props.toggleIsCollapsed}
      />
      <DepositWithdrawButtons />
      <RenegadeWalletPanel toggleIsCollapsed={props.toggleIsCollapsed} />
    </Flex>
  );
}

interface WalletsPanelProps {
  renegadeConnection: RenegadeConnection;
}
interface WalletsPanelState {
  isCollapsed: boolean;
}
export default class WalletsPanel extends React.Component<
  WalletsPanelProps,
  WalletsPanelState
> {
  constructor(props: WalletsPanelProps) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggleIsCollapsed = this.toggleIsCollapsed.bind(this);
  }

  toggleIsCollapsed() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render() {
    return this.state.isCollapsed ? (
      <WalletsPanelCollapsed toggleIsCollapsed={this.toggleIsCollapsed} />
    ) : (
      <WalletsPanelExpanded
        renegadeConnection={this.props.renegadeConnection}
        toggleIsCollapsed={this.toggleIsCollapsed}
      />
    );
  }
}
