import { Flex, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { type TaskState } from "@renegade-fi/react"
import dayjs from "dayjs"
import { CheckIcon, X } from "lucide-react"

export function TaskItem({
  name,
  createdAt,
  state,
  description,
  tooltip,
}: {
  name: string
  createdAt: number
  state: TaskState
  description?: string
  tooltip?: string
}) {
  const rightIcon = {
    ["Queued"]: <></>,
    ["Running"]: <Spinner size="xs" />,
    ["Proving"]: <Spinner size="xs" />,
    ["Submitting Tx"]: <Spinner size="xs" />,
    ["Finding Opening"]: <Spinner size="xs" />,
    ["Updating Validity Proofs"]: <Spinner size="xs" />,
    ["Completed"]: <CheckIcon size="17" />,
    ["Failed"]: <X size="12" />,
  }[state]

  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      width="100%"
      padding="4% 6%"
      color="white.60"
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
        whiteSpace="nowrap"
      >
        <Text fontFamily="Favorit Extended" fontWeight="500">
          {name}
        </Text>
        <Flex gap="1" verticalAlign="middle">
          {rightIcon}
          <Text fontSize="0.8em">{state}</Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        whiteSpace="nowrap"
      >
        <Tooltip backgroundColor="white" hasArrow label={tooltip}>
          <Text fontSize="0.8em" cursor="pointer">
            {description}
          </Text>
        </Tooltip>
        <Text fontFamily="Favorit Expanded" fontSize="0.7em" fontWeight="500">
          {dayjs.unix(createdAt).fromNow()}
        </Text>
      </Flex>
    </Flex>
  )
}
