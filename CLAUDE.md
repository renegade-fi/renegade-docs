# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a multi-project repository for Renegade (on-chain dark pool / MPC-based DEX) containing three independent projects, each with its own package manager:

- **docs.renegade.fi/** — Technical documentation site (Docusaurus 3, pnpm)
- **renegade.fi/** — Marketing landing page (Next.js 14, yarn)
- **trade.renegade.fi/** — Trading application (Next.js 14, pnpm)
- **api-specs/** — OpenAPI specs (external-match, price-reporter)

## Commands

### docs.renegade.fi (Docusaurus)
```bash
cd docs.renegade.fi
pnpm install
pnpm start          # Dev server on port 3000
pnpm build          # Production build
pnpm lint           # ESLint + markdown linting
pnpm format:check   # Prettier check
pnpm format:write   # Prettier fix
```

### renegade.fi (Next.js landing page)
```bash
cd renegade.fi
yarn install        # yarn is enforced via preinstall hook
yarn dev            # Dev server
yarn build          # Production build
yarn lint           # ESLint
yarn typecheck      # TypeScript checking
yarn format:check   # Prettier check
```

### trade.renegade.fi (Next.js trading app)
```bash
cd trade.renegade.fi
pnpm install
pnpm dev            # Dev server
pnpm build          # Production build
pnpm lint           # ESLint
pnpm typecheck      # TypeScript checking
pnpm format:check   # Prettier check
```

## Code Style

All projects share the same Prettier config: no semicolons, double quotes, 2-space tabs, trailing commas (es5), LF line endings. Import ordering is enforced by Prettier plugins (varies per project).

TypeScript strict mode is enabled across all projects. Path alias `@/*` maps to the project root.

The Next.js projects (renegade.fi, trade.renegade.fi) enforce Chakra UI prop ordering and shorthand rules via ESLint.

## Documentation Conventions (docs.renegade.fi)

- Docs are served at root path (`/`), not `/docs`
- Sidebar ordering uses `sidebar_position` in frontmatter
- Categories configured via `_category_.json` files with `collapsed: true`
- Light/dark image support via custom `Figure` component from `src/figure.js`
- Code examples appear in TypeScript, Rust, Python, and Go
- Algolia search integration (requires ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME env vars)

## Architecture Notes

- **trade.renegade.fi** uses WebAssembly (asyncWebAssembly enabled in webpack), Wagmi/Viem for wallet integration, Zustand for state management, and the `@renegade-fi/react` SDK
- **renegade.fi** uses Chakra UI with Framer Motion animations, with separate mobile/desktop view components
- CI runs ESLint and Prettier checks on push for renegade.fi and trade.renegade.fi (docs checks are currently disabled in CI)
