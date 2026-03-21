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

This relayer fee is set per-token. Traders always pay fees in the token they receive.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 1bps (0.01%) on all tokens |
| Base Mainnet | v2 | 1bps (0.01%) on all tokens |
| Arbitrum One | v1 | 0bps (0.00%) on all tokens |
| Base Mainnet | v1 | 0bps (0.00%) on all tokens |

## Relayer fee

### Direct matches

This relayer fee is set per-token. Traders always pay fees in the token they receive.

| Chain | Renegade version | Fee |
|-|-|-|
| Arbitrum One | v2 | 1bps for all tokens |
| Base Mainnet | v2 | 1bps for all tokens |
| Arbitrum One | v1 | 2bps for all tokens |
| Base Mainnet | v1 | 2bps for all tokens |

### Solver RFQ (external) matches

This relayer fee is set per-token. Traders always pay fees in the token they
receive.

#### Arbitrum One (both v1 and v2)

| Token | Fee |
|-|-|
| AAVE | 0.3000% |
| ARB | 0.0100% |
| COMP | 1.0000% |
| CRV | 0.3000% |
| ETHFI | 0.3000% |
| GMX | 0.1000% |
| GRT | 0.3000% |
| LDO | 0.3000% |
| LINK | 0.3000% |
| LPT | 0.4000% |
| PENDLE | 0.2000% |
| RDNT | 0.2000% |
| UNI | 0.3000% |
| USDT | 0.0000% |
| WBTC | 0.0600% |
| WETH | 0.0100% |
| XAI | 0.4000% |
| ZRO | 0.3500% |

#### Base Mainnet (both v1 and v2)

| Token | Fee |
|-|-|
| AERO | 0.1000% |
| AIXBT | 0.0400% |
| B3 | 0.0400% |
| CLANKER | 0.2500% |
| DEGEN | 0.1000% |
| EDGE | 0.2500% |
| FAI | 0.3500% |
| KAITO | 0.1000% |
| KEYCAT | 0.2500% |
| MORPHO | 0.2000% |
| SPX | 0.0400% |
| TOSHI | 0.2500% |
| USDT | 0.0000% |
| VIRTUAL | 0.0700% |
| VVV | 0.2000% |
| WETH | 0.0100% |
| ZORA | 0.1000% |
| ZRO | 0.3500% |
| cbBTC | 0.0100% |
| doginme | 0.2000% |

Relayer fees are collected at the relayer fee collection addresses listed on the
[v2 addresses](/addresses-and-endpoints/v2) and
[v1 addresses](/addresses-and-endpoints/v1) pages.
