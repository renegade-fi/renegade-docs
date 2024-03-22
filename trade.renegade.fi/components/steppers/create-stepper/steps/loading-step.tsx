import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"
import { useEffect } from "react"

import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskState, TaskType } from "@/contexts/Renegade/types"

import { useStepper } from "../create-stepper"

export function LoadingStep() {
  const { onClose } = useStepper()
  const { taskType, taskState } = useRenegade()

  useEffect(() => {
    if (
      taskType === TaskType.InitializeAccount &&
      taskState === TaskState.Completed
    ) {
      onClose()
    }
  }, [onClose, taskState, taskType])

  return (
    <>
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="48px"
          textAlign="center"
          marginY="12"
        >
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Creating your account...
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
