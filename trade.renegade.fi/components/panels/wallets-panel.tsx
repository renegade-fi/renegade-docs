"use client"

import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react"
import { useModal as useModalConnectKit } from "connectkit"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import SimpleBar from "simplebar-react"
import { useAccount, useAccount as useAccountWagmi } from "wagmi"

import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"
import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { useBalance } from "@/hooks/use-balance"
import { useUSDPrice } from "@/hooks/use-usd-price"

import { TaskType } from "@/contexts/Renegade/types"
import { Token } from "@renegade-fi/renegade-js"
import "simplebar-react/dist/simplebar.min.css"

import { renegade } from "@/app/providers"

interface TokenBalanceProps {
  tokenAddr: string
  userAddr?: string
  amount: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const { tokenIcons } = useApp()
  const { setView } = useApp()
  const router = useRouter()
  const { setTask, accountId } = useRenegade()
  const { address } = useAccount()

  const ticker = Token.findTickerByAddress(`${props.tokenAddr}`)
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
      <ArrowUpIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
        onClick={() => {
          if (accountId && address) {
            renegade.task
              .withdraw(
                accountId,
                new Token({ address: props.tokenAddr }),
                BigInt(1),
                address
              )
              .then(([taskId]) => setTask(taskId, TaskType.Withdrawal))
          }
        }}
      />
    </Flex>
  )
}

function DepositWithdrawButtons() {
  const { onOpenAirdropModal, setView } = useApp()
  const { accountId } = useRenegade()
  if (!accountId) return null
  return (
    <Flex
      flexDirection="row"
      width="100%"
      height="calc(1.5 * var(--banner-height))"
      color="white.60"
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
          backgroundColor: "#000",
        }}
        cursor="pointer"
        onClick={() => setView(ViewEnum.DEPOSIT)}
      >
        <Text>Deposit</Text>
        <ArrowDownIcon />
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        gap="5px"
        _hover={{
          backgroundColor: "#000"
        }}
        onClick={onOpenAirdropModal}
      >
        <Text>Airdrop</Text>
        <ArrowUpIcon />
      </Flex>
    </Flex>
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

  // const placeholderBalances = useMemo(() => {
  //   const result: [string, bigint][] = []
  //   for (const { ticker: base } of tokenMappings.tokens) {
  //     const bal = findBalanceByTicker(balances, base)
  //     const address = getToken({ ticker: base }).address
  //     result.push([address, bal.amount])
  //   }
  //   return result
  // }, [balances])
  const formattedBalances: Array<[string, bigint]> = useMemo(() => {
    return Object.entries(balances).map(([_, b]) => [
      b.mint.address,
      b.amount,
    ])
  }, [balances])

  const showDeposit = useMemo(() => {
    return !formattedBalances.some(([_, bal]) => bal > BigInt(0))
  }, [formattedBalances])
  // const balancesToShow = useMemo(() => {
  //   const result: Array<[string, bigint]> = []
  //   for (const b of Object.values(balances)) {
  //     result.push([b.mint.address, b.amount])
  //   }
  //   for (const [base] of DISPLAYED_TICKERS) {
  //     if (result.length >= 5) break
  //     if (
  //       !result.some(
  //         ([address]) => address === getToken({ ticker: base }).address
  //       )
  //     ) {
  //       result.push([getToken({ ticker: base }).address, BigInt(0)])
  //     }
  //   }
  //   return result
  // }, [balances])

  // const showDeposit = useMemo(() => {
  //   return !balancesToShow.some(([_, bal]) => bal > BigInt(0))
  // }, [balancesToShow])

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
            {formattedBalances.map(([address, amount]) => (
              // {balancesToShow.map(([address, amount]) => (
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
    formattedBalances,
    // balancesToShow,
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

function HistorySection() {
  const { accountId } = useRenegade()

  const Content = useMemo(() => {
    if (true) {
      return (
        <Flex alignItems="center" height="30vh">
          <Text
            margin="auto"
            padding="0 10%"
            color="white.50"
            fontSize="0.8em"
            fontWeight="100"
            textAlign="center"
          >
            Deposit your first tokens to see your history.
          </Text>
        </Flex>
      )
    }
  }, [])

  if (!accountId) return null

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        minHeight="var(--banner-height)"
        borderColor="border"
        borderTop="var(--border)"
        borderBottom="var(--border)"
      >
        <Text>History</Text>
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
      <HistorySection />
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
      panelCollapsedDisplayTexts={["Renegade Account", "History"]}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  )
}
