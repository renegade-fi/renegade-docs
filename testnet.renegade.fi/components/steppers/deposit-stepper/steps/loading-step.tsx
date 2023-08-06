import { useEffect } from "react"
import { Flex, ModalBody, ModalFooter, Text } from "@chakra-ui/react"

import { Step, useStepper } from "../deposit-stepper"

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
          textAlign="center"
        >
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Deposit in progress...
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
