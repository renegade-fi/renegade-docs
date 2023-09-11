import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

import { useStepper } from "../deposit-stepper"

export function DefaultStep() {
  const { baseTicker, baseTokenAmount } = useDeposit()
  const { setTask, accountId } = useRenegade()
  const { onNext } = useStepper()

  const handleDeposit = async () => {
    if (!accountId) return
    onNext()
    renegade.task
      .deposit(
        accountId,
        new Token({ ticker: baseTicker }),
        BigInt(baseTokenAmount)
      )
      .then(([taskId]) => setTask(taskId, TaskType.Deposit))
  }

  return (
    <>
      <ModalCloseButton />
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
        >
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            You&apos;re depositing
          </Text>
          <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
            {`${baseTokenAmount} ${baseTicker}`}
          </Text>
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            into your Renegade Account
          </Text>
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
          <HStack spacing="4px">
            <Text>Deposit</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
