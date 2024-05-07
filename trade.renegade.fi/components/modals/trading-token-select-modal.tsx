import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { DISPLAYED_TICKERS, TICKER_TO_NAME } from "@/lib/tokens"
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Token, formatAmount, useBalances } from "@renegade-fi/react"
import Image from "next/image"
import { useMemo, useState } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { useLocalStorage } from "usehooks-ts"

import { useDebounce } from "@/hooks/use-debounce"

const ROW_HEIGHT = "56px"
interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
}
export function TokenSelectModal({ isOpen, onClose }: TokenSelectModalProps) {
  const { view } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const balances = useBalances()
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const filteredTickers = useMemo(() => {
    return DISPLAYED_TICKERS.filter(([ticker]) =>
      ticker.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [debouncedSearchTerm])
  const filteredTickersWithBalances = useMemo(() => {
    const result: { ticker: string; balance: bigint | undefined }[] = []
    for (const [ticker] of filteredTickers) {
      const balance = balances.find(
        (b) => b.mint === Token.findByTicker(ticker).address
      )
      result.push({ ticker, balance: balance?.amount })
    }

    result.sort((a, b) => {
      if (!b.balance && !a.balance) return 0 // Both balances are undefined, maintain order
      if (!b.balance) return -1 // Undefined balances are considered less than any number
      if (!a.balance) return 1
      if (b.balance === a.balance) return 0 // Equal balances, maintain order
      return Number(b.balance) - Number(a.balance)
    })
    return result
  }, [balances, filteredTickers])
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent
        height="592px"
        fontFamily="Favorit"
        fontSize="1.2em"
        background="white.5"
        border="var(--border)"
        borderColor="white.30"
      >
        <ModalHeader>
          Select a Token
          <Input
            marginTop={4}
            borderColor="whiteAlpha.300"
            _focus={{
              borderColor: "white.50 !important",
              boxShadow: "none !important",
            }}
            _placeholder={{ color: "whiteAlpha.400" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or paste address"
            type="text"
            value={searchTerm}
          />
        </ModalHeader>
        <ModalBody padding="0">
          <ModalCloseButton />
          {filteredTickersWithBalances.length === 0 && (
            <Box display="grid" minHeight="80%" placeContent="center">
              <Text
                color="white.50"
                fontFamily="Favorit Extended"
                fontSize="1.2em"
              >
                No results found
              </Text>
            </Box>
          )}
          <SimpleBar
            style={{
              height: "100%",
            }}
          >
            {filteredTickersWithBalances
              .filter(({ ticker }) => {
                if (view === ViewEnum.TRADING) return ticker !== "USDC"
                return true
              })
              .map(({ ticker, balance }) => {
                return (
                  <Row
                    key={ticker}
                    balance={balance}
                    ticker={ticker}
                    onRowClick={() => {
                      onClose()
                      setBase(ticker)
                    }}
                  />
                )
              })}
          </SimpleBar>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface RowProps {
  balance?: bigint
  ticker: string
  onRowClick: () => void
}

const Row = ({ ticker, onRowClick, balance }: RowProps) => {
  const { tokenIcons } = useApp()

  const balanceAmount = useMemo(() => {
    let result = balance
      ? formatAmount(balance, Token.findByTicker(ticker))
      : "0"

    // Check if result has decimals and truncate to 2 decimals without rounding
    if (result.includes(".")) {
      const [integerPart, decimalPart] = result.split(".")
      result = `${integerPart}.${decimalPart.substring(0, 2)}`
    }

    return result
  }, [balance, ticker])
  return (
    <Grid
      className="wrapper"
      key={ticker}
      position="relative"
      alignItems="center"
      gridTemplateColumns="2fr 1fr"
      overflow="hidden"
      height={ROW_HEIGHT}
      _hover={{
        backgroundColor: "white.10",
      }}
      cursor="pointer"
      transition="0.1s"
      onClick={onRowClick}
      paddingX="5"
    >
      <GridItem>
        <HStack alignItems="center" gap="4">
          <Image
            alt={ticker}
            height={32}
            src={tokenIcons[ticker]}
            width={32}
            priority
          />
          <VStack alignItems="start" gap="0">
            <Text>{TICKER_TO_NAME[ticker]}</Text>
            <Text color="white.60" fontSize="0.7em">
              {ticker}
            </Text>
          </VStack>
        </HStack>
      </GridItem>
      <GridItem>
        <Box textAlign="right">
          <Text color="white.50" fontFamily="Favorit Mono">
            {balanceAmount}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  )
}
