import { useOrder } from "@/contexts/Order/order-context"
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

import { Step, useStepper } from "../order-stepper"

export default function DefaultStep() {
  const { setStep } = useStepper()
  const { baseTicker, baseTokenAmount } = useOrder()
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
            You&apos;re buying
          </Text>
          <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
            {`${baseTokenAmount} ${baseTicker}`}
          </Text>
          <Flex flexDirection="column" gap="12px" width="100%">
            <Divider />
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">Type</Text>
              <Text>Midpoint Peg</Text>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">Pay at most</Text>
              <Text>???? USDC</Text>
            </Flex>
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
            setStep(Step.LOADING)
          }}
        >
          <HStack spacing="4px">
            <Text>Buy {baseTicker}</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
