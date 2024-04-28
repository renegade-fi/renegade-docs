import { wagmiConfig } from "@/app/providers"
import { useApp } from "@/contexts/App/app-context"
import { readErc20BalanceOf, useReadErc20BalanceOf } from "@/generated"
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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Token } from "@sehyunchung/renegade-react"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { useLocalStorage } from "usehooks-ts"
import { formatUnits } from "viem/utils"
import { useAccount, useBlockNumber } from "wagmi"

import { useDebounce } from "@/hooks/use-debounce"

const ROW_HEIGHT = "56px"
interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
}
export function TokenSelectModal({ isOpen, onClose }: TokenSelectModalProps) {
  const [_, setBase] = useLocalStorage("base", "WETH")
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { address } = useAccount()

  const [tickerBalances, setTickerBalances] = useState<
    { base: string; balance: bigint }[]
  >([])

  useEffect(() => {
    const fetchBalances = async () => {
      const result: { base: string; balance: bigint }[] = []
      for (const [ticker] of DISPLAYED_TICKERS) {
        const balance = await readErc20BalanceOf(wagmiConfig, {
          address: Token.findByTicker(ticker).address,
          args: [address ?? "0x"],
        })
        result.push({ base: ticker, balance: balance })
      }
      const sortedResult = result.sort((a, b) => {
        if (a.balance > b.balance) return -1
        if (a.balance < b.balance) return 1
        return 0
      })
      setTickerBalances(sortedResult)
    }
    fetchBalances()
  }, [address])

  const filteredTickers = useMemo(() => {
    return tickerBalances.filter(({ base }) =>
      base.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [debouncedSearchTerm, tickerBalances])

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
          {filteredTickers.length === 0 && searchTerm ? (
            <Box display="grid" minHeight="80%" placeContent="center">
              <Text
                color="white.50"
                fontFamily="Favorit Extended"
                fontSize="1.2em"
              >
                No results found
              </Text>
            </Box>
          ) : filteredTickers.length === 0 ? (
            <Box display="grid" minHeight="80%" placeContent="center">
              <Spinner />
            </Box>
          ) : (
            <SimpleBar
              style={{
                height: "100%",
              }}
            >
              {filteredTickers.map(({ base }) => {
                return (
                  <Row
                    key={base}
                    ticker={base}
                    onRowClick={() => {
                      onClose()
                      setBase(base)
                    }}
                  />
                )
              })}
            </SimpleBar>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface RowProps {
  ticker: string
  onRowClick: () => void
}

const Row = ({ ticker, onRowClick }: RowProps) => {
  const { address } = useAccount()
  const { tokenIcons } = useApp()
  const { data: erc20Balance, queryKey } = useReadErc20BalanceOf({
    address: Token.findByTicker(ticker).address,
    args: [address ?? "0x"],
  })
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryClient, queryKey, blockNumber])

  const balanceAmount = useMemo(() => {
    let result = "0"

    result = erc20Balance ? formatUnits(erc20Balance, 18) : "0" // Adjust the decimals as needed

    // Check if result has decimals and truncate to 2 decimals without rounding
    if (result.includes(".")) {
      const [integerPart, decimalPart] = result.split(".")
      result = `${integerPart}.${decimalPart.substring(0, 2)}`
    }

    return result
  }, [erc20Balance])
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
