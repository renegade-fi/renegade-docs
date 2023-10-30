"use client"

import React from "react"
import Image from "next/image"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ViewEnum } from "@/contexts/Renegade/types"
import { ArrowDownIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { Balance, Exchange } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import {
  useAccount as useAccountWagmi,
  useBalance as useBalanceWagmi,
} from "wagmi"

import {
  ADDR_TO_TICKER,
  KATANA_ADDRESS_TO_TICKER,
  TICKER_TO_LOGO_URL_HANDLE,
} from "@/lib/tokens"
import { getNetwork } from "@/lib/utils"
import { LivePrices } from "@/components/banners/live-price"
import { SignInModal } from "@/components/modals/signin-modal"
import {
  Panel,
  callAfterTimeout,
  expandedPanelWidth,
} from "@/components/panels/panels"
import { renegade } from "@/app/providers"

interface TokenBalanceProps {
  tokenAddr: string
  userAddr?: string
  amount?: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const [logoUrl, setLogoUrl] = React.useState("")
  const ticker =
    getNetwork() === "katana"
      ? KATANA_ADDRESS_TO_TICKER[props.tokenAddr]
      : ADDR_TO_TICKER[props.tokenAddr]
  React.useEffect(() => {
    TICKER_TO_LOGO_URL_HANDLE.then((tickerToLogoUrl) => {
      setLogoUrl(tickerToLogoUrl[ticker])
    })
  }, [ticker])
  const { data } = useBalanceWagmi({
    address: props.userAddr as `0x${string}`,
    token: props.tokenAddr as `0x${string}`,
  })
  let amount = ""
  if (props.userAddr && data && data.value !== BigInt(0)) {
    amount = data.formatted
  }
  if (props.amount !== undefined) {
    amount = props.amount.toString()
  } else {
    // throw new Error("Exactly one of userAddr or amount must be provided.")
  }
  return (
    <Flex
      alignItems="center"
      gap="5px"
      width="100%"
      padding="0 8% 0 8%"
      color="white.60"
      borderColor="white.20"
      borderBottom="var(--border)"
      _hover={{
        filter: "inherit",
        color: "white.90",
      }}
      cursor="pointer"
      transition="filter 0.1s"
      filter="grayscale(1)"
    >
      <Image width="25" height="25" alt="Logo" src={logoUrl} />
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        flexGrow="1"
        marginLeft="5px"
        padding="10px 0 10px 0"
        fontFamily="Favorit"
      >
        <Text fontSize="1.1em" lineHeight="1">
          {amount.slice(0, 6)} {ticker}
        </Text>
        <Box color="white.40" fontSize="0.8em" lineHeight="1">
          <LivePrices
            baseTicker={ticker}
            quoteTicker={"USDC"}
            exchange={Exchange.Median}
            onlyShowPrice
            scaleBy={Number.parseFloat(amount)}
          />
        </Box>
      </Flex>
      {/* <ArrowDownIcon
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
              .deposit(
                accountId,
                new Token({ address: props.tokenAddr }),
                BigInt(1)
              )
              .then(([taskId]) => setTask(taskId, TaskType.Deposit))
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
              .withdraw(
                accountId,
                new Token({ address: props.tokenAddr }),
                BigInt(1)
              )
              .then(([taskId]) => setTask(taskId, TaskType.Withdrawal))
          }
        }}
      /> */}
    </Flex>
  )
}

function DepositWithdrawButtons() {
  const { setView } = useRenegade()
  return (
    <Flex
      flexDirection="row"
      width="100%"
      height="calc(1.5 * var(--banner-height))"
      borderColor="border"
      borderTop="var(--border)"
      borderBottom="var(--border)"
      cursor="pointer"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        gap="5px"
        color="white.90"
        borderColor="border"
        borderRight="var(--border)"
        _hover={{
          color: "white.60",
        }}
        cursor="pointer"
        onClick={() => setView(ViewEnum.DEPOSIT)}
      >
        <Text>Deposit</Text>
        <ArrowDownIcon />
      </Flex>
      {/* <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        gap="5px"
        onClick={() => {
          if (accountId) {
            renegade.task
              .withdraw(
                accountId,
                new Token({ ticker: "USDC", network: getNetwork() }),
                BigInt(1)
              )
              .then(([taskId]) => setTask(taskId, TaskType.Withdrawal))
          }
        }}
      >
        <Text>Withdraw</Text>
        <ArrowUpIcon />
      </Flex> */}
    </Flex>
  )
}

interface RenegadeWalletPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const { address } = useAccountWagmi()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { accountId, balances, setView } = useRenegade()

  let panelBody: React.ReactElement

  if (accountId) {
    const pkSettle =
      renegade.getKeychain(accountId).keyHierarchy.settle.publicKey
    // Serialize pkSettle from Uint8Array to hex string
    const pkSettleHex = Buffer.from(pkSettle).toString("hex")
    panelBody = (
      <>
        {Object.keys(balances).length === 0 && (
          <>
            <Text
              marginTop="20px"
              padding="0 10% 0 10%"
              color="white.50"
              fontSize="0.8em"
              fontWeight="100"
              textAlign="center"
            >
              Deposit tokens into your Renegade account to get started.
            </Text>
            <Flex alignItems="center" height="100%">
              <Button
                onClick={() => setView(ViewEnum.DEPOSIT)}
                variant="wallet-connect"
              >
                Deposit
              </Button>
            </Flex>
          </>
        )}
        {Object.values(balances).map((balance: Balance) =>
          balance.amount ? (
            <Box key={balance.mint.address} width="100%">
              <TokenBalance
                tokenAddr={"0x" + balance.mint.address}
                amount={balance.amount}
              />
            </Box>
          ) : null
        )}
        <Text
          marginTop="auto"
          padding="10%"
          color="white.40"
          fontSize="0.5em"
          fontWeight="100"
          textAlign="start"
          overflowWrap="anywhere"
        >
          Settle Key: 0x{pkSettleHex}
        </Text>
      </>
    )
  } else {
    panelBody = (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flexGrow="1"
      >
        <Button
          padding="0 15% 0 15%"
          opacity={address ? 1 : 0.4}
          _hover={address ? undefined : {}}
          cursor={address ? "pointer" : "inherit"}
          transition="0.2s"
          onClick={() => {
            if (!address) {
              return
            }
            onOpen()
          }}
          variant="wallet-connect"
        >
          Sign In
        </Button>
        <Text
          marginTop="10px"
          padding="0 10% 0 10%"
          color={address ? "white.50" : "white.40"}
          fontSize="0.8em"
          fontWeight="100"
          textAlign="center"
        >
          {address
            ? "Sign in to create a Renegade account and view your balances."
            : "Connect your Ethereum wallet before signing in."}
        </Text>
      </Flex>
    )
  }

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="var(--banner-height)"
        borderColor="border"
        borderBottom="var(--border)"
      >
        <Text>Renegade Account</Text>
        <Flex
          position="absolute"
          left="10px"
          alignItems="center"
          justifyContent="center"
          width="calc(0.6 * var(--banner-height))"
          height="calc(0.6 * var(--banner-height))"
          borderRadius="100px"
          _hover={{
            background: "white.10",
          }}
          cursor="pointer"
          onClick={props.toggleIsLocked}
        >
          {props.isLocked ? (
            <LockIcon boxSize="11px" color="white.80" />
          ) : (
            <UnlockIcon boxSize="11px" color="white.80" />
          )}
        </Flex>
      </Flex>
      <Flex
        className="scroll scroll-renegade-wallet hidden"
        alignItems="center"
        flexDirection="column"
        flexGrow="1"
        overflow="overlay"
        width="100%"
        onWheel={() => {
          const query = document.querySelector(".scroll-renegade-wallet")
          if (query) {
            query.classList.remove("hidden")
            callAfterTimeout(() => {
              query.classList.add("hidden")
            }, 400)()
          }
        }}
      >
        {panelBody}
      </Flex>
      <SignInModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

interface WalletsPanelExpandedProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function WalletsPanelExpanded(props: WalletsPanelExpandedProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      width={expandedPanelWidth}
      borderColor="border"
      borderRight="var(--border)"
      backdropFilter="blur(8px)"
    >
      <RenegadeWalletPanel
        isLocked={props.isLocked}
        toggleIsLocked={props.toggleIsLocked}
      />
      <DepositWithdrawButtons />
    </Flex>
  )
}

export function WalletsPanel() {
  const { open } = useModalConnectKit()
  return (
    <Panel
      panelExpanded={(isLocked, toggleIsLocked) => (
        <WalletsPanelExpanded
          isLocked={isLocked}
          toggleIsLocked={toggleIsLocked}
        />
      )}
      panelCollapsedDisplayTexts={["Renegade Account", "Airdrop"]}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  )
}
