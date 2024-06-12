import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import dayjs from "dayjs"
import { CheckIcon, TriangleAlert } from "lucide-react"

import { Tooltip } from "../tooltip"

export function TaskItem({
  createdAt,
  description,
  name,
  state,
  tooltip,
}: {
  createdAt: number
  description?: string
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
    state === "Completed"
      ? "green"
      : state === "Failed"
      ? "red"
      : "text.primary"

  return (
    <Box
      justifyContent="center"
      padding="4% 6%"
      color="text.secondary"
      fontSize="0.8em"
      borderBottom="var(--secondary-border)"
      _hover={{
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
        <Text fontSize="1.3em">{name}</Text>
        <Flex gap="1" verticalAlign="middle">
          <Box _groupHover={{ color: iconColor }} transition="color 0.3s ease">
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
  )
}
