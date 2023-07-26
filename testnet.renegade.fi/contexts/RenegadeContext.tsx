import React from "react"
import { AccountId, Keychain, Renegade, TaskId } from "@renegade-fi/renegade-js"

export interface PriceReport {
  type: string
  topic: string
  baseToken: { [addr: string]: string }
  quoteToken: { [addr: string]: string }
  exchange: string
  midpointPrice: number
  localTimestamp: number
  reportedTimestamp: number
}

export const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  topic: "",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
}

type TaskState = string // TODO: Put this into renegade-js.

export type RenegadeContextType = {
  renegade?: Renegade
  accountId?: AccountId
  taskId?: TaskId
  taskState?: TaskState
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => void
  setTask: (newTaskId: TaskId) => void
}
const RenegadeContext = React.createContext<RenegadeContextType>({
  setAccount: () => undefined,
  setTask: () => undefined,
})
export default RenegadeContext
