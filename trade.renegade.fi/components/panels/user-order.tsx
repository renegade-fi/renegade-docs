import { getReadableState } from "@/lib/task"
import { USER_ORDER_IN_ORDERBOOK } from "@/lib/tooltip-labels"
import { formatNumber } from "@/lib/utils"
import { Box, Flex, Text } from "@chakra-ui/react"
import { OrderMetadata, Token } from "@renegade-fi/react"
import dayjs from "dayjs"

import { Tooltip } from "@/components/tooltip"

export function UserOrder({ order }: { order: OrderMetadata }) {
  const base = Token.findByAddress(order.data.base_mint)
  const quote = Token.findByAddress(order.data.quote_mint).ticker
  const formattedAmount = formatNumber(order.data.amount, base.decimals)
  const title = `${order.data.side} ${formattedAmount} ${base.ticker} for ${quote}`
  return (
    <Tooltip placement="left" label={USER_ORDER_IN_ORDERBOOK}>
      <Box
        key={order.id}
        padding="5%"
        color="text.secondary"
        fontSize="0.8em"
        borderBottom="var(--secondary-border)"
        _hover={{
          filter: "inherit",
          color: "text.primary",
        }}
        role="group"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          minWidth="100%"
          whiteSpace="nowrap"
        >
          <Text fontSize="1.2em">{getReadableState(order.state)}&nbsp;</Text>
          <Text>{dayjs.unix(Number(order.created) / 1000).fromNow()}</Text>
        </Flex>
        <Text>{title}</Text>
      </Box>
    </Tooltip>
  )
}
