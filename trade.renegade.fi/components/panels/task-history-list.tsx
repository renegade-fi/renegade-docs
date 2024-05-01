import {
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
  return (
    <>
      {history.map((task) => {
        const createdAt = task.created_at / 1000
        switch (task.task_info.task_type) {
          case TaskType.NewWallet:
            return (
              <TaskItem
                key={task.id}
                name={formattedTaskType[task.task_info.task_type]}
                createdAt={createdAt}
                state={task.state}
              />
            )
          case TaskType.UpdateWallet:
            switch (task.task_info.update_type) {
              case UpdateType.Deposit:
                const depositToken = Token.findByAddress(task.task_info.mint)
                return (
                  <TaskItem
                    key={task.id}
                    createdAt={createdAt}
                    description={`${formatAmount(
                      task.task_info.amount,
                      depositToken
                    )} ${depositToken.ticker}`}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={task.state}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      depositToken.decimals
                    )} ${depositToken.ticker}`}
                  />
                )
              case UpdateType.Withdraw:
                const withdrawToken = Token.findByAddress(task.task_info.mint)
                return (
                  <TaskItem
                    key={task.id}
                    createdAt={createdAt}
                    description={`${formatAmount(
                      task.task_info.amount,
                      withdrawToken
                    )} ${withdrawToken.ticker}`}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={task.state}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      withdrawToken.decimals
                    )} ${withdrawToken.ticker}`}
                  />
                )
              case UpdateType.PlaceOrder:
                const placeOrderBase = Token.findByAddress(task.task_info.base)
                return (
                  <TaskItem
                    key={task.id}
                    description={`${task.task_info.side} ${formatAmount(
                      task.task_info.amount,
                      placeOrderBase
                    )} ${placeOrderBase.ticker} `}
                    createdAt={createdAt}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={task.state}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      placeOrderBase.decimals
                    )} ${placeOrderBase.ticker}`}
                  />
                )
              case UpdateType.CancelOrder:
                const cancelOrderBase = Token.findByAddress(task.task_info.base)
                return (
                  <TaskItem
                    key={task.id}
                    createdAt={createdAt}
                    description={`${task.task_info.side} ${formatAmount(
                      task.task_info.amount,
                      cancelOrderBase
                    )} ${cancelOrderBase.ticker} `}
                    name={formattedUpdateType[task.task_info.update_type]}
                    state={task.state}
                    tooltip={`${formatUnits(
                      task.task_info.amount,
                      cancelOrderBase.decimals
                    )} ${cancelOrderBase.ticker}`}
                  />
                )
              default:
                return null
            }
          case TaskType.SettleMatch:
            const settleMatchBase = Token.findByAddress(task.task_info.base)
            return (
              <TaskItem
                key={task.id}
                createdAt={createdAt}
                description={`${
                  task.task_info.is_sell ? "Sold" : "Bought"
                } ${formatAmount(task.task_info.volume, settleMatchBase)} ${
                  settleMatchBase.ticker
                }`}
                name={formattedTaskType[task.task_info.task_type]}
                state={task.state}
                tooltip={`${formatUnits(
                  task.task_info.volume,
                  settleMatchBase.decimals
                )} ${settleMatchBase.ticker}`}
              />
            )
          case TaskType.PayOfflineFee:
            return (
              <TaskItem
                key={task.id}
                name={formattedTaskType[task.task_info.task_type]}
                createdAt={createdAt}
                state={task.state}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
