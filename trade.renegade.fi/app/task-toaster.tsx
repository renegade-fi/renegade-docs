import {
  generateCompletionToastMessage,
  generateFailedToastMessage,
  generateStartToastMessage,
} from "@/lib/task"
import { Task, TaskType, useTaskHistoryWebSocket } from "@renegade-fi/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function TaskToaster() {
  const [incomingTask, setIncomingTask] = useState<Task>()
  useTaskHistoryWebSocket({
    onUpdate(task) {
      setIncomingTask(task)
    },
  })
  const taskRef = useRef<Map<string, Task>>(new Map())

  useEffect(() => {
    if (incomingTask) {
      // Ignore duplicate events
      if (taskRef.current.get(incomingTask.id)?.state === incomingTask.state) {
        return
      }
      taskRef.current.set(incomingTask.id, incomingTask)

      // Order toaster handles SettleMatch task completion
      if (incomingTask.task_info.task_type === TaskType.SettleMatch) {
        return
      }

      if (incomingTask.state === "Completed") {
        const message = generateCompletionToastMessage(incomingTask)
        toast.success(message)
        return
      } else if (incomingTask.state === "Failed") {
        const message = generateFailedToastMessage(incomingTask)
        toast.error(message)
      } else if (incomingTask.state === "Proving") {
        const message = generateStartToastMessage(incomingTask)
        toast.message(message)
      } else if (incomingTask.state === "Proving Payment") {
        const message = generateStartToastMessage(incomingTask)
        toast.message(message)
      }
    }
  }, [incomingTask])
  return null
}
