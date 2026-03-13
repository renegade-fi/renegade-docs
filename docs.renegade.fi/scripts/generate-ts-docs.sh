#!/usr/bin/env bash
# Generate TypeScript SDK documentation using typedoc and copy into static/sdk/typescript/
# so Docusaurus serves it at {baseUrl}/sdk/typescript/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATIC_TS_DIR="$PROJECT_ROOT/static/sdk/typescript"

REPO_URL="https://github.com/renegade-fi/typescript-sdk.git"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning typescript-sdk into $TMP_DIR..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

echo "Installing dependencies..."
cd "$TMP_DIR"
pnpm install

echo "Running typedoc..."
npx typedoc packages/external-match/src/index.ts \
  --tsconfig packages/external-match/tsconfig.build.json \
  --out docs

echo "Copying docs to $STATIC_TS_DIR..."
rm -rf "$STATIC_TS_DIR"
mkdir -p "$STATIC_TS_DIR"
cp -r docs/* "$STATIC_TS_DIR/"

echo "Done. TypeScript docs available at static/sdk/typescript/"
