#!/usr/bin/env bash
# Generate TypeScript SDK documentation using typedoc and copy into static/sdk/typescript/
# so Docusaurus serves it at {baseUrl}/sdk/typescript/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATIC_TS_DIR="$PROJECT_ROOT/static/sdk/typescript"

REPO_URL="https://github.com/renegade-fi/typescript-sdk.git"

source "$SCRIPT_DIR/cache-utils.sh"

CACHE_KEY="$(get_remote_head "$REPO_URL")"
if cache_check "ts-docs" "$CACHE_KEY"; then
  echo "Cache hit for TypeScript docs ($CACHE_KEY), restoring..."
  cache_restore "ts-docs" "$STATIC_TS_DIR"
  echo "Done. TypeScript docs restored from cache."
  exit 0
fi

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

# typedoc resolves TS via a peer dep; npx pulls the latest TypeScript, which no
# longer auto-includes @types/node implicitly. Force-include it via tsconfig.
node -e '
const fs = require("fs");
const file = "packages/external-match/tsconfig.build.json";
const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
cfg.compilerOptions = { ...(cfg.compilerOptions || {}), types: ["node"] };
fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
'

echo "Running typedoc..."
npx typedoc packages/external-match/src/index.ts \
  --tsconfig packages/external-match/tsconfig.build.json \
  --out docs

echo "Copying docs to $STATIC_TS_DIR..."
rm -rf "$STATIC_TS_DIR"
mkdir -p "$STATIC_TS_DIR"
cp -r docs/* "$STATIC_TS_DIR/"

cache_save "ts-docs" "$STATIC_TS_DIR" "$CACHE_KEY"
echo "Done. TypeScript docs available at static/sdk/typescript/"
