"use client"

import { useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ArrowDownIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, HStack, Spacer, Text } from "@chakra-ui/react"
import { useModal as useModalConnectKit } from "connectkit"
import SimpleBar from "simplebar-react"
import { useAccount as useAccountWagmi } from "wagmi"

import { DISPLAYED_TICKERS } from "@/lib/tokens"
import { findBalanceByTicker, getTickerFromToken, getToken } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { useUSDPrice } from "@/hooks/use-usd-price"
import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"

import "simplebar-react/dist/simplebar.min.css"

interface TokenBalanceProps {
  tokenAddr: string
  userAddr?: string
  amount: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const { tokenIcons } = useApp()
  const { setView } = useApp()
  const router = useRouter()

  const ticker = getTickerFromToken(getToken({ address: props.tokenAddr }))
  const usdPrice = useUSDPrice(ticker, Number(props.amount))

  const isZero = props.amount === BigInt(0)

  return (
    <Flex
      alignItems="center"
      gap="5px"
      width="100%"
      padding="0 8% 0 8%"
      color="white.60"
      borderColor="white.20"
      borderBottom="var(--secondary-border)"
      boxSizing="border-box"
      transition="filter 0.1s"
      filter={isZero ? "grayscale(1)" : undefined}
    >
      <Image width="25" height="25" alt="Logo" src={tokenIcons[ticker]} />
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        flexGrow="1"
        marginLeft="5px"
        padding="10px 0 10px 0"
        fontFamily="Favorit"
      >
        <Text
          fontSize="1.1em"
          lineHeight="1"
          opacity={isZero ? "40%" : undefined}
        >
          {props.amount.toString()} {ticker}
        </Text>
        <Box
          color="white.40"
          fontSize="0.8em"
          lineHeight="1"
          opacity={usdPrice === "0.00" ? "40%" : undefined}
        >
          ${usdPrice}
        </Box>
      </Flex>
      <ArrowDownIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        cursor="pointer"
        onClick={() => {
          router.replace(`/${ticker}/USDC`)
          setView(ViewEnum.DEPOSIT)
        }}
      />
      {/* <ArrowUpIcon
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
  const { setView } = useApp()
  const { accountId } = useRenegade()
  if (!accountId) return null
  return (
    <Box
      display="grid"
      width="100%"
      height="calc(1.5 * var(--banner-height))"
      color="white.60"
      borderColor="border"
      borderTop="var(--border)"
      _hover={{
        color: "white.90",
      }}
      cursor="pointer"
      onClick={() => setView(ViewEnum.DEPOSIT)}
      placeContent="center"
    >
      <HStack gap="4px">
        <Text>Deposit</Text>
        <ArrowDownIcon />
      </HStack>
    </Box>
  )
}

interface RenegadeWalletPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const { address } = useAccountWagmi()
  const { isSigningIn, setView } = useApp()
  const balances = useBalance()
  const { accountId } = useRenegade()

  const placeholderBalances = useMemo(() => {
    const result: [string, bigint][] = []
    for (const [base] of DISPLAYED_TICKERS) {
      const bal = findBalanceByTicker(balances, base)
      const address = getToken({ ticker: base }).address
      result.push([address, bal.amount])
    }
    return result
  }, [balances])

  const showDeposit = useMemo(() => {
    return !placeholderBalances.some(([_, bal]) => bal > BigInt(0))
  }, [placeholderBalances])

  const Content = useMemo(() => {
    if (accountId && !showDeposit) {
      return (
        <>
          <SimpleBar
            style={{
              height: "calc(100% - (2.5 * var(--banner-height)))",
              width: "100%",
              padding: "0 8px",
            }}
          >
            {placeholderBalances.map(([address, amount]) => (
              <Box key={address} width="100%">
                <TokenBalance tokenAddr={"0x" + address} amount={amount} />
              </Box>
            ))}
          </SimpleBar>
          <Spacer />
        </>
      )
    } else {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          flexGrow="1"
        >
          <ConnectWalletButton />
          <SignInButton />
          {accountId && (
            <Button
              padding="0 15% 0 15%"
              onClick={() => {
                setView(ViewEnum.DEPOSIT)
              }}
              variant="wallet-connect"
            >
              <Text>
                {accountId ? "Deposit" : isSigningIn ? "Signing In" : "Sign In"}
              </Text>
            </Button>
          )}
          <Text
            marginTop="10px"
            padding="0 10% 0 10%"
            color={address ? "white.50" : "white.40"}
            fontSize="0.8em"
            fontWeight="100"
            textAlign="center"
          >
            {accountId
              ? "Deposit tokens into your Renegade Account to get started."
              : address
              ? "Sign in to create a Renegade account and view your balances."
              : "Connect your Ethereum wallet before signing in."}
          </Text>
        </Flex>
      )
    }
  }, [
    accountId,
    address,
    isSigningIn,
    placeholderBalances,
    setView,
    showDeposit,
  ])

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        minHeight="var(--banner-height)"
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
      {Content}
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
      flexDirection="column"
      width={expandedPanelWidth}
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
      panelCollapsedDisplayTexts={["Renegade Account", "Deposit"]}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  )
}
