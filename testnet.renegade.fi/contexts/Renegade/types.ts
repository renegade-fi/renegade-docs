import {
  AccountId,
  Balance,
  BalanceId,
  Fee,
  FeeId,
  Keychain,
  Order,
  OrderId,
  TaskId,
} from "@renegade-fi/renegade-js"

export interface Counterparty {
  clusterId: string
  multiaddr: string
  peerId: string
}

export interface CounterpartyOrder {
  clusterId: string
  handshakeState: "not-matching" | "in-progress" | "completed"
  isLocal: boolean
  orderId: OrderId
  publicShareNullifier: bigint[]
  state: string
  timestamp: bigint
}

export type PeerId = string

export interface RenegadeContextType {
  accountId: AccountId | undefined
  balances: Record<BalanceId, Balance>
  clientWithSentry: (
    taskType: TaskType,
    task: (...args: any[]) => Promise<[TaskId, Promise<void>]>,
    ...args: any[]
  ) => Promise<void>
  counterparties: Record<PeerId, Counterparty>
  fees: Record<FeeId, Fee>
  orderBook: Record<OrderId, CounterpartyOrder>
  orders: Record<OrderId, Order>
  refreshAccount: (accountId?: AccountId) => void
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => Promise<void>
  setTask: (newTaskId: TaskId, taskType: TaskType) => Promise<void>
  setView: (view: ViewEnum) => void
  taskId: TaskId | undefined
  taskState: TaskState | undefined
  taskType: TaskType | undefined
  view: ViewEnum
}

export enum TaskState {
  Completed = "Completed",
  FindingOpening = "FindingOpening",
  Proving = "Proving",
  SubmittingTx = "SubmittingTx",
  UpdatingValidityProofs = "UpdatingValidityProofs",
}

export enum TaskType {
  ApproveFee = "ApproveFee",
  CancelOrder = "CancelOrder",
  Deposit = "Deposit",
  InitializeAccount = "InitializeAccount",
  ModifyFee = "ModifyFee",
  ModifyOrder = "ModifyOrder",
  PlaceOrder = "PlaceOrder",
  RevokeFee = "RevokeFee",
  Withdrawal = "Withdrawal",
}

export enum ViewEnum {
  TRADING,
  DEPOSIT,
}
