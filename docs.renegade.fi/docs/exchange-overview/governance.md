---
sidebar_position: 5
---

# Governance and Fees

The Renegade exchange is a governance-minimized protocol. These features may
change in advance of mainnet launch, but this is the current plan for
governance and fees.

## Multi-Sig

All contracts are immutable from deployment, except for a 2-of-3 multi-sig (the
"developer key") that has the following authority:

1. A boolean to censor all MATCH operation, halting matches within the
   exchange. Although we do not expect it, this authority would be used in the
   event of an exploit on the smart contract.
2. A boolean to censor all deposits into the smart contract. This may be used
   if we deploy a new contract and want to end support for the previous
   contract.
3. A boolean to turn on/off the protocol-level fee.
4. Delegate the above abilities to a new address, or change authority to a new
   address entirely.

Note that the developer key has no ability to censor withdrawals. In addition,
3 years from contract deployment date, the developer key loses all authority,
leaving the all bit switches in whatever last position.
##TODO
 
## Protocol Fees

On the core protocol layer, the exchange charges a 1bp fee from each party,
which is transferred to the company's wallet.

In addition, for the Public Cluster service of managed relayers, we charge an
additional 4bp for any trade that is made via this public cluster. If both
parties are using the public cluster, then the entire fee for the transaction
is 10bp. If only one party is using the public cluster, then the trader using
the public cluster pays 5bp and the counterparty pays 1bp.

