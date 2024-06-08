import { formatNumber } from "@/lib/utils"
import {
  OrderState,
  Task,
  TaskType,
  Token,
  UpdateType,
} from "@renegade-fi/react"

export const START_DEPOSIT_MSG = (mint: Token, amount: bigint) =>
  `Depositing ${formatNumber(amount, mint.decimals)} ${mint.ticker}...`

export const START_WITHDRAWAL_MSG = (mint: Token, amount: bigint) =>
  `Withdrawing ${formatNumber(amount, mint.decimals)} ${mint.ticker}...`

export const START_PLACE_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string
) =>
  `Placing Order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}...`

export const START_CANCEL_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string
) =>
  `Cancelling Order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}...`

export const START_REFRESH_WALLET_MSG = "Refreshing wallet to on-chain state..."

export const QUEUED_DEPOSIT_MSG = (mint: Token, amount: bigint) =>
  `Queued: Depositing ${formatNumber(amount, mint.decimals)} ${mint.ticker}.`

export const QUEUED_WITHDRAWAL_MSG = (mint: Token, amount: bigint) =>
  `Queued: Withdrawing ${formatNumber(amount, mint.decimals)} ${mint.ticker}.`

export const QUEUED_PLACE_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string
) =>
  `Queued: Placing order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}.`

export const QUEUED_CANCEL_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string
) =>
  `Queued: Cancelling order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}.`

export const QUEUED_REFRESH_WALLET_MSG = "Queued: Refreshing wallet..."

export const FAILED_DEPOSIT_MSG = (
  mint: Token,
  amount: bigint,
  reason?: string
) =>
  `Failed to deposit ${formatNumber(amount, mint.decimals)} ${mint.ticker}. ${
    reason ?? "Please try again"
  }.`

export const FAILED_WITHDRAWAL_MSG = (mint: Token, amount: bigint) =>
  `Failed to withdraw ${formatNumber(amount, mint.decimals)} ${
    mint.ticker
  }. Please try again.`

export const FAILED_PLACE_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string,
  reason?: string
) =>
  `Failed to place order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}. ${reason ?? "Please try again"}.`

export const FAILED_CANCEL_ORDER_MSG = (
  base: Token,
  amount: bigint,
  side: string
) =>
  `Failed to cancel order to ${side.toLowerCase()} ${formatNumber(
    amount,
    base.decimals
  )} ${base.ticker}. Please try again.`

export const FAILED_REFRESH_WALLET_MSG = "Failed to refresh wallet."

export const getReadableState = (state: OrderState) => {
  switch (state) {
    case OrderState.Created:
      return "Open"
    case OrderState.Matching:
      return "Open"
    case OrderState.SettlingMatch:
      return "Settling"
    case OrderState.Filled:
      return "Filled"
    case OrderState.Cancelled:
      return "Cancelled"
  }
}

export function generateCompletionToastMessage(task: Task) {
  let message = ""
  const { task_info: taskInfo } = task

  switch (taskInfo.task_type) {
    case TaskType.NewWallet:
      message = "New wallet created successfully."
      break
    case TaskType.PayOfflineFee:
      message = "Fee paid successfully."
      break
    case TaskType.UpdateWallet:
      switch (taskInfo.update_type) {
        case UpdateType.Deposit:
        case UpdateType.Withdraw:
          const mint = Token.findByAddress(taskInfo.mint)
          message = `${
            taskInfo.update_type === UpdateType.Deposit
              ? "Deposit"
              : "Withdrawal"
          } of ${formatNumber(taskInfo.amount, mint.decimals)} ${
            mint.ticker
          } completed.`
          break
        case UpdateType.PlaceOrder:
        case UpdateType.CancelOrder:
          const base = Token.findByAddress(taskInfo.base)
          message = `${taskInfo.side} order for ${formatNumber(
            taskInfo.amount,
            base.decimals
          )} ${base.ticker} ${
            taskInfo.update_type === UpdateType.PlaceOrder
              ? "placed"
              : "cancelled"
          } successfully.`
          break
      }
      break
    case TaskType.SettleMatch:
      const token = Token.findByAddress(taskInfo.base)
      let actionVerb = taskInfo.is_sell ? "Sold" : "Bought"
      message = `${actionVerb} ${formatNumber(
        taskInfo.volume,
        token.decimals
      )} ${token.ticker} successfully.`
      break
  }

  return message
}

export function generateStartToastMessage(task: Task) {
  let message = ""
  const taskInfo = task.task_info

  switch (taskInfo.task_type) {
    case TaskType.NewWallet:
      message = "Creating new wallet..."
      break
    case TaskType.PayOfflineFee:
      message = "Paying fee..."
      break
    case TaskType.UpdateWallet:
      switch (taskInfo.update_type) {
        case UpdateType.Deposit:
        case UpdateType.Withdraw:
          const mint = Token.findByAddress(taskInfo.mint) // mint is available for Deposit and Withdraw
          message = `Initiating ${
            taskInfo.update_type === UpdateType.Deposit
              ? "deposit"
              : "withdrawal"
          } of ${formatNumber(taskInfo.amount, mint.decimals)} ${
            mint.ticker
          }...`
          break
        case UpdateType.PlaceOrder:
        case UpdateType.CancelOrder:
          const base = Token.findByAddress(taskInfo.base) // base is available for PlaceOrder and CancelOrder
          message = `${
            taskInfo.update_type === UpdateType.PlaceOrder
              ? "Placing"
              : "Cancelling"
          } ${taskInfo.side.toLowerCase()} order for ${formatNumber(
            taskInfo.amount,
            base.decimals
          )} ${base.ticker}...`
          break
      }
      break
    case TaskType.SettleMatch:
      const token = Token.findByAddress(taskInfo.base) // base is available for SettleMatch
      let actionVerb = taskInfo.is_sell ? "Selling" : "Buying"
      message = `${actionVerb} ${formatNumber(
        taskInfo.volume,
        token.decimals
      )} ${token.ticker}...`
      break
  }

  return message
}

export function generateFailedToastMessage(task: Task) {
  let message = ""
  const taskInfo = task.task_info

  switch (taskInfo.task_type) {
    case TaskType.NewWallet:
      message = "Failed to create new wallet. Please try again."
      break
    case TaskType.PayOfflineFee:
      message = "Failed to pay fee. Please try again."
      break
    case TaskType.UpdateWallet:
      let token
      if (
        taskInfo.update_type === UpdateType.Deposit ||
        taskInfo.update_type === UpdateType.Withdraw
      ) {
        token = Token.findByAddress(taskInfo.mint) // mint is available for Deposit and Withdraw
        const action =
          taskInfo.update_type === UpdateType.Deposit ? "deposit" : "withdrawal"
        message = `Failed to ${action} ${formatNumber(
          taskInfo.amount,
          token.decimals
        )} ${token.ticker}. Please try again.`
      } else if (
        taskInfo.update_type === UpdateType.PlaceOrder ||
        taskInfo.update_type === UpdateType.CancelOrder
      ) {
        token = Token.findByAddress(taskInfo.base) // base is available for PlaceOrder and CancelOrder
        const action =
          taskInfo.update_type === UpdateType.PlaceOrder ? "place" : "cancel"
        message = `Failed to ${action} order for ${formatNumber(
          taskInfo.amount,
          token.decimals
        )} ${token.ticker}. Please try again.`
      }
      break
    case TaskType.SettleMatch:
      token = Token.findByAddress(taskInfo.base) // base is available for SettleMatch
      const actionVerb = taskInfo.is_sell ? "sell" : "buy"
      message = `Failed to ${actionVerb} ${formatNumber(
        taskInfo.volume,
        token.decimals
      )} ${token.ticker}. Please try again.`
      break
  }

  return message
}
