import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import {
  Button,
  Flex,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import { LuRepeat2 } from "react-icons/lu"

import { renegade } from "@/app/providers"

import { useStepper } from "../testnet-stepper"

export function DefaultStep() {
  const { accountId, setTask } = useRenegade()
  const { onNext, setTicker, ticker } = useStepper()

  const amount = ticker === "USDC" ? "1000" : "10"
  const handleDeposit = async () => {
    if (!accountId) return
    onNext()
    renegade.task
      .deposit(accountId, new Token({ ticker }), BigInt(amount))
      .then(([taskId]) => setTask(taskId, TaskType.Deposit))
      .then(() => onNext())
  }

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
            Deposit test funds into your Renegade account
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
              {`${amount} ${ticker}`}
            </Text>
            <Icon as={LuRepeat2} boxSize={6} />
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
          onClick={handleDeposit}
        >
          Deposit
        </Button>
      </ModalFooter>
    </>
  )
}
