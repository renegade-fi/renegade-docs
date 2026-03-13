# docs.renegade.fi

Renegade documentation site built with [Docusaurus](https://docusaurus.io/).

## Prerequisites

- Node.js >= 18

## Font Setup

Download fonts from S3 before building:

```bash
bash build.sh testnet-fonts us-east-2 "ABCFavoritExtendedVariable.woff2 FAMAime-Regular.woff2 FAMAime-Bold.woff2 ABCFavoritExpanded-Regular-Named.ttf ABCFavoritMono-Regular.ttf ABCFavorit-Light-Named.ttf ABCFavorit-Regular-Named.ttf"
```

## Configuration for GitHub Pages

In `docusaurus.config.js`, update the following fields:

```js
const config = {
  // ...
  url: "https://weijiekoh.github.io",
  baseUrl: "/<repo-name>/", // must match the GitHub repo name
  organizationName: "weijiekoh",
  projectName: "<repo-name>",
  // ...
};
```

Replace `<repo-name>` with the actual GitHub repository name.

## Build & Preview

```bash
npm install
npm run build
npm run serve
```

## Deploy to GitHub Pages

### Option A: Manual deploy via CLI

```bash
GIT_USER=<your-github-username> npm run build && npx docusaurus deploy
```

This pushes the built site to the `gh-pages` branch.

### Option B: GitHub Actions (recommended)

A workflow is included at `.github/workflows/deploy.yml` that automatically:

1. Triggers on push to `wj/v2` (TODO: update this)
2. Downloads fonts from S3
3. Runs `npm run build`
4. Deploys `build/` to GitHub Pages via `actions/deploy-pages`

To use it, enable GitHub Pages in the repository settings and set the source to **GitHub Actions**.

## Algolia Search (optional)

TODO: figure this out

To enable Algolia search, set the following environment variables:

```bash
export ALGOLIA_APP_ID=<your-app-id>
export ALGOLIA_API_KEY=<your-api-key>
export ALGOLIA_INDEX_NAME=<your-index-name>
```
