import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";

import RenegadeContext, {
  RenegadeContextType,
  TaskState,
  TaskType,
} from "../../contexts/RenegadeContext";

const TASK_TO_LATENCY = {
  [TaskType.InitializeAccount]: {
    [TaskState.Proving]: 2_000,
    [TaskState.SubmittingTx]: 4_000,
  },
  [TaskType.Deposit]: {
    [TaskState.Proving]: 12_000,
    [TaskState.SubmittingTx]: 4_000,
    [TaskState.UpdatingValidityProofs]: 18_000,
  },
  [TaskType.Withdrawal]: {
    [TaskState.Proving]: 12_000,
    [TaskState.SubmittingTx]: 4_000,
    [TaskState.UpdatingValidityProofs]: 18_000,
  },
  [TaskType.PlaceOrder]: {
    [TaskState.Proving]: 12_000,
    [TaskState.SubmittingTx]: 4_000,
    [TaskState.UpdatingValidityProofs]: 18_000,
  },
  [TaskType.ModifyOrder]: {
    [TaskState.Proving]: 12_000,
    [TaskState.SubmittingTx]: 4_000,
    [TaskState.UpdatingValidityProofs]: 18_000,
  },
  [TaskType.CancelOrder]: {
    [TaskState.Proving]: 12_000,
    [TaskState.SubmittingTx]: 4_000,
    [TaskState.UpdatingValidityProofs]: 18_000,
  },
};

interface TaskStatusState {
  taskType?: TaskType;
  taskState?: TaskState;
  taskStartTime?: number;
  currentTime?: number;
}
export class TaskStatus extends React.Component<
  Record<string, never>,
  TaskStatusState
> {
  static contextType = RenegadeContext;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {};
    this.refreshCurrentTime = this.refreshCurrentTime.bind(this);
  }

  componentDidMount() {
    this.refreshCurrentTime();
  }

  componentDidUpdate() {
    const { taskType, taskState } = this.context as RenegadeContextType;
    if (
      taskType === this.state.taskType &&
      taskState === this.state.taskState
    ) {
      return;
    }
    const currentTime = Date.now();
    this.setState({
      taskType,
      taskState,
      taskStartTime: currentTime,
      currentTime,
    });
  }

  refreshCurrentTime() {
    console.log(
      this.state.currentTime &&
        this.state.taskStartTime &&
        this.state.currentTime - this.state.taskStartTime,
    );
    this.setState({ currentTime: Date.now() });
    setTimeout(this.refreshCurrentTime, 100);
  }

  render() {
    const { orders, taskType, taskState } = this.context as RenegadeContextType;
    let progress = 0;
    if (
      taskType &&
      taskState &&
      this.state.currentTime &&
      this.state.taskStartTime
    ) {
      progress =
        (100 * (this.state.currentTime - this.state.taskStartTime)) /
        TASK_TO_LATENCY[taskType][taskState];
      progress = Math.min(Math.ceil(progress), 100);
    }
    if (taskState === TaskState.Completed) {
      progress = 100;
    }
    // If we're updating validity proofs, and there are no orders, this operation will completely immediately.
    if (
      taskState === TaskState.UpdatingValidityProofs &&
      Object.keys(orders).length === 0
    ) {
      progress = 100;
    }
    const displayedTaskType = {
      [TaskType.InitializeAccount]: "Creating a New Account",
      [TaskType.Deposit]: "Depositing Tokens",
      [TaskType.Withdrawal]: "Withdrawing Tokens",
      [TaskType.PlaceOrder]: "Placing an Order",
      [TaskType.ModifyOrder]: "Modifying an Order",
      [TaskType.CancelOrder]: "Cancelling an Order",
      [TaskType.ApproveFee]: "Approving a Fee",
      [TaskType.ModifyFee]: "Modifying a Fee",
      [TaskType.RevokeFee]: "Revoking a Fee",
    }[taskType || TaskType.InitializeAccount]; // If taskType is undefined, we won't use this displayedTaskType anyway.
    const displayedTaskState = {
      [TaskState.Proving]: "Generating ZK Proof",
      [TaskState.SubmittingTx]: "Submitting",
      [TaskState.FindingMerkleOpening]: "Finalizing",
      [TaskState.UpdatingValidityProofs]: "Finalizing",
      [TaskState.Completed]: "Completed",
    }[taskState || TaskState.Proving]; // If taskState is undefined, we won't use this displayedTaskState anyway.
    const isDisplayed = taskState && taskState !== TaskState.Completed;
    return (
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="10px"
        transform={isDisplayed ? "translateX(0)" : "translateX(30%)"}
        transitionDelay={isDisplayed ? "0s" : "5s"}
        opacity={isDisplayed ? 1 : 0}
        transition="all 0.25s ease-in-out"
      >
        <CircularProgress
          value={progress}
          isIndeterminate={progress === 100}
          size="40px"
          thickness="8px"
          color="green"
          trackColor="white.10"
          capIsRound={true}
        >
          <CircularProgressLabel fontSize="0.3em" color="white.60">
            {progress === 100 ? 99 : progress}
          </CircularProgressLabel>
        </CircularProgress>
        <Box flexDirection="column" alignItems="start" justifyContent="center">
          <Text fontSize="1.1em" fontFamily="Favorit Expanded">
            {displayedTaskState}
          </Text>
          <Text fontSize="0.9em" color="white.60">
            {displayedTaskType}
          </Text>
        </Box>
      </Flex>
    );
  }
}
