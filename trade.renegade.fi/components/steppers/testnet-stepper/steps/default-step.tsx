import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  Button,
  Flex,
  HStack,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { Repeat2 } from "lucide-react"


import { useStepper } from "../testnet-stepper"
import { useAccount } from "wagmi"

export function DefaultStep() {
  const { address } = useAccount()
  const { accountId } = useRenegade()
  const { setTicker, ticker, onNext } = useStepper()

  const amount = ticker === "USDC" ? 10000 : 10

  const handleFund = async () => {
    if (!accountId) return
    // TODO: Hit faucet contract
    // TODO: Should funds get automatically deposited into Renegade Wallet?
    // Move to next step
    onNext()
  }
  const formattedAccount = address?.slice(0, 6) + "..."

  return (
    <>
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="8px"
          textAlign="center"
        >
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Fund {formattedAccount} with testnet funds from the Renegade Faucet
          </Text>
          <HStack
            gap="2"
            _hover={{
              opacity: 0.6,
            }}
            cursor="pointer"
            transition="opacity 0.2s ease-in-out"
            onClick={() => setTicker((t) => (t === "USDC" ? "WETH" : "USDC"))}
          >
            <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
              {`${amount === 10000 ? "10,000" : "10"} ${ticker}`}
            </Text>
            <Repeat2 size={24} />
          </HStack>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
          borderWidth="thin"
          borderColor="white.40"
          borderRadius="100px"
          _hover={{
            borderColor: "white.60",
            color: "white",
          }}
          _focus={{
            backgroundColor: "transparent",
          }}
          transition="0.15s"
          backgroundColor="transparent"
          onClick={handleFund}
        >
          Fund
        </Button>
      </ModalFooter>
    </>
  )
}
