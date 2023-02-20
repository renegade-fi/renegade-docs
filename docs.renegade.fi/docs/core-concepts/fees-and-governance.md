---
sidebar_position: 5
description: Exchange fees and governance ability for Renegade.
---

# Fees and Governance

<div style={{ marginBottom: -15 }}>
  <i>Note: All fees and governance parameters may change in advance of mainnet launch.</i>
</div>

## Gas Fees

Gas fees are ~10 USD for a new wallet creation, and ~1 USD for each deposit,
withdraw, and transfer operation. If you run your own relayer in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)), order
placements and cancellations are instant and incur no gas fee. If you are using
someone else's relayer or not running in super-relayer mode, then gas fees for
order placements or cancellations is ~1 USD.

## Protocol Fees

In addition to the gas fee (paid to Ethereum validators), Renegade has a 2
basis points (0.02%) in-protocol fee taken upon each successful match. If you
run your own relay, this is the only fee paid; if you are instead using someone
else's relayer, the additional relay fee is set arbitrarily by the relay
operator. The public relay charges an additional 8 basis points on each trade,
on top of the 2 basis points in-protocol fee.

## Governance Power

Renegade is a governance-minimized protocol. All contracts are immutable from
deployment, except for a 2-of-3 multi-sig (the "developer key") that has the
following authority:

- Flip a boolean flag to reject all VALID MATCH proofs, halting matches within
  the exchange. Although we do not expect it, this authority could be used in
  the event of a smart contract exploit or oracle manipulation attack.
- Flip a boolean flag to halt all deposits into the exchange. This authority
  would be used in the event of exploits or to migrate the exchange to a new
  deployment.
- Mutate the global in-protocol fee, capped to 1 basis point for each side of
  the trade. The fee may be changed anywhere in the [0, 1] basis point range,
  including turning off the fee entirely.
- Change the public key where the in-protocol fees are sent.
- Delegate the above authorities to a new address, or change the authority to a
  new address entirely.

Note that the developer key has **no ability to censor withdrawals or
transfers**. In addition, 4 years from contract deployment date, the developer
key loses all authority, freezing all governance parameters.
