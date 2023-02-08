import {
  ArrowDownIcon,
  ArrowUpIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useModal as useModalConnectKit } from "connectkit";
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
import { Panel, expandedPanelWidth } from "./PanelCommon";

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
      padding="0 8% 0 8%"
      color="white.60"
      gap="5px"
      borderBottom="var(--border)"
      borderColor="white.20"
      cursor="pointer"
      filter="grayscale(1)"
      transition="filter 0.1s"
      _hover={{
        filter: "inherit",
        color: "white.90",
      }}
    >
      <Image src={logoUrl} width="25px" height="25px" />
      <Flex
        fontFamily="Favorit"
        flexDirection="column"
        alignItems="flex-start"
        padding="10px 0 10px 0"
        marginLeft="5px"
        flexGrow="1"
      >
        <Text fontSize="1.1em" lineHeight="1">
          {data.formatted.slice(0, 6)} {ADDR_TO_TICKER[props.tokenAddr]}
        </Text>
        <Box fontSize="0.8em" color="white.40" lineHeight="1">
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
      <ArrowDownIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
        _hover={{
          background: "white.10",
        }}
      />
      <ArrowUpIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
        _hover={{
          background: "white.10",
        }}
      />
    </Flex>
  );
}

// Set the scrollbar to hidden after a timeout.
let scrollTimer: NodeJS.Timeout;
function callAfterTimeout(func: () => void, timeout: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
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
        alignItems="center"
        width="100%"
        maxHeight="30vh"
        flexGrow="1"
        overflow="overlay"
        className="scroll hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll");
          if (query) {
            query.classList.remove("hidden");
            callAfterTimeout(() => {
              query.classList.add("hidden");
            }, 400)();
          }
        }}
      >
        {panelBody}
      </Flex>
    </>
  );
}

function DepositWithdrawButtons() {
  return (
    <Flex
      width="100%"
      height="calc(1.5 * var(--banner-height))"
      flexDirection="row"
      borderTop="var(--border)"
      borderBottom="var(--border)"
      borderColor="border"
      cursor="pointer"
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
  const { address } = useAccountWagmi();
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
          opacity={address ? 1 : 0.4}
          cursor={address ? "pointer" : "inherit"}
          onClick={address ? props.onOpenGlobalModal : undefined}
          transition="0.2s"
          _hover={address ? undefined : {}}
        >
          Sign In
        </Button>
        <Text
          marginTop="10px"
          fontSize="0.8em"
          fontWeight="100"
          color={address ? "white.50" : "white.40"}
          textAlign="center"
        >
          {address
            ? "Sign in to create a Renegade account and view your balances."
            : "Connect your Ethereum wallet before signing in."}
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
      width={expandedPanelWidth}
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
  isOpenGlobalModal: boolean;
}
export default function WalletsPanel(props: WalletsPanelProps) {
  const { open } = useModalConnectKit();
  return (
    <Panel
      panelExpanded={(isLocked, toggleIsLocked) => (
        <WalletsPanelExpanded
          renegadeConnection={props.renegadeConnection}
          onOpenGlobalModal={props.onOpenGlobalModal}
          isLocked={isLocked}
          toggleIsLocked={toggleIsLocked}
        />
      )}
      panelCollapsedDisplayTexts={["Ethereum Wallet", "Renegade Wallet"]}
      isOpenGlobalModal={props.isOpenGlobalModal}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  );
}
