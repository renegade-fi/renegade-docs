"use client"

import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { DISPLAY_TOKENS } from "@/lib/tokens"
import {
  FAUCET_TOOLTIP,
  RENEGADE_ACCOUNT_TOOLTIP,
  TASK_HISTORY_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Direction } from "@/lib/types"
import { formatNumber, fundList, fundWallet } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react"
import {
  Token,
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
import { useAccount as useAccountWagmi } from "wagmi"

import { useUSDPrice } from "@/hooks/use-usd-price"

import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { TaskHistoryList } from "@/components/panels/task-history-list"

import { Tooltip } from "../tooltip"

interface TokenBalanceProps {
  tokenAddr: `0x${string}`
  userAddr?: string
  amount: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const { setView, tokenIcons } = useApp()
  const token = Token.findByAddress(props.tokenAddr)
  const [, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [, setDirection] = useLocalStorage("direction", Direction.BUY, {
    initializeWithValue: false,
  })

  const formattedAmount = formatNumber(props.amount, token.decimals)
  const ticker = token.ticker
  const usdPrice = useUSDPrice(token, props.amount)
  const formattedUsdPrice = numeral(usdPrice).format("$0.00")

  const isZero = props.amount === BigInt(0)

  const handleClick = () => {
    if (ticker === "USDC") {
      setDirection(Direction.BUY)
    } else {
      setBase(ticker)
    }
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
    <Tooltip placement="right" label={FAUCET_TOOLTIP}>
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
          cursor="pointer"
          onClick={() => {
            if (!address) {
              toast.error("Please connect your wallet to fund your account.")
              return
            }

            toast.promise(fundWallet(fundList.slice(0, 2), address), {
              loading: "Funding account...",
              success: "Successfully funded account.",
              error:
                "Funding failed: An unexpected error occurred. Please try again.",
            })

            // Fund additional wallets in background
            fundWallet(fundList.slice(2), address)
          }}
        >
          <Text>Faucet</Text>
          <ArrowDownIcon transition="color 0.3s ease" />
        </Flex>
      </Flex>
    </Tooltip>
  )
}

function RenegadeWalletPanel() {
  const { address } = useAccountWagmi()
  const { setView } = useApp()
  const balances = useBalances()
  const status = useStatus()
  const isConnected = status === "in relayer"
  const isSigningIn =
    status === "creating wallet" ||
    status === "looking up" ||
    status === "connecting"

  const formattedBalances = useMemo<Array<[`0x${string}`, bigint]>>(() => {
    const wethAddress = Token.findByTicker("WETH").address
    const usdcAddress = Token.findByTicker("USDC").address

    const nonzero: Array<[`0x${string}`, bigint]> = Array.from(
      balances.values()
    ).map((b) => [b.mint, b.amount])
    const placeholders: Array<[`0x${string}`, bigint]> = DISPLAY_TOKENS()
      .filter((t) => !nonzero.some(([a]) => a === t.address))
      .map((t) => [t.address as `0x${string}`, BigInt(0)])

    const combined = [...nonzero, ...placeholders]

    combined.sort((a, b) => {
      if (a[0] === wethAddress) return -1
      if (b[0] === wethAddress) return 1
      if (a[0] === usdcAddress) return -1
      if (b[0] === usdcAddress) return 1
      return 0
    })

    return combined
  }, [balances])

  const Content = useMemo(() => {
    if (isConnected && balances.size) {
      return (
        <>
          <SimpleBar
            style={{
              width: "100%",
              height: "calc(100% - 30vh - (3 * var(--banner-height)))",
              padding: "0 8px",
            }}
          >
            {formattedBalances.map(([address, amount]) => (
              <Box key={address} width="100%">
                <TokenBalance tokenAddr={address} amount={amount} />
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
    balances.size,
    formattedBalances,
    isConnected,
    isSigningIn,
    setView,
  ])

  return (
    <>
      <Tooltip placement="right" label={RENEGADE_ACCOUNT_TOOLTIP}>
        <Box
          display="grid"
          height="var(--banner-height)"
          color="text.primary"
          borderBottom="var(--border)"
          placeContent="center"
        >
          <Text>Renegade Wallet</Text>
        </Box>
      </Tooltip>
      {Content}
    </>
  )
}

function HistorySection() {
  const status = useStatus()
  const { data } = useTaskHistory()
  const taskHistory = Array.from(data?.values() || []).filter(
    (task) => task.task_info.task_type !== "NewWallet"
  )
  const balances = useBalances()
  if (status !== "in relayer") return null
  if (!taskHistory.length && !balances.size) return null
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

function WalletsPanelExpanded() {
  return (
    <Flex
      flexDirection="column"
      width={expandedPanelWidth}
      borderRight="var(--border)"
      backdropFilter="blur(8px)"
    >
      <RenegadeWalletPanel />
      <HistorySection />
      <DepositWithdrawButtons />
    </Flex>
  )
}

export function WalletsPanel() {
  const { open } = useModalConnectKit()
  return (
    <Panel
      panelExpanded={() => <WalletsPanelExpanded />}
      panelCollapsedDisplayTexts={["Renegade Wallet", "History"]}
      isOpenConnectKitModal={open}
      flipDirection={false}
    />
  )
}
