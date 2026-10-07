---
sidebar_position: 5
description: Exchange fees for Renegade.
---

# Gas and Trading Fees

## Gas Fees

Gas fees are ~0.2 USD for a new wallet creation, and ~0.3 USD for each deposit,
withdraw, and transfer operation. If you run your own relayer in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)), order placements
and cancellations are instant and incur no gas fee.

## Protocol Fees

In addition to the gas fee (paid to Ethereum validators), Renegade has a 2
basis points (0.02%) in-protocol fee taken upon each successful match. If you
run your own relay, this is the only fee paid; if you are instead using someone
else's relayer, the additional relay fee is set arbitrarily by the relay
operator. The public relay charges an additional 2 basis points on each trade,
on top of the 2 basis points in-protocol fee.
