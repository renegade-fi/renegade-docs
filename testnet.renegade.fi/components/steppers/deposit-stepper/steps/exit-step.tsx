import { useRouter } from "next/navigation"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Divider,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react"

import { findBalanceByTicker } from "@/lib/utils"
import { useDeposit } from "@/app/deposit/deposit-context"

import { useStepper } from "../deposit-stepper"

export default function DefaultStep() {
  const { baseTicker, baseTokenAmount } = useDeposit()
  const { onClose } = useStepper()
  const { balances } = useRenegade()
  const router = useRouter()
  const balance = findBalanceByTicker(balances, baseTicker)?.amount.toString()
  return (
    <>
      <ModalCloseButton />
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="4"
          textAlign="center"
        >
          <div>
            <Text
              color="white.50"
              fontFamily="Favorit Extended"
              fontSize="1.3em"
              fontWeight="200"
            >
              You&apos;ve deposited
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
          </div>
          <Divider />
          <Flex>
            <Text
              color="white.50"
              fontFamily="Favorit Extended"
              fontSize="1.3em"
              fontWeight="200"
            >
              Your new balance is&nbsp;
            </Text>
            <Text fontFamily="Aime" fontSize="1.3em" fontWeight="700">
              {`${balance} ${baseTicker}`}
            </Text>
          </Flex>
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
          onClick={() => {
            router.push(`/${baseTicker}/USDC`)
            onClose()
          }}
        >
          <HStack spacing="4px">
            <Text>Trade</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
