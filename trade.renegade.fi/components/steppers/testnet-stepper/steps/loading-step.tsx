import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useAccount } from "wagmi"

import { useStepper } from "../testnet-stepper"

export function LoadingStep() {
  const { onNext } = useStepper()
  const { address } = useAccount()


  useEffect(() => {
    const handleFund = async () => {
      await fetch(`/api/fund?address=${address}`).then(() => {
        onNext()
      })
    }
    handleFund()
  }, [address, onNext])

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
            Funding in progress...
          </Text>
          <Spinner />
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent="center"></ModalFooter>
    </>
  )
}
