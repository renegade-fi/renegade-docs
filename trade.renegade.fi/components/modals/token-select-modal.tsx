import { useApp } from "@/contexts/App/app-context"
import { TICKER_TO_NAME } from "@/lib/tokens"
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
import { Token } from "@renegade-fi/react"
import Image from "next/image"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { Address } from "viem"

type TokenSelectModalProps = {
  addressAndBalances: { address: Address; balance: string }[]
  isOpen: boolean
  onClose: () => void
  setBase: (ticker: string) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
}
export function TokenSelectModal({
  isOpen,
  addressAndBalances,
  onClose,
  setBase,
  searchTerm,
  setSearchTerm,
}: TokenSelectModalProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent
        height="592px"
        background="white.5"
        border="var(--border)"
        borderColor="white.30"
      >
        <ModalHeader color="text.primary">
          Select a Token
          <Input
            marginTop={4}
            fontFamily="Favorit"
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
          {addressAndBalances.length === 0 && (
            <Box display="grid" minHeight="80%" placeContent="center">
              <Text
                color="text.secondary"
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
            {addressAndBalances.map(({ address, balance }) => {
              return (
                <Row
                  key={address}
                  balance={balance}
                  address={address}
                  onClick={() => {
                    onClose()
                    setBase(Token.findByAddress(address).ticker)
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
  balance: string
  address: Address
  onClick: () => void
}

const ROW_HEIGHT = "56px"
const Row = ({ address, onClick, balance }: RowProps) => {
  const { tokenIcons } = useApp()
  const ticker = Token.findByAddress(address).ticker
  return (
    <Grid
      key={address}
      position="relative"
      alignItems="center"
      gridTemplateColumns="2fr 1fr"
      overflow="hidden"
      height={ROW_HEIGHT}
      color="text.primary"
      fontFamily="Favorit"
      fontSize="1.2em"
      _hover={{
        backgroundColor: "white.10",
      }}
      cursor="pointer"
      onClick={onClick}
      paddingX="5"
    >
      <GridItem>
        <HStack alignItems="center" gap="4">
          <Image
            alt={address}
            height={32}
            src={tokenIcons[ticker]}
            width={32}
            priority
          />
          <VStack alignItems="start" gap="0">
            <Text>{TICKER_TO_NAME[ticker]}</Text>
            <Text color="text.secondary" fontSize="0.7em">
              {ticker}
            </Text>
          </VStack>
        </HStack>
      </GridItem>
      <GridItem>
        <Box textAlign="right">
          <Text fontFamily="Favorit Mono">{balance}</Text>
        </Box>
      </GridItem>
    </Grid>
  )
}
