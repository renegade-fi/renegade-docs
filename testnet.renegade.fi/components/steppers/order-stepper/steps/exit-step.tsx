import { useEffect, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import {
  Button,
  Divider,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react"

import { useStepper } from "../order-stepper"

export default function ExitStep() {
  const { baseTicker, baseTokenAmount, direction } = useOrder()
  const { onClose } = useStepper()
  const [isHovered, setIsHovered] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsHovered(false)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <ModalCloseButton />
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Text
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Order to {direction === "buy" ? "buy" : "sell"}
          </Text>
          <Text
            fontFamily="Aime"
            fontSize="3em"
            fontWeight="700"
            variant={isHovered ? "" : "blurred"}
          >
            {`${baseTokenAmount} ${baseTicker}`}
          </Text>
          <Flex flexDirection="column" gap="12px" width="100%">
            <Text
              color="white.50"
              fontFamily="Favorit Extended"
              fontSize="1.3em"
              fontWeight="200"
            >
              has been placed
            </Text>
            <Divider />
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">Type</Text>
              <Text variant={isHovered ? undefined : "blurred"}>
                Midpoint Peg
              </Text>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">
                {direction === "buy" ? "Paid at most" : "Received at least"}
              </Text>
              <Text variant={isHovered ? undefined : "blurred"}>???? USDC</Text>
            </Flex>
          </Flex>
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
            onClose()
          }}
        >
          Close
        </Button>
      </ModalFooter>
    </>
  )
}
