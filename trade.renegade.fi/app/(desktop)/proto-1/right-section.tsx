"use client"

import {
  NETWORK_ORDERS_TOOLTIP,
  PROTOCOL_FEE_TOOLTIP,
  RELAYER_FEE_TOOLTIP,
  RELAYER_NAME_TOOLTIP,
  TVL_TOOLTIP,
} from "@/lib/tooltip-labels"
import { formatNumber } from "@/lib/utils"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Token, useNetworkOrders, useOrderHistory } from "@renegade-fi/react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import { useLocalStorage } from "usehooks-ts"

import { useTvl } from "@/hooks/use-tvl"

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
  const baseTvl = useTvl(base)
  const quoteTvl = useTvl(quote)
  return (
    <Box
      flexDirection="column"
      display="flex"
      width="240px"
      borderLeft="var(--border)"
    >
      <Flex flexDirection="column" flexGrow={1}>
        <Tooltip placement="left" label={NETWORK_ORDERS_TOOLTIP}>
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height="var(--banner-height)"
            borderColor="border"
            borderBottom="var(--border)"
          >
            <Text color="text.primary">Relayer Info</Text>
          </Flex>
        </Tooltip>
        <Flex
          flexDirection="column"
          flexGrow={1}
          gap="8"
          paddingX="12px"
          paddingY="12px"
        >
          <Tooltip placement="left" label={RELAYER_NAME_TOOLTIP}>
            <Flex justifyContent="space-between">
              <Text color="text.secondary">Relayer</Text>
              <Flex alignItems="flex-end" flexDirection="column">
                <Text>renegade-relayer.eth</Text>
                <Flex alignItems="center" gap="1" textAlign="right">
                  <Text marginBottom="-3px" variant="status-green">
                    CONNECTED
                  </Text>
                  <PulsingConnection state="live" />
                </Flex>
              </Flex>
            </Flex>
          </Tooltip>

          <Tooltip placement="left" label={TVL_TOOLTIP}>
            <Flex justifyContent="space-between">
              <Text color="text.secondary">TVL</Text>
              <div>
                <Tooltip
                  placement="bottom"
                  label={`${formatNumber(
                    baseTvl,
                    Token.findByTicker(base).decimals,
                    true
                  )} ${base}`}
                >
                  <Text>
                    {formatNumber(baseTvl, Token.findByTicker(base).decimals)}{" "}
                    {base}
                  </Text>
                </Tooltip>
                <Tooltip
                  placement="bottom"
                  label={`${formatNumber(
                    quoteTvl,
                    Token.findByTicker(quote).decimals,
                    true
                  )} ${base}`}
                >
                  <Text>
                    {formatNumber(quoteTvl, Token.findByTicker(quote).decimals)}{" "}
                    {quote}
                  </Text>
                </Tooltip>
              </div>
            </Flex>
          </Tooltip>

          <div>
            <Tooltip placement="left" label={PROTOCOL_FEE_TOOLTIP}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="text.secondary">Protocol Fee</Text>
                <div>0.02%</div>
              </Flex>
            </Tooltip>
            <Tooltip placement="left" label={RELAYER_FEE_TOOLTIP}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="text.secondary">Relayer Fee</Text>
                <div>0.08%</div>
              </Flex>
            </Tooltip>
          </div>
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
