import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  Button,
  Flex,
  ModalBody,
  ModalFooter,
  Spacer,
  Text
} from "@chakra-ui/react"


import { useStepper } from "../testnet-stepper"

export function ApprovalStep() {
  const { accountId } = useRenegade()
  const { onNext } = useStepper()

  const handleApproval = async () => {
    if (!accountId) return
    // TODO: Hit approval contract
    // TODO: Should funds get automatically deposited into Renegade Wallet?
    // Move to loading step
    onNext()
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
            Approve the Renegade contract to use your testnet funds
          </Text>
          <Spacer />
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
          onClick={handleApproval}
        >
          Approve
        </Button>
      </ModalFooter>
    </>
  )
}
