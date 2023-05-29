import { useToast } from "@chakra-ui/react";
import {
  AccountId,
  Balance,
  BalanceId,
  Fee,
  FeeId,
  Keychain,
  Order,
  OrderId,
  Renegade,
  TaskId,
} from "@renegade-fi/renegade-js";
import React from "react";

export interface PriceReport {
  type: string;
  topic: string;
  baseToken: { [addr: string]: string };
  quoteToken: { [addr: string]: string };
  exchange: string;
  midpointPrice: number;
  localTimestamp: number;
  reportedTimestamp: number;
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
};

export enum TaskType {
  InitializeAccount = "InitializeAccount",
  Deposit = "Deposit",
  Withdrawal = "Withdrawal",
  PlaceOrder = "PlaceOrder",
  ModifyOrder = "ModifyOrder",
  CancelOrder = "CancelOrder",
  ApproveFee = "ApproveFee",
  ModifyFee = "ModifyFee",
  RevokeFee = "RevokeFee",
}

export enum TaskState {
  Proving = "Proving",
  SubmittingTx = "SubmittingTx",
  FindingMerkleOpening = "FindingMerkleOpening",
  UpdatingValidityProofs = "UpdatingValidityProofs",
  Completed = "Completed",
}

export type RenegadeContextType = {
  balances: Record<BalanceId, Balance>;
  orders: Record<OrderId, Order>;
  fees: Record<FeeId, Fee>;
  accountId?: AccountId;
  taskId?: TaskId;
  taskType?: TaskType;
  taskState?: TaskState;
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => void;
  setTask: (newTaskId: TaskId, newTaskType: TaskType) => void;
};

const RenegadeContext = React.createContext<RenegadeContextType>({
  balances: {},
  orders: {},
  fees: {},
  setAccount: () => undefined,
  setTask: () => undefined,
});

export function prepareRenegadeContext(
  renegade: Renegade,
): RenegadeContextType {
  // Create balance, order, fee, account, and task states.
  const [balances, setBalances] = React.useState<Record<BalanceId, Balance>>(
    {},
  );
  const [orders, setOrders] = React.useState<Record<OrderId, Order>>({});
  const [fees, setFees] = React.useState<Record<FeeId, Fee>>({});
  const [accountId, setAccountId] = React.useState<AccountId>();
  const [taskId, setTaskId] = React.useState<TaskId>();
  const [taskType, setTaskType] = React.useState<TaskType>();
  const [taskState, setTaskState] = React.useState<TaskState>();

  // Define the setAccount handler. This handler unregisters the previous
  // account ID, registers the new account ID, and starts an initializeAccount
  // task.
  //
  // Once the new initializeAccount task has completed, we register a callback
  // to stream all account events.
  async function setAccount(
    oldAccountId?: AccountId,
    keychain?: Keychain,
  ): Promise<void> {
    if (oldAccountId) {
      await renegade.unregisterAccount(oldAccountId);
    }
    // TODO: Tear down the previously-registered callback ID.
    if (!keychain) {
      setAccountId(undefined);
      return;
    }
    // Register and initialize the new account.
    const accountId = renegade.registerAccount(keychain);
    const [taskId, taskJob] = await renegade.task.initializeAccount(accountId);
    setTask(taskId, TaskType.InitializeAccount);
    await taskJob;
    setAccountId(accountId);
    // After the initialization has completed, query the current balances,
    // orders, and fees, and start streaming.
    const refreshAccount = () => {
      setBalances(renegade.getBalances(accountId));
      setOrders(renegade.getOrders(accountId));
      setFees(renegade.getFees(accountId));
    };
    refreshAccount();
    await renegade.registerAccountCallback(refreshAccount, accountId, -1);
  }

  // Define the setTask handler. Given a new task ID, this handler starts
  // streaming task updates to the task state.
  const toast = useToast();
  const setTask = async (newTaskId: TaskId, taskType: TaskType) => {
    if (newTaskId === "DONE") {
      return;
    }
    setTaskId(newTaskId);
    setTaskType(taskType);
    setTaskState(TaskState.Proving);
    toast({
      title: "New Task State",
      description: "Proving",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    await renegade.registerTaskCallback((message: string) => {
      const taskUpdate = JSON.parse(message).state;
      setTaskState(taskUpdate.state as TaskState);
      toast({
        title: "New Task State",
        description: taskUpdate.state,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }, newTaskId);
  };

  return {
    balances,
    orders,
    fees,
    accountId,
    taskId,
    taskType,
    taskState,
    setAccount,
    setTask,
  };
}

export default RenegadeContext;
