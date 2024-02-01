import { renegade } from "@/app/providers"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Balance, BalanceId } from "@renegade-fi/renegade-js"
import { useEffect, useState } from "react"

export const useBalance = () => {
  const { accountId, balances: initialBalances } = useRenegade()
  const [balances, setBalances] = useState<Record<BalanceId, Balance>>(initialBalances || {})

  useEffect(() => {
    if (!accountId) return
    const interval = setInterval(async () => {
      const fetchedBalances = await renegade
        .queryWallet(accountId)
        .then(() => renegade.getBalances(accountId))
      setBalances(fetchedBalances)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [accountId])

  return balances
}
