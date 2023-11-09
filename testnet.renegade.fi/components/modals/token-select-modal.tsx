import Image from "next/image"
import { useApp } from "@/contexts/App/app-context"
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"

import {
  DISPLAYED_TICKERS,
  KATANA_TICKER_TO_ADDR,
  TICKER_TO_ADDR,
} from "@/lib/tokens"
import { getNetwork } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"

const ROW_HEIGHT = "72px"
interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  setToken: (ticker: string) => void
}
export function TokenSelectModal({
  isOpen,
  onClose,
  setToken,
}: TokenSelectModalProps) {
  const balances = useBalance()
  const { tokenIcons } = useApp()
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent
        fontSize="1.2em"
        background="white.5"
        border="var(--border)"
        borderColor="white.30"
      >
        <ModalHeader paddingBottom="4" textAlign="center">
          Select a Token
        </ModalHeader>
        <ModalBody padding="0">
          {/* <Box padding="4">
            <Input
              fontFamily="Favorit"
              borderColor="whiteAlpha.300"
              _focus={{
                borderColor: "white.50 !important",
                boxShadow: "none !important",
              }}
              _placeholder={{ color: "whiteAlpha.400" }}
              placeholder="Search name or paste ERC-20 address"
              type="text"
            />
          </Box> */}
          <Flex position="relative" flexDirection="column">
            {DISPLAYED_TICKERS.concat([["USDC", "USDC"]]).map(([ticker]) => {
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
                  gridTemplateColumns="2fr 1fr 1fr"
                  overflow="hidden"
                  height={ROW_HEIGHT}
                  borderTop="var(--border)"
                  _hover={{
                    transition: "0.3s cubic-bezier(0.215, 0.61, 0.355, 1)",
                    backgroundColor: "white.10",
                  }}
                  cursor="pointer"
                  transition="0.1s"
                  onClick={() => {
                    onClose()
                    setToken(ticker)
                  }}
                  paddingX="8"
                >
                  {/* <Box
                    position="absolute"
                    zIndex={-1}
                    bottom={`-${ROW_HEIGHT}`}
                    width="100%"
                    height={ROW_HEIGHT}
                    background="white.10"
                    transition="0.3s cubic-bezier(0.215, 0.61, 0.355, 1)"
                    id="slide"
                  /> */}
                  <GridItem>
                    <HStack gap="3">
                      <Image
                        alt="Logo"
                        height={24}
                        src={tokenIcons[ticker]}
                        width={24}
                      />
                      <Box key={ticker}>{ticker}</Box>
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <Box key={ticker} paddingLeft="4">
                      <Text color="white.50" fontFamily="Favorit Mono">
                        {tickerAddress.slice(0, 6) + "..."}
                      </Text>
                    </Box>
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
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
