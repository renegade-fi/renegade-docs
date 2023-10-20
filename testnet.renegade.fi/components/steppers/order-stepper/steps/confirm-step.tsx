import { useEffect, useState } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { useOrder } from "@/contexts/Order/order-context"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import {
  Button,
  Divider,
  Flex,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { Exchange, PriceReport } from "@renegade-fi/renegade-js"

import { ErrorType, useStepper } from "../order-stepper"

export function ConfirmStep() {
  const { setMidpoint, onNext, setError } = useStepper()
  const { getPriceData } = useExchange()
  const { baseTicker, baseTokenAmount, direction, onPlaceOrder, quoteTicker } =
    useOrder()
  const [currentPriceReport, setCurrentPriceReport] = useState<PriceReport>()

  const priceReport = getPriceData(Exchange.Median, baseTicker, quoteTicker)

  useEffect(() => {
    if (!priceReport || currentPriceReport?.midpointPrice) return
    setCurrentPriceReport(priceReport)
  }, [currentPriceReport?.midpointPrice, priceReport])

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
            You&apos;re {direction === "buy" ? "buying" : "selling"}
          </Text>
          <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
            {`${baseTokenAmount} ${baseTicker}`}
          </Text>
          <Flex flexDirection="column" gap="12px" width="100%">
            <Divider />
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">Type</Text>
              <Text>Midpoint Peg</Text>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
              width="100%"
              fontFamily="Favorit"
            >
              <Text color="white.50">
                {direction === "buy" ? "Pay at most" : "Receive at least"}
              </Text>
              <Text>
                {currentPriceReport?.midpointPrice?.toFixed(2)}&nbsp;USDC
              </Text>
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
            if (!currentPriceReport) {
              throw new Error("No current price report")
            }
            setMidpoint(currentPriceReport.midpointPrice || 0)
            onPlaceOrder()
              .then(() => onNext())
              .catch((e) => {
                if (
                  e.message ===
                  "RenegadeError: The maximum number of active, unmatched orders has been reached."
                ) {
                  setError(ErrorType.ORDERBOOK_FULL)
                } else if (
                  e.message ===
                  "RenegadeError: The relayer returned a non-200 response. wallet update already in progress"
                ) {
                  setError(ErrorType.WALLET_LOCKED)
                }
              })
          }}
        >
          <HStack spacing="4px">
            <Text>{`${
              direction === "buy" ? "Buy" : "Sell"
            } ${baseTicker}`}</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </ModalFooter>
    </>
  )
}
