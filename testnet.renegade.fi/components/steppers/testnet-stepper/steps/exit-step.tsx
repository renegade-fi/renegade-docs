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

import { useStepper } from "../testnet-stepper"

export function ExitStep() {
  const { onClose, ticker } = useStepper()
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
            Your account has been funded with
          </Text>
          <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
            {`1000 ${ticker}`}
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button
          padding="20px"
          color="white.80"
          fontFamily="Favorit"
          fontSize="1.2em"
          fontWeight="500"
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
          onClick={onClose}
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
