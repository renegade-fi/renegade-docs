import { useEffect } from "react"
import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"

import { Step, useStepper } from "../order-stepper"

export default function LoadingStep() {
  const { setStep } = useStepper()
  useEffect(() => {
    setTimeout(() => {
      setStep(Step.EXIT)
    }, 2000)
  }, [setStep])

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
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Submitting order
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
