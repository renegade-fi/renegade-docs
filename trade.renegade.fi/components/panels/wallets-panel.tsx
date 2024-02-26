"use client"

import { useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskState, TaskType } from "@/contexts/Renegade/types"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import { Box, Button, Flex, Spacer, Spinner, Text } from "@chakra-ui/react"
import { Token, tokenMappings } from "@renegade-fi/renegade-js"
import { useModal as useModalConnectKit } from "connectkit"
import SimpleBar from "simplebar-react"
import { useAccount, useAccount as useAccountWagmi } from "wagmi"

import { useBalance } from "@/hooks/use-balance"
import { useUSDPrice } from "@/hooks/use-usd-price"
import { Panel, expandedPanelWidth } from "@/components/panels/panels"
import { ConnectWalletButton, SignInButton } from "@/app/(desktop)/main-nav"

import "simplebar-react/dist/simplebar.min.css"
import { useTasks } from "@/hooks/use-tasks"
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
  const { setView } = useApp()
  const { accountId } = useRenegade()
  if (!accountId) return null
  return (
    <Flex
      flexDirection="row"
      width="100%"
      minHeight="var(--banner-height)"
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
  const { isSigningIn, setView } = useApp()
  const balances = useBalance()
  const { accountId } = useRenegade()

  const formattedBalances = useMemo<Array<[string, bigint]>>(() => {
    const wethAddress = Token.findAddressByTicker("WETH").replace("0x", "")
    const usdcAddress = Token.findAddressByTicker("USDC").replace("0x", "")

    const nonzero: Array<[string, bigint]> = Object.entries(balances).map(
      ([_, b]) => [b.mint.address, b.amount]
    )
    const placeholders: Array<[string, bigint]> = tokenMappings.tokens
      .filter((t) => !nonzero.some(([a]) => `0x${a}` === t.address))
      .map((t) => [t.address.replace("0x", ""), BigInt(0)])

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
    if (accountId && !showDeposit) {
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
  }, [accountId, address, isSigningIn, formattedBalances, setView, showDeposit])

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
  const tasks = useTasks()
  const formatTask = (type?: string) => {
    switch (type) {
      case "UpdateWallet":
        return "Update Wallet"
      default:
        return type
    }
  }

  const Content = useMemo(() => {
    const TASK_TO_NAME = {
      // [TaskState.Queued]: "Queued",
      [TaskState.Proving]: "Proving",
      [TaskState.SubmittingTx]: "Submitting Transaction",
      [TaskState.FindingOpening]: "Validating",
      [TaskState.UpdatingValidityProofs]: "Validating",
      [TaskState.Completed]: "Completed",
    }
    return (
      <SimpleBar
        style={{
          minHeight: "30vh",
          width: "100%",
        }}
      >
        {tasks.map((task) => {
          const textColor =
            task.status?.state === "Completed" ? "green" : "white"

          const rightIcon =
            task.status?.state === "Completed" ? (
              <CheckIcon color="white.60" height="4" />
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
              borderBottom="var(--secondary-border)"
            >
              <Flex flexDirection="column">
                <Flex alignItems="center" gap="2">
                  <Text
                    color={textColor}
                    fontFamily="Favorit Extended"
                    fontWeight="500"
                  >
                    {formatTask(task.status?.task_type)}
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
                  {task.status?.state !== "Completed" && <>{rightIcon}</>}
                  <Text color="white.80" fontSize="0.8em">
                    {TASK_TO_NAME[task.status?.state as TaskState]}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )
        })}
      </SimpleBar>
    )
  }, [tasks])

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
