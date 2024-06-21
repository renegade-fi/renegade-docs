import { useApp } from "@/contexts/App/app-context"
import { FAILED_PLACE_ORDER_MSG, QUEUED_PLACE_ORDER_MSG } from "@/lib/task"
import {
  GAS_FEE_TOOLTIP,
  MIDPOINT_TOOLTIP,
  ORDER_CONFIRMATION_PROTOCOL_FEE_TOOLTIP,
  ORDER_CONFIRMATION_RELAYER_FEE_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Direction } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import {
  Token,
  formatAmount,
  parseAmount,
  useBalances,
  useConfig,
  useTaskHistory,
} from "@renegade-fi/react"
import { createOrder } from "@renegade-fi/react/actions"
import { Info } from "lucide-react"
import Image from "next/image"
import numeral from "numeral"
import { useMemo } from "react"
import "simplebar-react/dist/simplebar.min.css"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { v4 as uuidv4 } from "uuid"
import { parseUnits } from "viem/utils"

import { useUSDPrice } from "@/hooks/use-usd-price"

import { Tooltip } from "@/components/tooltip"

type OrderConfirmationModalProps = {
  amount: string
  isOpen: boolean
  onClose: () => void
  setAmount: (amount: string) => void
}
export function OrderConfirmationModal({
  amount,
  isOpen,
  onClose,
  setAmount,
}: OrderConfirmationModalProps) {
  const { tokenIcons } = useApp()
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const [direction] = useLocalStorage("direction", Direction.BUY)
  const baseToken = Token.findByTicker(base)
  const quoteToken = Token.findByTicker(quote)
  const usd = useUSDPrice(baseToken, parseUnits(amount, baseToken.decimals))
  const formattedUsdPrice = numeral(usd).format("0[.]00")
  const [protocolFee, relayerFee] = useMemo(() => {
    return [
      numeral(usd * 0.0002).format("$0[.]00"),
      numeral(usd * 0.0008).format("$0[.]00"),
    ]
  }, [usd])
  const formattedAmount = formatNumber(
    parseUnits(amount, baseToken.decimals),
    baseToken.decimals
  )
  const formattedLongAmount = formatNumber(
    parseUnits(amount, baseToken.decimals),
    baseToken.decimals,
    true
  )

  const balances = useBalances()

  const hasInsufficientBalance = useMemo(() => {
    if (!amount) return false
    const baseBalance = balances.get(baseToken.address)?.amount || BigInt(0)
    const quoteBalance = balances.get(quoteToken.address)?.amount || BigInt(0)
    if (direction === Direction.SELL) {
      return baseBalance < parseAmount(amount, baseToken)
    }
    return parseFloat(formatAmount(quoteBalance, quoteToken)) < usd
  }, [amount, balances, baseToken, direction, quoteToken, usd])

  const config = useConfig()
  const { data: taskHistory } = useTaskHistory()
  const isQueue = Array.from(taskHistory?.values() || []).find(
    (task) => task.state !== "Completed" && task.state !== "Failed"
  )
  const handlePlaceOrder = async () => {
    const id = uuidv4()
    const parsedAmount = parseAmount(amount, baseToken)
    if (isQueue) {
      toast.message(QUEUED_PLACE_ORDER_MSG(baseToken, parsedAmount, direction))
    }
    await createOrder(config, {
      id,
      base: baseToken.address,
      quote: quoteToken.address,
      side: direction,
      amount: parsedAmount,
    }).catch((e) => {
      toast.error(
        FAILED_PLACE_ORDER_MSG(
          baseToken,
          parsedAmount,
          direction,
          e.shortMessage ?? e.response.data
        )
      )
      console.error(`Error placing order: ${e.response?.data ?? e.message}`)
    })
    onClose()
    setAmount("")
  }

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="sm"
    >
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent
        background="white.5"
        border="var(--border)"
        borderColor="white.30"
      >
        <ModalHeader>Review order</ModalHeader>
        <ModalBody>
          <ModalCloseButton />
          <Flex flexDirection="column" gap="8">
            <Box>
              <Text color="text.secondary">
                {direction === Direction.BUY ? "Buy" : "Sell"}
              </Text>
              <Flex alignItems="center" justifyContent="space-between">
                <Tooltip label={`${formattedLongAmount} ${base}`}>
                  <Text
                    marginBottom="-2"
                    fontSize="2.4em"
                    variant="trading-body-button"
                  >
                    {formattedAmount} {base}
                  </Text>
                </Tooltip>
                <Image
                  src={tokenIcons[base]}
                  height={36}
                  width={36}
                  alt={base}
                />
              </Flex>
            </Box>
            <Box>
              <Text color="text.secondary">
                {direction === Direction.BUY ? "with" : "for"}
              </Text>
              <Flex alignItems="center" justifyContent="space-between">
                <Text
                  marginBottom="-2"
                  fontSize="2.4em"
                  variant="trading-body-button"
                >
                  ~{formattedUsdPrice} {quote}
                </Text>
                <Image
                  src={tokenIcons[quote]}
                  height={36}
                  width={36}
                  alt={quote}
                />
              </Flex>
            </Box>
            <Divider />
            <Flex flexDirection="column" gap="3">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" gap="1" color="text.secondary">
                  <Text>Type</Text>
                  <Tooltip placement="top" label={MIDPOINT_TOOLTIP}>
                    <Info height={16} width={16} />
                  </Tooltip>
                </Flex>
                <Text>Peg-to-midpoint</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" gap="1" color="text.secondary">
                  <Text>Protocol Fee (0.02%)</Text>
                  <Tooltip
                    placement="top"
                    label={ORDER_CONFIRMATION_PROTOCOL_FEE_TOOLTIP}
                  >
                    <Info height={16} width={16} />
                  </Tooltip>
                </Flex>
                <Text>{protocolFee}</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" gap="1" color="text.secondary">
                  <Text>Relayer Fee (0.08%)</Text>
                  <Tooltip
                    placement="top"
                    label={ORDER_CONFIRMATION_RELAYER_FEE_TOOLTIP}
                  >
                    <Info height={16} width={16} />
                  </Tooltip>
                </Flex>
                <Text>{relayerFee}</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" gap="1" color="text.secondary">
                  <Text>Gas Fee</Text>
                  <Tooltip placement="top" label={GAS_FEE_TOOLTIP}>
                    <Info height={16} width={16} />
                  </Tooltip>
                </Flex>
                <Text>$0.00</Text>
              </Flex>
            </Flex>
            {hasInsufficientBalance && (
              <Text alignItems="center" gap="2" display="flex">
                Warning: Insufficient{" "}
                {direction === Direction.BUY ? quote : base}, only part of the
                order will be filled.
              </Text>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button minWidth="100%" height="48px" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
