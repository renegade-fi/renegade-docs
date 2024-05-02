import {
  TaskState,
  TaskType,
  Token,
  UpdateType,
  formatAmount,
  useTaskHistory,
} from "@renegade-fi/react"
import { formatUnits } from "viem"

import { TaskItem } from "@/components/panels/task-item"

export function TaskHistoryList() {
  const history = useTaskHistory({ sort: "desc" })
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
    ["Updating Validity Proofs"]: "Updating State",
    ["Completed"]: "Completed",
    ["Failed"]: "Failed",
  }
  return (
    <>
      {history.map((task) => {
        const createdAt = task.created_at / 1000
        const formattedState = formattedStates[task.state]
        switch (task.task_info.task_type) {
          case TaskType.NewWallet:
          case TaskType.PayOfflineFee:
            return (
              <TaskItem
                key={task.id}
                name={formattedTaskType[task.task_info.task_type]}
                createdAt={createdAt}
                state={formattedState}
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
                    description={`${formatAmount(
                      task.task_info.amount,
                      token
                    )} ${token.ticker}`}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={formattedState}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      token.decimals
                    )} ${token.ticker}`}
                  />
                )
              case UpdateType.PlaceOrder:
              case UpdateType.CancelOrder:
                const base = Token.findByAddress(task.task_info.base)
                return (
                  <TaskItem
                    key={task.id}
                    description={`${task.task_info.side} ${formatAmount(
                      task.task_info.amount,
                      base
                    )} ${base.ticker} `}
                    createdAt={createdAt}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={formattedState}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      base.decimals
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
                  task.task_info.is_sell ? "Sold" : "Bought"
                } ${formatAmount(task.task_info.volume, base)} ${base.ticker}`}
                name={formattedTaskType[task.task_info.task_type]}
                state={formattedState}
                tooltip={`${formatUnits(
                  task.task_info.volume,
                  base.decimals
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