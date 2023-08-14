import { useEffect } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskState, TaskType } from "@/contexts/Renegade/types"
import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"

import { useStepper } from "../order-stepper"

export default function LoadingStep() {
  const { onNext } = useStepper()
  const { taskState, taskType } = useRenegade()
  useEffect(() => {
    if (taskType === TaskType.PlaceOrder && taskState === TaskState.Completed)
      onNext()
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
            Submitting order
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
