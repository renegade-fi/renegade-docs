# Concepts

Renegade is a crossing network for on-chain ERC20 trades. The main actors in the system are:

- **Internal traders:** they deposit tokens into Renegade, submit orders, and await order execution. They may withdraw their funds at any time. Their trades are "internal" because they live inside Renegade.
- **External traders:** they represent order flow from DEX aggregators, smart wallets, and other external parties. They submit requests for quotes (RFQs) to the Renegade auth server, receive executable calldata, and submit transactions on-chain. Their orders get settled by the Renegade contract, and tokens move via the ERC20 `transferFrom()` function.
    - **Auth servers:** Renegade runs *auth servers* which respond to RFQs from external traders and respond with executable calldata that can settle orders on-chain.
- **Relayers:** Relayers receive orders from internal traders, match them, and submit transactions to settle them on-chain. Currently, Renegade runs a set of relayers.
- **Contracts:** these are EVM smart contracts [deployed on Ethereum Mainnet, Arbitrum One, Base Mainnet](/addresses-and-endpoints/v2).
    - **Darkpool:** the main contract that handles settlement.
    - **Gas Sponsor:** the Renegade relayer will cover the gas cost of external match transactions, up to a daily limit. When requested, the relayer will re-route the settlement transaction through this contract, which will refund the cost of the transaction.
- **Price feeds:** servers which the mid-point price from Binance and provide
  them to traders via an API or Websockets. [View the Price Feed API
  documentation here.](/apis/price-reporter)
