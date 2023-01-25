---
sidebar_position: 2
description: What is multi-party computation?
---

import Figure from '../../src/figure.js'
import MpcIdealLight from '@site/static/img/mpc_ideal_light.svg'
import MpcIdealDark from '@site/static/img/mpc_ideal_dark.svg'
import MpcRealizedLight from '@site/static/img/mpc_realized_light.png'
import MpcRealizedDark from '@site/static/img/mpc_realized_dark.png'
import MpcRealizedMobileLight from '@site/static/img/mpc_realized_mobile_light.png'
import MpcRealizedMobileDark from '@site/static/img/mpc_realized_mobile_dark.png'
import MatchingEngineLight from '@site/static/img/matching_engine_light.png'
import MatchingEngineDark from '@site/static/img/matching_engine_dark.png'
import MatchingEngineMobileLight from '@site/static/img/matching_engine_mobile_light.png'
import MatchingEngineMobileDark from '@site/static/img/matching_engine_mobile_dark.png'

# What is MPC?

Multi-party computation (MPC) is a core cryptographic primitive that has been
studied since the early 1980s, but has seen little use in DeFi before Renegade.

To best understand MPC, it is easiest to compare to the "ideal functionality"
that MPC implements. In this setting, multiple parties send some private data
to a trusted evaluator. Once the evaluator receives all the private data, it
computes a function on that data and then sends the function output to all the
parties.

<Figure
  LightImage={MpcIdealLight}
  DarkImage={MpcIdealDark}
  isSvg={true}
  caption="The idealized version of MPC with a trusted evaluator."
  width="50%"
  widthMobile="90%"
/>

Note that the important property here is that the trusted evaluator *only*
sends the output to each party, and is trusted to forget all the private
inputs. This allows for computation of a function without needing to reveal the
inputs to everyone.

For example, two parties could each hold two private numbers and compute a
comparator between the two private values, outputting a single bit to determine
who has the larger input (this is [Yao's Millionaire's
Problem](https://en.wikipedia.org/wiki/Yao%27s_Millionaires%27_problem)).

The core idea of a MPC protocol is that it lets you implement the above
functionality *without needing to trust a central party*. That is, MPC allows
for multiple mutually-distrusting parties to compute a function output on
secret input data.

<Figure
  LightImage={MpcRealizedLight}
  DarkImage={MpcRealizedDark}
  LightImageMobile={MpcRealizedMobileLight}
  DarkImageMobile={MpcRealizedMobileDark}
  isSvg={false}
  caption="The realized version of MPC, where mutually-distrusting parties
  compute a function without a centralized intermediary."
  width="65%"
/>

There are two main classes of MPC algorithms: "garbled circuits" and
"secret-sharing" algorithms. The secret-shared approaches are typically easier
to understand, where "somewhat homomorphic" MPC calculations are done on
[Shamir Secret Shares](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
of the individual private inputs. Understanding how MPC works on the protocol
level is out-of-scope for these docs, but one of the easier-to-understand
secret-shared MPC protocols is BGW: [See
here](https://securecomputation.org/docs/ch3-fundamentalprotocols.pdf) for an
explainer.

## Using MPC for Dark Pools

In the context of a dark pool, the use of MPC is pretty natural: The private
inputs are each trader's personal order book, and the output of the MPC is a
list of any tokens that have been swapped as a result of executing the matching
engine on the pairs of order books.

<Figure
  LightImage={MatchingEngineLight}
  DarkImage={MatchingEngineDark}
  LightImageMobile={MatchingEngineMobileLight}
  DarkImageMobile={MatchingEngineMobileDark}
  isSvg={false}
  caption="Renegade runs matching engine execution within a MPC."
  width="100%"
/>

Importantly, note that by using MPC, two traders can *anonymously match* their
orders. Traders never need to reveal orders in-the-clear, and if there is no
match between two traders' order books, then no information is leaked (other
than the fact that there was no valid counter-order). It's full dark pool
functionality, with no trusted dark pool operator!

Note, however, that MPC algorithms on their own don't have any guarantees about
the validity of the inputs of each party. This would be a huge problem for the
dark pool, as we must have guarantees that each trader actually has appropriate
balances for each of their orders. In the next section [The MPC-ZKP
Architecture](/core-concepts/mpc-zkp), we will see how we combine the idea of
MPC with zero-knowledge proofs in order to prove consistency of balances and
orders with respect to on-chain state.
