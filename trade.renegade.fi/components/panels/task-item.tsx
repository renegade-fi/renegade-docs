import { Box, Flex, Spinner, Text, Tooltip } from "@chakra-ui/react"
import dayjs from "dayjs"
import { CheckIcon, TriangleAlert } from "lucide-react"

export function TaskItem({
  name,
  createdAt,
  state,
  description,
  tooltip,
}: {
  name: string
  createdAt: number
  state: string
  description?: string
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

  return (
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
          {icon}
          <Text>{state}</Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        minWidth="100%"
        whiteSpace="nowrap"
      >
        <Tooltip backgroundColor="white" hasArrow label={tooltip}>
          <Text>{description}</Text>
        </Tooltip>
        <Text>{dayjs.unix(createdAt).fromNow()}</Text>
      </Flex>
    </Box>
  )
}
