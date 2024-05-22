"use client"

import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import {
  AIRDROP_TOOLTIP,
  RENEGADE_ACCOUNT_TOOLTIP,
  TASK_HISTORY_TOOLTIP,
} from "@/lib/tooltip-labels"
import { formatNumber, fundList, fundWallet } from "@/lib/utils"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Circle,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
} from "@chakra-ui/react"
import {
  Token,
  formatAmount,
  tokenMapping,
  useBalances,
  useStatus,
  useTaskHistory,
} from "@renegade-fi/react"
import { useModal as useModalConnectKit } from "connectkit"
import Image from "next/image"
import numeral from "numeral"
import { useMemo } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { Address } from "viem"
import { useAccount as useAccountWagmi } from "wagmi"

import { useUSDPrice } from "@/hooks/use-usd-price"

import { EmptyBalanceItem } from "@/components/panels/empty-balance-item"
import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { TaskHistoryList } from "@/components/panels/task-history-list"

import { Tooltip } from "../tooltip"

interface TokenBalanceProps {
  tokenAddr: Address
  userAddr?: string
  amount: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const { setView, tokenIcons } = useApp()
  const token = Token.findByAddress(props.tokenAddr)
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })

  const formattedAmount = formatNumber(props.amount, token.decimals)
  const ticker = token.ticker
  const usdPrice = useUSDPrice(
    ticker,
    parseFloat(formatAmount(props.amount, token))
  )
  const formattedUsdPrice = numeral(usdPrice).format("$0.00")

  const isZero = props.amount === BigInt(0)

  const handleClick = () => {
    setBase(ticker)
    setView(ViewEnum.TRADING)
  }
  return (
    <Flex
      alignItems="center"
      gap="5px"
      width="100%"
      padding="5% 6%"
      color="text.secondary"
      borderBottom="var(--secondary-border)"
      boxSizing="border-box"
      filter={isZero ? "grayscale(1)" : undefined}
    >
      <Image width="25" height="25" alt="Logo" src={tokenIcons[ticker]} />
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        flexGrow="1"
        marginLeft="5px"
        fontFamily="Favorit"
        lineHeight="1"
        cursor="pointer"
        onClick={handleClick}
      >
        <Tooltip
          label={
            !isZero
              ? `${formatNumber(props.amount, token.decimals, true)} ${ticker}`
              : undefined
          }
        >
          <Text fontSize="1.1em" opacity={isZero ? "40%" : undefined}>
            {formattedAmount} {ticker}
          </Text>
        </Tooltip>
        <Box
          color="text.muted"
          fontSize="0.8em"
          opacity={!usdPrice ? "40%" : undefined}
        >
          {formattedUsdPrice}
        </Box>
      </Flex>
      <Tooltip label="Deposit">
        <ArrowDownIcon
          transition="color 0.3s ease"
          color="text.secondary"
          _hover={{
            color: "text.muted",
          }}
          width="calc(0.5 * var(--banner-height))"
          height="calc(0.5 * var(--banner-height))"
          cursor="pointer"
          onClick={() => {
            setBase(ticker)
            setView(ViewEnum.DEPOSIT)
          }}
        />
      </Tooltip>
      <Tooltip label="Withdraw">
        <ArrowUpIcon
          transition="color 0.3s ease"
          color="text.secondary"
          _hover={{
            color: "text.muted",
          }}
          width="calc(0.5 * var(--banner-height))"
          height="calc(0.5 * var(--banner-height))"
          borderRadius="100px"
          cursor="pointer"
          onClick={() => {
            setBase(token.ticker)
            setView(ViewEnum.WITHDRAW)
          }}
        />
      </Tooltip>
    </Flex>
  )
}

function DepositWithdrawButtons() {
  const { address } = useAccountWagmi()
  return (
    <Tooltip placement="right" label={AIRDROP_TOOLTIP}>
      <Flex
        flexDirection="row"
        width="100%"
        minHeight="var(--banner-height)"
        borderColor="border"
        borderTop="var(--border)"
        cursor="pointer"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          flexGrow="1"
          gap="5px"
          color="text.primary"
          borderRight="var(--border)"
          _hover={{
            backgroundColor: "#000",
            color: "text.muted",
          }}
          cursor="pointer"
          // transition="color 0.3s ease"
          onClick={() => {
            if (!address) return

            toast.promise(
              fundWallet(
                [
                  { ticker: "WETH", amount: "10" },
                  { ticker: "USDC", amount: "1000000" },
                ],
                address
              ),
              {
                loading: "Funding account...",
                success: "Your account has been funded with test funds.",
                error:
                  "Funding failed: An unexpected error occurred. Please try again.",
              }
            )

            // Fund additional wallets in background
            fundWallet(fundList, address)
          }}
        >
          <Text>Airdrop</Text>
          <ArrowDownIcon transition="color 0.3s ease" />
        </Flex>
      </Flex>
    </Tooltip>
  )
}

interface RenegadeWalletPanelProps {
  isLocked: boolean
  toggleIsLocked: () => void
}
function RenegadeWalletPanel(props: RenegadeWalletPanelProps) {
  const { address } = useAccountWagmi()
  const { setView } = useApp()
  const balances = useBalances()
  const status = useStatus()
  const isConnected = status === "in relayer"
  const isSigningIn =
    status === "creating wallet" ||
    status === "looking up" ||
    status === "connecting"

  const formattedBalances = useMemo(() => {
    const wethAddress = Token.findByTicker("WETH").address
    const usdcAddress = Token.findByTicker("USDC").address

    balances.sort((a, b) => {
      if (a.mint === wethAddress) return -1
      if (b.mint === wethAddress) return 1
      if (a.mint === usdcAddress) return -1
      if (b.mint === usdcAddress) return 1
      return 0
    })

    const placeholders = Array.from({ length: 5 - balances.length }, () => ({
      mint: "" as Address,
      amount: BigInt(0),
    }))

    return [...balances, ...placeholders]
  }, [balances])

  const Content = useMemo(() => {
    if (isConnected && balances.length) {
      return (
        <>
          <SimpleBar
            style={{
              width: "100%",
              height: "calc(100% - 30vh - (3 * var(--banner-height)))",
              padding: "0 8px",
            }}
          >
            {formattedBalances.map((balance) => {
              if (!balance.mint) return <EmptyBalanceItem />
              return (
                <TokenBalance
                  key={balance.mint}
                  tokenAddr={balance.mint}
                  amount={balance.amount}
                />
              )
            })}
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
          minHeight="calc(100% - 30vh - (3 * var(--banner-height)))"
        >
          {!address ? (
            <ConnectWalletButton />
          ) : !isConnected ? (
            <SignInButton />
          ) : (
            <Button
              padding="0 15% 0 15%"
              onClick={() => {
                setView(ViewEnum.DEPOSIT)
              }}
              variant="wallet-connect"
            >
              <Text>
                {isConnected
                  ? "Deposit"
                  : isSigningIn
                  ? "Signing In"
                  : "Sign In"}
              </Text>
            </Button>
          )}
          <Text
            marginTop="10px"
            padding="0 10% 0 10%"
            color="text.secondary"
            fontSize="0.8em"
            fontWeight="100"
            textAlign="center"
          >
            {isConnected
              ? "Deposit tokens into your Renegade Wallet to get started."
              : address
              ? "Sign in to create a Renegade Wallet and view your balances."
              : "Connect your Ethereum wallet before signing in."}
          </Text>
        </Flex>
      )
    }
  }, [
    address,
    balances.length,
    formattedBalances,
    isConnected,
    isSigningIn,
    setView,
  ])

  return (
    <>
      <Tooltip placement="right" label={RENEGADE_ACCOUNT_TOOLTIP}>
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          width="100%"
          minHeight="var(--banner-height)"
          borderColor="border"
          borderBottom="var(--border)"
        >
          <Text color="text.primary">Renegade Wallet</Text>
          <Flex
            position="absolute"
            top="12px"
            left="29px"
            alignItems="center"
            color="text.primary"
            _hover={{
              color: "text.secondary",
            }}
            cursor="pointer"
            transition="color 0.3s ease"
            onClick={props.toggleIsLocked}
          >
            {props.isLocked ? (
              <LockIcon boxSize="11px" />
            ) : (
              <UnlockIcon boxSize="11px" />
            )}
          </Flex>
        </Flex>
      </Tooltip>
      {Content}
    </>
  )
}

function HistorySection() {
  const history = useTaskHistory()
  const historyWithoutNewWallet = history.filter(
    (task) => task.task_info.task_type !== "NewWallet"
  )
  const balances = useBalances()
  if (!historyWithoutNewWallet.length && !balances.length) return null
  return (
    <>
      <Tooltip placement="right" label={TASK_HISTORY_TOOLTIP}>
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
          <Text color="text.primary">Task History</Text>
        </Flex>
      </Tooltip>
      <SimpleBar
        style={{
          height: "30vh",
          width: "100%",
          padding: "0 8px",
        }}
      >
        <TaskHistoryList />
      </SimpleBar>
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
      panelCollapsedDisplayTexts={["Renegade Wallet", "History"]}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  )
}
