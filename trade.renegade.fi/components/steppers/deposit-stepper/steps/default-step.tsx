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

import { getNetwork } from "@/lib/utils"
import { renegade } from "@/app/providers"

import { ErrorType, useStepper } from "../deposit-stepper"

export function DefaultStep() {
  const { baseTicker, baseTokenAmount, setBaseTokenAmount } = useDeposit()
  const { setTask, accountId } = useRenegade()
  const { onClose, setError } = useStepper()

  const handleDeposit = async () => {
  console.log("🚀 ~ DefaultStep ~ accountId:", accountId)
    if (!accountId) return
    renegade.task
      .deposit(
        accountId,
        new Token({ address: "0x408Da76E87511429485C32E4Ad647DD14823Fdc4" }),
        BigInt(baseTokenAmount)
      )
      .then(([taskId]) => setTask(taskId, TaskType.Deposit))
      .then(() => setBaseTokenAmount(0))
      .then(() => onClose())
      .catch((e) => {
        if (
          e.message ===
          "The relayer returned a non-200 response. wallet update already in progress"
        ) {
          setError(ErrorType.WALLET_LOCKED)
        }
      })
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
            <Text>Deposit {baseTicker}</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
