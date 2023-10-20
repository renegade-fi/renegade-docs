import { Button, Flex, ModalBody, Text } from "@chakra-ui/react"

import { ErrorType, useStepper } from "../deposit-stepper"

export function ErrorStep() {
  const { onClose, error } = useStepper()
  const title = {
    [ErrorType.WALLET_LOCKED]: "Wallet locked",
    "": "",
  }[error || ""]
  const content = {
    [ErrorType.WALLET_LOCKED]: "Please wait for the ongoing task to complete.",
    "": "",
  }[error || ""]

  return (
    <ModalBody>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="12"
        textAlign="center"
      >
        <Text
          color="white.50"
          fontFamily="Favorit Extended"
          fontSize="1.3em"
          fontWeight="200"
        >
          {title}
        </Text>
        <Text fontSize="0.9em">{content}</Text>
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
          onClick={onClose}
        >
          Close
        </Button>
      </Flex>
    </ModalBody>
  )
}
