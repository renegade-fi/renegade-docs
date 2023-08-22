import { useEffect, useState } from "react"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction } from "@/contexts/Order/types"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import {
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { Order, Token } from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

interface PlaceOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PlaceOrderModal({
  isOpen,
  onClose,
}: PlaceOrderModalProps) {
  const {
    baseTicker,
    quoteTicker,
    baseTokenAmount,
    direction,
    setBaseTokenAmount,
  } = useOrder()
  const [medianPriceReport, setMedianPriceReport] =
    useState(DEFAULT_PRICE_REPORT)
  const { accountId, setTask } = useRenegade()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  function getLimitPrice(): number {
    let limitPrice = baseTokenAmount * medianPriceReport.midpointPrice
    if (direction === Direction.BUY) {
      limitPrice *= SLIPPAGE_TOLERANCE
    } else {
      limitPrice /= SLIPPAGE_TOLERANCE
    }
    return limitPrice
  }

  async function placeOrder() {
    if (!accountId) {
      return
    }
    setIsPlacingOrder(true)
    const order = new Order({
      baseToken: new Token({ ticker: baseTicker }),
      quoteToken: new Token({ ticker: quoteTicker }),
      side: direction,
      type: "midpoint",
      amount: BigInt(baseTokenAmount),
    })
    const [taskId] = await renegade.task.placeOrder(accountId, order)
    setTask(taskId, TaskType.PlaceOrder)
    setTimeout(() => {
      setBaseTokenAmount(0)
      onClose()
      setTimeout(() => setIsPlacingOrder(false), 100)
    }, 1000)
  }

  useEffect(() => {
    async function queryMedianPrice() {
      const healthStates = await renegade.queryExchangeHealthStates(
        new Token({ ticker: baseTicker }),
        new Token({ ticker: quoteTicker })
      )
      if (healthStates["median"]["Nominal"]) {
        setMedianPriceReport(healthStates["median"]["Nominal"])
      }
    }
    queryMedianPrice()
  }, [baseTicker, quoteTicker])

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent background="brown" borderRadius="10px">
        <ModalHeader paddingBottom="0">Confirm your Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Flex
              flexDirection="column"
              width="100%"
              marginBottom="10px"
              color="white.60"
              fontSize="0.9em"
            >
              <Text>Submit your order for MPC matching to relayer</Text>
              <Text fontFamily="Favorit Mono">renegade-relayer.eth</Text>
              <Flex
                flexDirection="column"
                gap="3px"
                height={isPlacingOrder ? "0px" : "110px"}
                marginTop={isPlacingOrder ? "0px" : "10px"}
                marginBottom="10px"
                marginLeft="10px"
                fontFamily="Favorit Mono"
                fontSize="1.2em"
                opacity={isPlacingOrder ? 0 : 1}
                transition="0.2s"
              >
                <Flex gap="8px">
                  <Text>Buying</Text>
                  <Text color="white">
                    {direction === Direction.BUY
                      ? baseTokenAmount + " " + baseTicker
                      : quoteTicker}
                  </Text>
                </Flex>
                <Flex gap="8px">
                  <Text>Selling</Text>
                  <Text color="white">
                    {direction === Direction.BUY
                      ? quoteTicker
                      : baseTokenAmount + " " + baseTicker}
                  </Text>
                </Flex>
                <Flex gap="8px">
                  <Text>Type</Text>
                  <Text color="white">Midpoint Peg</Text>
                </Flex>
                <Flex gap="8px">
                  <Text>
                    {direction === Direction.BUY
                      ? "Pay at Most"
                      : "Receive at Least"}
                  </Text>
                  <Text color="white">
                    {medianPriceReport === DEFAULT_PRICE_REPORT
                      ? "?????"
                      : getLimitPrice().toFixed(2) + " " + quoteTicker}
                  </Text>
                </Flex>
              </Flex>
              <ConfirmButton
                isPlacingOrder={isPlacingOrder}
                placeOrder={placeOrder}
                onClose={onClose}
              />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  topic: "",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
}

const SLIPPAGE_TOLERANCE = 1.05

interface ConfirmButtonProps {
  isPlacingOrder: boolean
  placeOrder: () => void
  onClose: () => void
}
function ConfirmButton(props: ConfirmButtonProps) {
  return (
    <Button
      width="100%"
      height={props.isPlacingOrder ? "50px" : "40px"}
      color="white.90"
      fontWeight="800"
      transition="0.2s"
      backgroundColor="brown.light"
      onClick={() => props.placeOrder()}
    >
      <HStack spacing="10px">
        <Spinner
          width={props.isPlacingOrder ? "17px" : "0px"}
          height={props.isPlacingOrder ? "17px" : "0px"}
          opacity={props.isPlacingOrder ? 1 : 0}
          transition="0.2s"
          speed="0.8s"
        />
        <Text>Confirm and Send</Text>
      </HStack>
    </Button>
  )
}
