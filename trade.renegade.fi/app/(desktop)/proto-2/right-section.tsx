"use client"

import { BBO_TOOLTIP, NETWORK_ORDERS_TOOLTIP } from "@/lib/tooltip-labels"
import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import { useNetworkOrders, useOrderHistory } from "@renegade-fi/react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { useLocalStorage } from "usehooks-ts"

import { LivePrices } from "@/components/live-price"
import { NetworkOrderItem } from "@/components/panels/network-order"
import { UserOrder } from "@/components/panels/user-order"
import { PulsingConnection } from "@/components/pulsing-connection-indicator"
import { Tooltip } from "@/components/tooltip"

export function RightSection() {
  const { data } = useNetworkOrders()
  const networkOrders = Array.from(data?.values() || []).sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  )
  const orderHistory = useOrderHistory()
  const [base] = useLocalStorage("base", "WETH", { initializeWithValue: false })
  const [quote] = useLocalStorage("quote", "USDC", {
    initializeWithValue: false,
  })
  return (
    <Box
      flexDirection="column"
      display="flex"
      width="240px"
      borderLeft="var(--border)"
    >
      <Flex flexDirection="column" flexGrow={1}>
        <Tooltip placement="left" label={BBO_TOOLTIP}>
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height="var(--banner-height)"
            borderColor="border"
            borderBottom="var(--border)"
          >
            <Text color="text.primary">BBO Feeds</Text>
          </Flex>
        </Tooltip>
        <Flex
          flexDirection="column"
          flexGrow={1}
          gap="8"
          paddingX="14px"
          paddingY="12px"
        >
          <Flex justifyContent="space-between" fontFamily="Favorit Mono">
            <Text color="text.secondary" fontFamily="Favorit Extended">
              Binance
            </Text>
            <Flex flexDirection="column" gap="1">
              <LivePrices
                baseTicker={base}
                quoteTicker={quote}
                exchange="binance"
                onlyShowPrice
              />
              <Stack
                alignItems="center"
                justifyContent="flex-end"
                direction="row"
                spacing="5px"
              >
                <Text
                  marginBottom="-3px"
                  fontFamily="Favorit Extended"
                  lineHeight="1"
                  variant="status-green"
                >
                  LIVE
                </Text>
                <PulsingConnection state="live" />
              </Stack>
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" fontFamily="Favorit Mono">
            <Text color="text.secondary" fontFamily="Favorit Extended">
              Coinbase
            </Text>
            <Flex flexDirection="column" gap="1">
              <LivePrices
                baseTicker={base}
                quoteTicker={quote}
                exchange="coinbase"
                onlyShowPrice
              />
              <Stack
                alignItems="center"
                justifyContent="flex-end"
                direction="row"
                spacing="5px"
              >
                <Text
                  marginBottom="-3px"
                  fontFamily="Favorit Extended"
                  lineHeight="1"
                  variant="status-green"
                >
                  LIVE
                </Text>
                <PulsingConnection state="live" />
              </Stack>
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" fontFamily="Favorit Mono">
            <Text color="text.secondary" fontFamily="Favorit Extended">
              Kraken
            </Text>
            <Flex flexDirection="column" gap="1">
              <LivePrices
                baseTicker={base}
                quoteTicker={quote}
                exchange="kraken"
                onlyShowPrice
              />
              <Stack
                alignItems="center"
                justifyContent="flex-end"
                direction="row"
                spacing="5px"
              >
                <Text
                  marginBottom="-3px"
                  fontFamily="Favorit Extended"
                  lineHeight="1"
                  variant="status-green"
                >
                  LIVE
                </Text>
                <PulsingConnection state="live" />
              </Stack>
            </Flex>
          </Flex>

          <Flex justifyContent="space-between" fontFamily="Favorit Mono">
            <Text color="text.secondary" fontFamily="Favorit Extended">
              Okx
            </Text>
            <Flex flexDirection="column" gap="1">
              <LivePrices
                baseTicker={base}
                quoteTicker={quote}
                exchange="okx"
                onlyShowPrice
              />
              <Stack
                alignItems="center"
                justifyContent="flex-end"
                direction="row"
                spacing="5px"
              >
                <Text
                  marginBottom="-3px"
                  fontFamily="Favorit Extended"
                  lineHeight="1"
                  variant="status-green"
                >
                  LIVE
                </Text>
                <PulsingConnection state="live" />
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <Tooltip placement="left" label={NETWORK_ORDERS_TOOLTIP}>
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height="var(--banner-height)"
            borderColor="border"
            borderTop="var(--border)"
            borderBottom="var(--border)"
          >
            <Text color="text.primary">Order Book</Text>
          </Flex>
        </Tooltip>
        <SimpleBar
          style={{
            height: "40vh",
            padding: "0 8px",
          }}
        >
          {Object.values(networkOrders).map((networkOrder) => {
            const userOrder = orderHistory.data?.get(networkOrder.id)
            if (userOrder) {
              return (
                <UserOrder
                  key={userOrder.id}
                  order={userOrder}
                  timestamp={networkOrder.timestamp}
                />
              )
            }
            return (
              <NetworkOrderItem key={networkOrder.id} order={networkOrder} />
            )
          })}
        </SimpleBar>
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          height="var(--banner-height)"
          borderTop="var(--border)"
        >
          <Text color="text.primary">Active Orders: 198</Text>
        </Flex>
      </Flex>
    </Box>
  )
}
