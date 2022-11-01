---
sidebar_position: 1
---

# Indications of Interest

The core protocol is quite simple: It allows for two traders to anonymously
match spot orders, without leaking their trading activity either before or
after the swap.

However, many advanced traders prefer order types beyond simple limit or
midpoint orders. One such common order type is the TWAP over a period of time,
where a trader submits, say, 1/7 of their order each day over the course of a
week.

Since the relay network is off-chain, there is lots of flexibility in trading
design. Out of the box, we support TWAP and VWAP orders, allowing for advanced
traders to experience even less price impact in their swaps.

Another common issue that is faced in a dark pool is attracting liquidity: If
all trades are private, then it is difficult to tell what assets have
liquidity, or what pairs have new size traders what want to swap.

The solution to the liquidity problem is the set of Indications of Interest
(IOI) flags. These flags allow a user to broadcast some details of their order,
without having to reveal the entire order or history of exchange.

We support the following IOI flags: Pair, Pair + Direction, Pair + Amount,
Pair + Direction + Amount, Pair + Direction + Amount + Price.

If a trader wants to attract more liquidity to fill their order, they could
e.g. broadcast a ZKP that their order is of a certain asset pair and of a
certain size, while still hiding their price, so that market makers may be
attracted to the IOI flag and come fill the user’s order.

Note that we also offer a Pair + Direction + Amount + Price flag. This is the
entire contents of a user’s limit order, so that we can actually embed an
entire lit CLOB into the DEX. This allows for a crossover dark-lit pool, where
dark orders can intersect with fully transparent orders, driving additional
liquidity network effects to the system.
