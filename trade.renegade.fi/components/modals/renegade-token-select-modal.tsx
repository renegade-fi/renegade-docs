import { TICKER_TO_NAME } from "@/lib/tokens"
import {
  Token,
  formatAmount,
  tokenMapping,
  useBalances,
} from "@renegade-fi/react"
import { useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Address } from "viem"

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
  const tokens = tokenMapping.tokens
  const balances = useBalances()
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredBalances = useMemo(() => {
    return tokens
      .filter(({ address }) => {
        const ticker = Token.findByAddress(address as Address).ticker
        const name = Token.findByAddress(address as Address).name
        return (
          ticker.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          TICKER_TO_NAME[ticker]
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      })
      .map(({ address }) => ({
        address: address as Address,
        balance:
          balances.find((balance) => balance.mint === address)?.amount ??
          BigInt(0),
      }))
      .sort((a, b) => Number(b.balance - a.balance)) // Sort in descending order
      .map(({ address, balance }) => ({
        address,
        balance: formatAmount(balance, Token.findByAddress(address)),
      }))
  }, [balances, debouncedSearchTerm, tokens])

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
