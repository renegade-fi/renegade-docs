import { FEES_TOOLTIP } from "@/lib/tooltip-labels"
import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import dayjs from "dayjs"
import { CheckIcon, TriangleAlert } from "lucide-react"

import { Tooltip } from "../tooltip"

export function TaskItem({
  createdAt,
  description,
  isFeeTask,
  name,
  state,
  tooltip,
}: {
  createdAt: number
  description?: string
  isFeeTask?: boolean
  name: string
  state: string
  tooltip?: string
}) {
  const icon =
    state === "Completed" ? (
      <CheckIcon size="17" />
    ) : state === "Failed" ? (
      <TriangleAlert size="14" />
    ) : state === "Queued" ? (
      <></>
    ) : (
      <Spinner size="xs" />
    )

  const iconColor =
    state === "Completed" ? "green" : state === "Failed" ? "red" : "white.90"

  return (
    <Tooltip placement="right" label={isFeeTask ? FEES_TOOLTIP : ""}>
      <Box
        justifyContent="center"
        padding="4% 6%"
        color="white.60"
        fontSize="0.8em"
        borderColor="white.20"
        borderBottom="var(--secondary-border)"
        _hover={{
          filter: "inherit",
          color: "white.90",
        }}
        transition="all 0.2s"
        role="group"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          minWidth="100%"
          whiteSpace="nowrap"
        >
          <Text fontFamily="Favorit Extended" fontSize="1.2em" fontWeight="500">
            {name}
          </Text>
          <Flex gap="1" verticalAlign="middle">
            <Box _groupHover={{ color: iconColor }} transition="color 0.2s">
              {icon}
            </Box>
            <Text>{state}</Text>
          </Flex>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          minWidth="100%"
          whiteSpace="nowrap"
        >
          <Tooltip label={tooltip}>
            <Text>{description}</Text>
          </Tooltip>
          <Text>{dayjs.unix(createdAt).fromNow()}</Text>
        </Flex>
      </Box>
    </Tooltip>
  )
}
