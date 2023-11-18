import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react"

import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useStepper } from "../testnet-stepper"

export function ExitStep() {
  const router = useRouter()
  const { setView } = useApp()
  const { address } = useAccount()
  const { onClose, ticker } = useStepper()
  const formattedAddress = address ? address.slice(0, 6) + "..." : ""
  if (ticker === 'USDC') {
    router.prefetch("/USDC")
  }
  return (
    <>
      <ModalCloseButton />
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
            {formattedAddress} has been funded with
          </Text>
          <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
            {`${ticker === "USDC" ? "10,000" : "10"} ${ticker}`}
          </Text>
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
          onClick={() => {
            // TODO: Not good enough, should render in deposit/order contexts and set baseToken accordingly
            // setDirection(ticker === "USDC" ? Direction.BUY : Direction.SELL)
            // if (ticker === "USDC") {
            //   router.push("/USDC")
            // } else {
            //   setView(ViewEnum.DEPOSIT)
            //   onClose()
            // }
            // TODO: Funding with both tokens so no longer need to conditionally step
            setView(ViewEnum.DEPOSIT)
            onClose()
          }}
        >
          <HStack spacing="4px">
            <Text>Deposit into Renegade</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
