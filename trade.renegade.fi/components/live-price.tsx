import { useEffect, useMemo, useRef, useState } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Exchange, PriceReport } from "@renegade-fi/renegade-js"

import { TICKER_TO_DEFAULT_DECIMALS } from "@/lib/tokens"

import { BannerSeparator } from "./banner-separator"

interface LivePricesProps {
  baseTicker: string
  exchange: Exchange
  quoteTicker: string
  isMobile?: boolean
  onlyShowPrice?: boolean
  price?: number
  scaleBy?: number
  shouldRotate?: boolean
  withCommas?: boolean
}

export const LivePrices = ({
  baseTicker,
  exchange,
  quoteTicker,
  isMobile,
  onlyShowPrice,
  price: priceProp,
  scaleBy,
  shouldRotate,
  withCommas,
}: LivePricesProps) => {
  const [previousPriceReport, setPreviousPriceReport] = useState<PriceReport>(
    {}
  )
  const [currentPriceReport, setCurrentPriceReport] = useState<PriceReport>({})

  const { getPriceData, onRegisterPriceListener } = useExchange()
  const priceReport = getPriceData(exchange, baseTicker, quoteTicker)

  useEffect(() => {
    if (!priceReport) return
    setCurrentPriceReport((prev) => {
      setPreviousPriceReport(prev)
      return priceReport
    })
  }, [priceReport])

  const baseDefaultDecimals = TICKER_TO_DEFAULT_DECIMALS[baseTicker]
  const trailingDecimals = useMemo(() => {
    if (quoteTicker !== "USDC") {
      return 2
    } else if (baseDefaultDecimals >= 3) {
      return 2
    } else {
      return Math.abs(baseDefaultDecimals) + 2
    }
  }, [baseDefaultDecimals, quoteTicker])

  const callbackIdRef = useRef(false)
  useEffect(() => {
    if (callbackIdRef.current) return
    onRegisterPriceListener(
      exchange,
      baseTicker,
      quoteTicker,
      trailingDecimals
    ).then((callbackId) => {
      if (callbackId) {
        callbackIdRef.current = true
      }
    })
  }, [
    baseTicker,
    quoteTicker,
    onRegisterPriceListener,
    exchange,
    trailingDecimals,
  ])

  // Given the previous and current price reports, determine the displayed
  // price and red/green fade class
  let priceStrClass = ""
  if (
    previousPriceReport.midpointPrice &&
    currentPriceReport.midpointPrice &&
    currentPriceReport.midpointPrice > previousPriceReport.midpointPrice
  ) {
    priceStrClass = "fade-green-to-white"
  } else if (
    previousPriceReport.midpointPrice &&
    currentPriceReport.midpointPrice &&
    currentPriceReport.midpointPrice < previousPriceReport.midpointPrice
  ) {
    priceStrClass = "fade-red-to-white"
  }

  let price = currentPriceReport.midpointPrice
    ? currentPriceReport.midpointPrice
    : priceProp
    ? priceProp
    : baseTicker === "USDC"
    ? 1
    : 0

  // If the caller supplied a scaleBy prop, scale the price appropriately
  if (scaleBy !== undefined) {
    price *= scaleBy
  }

  // Format the price as a string
  let priceStr = price.toFixed(trailingDecimals)
  if (
    (!Object.keys(currentPriceReport).length || scaleBy === 0) &&
    baseDefaultDecimals > 0
  ) {
    if (baseTicker === "USDC") {
      priceStr = "1.00"
    }
    const leadingDecimals = priceStr.split(".")[0].length
    priceStr =
      "0".repeat(Math.max(0, baseDefaultDecimals - leadingDecimals)) + priceStr
  }

  // Add commas to the price string
  if (withCommas) {
    const priceStrParts = priceStr.split(".")
    priceStrParts[0] = priceStrParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    priceStr = priceStrParts.join(".")
  }

  const priceOpacity = price === 0 ? "40%" : "inherit"

  if (onlyShowPrice) {
    return <Text opacity={priceOpacity}>${priceStr}</Text>
  }

  const key = [baseTicker, quoteTicker, currentPriceReport.localTimestamp].join(
    "_"
  )

  // Create the icon to display next to the price
  let priceIcon
  if (priceStrClass === "") {
    priceIcon = (
      <TriangleUpIcon
        width="12px"
        height="12px"
        opacity="0%"
        key={key + "_icon"}
      />
    )
  } else if (priceStrClass === "fade-green-to-white") {
    priceIcon = (
      <TriangleUpIcon
        width="12px"
        height="12px"
        className="fade-green-to-transparent"
        key={key + "_icon"}
      />
    )
  } else {
    priceIcon = (
      <TriangleDownIcon
        width="12px"
        height="12px"
        className="fade-red-to-transparent"
        key={key + "_icon"}
      />
    )
  }

  return (
    <>
      <Text
        className={priceStrClass}
        key={key + "_price"}
        sx={
          isMobile
            ? {
                writingMode: "vertical-rl",
                textOrientation: "sideways",
              }
            : undefined
        }
        width={isMobile ? "100%" : undefined}
        color="white.80"
        fontFamily="Favorit Mono"
        opacity={price === 0 ? "20%" : "100%"}
        _hover={{ textDecoration: "none" }}
        transform={isMobile && shouldRotate ? "rotate(180deg)" : undefined}
      >
        ${priceStr}
      </Text>
      <Flex position="relative" width={isMobile ? "100%" : undefined}>
        {priceIcon}
      </Flex>
    </>
  )
}
