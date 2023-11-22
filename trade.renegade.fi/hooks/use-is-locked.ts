import { useEffect, useState } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"

import { renegade } from "@/app/providers"

export const useIsLocked = () => {
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const { accountId } = useRenegade()

  useEffect(() => {
    if (!accountId) return
    const interval = setInterval(async () => {
      const fetchIsLocked = await renegade
        .queryWallet(accountId)
        .then(() => renegade.getIsLocked(accountId))
      setIsLocked(fetchIsLocked)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [accountId])

  return isLocked
}
