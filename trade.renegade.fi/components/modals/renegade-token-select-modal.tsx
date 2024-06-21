import { DISPLAY_TOKENS, TICKER_TO_NAME } from "@/lib/tokens"
import { formatNumber } from "@/lib/utils"
import { Token, useBalances } from "@renegade-fi/react"
import { useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useDebounce } from "@/hooks/use-debounce"

import { TokenSelectModal } from "@/components/modals/token-select-modal"

type TradingTokenSelectModalProps = {
  isOpen: boolean
  onClose: () => void
}
export function TradingTokenSelectModal({
  isOpen,
  onClose,
}: TradingTokenSelectModalProps) {
  const balances = useBalances()
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredBalances = useMemo(() => {
    return DISPLAY_TOKENS()
      .filter(({ address }) => {
        const ticker = Token.findByAddress(address as `0x${string}`).ticker
        const name = Token.findByAddress(address as `0x${string}`).name
        return (
          ticker.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          TICKER_TO_NAME[ticker]
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      })
      .map(({ address }) => ({
        address: address as `0x${string}`,
        balance: balances.get(address)?.amount ?? BigInt(0),
      }))
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
