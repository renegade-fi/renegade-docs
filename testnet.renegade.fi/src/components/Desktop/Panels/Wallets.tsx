import {
  ArrowDownIcon,
  ArrowUpIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { Balance, Exchange, Token } from "@renegade-fi/renegade-js";
import { useModal as useModalConnectKit } from "connectkit";
import React from "react";
import {
  useAccount as useAccountWagmi,
  useBalance as useBalanceWagmi,
} from "wagmi";

import { renegade } from "../../..";
import { ADDR_TO_TICKER, TICKER_TO_LOGO_URL_HANDLE } from "../../../../tokens";
import RenegadeContext, { TaskType } from "../../../contexts/RenegadeContext";
import { LivePrices } from "../../Common/Banner";
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "../../Common/Panel";
import { GlobalModalState } from "../GlobalModal";
import { ConnectWalletButton } from "../Header";

interface TokenBalanceProps {
  tokenAddr: string;
  userAddr?: string;
  amount?: bigint;
}
function TokenBalance(props: TokenBalanceProps) {
  const { accountId, setTask } = React.useContext(RenegadeContext);
  const [logoUrl, setLogoUrl] = React.useState("DEFAULT.png");
  React.useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setLogoUrl(tickerToLogoUrl[ADDR_TO_TICKER[props.tokenAddr]]);
    });
  });
  let amount: string;
  if (props.amount !== undefined) {
    amount = props.amount.toString();
  } else if (props.userAddr) {
    const { data } = useBalanceWagmi({
      addressOrName: props.userAddr,
      token: props.tokenAddr,
    });
    if (!data || data.value.isZero()) {
      return null;
    }
    amount = data.formatted;
  } else {
    throw new Error("Exactly one of userAddr or amount must be provided.");
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
          {amount.slice(0, 6)} {ADDR_TO_TICKER[props.tokenAddr]}
        </Text>
        <Box fontSize="0.8em" color="white.40" lineHeight="1">
          <LivePrices
            baseTicker={ADDR_TO_TICKER[props.tokenAddr]}
            quoteTicker={"USDC"}
            exchange={Exchange.Median}
            onlyShowPrice
            scaleBy={Number.parseFloat(amount)}
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
        onClick={() => {
          if (accountId) {
            renegade.task
              .deposit(accountId, new Token({ address: props.tokenAddr }), 10n)
              .then(([taskId]) => setTask(taskId, TaskType.Deposit));
          }
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
        onClick={() => {
          if (accountId) {
            renegade.task
              .withdraw(accountId, new Token({ address: props.tokenAddr }), 10n)
              .then(([taskId]) => setTask(taskId, TaskType.Withdrawal));
          }
        }}
      />
    </Flex>
  );
}

interface EthereumWalletPanelProps {
  isLocked: boolean;
  toggleIsLocked: () => void;
}
function EthereumWalletPanel(props: EthereumWalletPanelProps) {
  const { address } = useAccountWagmi();
  let panelBody: React.ReactElement;

  if (address) {
    panelBody = (
      <>
        {Object.keys(ADDR_TO_TICKER).map((tokenAddr) => (
          <Box width="100%" key={tokenAddr}>
            <TokenBalance tokenAddr={tokenAddr} userAddr={address} />
          </Box>
        ))}
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
        className="scroll scroll-eth-wallet hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll-eth-wallet");
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
  const { accountId, setTask } = React.useContext(RenegadeContext);
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
        onClick={() => {
          if (accountId) {
            renegade.task
              .deposit(accountId, new Token({ ticker: "USDC" }), 10n)
              .then(([taskId]) => setTask(taskId, TaskType.Deposit));
          }
        }}
      >
        <Text>Deposit</Text>
        <ArrowDownIcon />
      </Flex>
      <Flex
        justifyContent="center"
        gap="5px"
        alignItems="center"
        flexGrow="1"
        onClick={() => {
          if (accountId) {
            renegade.task
              .withdraw(accountId, new Token({ ticker: "USDC" }), 20n)
              .then(([taskId]) => setTask(taskId, TaskType.Withdrawal));
          }
        }}
      >
        <Text>Withdraw</Text>
        <ArrowUpIcon />
      </Flex>
    </Flex>
  );
}

interface RenegadeWalletPanelProps {
  onOpenGlobalModal: () => void;
  setGlobalModalState: (state: GlobalModalState) => void;
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const { address } = useAccountWagmi();
  const { balances, accountId } = React.useContext(RenegadeContext);
  let panelBody: React.ReactElement;

  if (accountId) {
    const pkSettle =
      renegade.getKeychain(accountId).keyHierarchy.settle.publicKey;
    // Serialize pkSettle from Uint8Array to hex string
    const pkSettleHex = Buffer.from(pkSettle).toString("hex");
    panelBody = (
      <>
        {Object.keys(balances).length === 0 && (
          <Text
            marginTop="20px"
            padding="0 10% 0 10%"
            fontSize="0.8em"
            fontWeight="100"
            color="white.50"
            textAlign="center"
          >
            No tokens have been deposited into Renegade.
          </Text>
        )}
        {Object.values(balances).map((balance: Balance) =>
          balance.amount ? (
            <Box width="100%" key={balance.mint.address}>
              <TokenBalance
                tokenAddr={"0x" + balance.mint.address}
                amount={balance.amount}
              />
            </Box>
          ) : null,
        )}
        <Text
          marginTop="auto"
          fontSize="0.5em"
          padding="10%"
          textAlign="start"
          fontWeight="100"
          overflowWrap="anywhere"
          color="white.40"
        >
          Settle Key: 0x{pkSettleHex}
        </Text>
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
        <Button
          variant="wallet-connect"
          padding="0 15% 0 15%"
          opacity={address ? 1 : 0.4}
          cursor={address ? "pointer" : "inherit"}
          onClick={() => {
            if (!address) {
              return;
            }
            props.setGlobalModalState("sign-in");
            props.onOpenGlobalModal();
          }}
          transition="0.2s"
          _hover={address ? undefined : {}}
        >
          Sign In
        </Button>
        <Text
          marginTop="10px"
          padding="0 10% 0 10%"
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
        alignItems="center"
        width="100%"
        maxHeight="30vh"
        flexGrow="1"
        overflow="overlay"
        className="scroll scroll-renegade-wallet hidden"
        onWheel={() => {
          const query = document.querySelector(".scroll-renegade-wallet");
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

interface WalletsPanelExpandedProps {
  onOpenGlobalModal: () => void;
  setGlobalModalState: (state: GlobalModalState) => void;
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
        isLocked={props.isLocked}
        toggleIsLocked={props.toggleIsLocked}
      />
      <DepositWithdrawButtons />
      <RenegadeWalletPanel
        onOpenGlobalModal={props.onOpenGlobalModal}
        setGlobalModalState={props.setGlobalModalState}
      />
    </Flex>
  );
}

interface WalletsPanelProps {
  onOpenGlobalModal: () => void;
  isOpenGlobalModal: boolean;
  setGlobalModalState: (state: GlobalModalState) => void;
}
export default function WalletsPanel(props: WalletsPanelProps) {
  const { open } = useModalConnectKit();
  return (
    <Panel
      panelExpanded={(isLocked, toggleIsLocked) => (
        <WalletsPanelExpanded
          onOpenGlobalModal={props.onOpenGlobalModal}
          setGlobalModalState={props.setGlobalModalState}
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
