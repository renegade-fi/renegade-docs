---
sidebar_position: 5
---

# Fees and Governance

:::caution
All fees and governance parameters may change in advance of mainnet launch.
:::

## Gas Fees and Protocol Fees

Gas fees are ~10 USD for a new wallet creation, and ~1 USD for each deposit,
withdraw, and transfer opration. If you run your own relayer in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)), order
placements and cancellations are instant and incur no gas fee. If you are using
someone else's relayer or not running in super-relayer mode, then gas fees for
order placements or cancellations is ~1 USD.

In addition to the gas fee (paid to Ethereum validators), Renegade has a 1
basis point (0.01%) in-protocol fee taken upon each successful match. If you
run your own relay, this is the only fee paid; if you are instead using someone
else's relayer, the additional relay fee is set arbitrarily by the relay
operator. The public relay charges an additional 4 basis points on each trade,
on top of the 1 basis point in-protocol fee.

## Governance Power

Renegade is a governance-minimized protocol. All contracts are immutable from
deployment, except for a 2-of-3 multi-sig (the "developer key") that can mutate
the following contract parameters:

- A boolean to censor all VALID MATCH operations, halting matches within the
  exchange. Although we do not expect it, this authority would be used in the
  event of a smart contract exploit.

- A boolean to halt all deposits into the exchange. This authority would be
  used in the event of exploits or to migrate the exchange to a new deployment.

- The global in-protocol fee, capped at 1 basis point for each side of the
  trade. The fee may be changed anywhere in the [0, 1] basis point range,
  including turning off the fee entirely.

- Delegate the above authorities to a new address, or change the authority to a
  new address entirely.

Note that the developer key has **no ability to censor withdrawals**. In
addition, 4 years from contract deployment date, the developer key loses all
authority, freezing all governance parameters.
