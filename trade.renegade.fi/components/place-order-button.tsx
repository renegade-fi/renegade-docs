"use client"

import { usePrice } from "@/contexts/PriceContext/price-context"
import { Direction } from "@/lib/types"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Button, useDisclosure } from "@chakra-ui/react"
import {
  Token,
  createOrder,
  formatAmount,
  parseAmount,
  useBalances,
  useConfig,
  useStatus,
} from "@renegade-fi/react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { v4 as uuidv4 } from "uuid"
import { useAccount as useAccountWagmi } from "wagmi"

import { useButton } from "@/hooks/use-button"
import { useUSDPrice } from "@/hooks/use-usd-price"

import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"

export function PlaceOrderButton({
  baseTokenAmount,
}: {
  baseTokenAmount: string
}) {
  const { address } = useAccountWagmi()
  const balances = useBalances()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const baseToken = Token.findByTicker(base)
  const baseAddress = baseToken.address
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  const quoteToken = Token.findByTicker(quote)
  const quoteAddress = quoteToken.address
  const [direction] = useLocalStorage("direction", Direction.BUY)

  const { buttonOnClick, buttonText, cursor, shouldUse } = useButton({
    connectText: "Connect Wallet to Place Orders",
    onOpenSignIn,
    signInText: "Sign in to Place Orders",
  })

  const config = useConfig()
  const status = useStatus()

  const isConnected = status === "in relayer"

  const handlePlaceOrder = async () => {
    const id = uuidv4()
    const parsedAmount = parseAmount(baseTokenAmount, baseToken)
    await createOrder(config, {
      id,
      base: baseAddress,
      quote: quoteAddress,
      side: direction,
      amount: parsedAmount,
    })
      .then(() => {
        toast.message(
          `Creating order to ${
            direction === "buy" ? "Buy" : "Sell"
          } ${baseTokenAmount} ${base} for ${quote}`
        )
      })
      .catch((e) => {
        toast.error(`Error placing order: ${e.response.data ?? e.message}`)
      })
  }

  const costInUsd = useUSDPrice(base, parseFloat(baseTokenAmount))

  const hasInsufficientBalance = useMemo(() => {
    if (!baseTokenAmount) return false
    const baseBalance =
      balances.find(({ mint }) => mint === baseAddress)?.amount || BigInt(0)
    const quoteBalance =
      balances.find(({ mint }) => mint === quoteAddress)?.amount || BigInt(0)
    if (direction === Direction.SELL) {
      return baseBalance < parseAmount(baseTokenAmount, baseToken)
    }
    return parseFloat(formatAmount(quoteBalance, quoteToken)) < costInUsd
  }, [
    balances,
    baseAddress,
    baseToken,
    baseTokenAmount,
    costInUsd,
    direction,
    quoteAddress,
    quoteToken,
  ])

  const [price, setPrice] = useState(0)
  const { handleSubscribe, handleGetPrice } = usePrice()
  const priceReport = handleGetPrice("binance", baseAddress, quoteAddress)
  useEffect(() => {
    if (!priceReport) return
    setPrice(priceReport)
  }, [priceReport])
  useEffect(() => {
    handleSubscribe("binance", baseAddress, quoteAddress)
  }, [baseAddress, quoteAddress, handleSubscribe])
  let placeOrderButtonContent: string
  if (shouldUse) {
    placeOrderButtonContent = buttonText
  } else if (!price) {
    placeOrderButtonContent = "No Exchange Data"
  } else if (hasInsufficientBalance) {
    placeOrderButtonContent = "Insufficient Balance"
  } else {
    placeOrderButtonContent = `Place Order for ${baseTokenAmount || ""} ${base}`
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
