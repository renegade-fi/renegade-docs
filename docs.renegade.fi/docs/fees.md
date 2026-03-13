---
title: Fees
description: Renegade fee schedule and fee structure.
---

# Fees

Every trade on Renegade incurs two fees, both taken as a percentage of the
amount received by each party:

1. **Protocol fee:** charged by the protocol
2. **Relayer fee:** charged by the relayer

## Protocol fee

### Direct matches

This protocol fee applies to all direct matches, regardless of token or trading pair.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 1bps (0.01%) |
| Base Mainnet | v2 | 1bps (0.01%) |
| Arbitrum One | v1 | 0bps (0.00%) |
| Base Mainnet | v1 | 0bps (0.00%) |

### Solver RFQ (external) matches

This protocol fee is set per-token, and applies to the non-USDC side of each trade.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 1bps (0.01%) on all tokens |
| Base Mainnet | v2 | 1bps (0.01%) on all tokens |
| Arbitrum One | v1 | 0bps (0.00%) on all tokens |
| Base Mainnet | v1 | 0bps (0.00%) on all tokens |

## Relayer fee

### Direct matches

This relayer fee is set per-token, and applies to the non-USDC side of each trade.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 0bps for USDT, 1bps for all other tokens |
| Base Mainnet | v2 | 0bps for USDT, 1bps for all other tokens |
| Arbitrum One | v1 | 2bps for all tokens |
| Base Mainnet | v1 | 2bps for all tokens |

### Solver RFQ (external) matches

This relayer fee is set per-token, and applies to the non-USDC side of each trade.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 0bps for USDT, 1bps for all other tokens |
| Base Mainnet | v2 | 0bps for USDT, 1bps for all other tokens |
| Arbitrum One | v1 | 0bps for USDT, 1bps for all other tokens |
| Base Mainnet | v1 | 0bps for USDT, 1bps for all other tokens |

Relayer fees are collected at the relayer fee collection addresses listed on the
[v2 addresses](/addresses-and-endpoints/v2) and
[v1 addresses](/addresses-and-endpoints/v1) pages.
