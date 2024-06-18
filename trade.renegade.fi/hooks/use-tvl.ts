import { renegadeConfig } from "@/app/providers"
import { viemClient } from "@/lib/viem"
import { Token } from "@renegade-fi/react"
import { useCallback, useEffect, useState } from "react"
import { parseAbi } from "viem"

const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
])

export const useTvl = (ticker: string) => {
  const [data, setData] = useState<bigint>(BigInt(0))

  const fetchBalance = useCallback(async () => {
    const balance = await viemClient.readContract({
      address: Token.findByTicker(ticker).address,
      abi,
      functionName: "balanceOf",
      args: [process.env.NEXT_PUBLIC_DARKPOOL_CONTRACT],
    })
    setData(balance)
  }, [ticker])

  useEffect(() => {
    fetchBalance()

    const intervalId = setInterval(fetchBalance, renegadeConfig.pollingInterval)

    return () => clearInterval(intervalId)
  }, [fetchBalance, ticker])
  return data
}

// Causes Chain not Configured Error, reenable when fixed
// const { data: blockNumber } = useBlockNumber({ watch: true })
// const queryClient = useQueryClient()
// useEffect(() => {
//   const intervalId = setInterval(() => {
//     queryClient.invalidateQueries({ queryKey })
//   }, 10000)
