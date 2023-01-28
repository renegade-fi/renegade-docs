import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import {
  useAccount as useAccountWagmi,
  useBalance as useBalanceWagmi,
} from "wagmi";

import { ADDR_TO_TICKER, TICKER_TO_LOGO_URL_HANDLE } from "../../tokens";
import KeyStore from "../connections/KeyStore";
import RenegadeConnection from "../connections/RenegadeConnection";
import KeyStoreContext from "../contexts/KeyStoreContext";
import { LivePrices } from "./BannerCommon";
import { ConnectWalletButton } from "./Header";

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

interface WalletsPanelCollapsedProps {}
function WalletsPanelCollapsed(props: WalletsPanelCollapsedProps) {
  return (
    <Flex
      width="calc(1.5 * var(--banner-height))"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderRight="var(--border)"
      borderColor="border"
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
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function EthereumWalletPanel(props: EthereumWalletPanelProps) {
  const { address } = useAccountWagmi();
  let panelBody: React.ReactElement;
  if (address) {
    panelBody = (
      <>
        <Box height="10px" />
        {Object.keys(ADDR_TO_TICKER).map((tokenAddr) => (
          <TokenBalance
            renegadeConnection={props.renegadeConnection}
            userAddr={address}
            tokenAddr={tokenAddr}
            key={tokenAddr}
          />
        ))}
        <Box height="10px" />
      </>
    );
  } else {
    panelBody = (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
      >
        <ConnectWalletButton />
        <Text
          marginTop="10px"
          fontSize="0.8em"
          fontWeight="100"
          color="white.50"
          textAlign="center"
        >
          Connect your wallet to view your Ethereum token balances.
        </Text>
      </Flex>
    );
  }
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
          left="10px"
          width="calc(0.6 * var(--banner-height))"
          height="calc(0.6 * var(--banner-height))"
          borderRadius="100px"
          onClick={props.toggleIsLocked}
          cursor="pointer"
          _hover={{
            background: "white.10",
          }}
        >
          {props.isLocked ? (
            <LockIcon boxSize="11px" color="white.80" />
          ) : (
            <UnlockIcon boxSize="11px" color="white.80" />
          )}
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        width="100%"
        padding="0 9% 0 9%"
        flexGrow="1"
      >
        {panelBody}
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
  onOpenGlobalModal: () => void;
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const [keyStoreState] = React.useContext(KeyStoreContext);
  let panelBody: React.ReactElement;
  if (KeyStore.isUnpopulated(keyStoreState)) {
    panelBody = (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
      >
        <Button
          variant="wallet-connect"
          padding="0 15% 0 15%"
          onClick={props.onOpenGlobalModal}
        >
          Sign In
        </Button>
        <Text
          marginTop="10px"
          fontSize="0.8em"
          fontWeight="100"
          color="white.50"
          textAlign="center"
        >
          Sign in to create a Renegade account and view your balances.
        </Text>
      </Flex>
    );
  } else {
    const root = keyStoreState.renegadeKeypairs.root.publicKey;
    const match = keyStoreState.renegadeKeypairs.match.publicKey;
    const settle = keyStoreState.renegadeKeypairs.settle.publicKey;
    const view = keyStoreState.renegadeKeypairs.view.publicKey;
    panelBody = (
      <Box fontSize="0.9em" color="white.60">
        <Box height="10px" />
        <Text>rng-root-{root && root.toString("hex").slice(0, 12)}</Text>
        <Text>rng-match-{match && match.toString("hex").slice(0, 12)}</Text>
        <Text>rng-settle-{settle && settle.toString("hex").slice(0, 12)}</Text>
        <Text>rng-view-{view && view.toString("hex").slice(0, 12)}</Text>
      </Box>
    );
  }
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
      >
        Renegade Wallet
      </Flex>
      <Flex
        flexDirection="column"
        width="100%"
        padding="0 9% 0 9%"
        flexGrow="1"
      >
        {panelBody}
      </Flex>
    </>
  );
}

interface WalletsPanelExpandedProps {
  renegadeConnection: RenegadeConnection;
  onOpenGlobalModal: () => void;
  isLocked: boolean;
  toggleIsLocked: () => void;
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
        isLocked={props.isLocked}
        toggleIsLocked={props.toggleIsLocked}
      />
      <DepositWithdrawButtons />
      <RenegadeWalletPanel onOpenGlobalModal={props.onOpenGlobalModal} />
    </Flex>
  );
}

interface WalletsPanelProps {
  renegadeConnection: RenegadeConnection;
  onOpenGlobalModal: () => void;
}
interface WalletsPanelState {
  isCollapsed: boolean;
  isLocked: boolean;
}
export default class WalletsPanel extends React.Component<
  WalletsPanelProps,
  WalletsPanelState
> {
  constructor(props: WalletsPanelProps) {
    super(props);
    this.state = {
      isCollapsed: true,
      isLocked: false,
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.toggleIsLocked = this.toggleIsLocked.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isCollapsed: false,
    });
  }

  onMouseLeave() {
    this.setState({
      isCollapsed: true,
    });
  }

  toggleIsLocked() {
    this.setState({
      isLocked: !this.state.isLocked,
    });
  }

  render() {
    let content: React.ReactElement;
    if (!this.state.isLocked && this.state.isCollapsed) {
      content = <WalletsPanelCollapsed />;
    } else {
      content = (
        <WalletsPanelExpanded
          renegadeConnection={this.props.renegadeConnection}
          onOpenGlobalModal={this.props.onOpenGlobalModal}
          isLocked={this.state.isLocked}
          toggleIsLocked={this.toggleIsLocked}
        />
      );
    }
    return (
      <Flex onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {content}
      </Flex>
    );
  }
}
