import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { parseAbi } from 'viem'

const abi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) returns (uint256)',
  'event Approval(address indexed owner, address indexed spender, uint256 amount)',
])

export default defineConfig({
  out: 'generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi
    }
  ],
  plugins: [react()],
})
