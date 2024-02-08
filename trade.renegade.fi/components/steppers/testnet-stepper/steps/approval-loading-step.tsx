import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useAccount } from "wagmi"

import { useStepper } from "../testnet-stepper"

export function ApprovalLoadingStep() {
  const { onNext } = useStepper()
  const { taskType, taskState } = useRenegade()
  const { address } = useAccount()

  useEffect(() => {
    // TODO: Use ERC20 contract events in addition to deposit task state if deposit is included
    setTimeout(() => {
      onNext();
    }, 2000);
  }, [address, onNext, taskState, taskType])

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
            Approval in progress...
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
