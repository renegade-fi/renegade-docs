import { useEffect, useMemo, useState } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { useOrder } from "@/contexts/Order/order-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
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
import {
  Exchange,
  Order,
  OrderId,
  PriceReport,
  Token,
} from "@renegade-fi/renegade-js"
import { v4 as uuidv4 } from "uuid"

import {
  getNetwork,
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
} from "@/lib/utils"
import { renegade } from "@/app/providers"

import { ErrorType, useStepper } from "../order-stepper"

export interface LocalOrder {
  id: string
  base: string
  quote: string
  side: string
  amount: string
  timestamp: number
}

export function ConfirmStep() {
  const { onClose, setMidpoint, setError } = useStepper()
  const { getPriceData } = useExchange()
  const {
    baseTicker,
    baseTokenAmount,
    direction,
    quoteTicker,
    setBaseTokenAmount,
  } = useOrder()
  const { setTask, accountId } = useRenegade()
  const [currentPriceReport, setCurrentPriceReport] = useState<PriceReport>()

  const priceReport = getPriceData(Exchange.Median, baseTicker, quoteTicker)

  useEffect(() => {
    if (!priceReport || currentPriceReport?.midpointPrice) return
    setCurrentPriceReport(priceReport)
  }, [currentPriceReport?.midpointPrice, priceReport])

  const timestampMap = useMemo(() => {
    const o = safeLocalStorageGetItem("timestampMap")
    const parsed = o ? JSON.parse(o) : {}
    return parsed
  }, [])

  const handlePlaceOrder = async () => {
    if (!accountId) return
    const id = uuidv4() as OrderId
    const order = new Order({
      id,
      baseToken: new Token({ ticker: baseTicker, network: getNetwork() }),
      quoteToken: new Token({ ticker: quoteTicker, network: getNetwork() }),
      side: direction,
      type: "midpoint",
      amount: BigInt(baseTokenAmount),
    })
    renegade.task
      .modifyOrPlaceOrder(accountId, order)
      .then(([taskId]) => setTask(taskId, TaskType.PlaceOrder))
      .then(() => {
        const o = safeLocalStorageGetItem(`order-details-${accountId}`)
        const parseO: LocalOrder[] = o ? JSON.parse(o) : []
        const newO = [
          ...parseO,
          {
            id,
            base: order.baseToken.address,
            quote: order.quoteToken.address,
            side: direction,
            amount: baseTokenAmount,
          },
        ]
        safeLocalStorageSetItem(
          `order-details-${accountId}`,
          JSON.stringify(newO)
        )
        timestampMap[id] = order.timestamp
        safeLocalStorageSetItem("timestampMap", JSON.stringify(timestampMap))
      })
      .then(() => setBaseTokenAmount(0))
      .then(() => onClose())
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
        // TODO: If error, should remove from local storage order details
      })
  }

  const limit = useMemo(() => {
    if (!currentPriceReport || !currentPriceReport.midpointPrice) return 0
    const unit =
      direction === "buy"
        ? currentPriceReport.midpointPrice * 1.2
        : currentPriceReport.midpointPrice * 0.8
    return unit * baseTokenAmount
  }, [baseTokenAmount, currentPriceReport, direction])

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
              <Text>{limit.toFixed(2)}&nbsp;USDC</Text>
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
            handlePlaceOrder()
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
