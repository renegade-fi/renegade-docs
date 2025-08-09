---
sidebar_position: 3
title: SDKs
hide_title: true
description: SDKs and client libraries for the Renegade External Matches API
slug: /external-matches/sdks
---

import Figure from '../../src/figure.js'
import LogoLight from '@site/static/img/logo_light.svg'
import LogoDark from '@site/static/img/logo_dark.svg'

<div style={{ minHeight: "70px"}}>
  <Figure
    LightImage={LogoLight}
    DarkImage={LogoDark}
    isSvg={true}
    width="40%"
    widthMobile="70%"
  />
</div>

## Available SDKs

Renegade provides official SDKs and client libraries to help you integrate with the External Matches API more easily.

### Rust SDK

```bash
cargo add renegade-sdk
```
 
- **GitHub**: [renegade-fi/rust-sdk](https://github.com/renegade-fi/rust-sdk)
- **crates.io**: [renegade-sdk](https://crates.io/crates/renegade-sdk)

See the [Example Here](https://github.com/renegade-fi/rust-sdk/blob/main/examples/external_match/external_match.rs) for basic use.


### Golang SDK

```bash
go get github.com/renegade-fi/golang-sdk
```

- **GitHub**: [renegade-fi/golang-sdk](https://github.com/renegade-fi/golang-sdk)

See the [Example Here](https://github.com/renegade-fi/golang-sdk/blob/main/examples/01_external_match/main.go) for basic use.

### TypeScript/JavaScript SDK

```bash
# Using npm
npm install @renegade-fi/renegade-sdk

# Using yarn
yarn add renegade-sdk

# Using bun
bun add renegade-sdk```
```

- **GitHub**: [renegade-fi/typescript-external-match-client](https://github.com/renegade-fi/typescript-external-match-client)
- **npm**: [@renegade-fi/renegade-sdk](https://www.npmjs.com/package/@renegade-fi/renegade-sdk)

See the [Example Here](https://github.com/renegade-fi/typescript-external-match-client/blob/main/examples/basic.ts) for basic use.


### Python SDK

```bash
# Using uv
uv add renegade-sdk

# Using pip
pip install renegade-sdk
```

- **GitHub**: [renegade-fi/python-sdk](https://github.com/renegade-fi/python-sdk)
- **PyPI**: [renegade-sdk](https://pypi.org/project/renegade-sdk/)

See the [Example Here](https://github.com/renegade-fi/python-sdk/blob/main/examples/external_match.py) for basic use.

## Getting Help

- **Documentation**: Each SDK includes comprehensive documentation and examples
- **Telegram**: Ping us on [Telegram](https://t.me/jkraut) for questions.
- **Email**: Contact us at hello@renegade.fi for support.
