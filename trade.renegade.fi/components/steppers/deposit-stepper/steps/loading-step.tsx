import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"
import { useEffect } from "react"

import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskState, TaskType } from "@/contexts/Renegade/types"

import { useStepper } from "../deposit-stepper"

export function LoadingStep() {
  const { onNext } = useStepper()
  const { taskType, taskState } = useRenegade()

  useEffect(() => {
    if (taskType === TaskType.Deposit && taskState === TaskState.Completed) {
      onNext()
    }
  }, [onNext, taskState, taskType])

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
            Deposit in progress...
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
