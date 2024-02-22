import { renegade } from "@/app/providers"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { useEffect, useState } from "react"


export const useTasks = () => {
  const [tasks, setTasks] = useState<
    {
      id?: string | undefined
      status?:
      | {
        task_type?: string | undefined
        state?: string | undefined
      }
      | undefined
      committed?: boolean | undefined
    }[]
  >([])
  const { accountId } = useRenegade()

  useEffect(() => {
    if (!accountId) return
    const interval = setInterval(async () => {
      const _tasks = await renegade.queryTaskQueue(accountId)
      setTasks(_tasks)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [accountId])

  return tasks
}
