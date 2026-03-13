---
sidebar_position: 1
title: Integration Quickstart
hide_title: true
description: Renegade is the on-chain dark pool.
slug: /integration-quickstart
---

# Integration Quickstart

There are two ways to integrate with Renegade: by making **direct matches**, or
by submitting **requests for quotes (RFQ)**.

- Direct matches are best for traders with execution-sensitive strategies. Our
  users include basis traders who need to rebalance their spot holdings and
  funds which TWAP their positions.
    - Read our **[integration guide for direct matches](./integration-quickstart/direct-matches)**.
- RFQs are for solvers on DEX aggregation protocols like
  [Cowswap](https://docs.cow.fi/), or smart wallets that bundle transactions.
    - Read our **[integration guide for RFQs](./integration-quickstart/solver-rfqs)**.

We provide SDKs for Typescript, Rust, Python, and Golang. To use them, first [read our SDK guide](./sdk).

In addition to avoiding the counterparty risk that exists in centralized
exchanges and OTC desks, Renegade solves many problems in current spot markets,
ultimately giving you optimal execution. Learn more about Renegade in the
**Concepts page**.
