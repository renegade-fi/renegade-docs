import { useEffect, useRef } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Flex, ModalBody, ModalFooter, Spinner, Text } from "@chakra-ui/react"

import { findBalanceByTicker } from "@/lib/utils"
import { useDeposit } from "@/app/deposit/deposit-context"

import { useStepper } from "../deposit-stepper"

export default function LoadingStep() {
  const { onNext } = useStepper()
  const { balances } = useRenegade()
  const prevBalance = useRef(balances)
  const { baseTicker } = useDeposit()

  useEffect(() => {
    const oldBalance = findBalanceByTicker(prevBalance.current, baseTicker)
    const newBalance = findBalanceByTicker(balances, baseTicker)
    if (oldBalance && newBalance && oldBalance.amount !== newBalance.amount) {
      onNext()
    }
  }, [balances, baseTicker, onNext])

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
