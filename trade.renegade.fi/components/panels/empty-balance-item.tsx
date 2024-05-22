import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { MAX_BALANCES_TOOLTIP } from "@/lib/tooltip-labels"
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import { Box, Circle, Flex } from "@chakra-ui/react"
import "simplebar-react/dist/simplebar.min.css"

import { Tooltip } from "../tooltip"

export function EmptyBalanceItem() {
  const { setView } = useApp()
  return (
    <Tooltip placement="right" label={MAX_BALANCES_TOOLTIP}>
      <Flex
        alignItems="center"
        gap="5px"
        width="100%"
        minHeight="51px"
        padding="5% 6%"
        color="text.secondary"
        borderBottom="var(--secondary-border)"
        boxSizing="border-box"
      >
        <Circle opacity="40%" backgroundColor="text.muted" size="25px" />
        <Flex
          flexDirection="column"
          flexGrow="1"
          gap="1"
          marginLeft="5px"
          opacity="40%"
        >
          <Box width="48px" height="12px" backgroundColor="text.muted" />
          <Box width="24px" height="6px" backgroundColor="text.muted" />
        </Flex>
        <Tooltip label="Deposit">
          <ArrowDownIcon
            opacity="40%"
            transition="color 0.3s ease"
            color="text.secondary"
            _hover={{
              color: "text.muted",
            }}
            width="calc(0.5 * var(--banner-height))"
            height="calc(0.5 * var(--banner-height))"
            cursor="pointer"
            onClick={() => {
              setView(ViewEnum.DEPOSIT)
            }}
          />
        </Tooltip>
        <Tooltip label="Withdraw">
          <ArrowUpIcon
            opacity="40%"
            transition="color 0.3s ease"
            color="text.secondary"
            _hover={{
              color: "text.muted",
            }}
            width="calc(0.5 * var(--banner-height))"
            height="calc(0.5 * var(--banner-height))"
            // borderRadius="100px"
            cursor="pointer"
            onClick={() => {
              setView(ViewEnum.WITHDRAW)
            }}
          />
        </Tooltip>
      </Flex>
    </Tooltip>
  )
}
