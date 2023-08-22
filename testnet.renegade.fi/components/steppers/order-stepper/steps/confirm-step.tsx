import { useCallback } from "react"
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

import { useStepper } from "../order-stepper"

export default function ConfirmStep() {
  const { onNext } = useStepper()
  const {
    onPlaceOrder,
    baseTicker,
    baseTokenAmount,
    midpointPrice,
    direction,
  } = useOrder()
  const handleClick = useCallback(() => {
    onPlaceOrder()
    onNext()
  }, [onNext, onPlaceOrder])

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
            You&apos;re {direction === "buy" ? "buying" : "selling"}
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
              <Text color="white.50">
                {direction === "buy" ? "Pay at most" : "Receive at least"}
              </Text>
              <Text>{midpointPrice}&nbsp;USDC</Text>
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
          onClick={handleClick}
        >
          <HStack spacing="4px">
            <Text>{`${
              direction === "buy" ? "Buy" : "Sell"
            } ${baseTicker}`}</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
