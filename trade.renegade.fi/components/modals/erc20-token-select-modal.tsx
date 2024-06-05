import { wagmiConfig } from "@/app/providers"
import { readErc20BalanceOf } from "@/generated"
import { DISPLAY_TOKENS, TICKER_TO_NAME } from "@/lib/tokens"
import { formatNumber } from "@/lib/utils"
import { Token } from "@renegade-fi/react"
import { useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { useAccount, useBlockNumber } from "wagmi"

import { useDebounce } from "@/hooks/use-debounce"

import { TokenSelectModal } from "@/components/modals/token-select-modal"

type ERC20TokenSelectModalProps = {
  isOpen: boolean
  onClose: () => void
}
export function ERC20TokenSelectModal({
  isOpen,
  onClose,
}: ERC20TokenSelectModalProps) {
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber()
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [balances, setBalances] = useState<
    { address: `0x${string}`; balance: bigint }[]
  >([])

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) {
        return
      }
      const balancePromises = DISPLAY_TOKENS().map(async (token) => {
        const balance = await readErc20BalanceOf(wagmiConfig, {
          address: token.address as `0x${string}`,
          args: [address ?? "0x"],
        })
        return { address: token.address as `0x${string}`, balance }
      })
      const result = await Promise.all(balancePromises)
      setBalances(result)
    }
    fetchBalances()
  }, [address, blockNumber])

  const filteredBalances = useMemo(() => {
    return balances
      .filter(({ address }) => {
        const ticker = Token.findByAddress(address).ticker
        const name = Token.findByAddress(address).name
        return (
          ticker.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          TICKER_TO_NAME[ticker]
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      })
      .sort((a, b) => Number(b.balance - a.balance)) // Sort in descending order
      .map(({ address, balance }) => ({
        address,
        balance: formatNumber(
          balance,
          Token.findByAddress(address).decimals,
          true
        ),
      }))
  }, [balances, debouncedSearchTerm])

  return (
    <TokenSelectModal
      addressAndBalances={filteredBalances}
      isOpen={isOpen}
      onClose={onClose}
      setBase={setBase}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  )
}
