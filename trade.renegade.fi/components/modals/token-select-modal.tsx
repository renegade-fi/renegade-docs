import { useMemo, useState } from "react"
import Image from "next/image"
import { useApp } from "@/contexts/App/app-context"
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
import SimpleBar from "simplebar-react"

import {
  DISPLAYED_TICKERS,
  KATANA_TICKER_TO_ADDR,
  TICKER_TO_ADDR,
  TICKER_TO_NAME,
} from "@/lib/tokens"
import { getNetwork } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { useDebounce } from "@/hooks/use-debounce"

import "simplebar-react/dist/simplebar.min.css"

const ROW_HEIGHT = "56px"
interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  setToken: (ticker: string) => void
  isTrading?: boolean
}
export function TokenSelectModal({
  isOpen,
  onClose,
  setToken,
  isTrading,
}: TokenSelectModalProps) {
  const balances = useBalance()
  const { tokenIcons } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const filteredTickers = useMemo(() => {
    return DISPLAYED_TICKERS.filter(([ticker]) =>
      ticker.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [debouncedSearchTerm])
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
          {filteredTickers.length === 0 && (
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
            {filteredTickers
              .filter(([base]) => (isTrading ? base !== "USDC" : true))
              .map(([ticker]) => {
                const tickerAddress =
                  getNetwork() === "katana"
                    ? KATANA_TICKER_TO_ADDR[ticker]
                    : TICKER_TO_ADDR[ticker]
                const matchingBalance = Object.values(balances).find(
                  (balance) => `0x${balance.mint.address}` === tickerAddress
                )
                const balanceAmount = matchingBalance
                  ? matchingBalance.amount.toString()
                  : "0"
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
                    onClick={() => {
                      onClose()
                      setToken(ticker)
                    }}
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
                      <Box key={ticker} textAlign="right">
                        <Text color="white.50" fontFamily="Favorit Mono">
                          {balanceAmount}
                        </Text>
                      </Box>
                    </GridItem>
                  </Grid>
                )
              })}
          </SimpleBar>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
