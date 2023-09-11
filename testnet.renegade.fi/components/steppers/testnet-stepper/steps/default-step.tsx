import { useEffect } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"

import { useStepper } from "../testnet-stepper"

export function DefaultStep() {
  const { onNext } = useStepper()
  const { balances } = useRenegade()

  useEffect(() => {
    if (Object.values(balances).length && Object.values(balances)[0].amount) {
      onNext()
    }
  }, [balances, onNext])

  return (
    <>
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="48px"
          textAlign="center"
        >
          <Flex flexDirection="column" gap="12px">
            <Text
              color="white.50"
              fontFamily="Favorit Extended"
              fontSize="1.3em"
              fontWeight="200"
            >
              Successfully signed in
            </Text>
            <Text
              color="white"
              fontFamily="Favorit Extended"
              fontSize="1.3em"
              fontWeight="200"
            >
              Preparing account for testnet
            </Text>
          </Flex>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
