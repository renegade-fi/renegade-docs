import { formatNumber } from "@/lib/utils"
import {
  TaskState,
  TaskType,
  Token,
  UpdateType,
  useTaskHistory,
} from "@renegade-fi/react"

import { TaskItem } from "@/components/panels/task-item"

export function TaskHistoryList() {
  const { data } = useTaskHistory()
  const taskHistory = Array.from(data?.values() || []).sort((a, b) => {
    return Number(b.created_at) - Number(a.created_at)
  })
  const formattedTaskType = {
    [TaskType.NewWallet]: "New Wallet",
    [TaskType.UpdateWallet]: "Update Wallet",
    [TaskType.SettleMatch]: "Settle Match",
    [TaskType.PayOfflineFee]: "Pay Fee",
  }
  const formattedUpdateType = {
    [UpdateType.Deposit]: "Deposit",
    [UpdateType.Withdraw]: "Withdraw",
    [UpdateType.PlaceOrder]: "Place Order",
    [UpdateType.CancelOrder]: "Cancel Order",
  }
  const formattedStates: Record<TaskState, string> = {
    ["Queued"]: "Queued",
    ["Running"]: "In Progress",
    ["Proving"]: "Proving",
    ["Proving Payment"]: "Proving",
    ["Submitting Tx"]: "Submitting Tx",
    ["Submitting Payment"]: "Submitting Tx",
    ["Finding Opening"]: "Indexing",
    ["Updating Validity Proofs"]: "Updating",
    ["Completed"]: "Completed",
    ["Failed"]: "Failed",
  }
  return (
    <>
      {taskHistory.map((task) => {
        const createdAt = Number(task.created_at) / 1000
        const formattedState = formattedStates[task.state]
        switch (task.task_info.task_type) {
          case TaskType.NewWallet:
            return (
              <TaskItem
                key={task.id}
                name={formattedTaskType[task.task_info.task_type]}
                createdAt={createdAt}
                state={formattedState}
              />
            )
          case TaskType.PayOfflineFee:
            return (
              <TaskItem
                key={task.id}
                name={formattedTaskType[task.task_info.task_type]}
                createdAt={createdAt}
                state={formattedState}
                isFeeTask
              />
            )
          case TaskType.UpdateWallet:
            switch (task.task_info.update_type) {
              case UpdateType.Deposit:
              case UpdateType.Withdraw:
                const token = Token.findByAddress(task.task_info.mint)
                return (
                  <TaskItem
                    key={task.id}
                    createdAt={createdAt}
                    description={`${formatNumber(
                      task.task_info.amount,
                      token.decimals
                    )} ${token.ticker}`}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={formattedState}
                    tooltip={`${formatNumber(
                      task.task_info.amount,
                      token.decimals,
                      true
                    )} ${token.ticker}`}
                  />
                )
              case UpdateType.PlaceOrder:
              case UpdateType.CancelOrder:
                const base = Token.findByAddress(task.task_info.base)
                return (
                  <TaskItem
                    key={task.id}
                    description={`${task.task_info.side} ${formatNumber(
                      task.task_info.amount,
                      base.decimals
                    )} ${base.ticker} `}
                    createdAt={createdAt}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={formattedState}
                    tooltip={`${formatNumber(
                      task.task_info.amount,
                      base.decimals,
                      true
                    )} ${base.ticker}`}
                  />
                )
              default:
                return null
            }
          case TaskType.SettleMatch:
            const base = Token.findByAddress(task.task_info.base)
            return (
              <TaskItem
                key={task.id}
                createdAt={createdAt}
                description={`${
                  task.task_info.is_sell ? "Sell" : "Buy"
                } ${formatNumber(task.task_info.volume, base.decimals)} ${
                  base.ticker
                }`}
                name={formattedTaskType[task.task_info.task_type]}
                state={formattedState}
                tooltip={`${formatNumber(
                  task.task_info.volume,
                  base.decimals,
                  true
                )} ${base.ticker}`}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
