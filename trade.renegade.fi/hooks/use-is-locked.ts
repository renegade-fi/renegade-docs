import { useState } from "react"

export const useIsLocked = () => {
  const [isLocked] = useState<boolean>(false)

  // useEffect(() => {
  //   if (!accountId) return
  //   const interval = setInterval(async () => {
  //     const fetchIsLocked = await renegade
  //     .queryWallet(accountId)
  //     .then(() => renegade.getIsLocked(accountId))
  //     setIsLocked(fetchIsLocked)
  //   }, 1000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [accountId])

  return isLocked
}
