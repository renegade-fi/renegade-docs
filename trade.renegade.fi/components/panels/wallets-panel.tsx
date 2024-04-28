"use client"

import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { fundList, fundWallet } from "@/lib/utils"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import { Box, Button, Flex, Spacer, Spinner, Text } from "@chakra-ui/react"
import { tokenMapping } from "@sehyunchung/renegade-react"
import {
  Token,
  formatAmount,
  useBalances,
  useStatus,
  useTaskQueue,
} from "@sehyunchung/renegade-react"
import { useModal as useModalConnectKit } from "connectkit"
import Image from "next/image"
import { useMemo } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { Address } from "viem"
import { useAccount as useAccountWagmi, useWalletClient } from "wagmi"

import { useUSDPrice } from "@/hooks/use-usd-price"

import { Panel, expandedPanelWidth } from "@/components/panels/panels"

interface TokenBalanceProps {
  tokenAddr: Address
  userAddr?: string
  amount: bigint
}
function TokenBalance(props: TokenBalanceProps) {
  const { tokenIcons } = useApp()
  const { setView } = useApp()
  const token = Token.findByAddress(props.tokenAddr)
  const [_, setBase] = useLocalStorage(
    "base",
    Token.findByTicker("WETH").ticker
  )

  const formattedAmount = formatAmount(props.amount, token)
  const ticker = token.ticker
  const usdPrice = useUSDPrice(
    ticker,
    parseFloat(formatAmount(props.amount, token))
  )

  const isZero = props.amount === BigInt(0)

  const { data: walletClient } = useWalletClient()
  const handleAddToWallet = async (address: Address) => {
    if (!walletClient) return
    const token = Token.findByAddress(address)
    await walletClient.watchAsset({
      type: "ERC20",
      options: {
        address,
        decimals: token.decimals || 18,
        // TODO: Deploy new contracts with actual ticker
        symbol: "DUMMY",
      },
    })
  }

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
        cursor="pointer"
        onClick={() => handleAddToWallet(props.tokenAddr)}
      >
        <Text
          fontSize="1.1em"
          lineHeight="1"
          opacity={isZero ? "40%" : undefined}
        >
          {formattedAmount} {ticker}
        </Text>
        <Box
          color="white.40"
          fontSize="0.8em"
          lineHeight="1"
          opacity={!usdPrice ? "40%" : undefined}
        >
          ${usdPrice.toFixed(2)}
        </Box>
      </Flex>
      <ArrowDownIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        cursor="pointer"
        onClick={() => {
          setBase(ticker)
          setView(ViewEnum.DEPOSIT)
        }}
      />
      <ArrowUpIcon
        width="calc(0.5 * var(--banner-height))"
        height="calc(0.5 * var(--banner-height))"
        borderRadius="100px"
        cursor="pointer"
        onClick={() => {
          setBase(token.ticker)
          setView(ViewEnum.WITHDRAW)
        }}
      />
    </Flex>
  )
}

function DepositWithdrawButtons() {
  const { address } = useAccountWagmi()
  return (
    <Flex
      flexDirection="row"
      width="100%"
      minHeight="var(--banner-height)"
      color="white.60"
      borderColor="border"
      borderTop="var(--border)"
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
        <ArrowDownIcon />
      </Flex>
      {/* <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        gap="5px"
        _hover={{
          backgroundColor: "#000",
        }}
        onClick={onOpenAirdropModal}
      >
        <Text>Airdrop</Text>
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
  const { setView } = useApp()
  const balances = useBalances()
  const status = useStatus()
  const isConnected = status === "in relayer"
  const isSigningIn =
    status === "creating wallet" ||
    status === "looking up" ||
    status === "connecting"

  const formattedBalances = useMemo<Array<[Address, bigint]>>(() => {
    const wethAddress = Token.findByTicker("WETH").address
    const usdcAddress = Token.findByTicker("USDC").address

    const nonzero: Array<[Address, bigint]> = Object.entries(balances).map(
      ([_, b]) => [b.mint, b.amount]
    )
    const placeholders: Array<[Address, bigint]> = tokenMapping.tokens
      .filter((t) => !nonzero.some(([a]) => a === t.address))
      .map((t) => [t.address as Address, BigInt(0)])

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

  const showDeposit = useMemo(() => {
    return !Object.values(balances).some((b) => b.amount > BigInt(0))
  }, [balances])

  const Content = useMemo(() => {
    if (isConnected && !showDeposit) {
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
        >
          <ConnectWalletButton />
          <SignInButton />
          {isConnected && (
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
            color={address ? "white.50" : "white.40"}
            fontSize="0.8em"
            fontWeight="100"
            textAlign="center"
          >
            {isConnected
              ? "Deposit tokens into your Renegade Account to get started."
              : address
              ? "Sign in to create a Renegade account and view your balances."
              : "Connect your Ethereum wallet before signing in."}
          </Text>
        </Flex>
      )
    }
  }, [
    address,
    formattedBalances,
    isConnected,
    isSigningIn,
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
  const status = useStatus()
  const tasks = useTaskQueue()
  const Content = useMemo(() => {
    return (
      <SimpleBar
        style={{
          minHeight: "30vh",
          width: "100%",
        }}
      >
        {tasks
          .filter((task) => !task.description.includes("Fee"))
          .map((task) => {
            const textColor = task.state === "Completed" ? "green" : "white"

            const rightIcon =
              task.state === "Completed" ? (
                <CheckIcon color="white.60" height="4" />
              ) : task.state === "Queued" ? (
                <></>
              ) : (
                <Spinner color="white.60" size="xs" />
              )
            return (
              <Flex
                key={task.id}
                alignItems="center"
                flexDirection="row"
                width="100%"
                padding="4%"
                borderColor="white.20"
                borderBottom="var(--secondary-border)"
              >
                <Flex flexDirection="column">
                  <Flex alignItems="center" gap="2">
                    <Text
                      color={textColor}
                      fontFamily="Favorit Extended"
                      fontWeight="500"
                    >
                      {task.description}
                    </Text>
                    <Text
                      color="white.60"
                      fontFamily="Favorit Expanded"
                      fontSize="0.7em"
                      fontWeight="500"
                    >
                      a few seconds ago
                    </Text>
                  </Flex>
                  <Flex alignItems="center" gap="2">
                    {task.state !== "Completed" && <>{rightIcon}</>}
                    <Text color="white.80" fontSize="0.8em">
                      {task.state}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )
          })}
      </SimpleBar>
    )
  }, [tasks])

  if (status !== "in relayer") return null

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
