"use client"

import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"
import { useEffect, useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAccount as useAccountWagmi } from "wagmi"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { useOrder } from "@/contexts/Order/order-context"
import { Direction, LocalOrder } from "@/contexts/Order/types"
import { usePrice } from "@/contexts/PriceContext/price-context"
import { useButton } from "@/hooks/use-button"
import { useUSDPrice } from "@/hooks/use-usd-price"
import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"
import {
  createOrder,
  formatAmount,
  parseAmount,
  useBalances,
  useConfig,
  useStatus,
  useWalletId,
} from "@sehyunchung/renegade-react"
import { toast } from "sonner"

export function PlaceOrderButton() {
  const { address } = useAccountWagmi()
  const balances = useBalances()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { base, baseTicker, baseTokenAmount, direction, quote, quoteTicker } =
    useOrder()

  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Place Orders",
    onOpenSignIn,
    signInText: "Sign in to Place Orders",
  })

  const config = useConfig()
  const walletId = useWalletId()
  const status = useStatus()

  const isConnected = status === "in relayer"

  const handlePlaceOrder = async () => {
    const id = uuidv4()
    const parsedAmount = parseAmount(baseTokenAmount, base)
    await createOrder(config, {
      id,
      base: base.address,
      quote: quote.address,
      side: direction,
      amount: parsedAmount,
    })
      .then(({ taskId }) => {
        toast.message(
          `Started to place order to ${
            direction === "buy" ? "Buy" : "Sell"
          } ${baseTokenAmount} ${baseTicker} for ${quoteTicker}`,
          {
            description: "Check the history tab for the status of the task",
          }
        )
        const old = safeLocalStorageGetItem(`order-details-${walletId}`)
        const parseOld: LocalOrder[] = old ? JSON.parse(old) : []
        const newO = [
          ...parseOld,
          {
            id,
            base: base.address,
            quote: quote.address,
            side: direction,
            amount: baseTokenAmount,
            timestamp: Date.now(),
          },
        ]
        safeLocalStorageSetItem(
          `order-details-${walletId}`,
          JSON.stringify(newO)
        )
        console.log(`${walletId} started to place order ${id} in ${taskId}`)
      })
      .catch((e) => toast.error(`Error placing order: ${e.message}`))
  }

  const costInUsd = useUSDPrice(base.ticker, parseFloat(baseTokenAmount))

  const hasInsufficientBalance = useMemo(() => {
    if (!baseTokenAmount) return false
    const baseBalance =
      balances.find(({ mint }) => mint === base.address)?.amount || BigInt(0)
    const quoteBalance =
      balances.find(({ mint }) => mint === quote.address)?.amount || BigInt(0)
    if (direction === Direction.SELL) {
      return baseBalance < parseAmount(baseTokenAmount, base)
    }
    return parseFloat(formatAmount(quoteBalance, quote)) < costInUsd
  }, [balances, base, baseTokenAmount, costInUsd, direction, quote])

  const [price, setPrice] = useState(0)
  const { handleSubscribe, handleGetPrice } = usePrice()
  const priceReport = handleGetPrice(Exchange.Binance, baseTicker, quoteTicker)
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe(Exchange.Binance, baseTicker, quoteTicker, 2)
  }, [baseTicker, quoteTicker, handleSubscribe])
  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (!price) {
    placeOrderButtonContent = "No Exchange Data"
  } else if (hasInsufficientBalance) {
    placeOrderButtonContent = "Insufficient Balance"
  } else {
    placeOrderButtonContent = `Place Order for ${
      baseTokenAmount || ""
    } ${baseTicker}`
  }

  const isDisabled = isConnected && (!baseTokenAmount || hasInsufficientBalance)

  return (
    <>
      <Button
        padding="20px"
        color="white.80"
        fontSize="1.2em"
        fontWeight="200"
        opacity={
          !baseTokenAmount ? "0" : !address || !isConnected ? "0.6" : "1"
        }
        borderWidth="thin"
        borderColor="white.40"
        borderRadius="100px"
        _hover={
          isDisabled
            ? { backgroundColor: "transparent" }
            : {
                borderColor: "white.60",
                color: "white",
              }
        }
        transform={baseTokenAmount ? "translateY(10px)" : "translateY(-10px)"}
        visibility={baseTokenAmount ? "visible" : "hidden"}
        cursor={cursor}
        transition="0.15s"
        backgroundColor="transparent"
        isDisabled={isDisabled}
        loadingText="Please wait for task completion"
        onClick={() => {
          if (shouldUse) {
            buttonOnClick()
          } else if (isDisabled) {
            return
          } else {
            handlePlaceOrder()
          }
        }}
        rightIcon={<ArrowForwardIcon />}
      >
        {placeOrderButtonContent}
      </Button>
      {signInIsOpen && <CreateStepper onClose={onCloseSignIn} />}
    </>
  )
}
