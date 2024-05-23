import {
  FAIL_SEQUENCER_STATUS_TOOLTIP,
  OK_SEQUENCER_STATUS_TOOLTIP,
} from "@/lib/tooltip-labels"
import { Box, Skeleton, Text } from "@chakra-ui/react"
import { useBlockNumber } from "wagmi"

import { Tooltip } from "@/components/tooltip"

export function SequencerStatusIndicator() {
  const {
    data: blockNumber,
    status,
    fetchStatus,
  } = useBlockNumber({ watch: true })
  const statusColor =
    fetchStatus === "fetching" || status === "success"
      ? "green"
      : status === "error"
      ? "red"
      : "yellow"
  return (
    <Tooltip
      placement="top"
      // @ts-ignore
      label={
        status === "success"
          ? OK_SEQUENCER_STATUS_TOOLTIP()
          : FAIL_SEQUENCER_STATUS_TOOLTIP()
      }
    >
      <Box
        position="absolute"
        right="0"
        bottom="0"
        padding="4px 8px"
        color="white"
      >
        <Box alignItems="center" gap="4px" display="flex">
          <Box
            width="10px"
            height="10px"
            borderRadius="100%"
            backgroundColor={statusColor}
          />
          {status === "pending" ? (
            <Skeleton width="4ch" height="12px" />
          ) : (
            <Text color="text.muted" fontFamily="Favorit Mono" lineHeight="1">
              {blockNumber?.toString()}
            </Text>
          )}
        </Box>
      </Box>
    </Tooltip>
  )
}
