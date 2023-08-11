import { useCallback, useEffect, useRef, useState } from "react"
import { AccountId, Balance, BalanceId } from "@renegade-fi/renegade-js"

import { renegade } from "../app/providers"
import { useRenegade } from "../contexts/Renegade/renegade-context"

const useBalance = (accountId?: AccountId) => {
  const [balances, setBalances] = useState<Record<BalanceId, Balance>>({})
  const fetchRef = useRef(0)
  const fetchBalance = useCallback(() => {
    if (!accountId) {
      return
    }
    fetchRef.current++
    const fetchId = fetchRef.current
    let b: Record<BalanceId, Balance> = {}
    try {
      b = renegade.getBalances(accountId)
      console.log("🚀 ~ accountId:", accountId)
      console.log("🚀 ~ renegade.getBalances", b)
    } catch (e) {
      console.log(e)
    }
    if (fetchId === fetchRef.current) {
      setBalances(b)
    }
  }, [accountId])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalance()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchBalance])
  return balances
}
export default useBalance
