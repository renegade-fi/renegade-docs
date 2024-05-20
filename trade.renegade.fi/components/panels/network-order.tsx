import { Box, Flex, Text } from "@chakra-ui/react"
import { NetworkOrder } from "@renegade-fi/react"
import dayjs from "dayjs"

export function NetworkOrderItem({ order }: { order: NetworkOrder }) {
  const title = `Unknown order hash: ${order.id.split("-")[0]}`
  return (
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
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        minWidth="100%"
        whiteSpace="nowrap"
      >
        <Text fontSize="1.2em">{order.state}&nbsp;</Text>
        <Text>{dayjs.unix(Number(order.timestamp)).fromNow()}</Text>
      </Flex>
      <Text>{title}</Text>
    </Box>
  )
}
