import { useEffect, useMemo, useRef, useState } from "react"
import { useExchange } from "@/contexts/Exchange/exchange-context"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Exchange } from "@renegade-fi/renegade-js"

import { TICKER_TO_DEFAULT_DECIMALS } from "@/lib/tokens"

import { PriceReport } from "../../types"
import { BannerSeparator } from "./banner-separator"

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

interface LivePricesProps {
  baseTicker: string
  quoteTicker: string
  exchange: Exchange
  onlyShowPrice?: boolean
  withCommas?: boolean
  scaleBy?: number
  isMobile?: boolean
  shouldRotate?: boolean
  price?: number
}

export const LivePrices = ({
  baseTicker,
  quoteTicker,
  exchange,
  onlyShowPrice,
  withCommas,
  scaleBy,
  isMobile,
  shouldRotate,
  price: priceProp,
}: LivePricesProps) => {
  const [fallbackPriceReport, setFallbackPriceReport] =
    useState(DEFAULT_PRICE_REPORT)
  const [previousPriceReport, setPreviousPriceReport] =
    useState<PriceReport>(DEFAULT_PRICE_REPORT)
  const [currentPriceReport, setCurrentPriceReport] =
    useState<PriceReport>(DEFAULT_PRICE_REPORT)

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
  let price = priceProp
  let priceStrClass = ""
  if (currentPriceReport === DEFAULT_PRICE_REPORT) {
    if (fallbackPriceReport !== DEFAULT_PRICE_REPORT) {
      price = fallbackPriceReport.midpointPrice
    } else if (baseTicker === "USDC" || baseTicker === "USDT") {
      price = 1
    } else {
      price = 0
    }
  } else if (previousPriceReport === DEFAULT_PRICE_REPORT) {
    price = currentPriceReport.midpointPrice
  } else {
    price = currentPriceReport.midpointPrice
    priceStrClass =
      currentPriceReport.midpointPrice > previousPriceReport.midpointPrice
        ? "fade-green-to-white"
        : "fade-red-to-white"
  }
  price = price || 0

  // If the caller supplied a scaleBy prop, scale the price appropriately
  if (scaleBy !== undefined) {
    price *= scaleBy
  }

  // Format the price as a string
  let priceStr = price?.toFixed(trailingDecimals) || ""
  if (
    (currentPriceReport === DEFAULT_PRICE_REPORT || scaleBy === 0) &&
    baseDefaultDecimals > 0
  ) {
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
      <Flex
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
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        width={isMobile ? "100%" : undefined}
        color="white.80"
        fontFamily="Favorit Mono"
        lineHeight="1"
        opacity={price === 0 ? "20%" : "100%"}
        _hover={{ textDecoration: "none" }}
        transform={isMobile && shouldRotate ? "rotate(180deg)" : undefined}
      >
        ${priceStr}
      </Flex>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={isMobile ? "100%" : undefined}
        height="100%"
        _hover={{ textDecoration: "none" }}
      >
        <Box position="absolute">
          <BannerSeparator />
        </Box>
        {priceIcon}
      </Flex>
    </>
  )
}
