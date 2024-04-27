import { BannerSeparator } from "./banner-separator"
import { TICKER_TO_DEFAULT_DECIMALS } from "@/lib/tokens"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { type Exchange, Token } from "@sehyunchung/renegade-react"
import { useMemo } from "react"

import { usePrevious } from "@/hooks/use-previous"
import { usePrice } from "@/hooks/use-price"

interface LivePricesProps {
  baseTicker: string
  exchange: Exchange
  quoteTicker: string
  isMobile?: boolean
  onlyShowPrice?: boolean
  initialPrice?: number
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
  scaleBy,
  shouldRotate,
  withCommas,
}: LivePricesProps) => {
  const baseDefaultDecimals = TICKER_TO_DEFAULT_DECIMALS[baseTicker] || 0
  const trailingDecimals = useMemo(() => {
    if (["USDC", "WETH", "WBTC"].includes(baseTicker)) {
      return 2
    } else if (quoteTicker !== "USDC") {
      return 2
    } else if (baseDefaultDecimals >= 3) {
      return 2
    } else {
      return Math.abs(baseDefaultDecimals) + 2
    }
  }, [baseDefaultDecimals, baseTicker, quoteTicker])

  const price = usePrice(exchange, Token.findByTicker(baseTicker).address)
  const prevPrice = usePrevious(price)

  // Given the previous and current price reports, determine the displayed
  // price and red/green fade class
  let priceStrClass = ""
  if (prevPrice && price && price > prevPrice) {
    priceStrClass = "fade-green-to-white"
  } else if (prevPrice && price && price < prevPrice) {
    priceStrClass = "fade-red-to-white"
  }

  let scaledPrice = price
  // If the caller supplied a scaleBy prop, scale the price appropriately
  if (scaleBy !== undefined) {
    scaledPrice *= scaleBy
  }

  // Format the price as a string
  let priceStr = price.toFixed(trailingDecimals)
  if (
    // (!scaledPrice || scaleBy === 0) &&
    // baseDefaultDecimals > 0 &&
    !price &&
    baseTicker !== "USDC"
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

  const key = [baseTicker, quoteTicker, price].join("_")

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
