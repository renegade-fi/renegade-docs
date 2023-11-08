"use client"

import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ViewEnum } from "@/contexts/Renegade/types"
import { Box } from "@chakra-ui/react"

import { TaskStatus } from "@/components/task-status"
import { DepositBody } from "@/app/[base]/[quote]/deposit"
import { TradingBody } from "@/app/[base]/[quote]/trading"

export function Main() {
  const { view } = useRenegade()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
  }[view]

  return (
    <>
      <CurrentView />
      <Box position="absolute" zIndex={1500} right="0" bottom="0">
        <TaskStatus />
      </Box>
    </>
  )
}
