import { wagmiConfig } from "@/app/providers"
import { readErc20BalanceOf } from "@/generated"
import { TICKER_TO_NAME } from "@/lib/tokens"
import { Token, formatAmount, tokenMapping } from "@renegade-fi/react"
import { useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { useDebounce } from "@/hooks/use-debounce"

import { TokenSelectModal } from "@/components/modals/token-select-modal"

type ERC20TokenSelectModalProps = {
  isOpen: boolean
  onClose: () => void
}
const tokens = tokenMapping.tokens
export function ERC20TokenSelectModal({
  isOpen,
  onClose,
}: ERC20TokenSelectModalProps) {
  const { address } = useAccount()
  const [balances, setBalances] = useState<
    { address: Address; balance: bigint }[]
  >([])
  const [_, setBase] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchBalances = async () => {
      const balancePromises = tokens.map(async (token) => {
        const balance = await readErc20BalanceOf(wagmiConfig, {
          address: token.address as Address,
          args: [address ?? "0x"],
        })
        return { address: token.address as Address, balance }
      })
      const result = await Promise.all(balancePromises)
      setBalances(result)
    }
    fetchBalances()
  }, [address])

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
        balance: formatAmount(balance, Token.findByAddress(address)),
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