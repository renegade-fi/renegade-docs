#!/usr/bin/env bash
# Generate Rust SDK documentation using cargo doc and copy into static/sdk/rust/
# so Docusaurus serves it at {baseUrl}/sdk/rust/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATIC_RUST_DIR="$PROJECT_ROOT/static/sdk/rust"

REPO_URL="https://github.com/renegade-fi/rust-sdk.git"

source "$SCRIPT_DIR/cache-utils.sh"

CACHE_KEY="$(get_remote_head "$REPO_URL")"
if cache_check "rust-docs" "$CACHE_KEY"; then
  echo "Cache hit for Rust docs ($CACHE_KEY), restoring..."
  cache_restore "rust-docs" "$STATIC_RUST_DIR"
  echo "Done. Rust docs restored from cache."
  exit 0
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning rust-sdk into $TMP_DIR..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

echo "Running cargo doc..."
cd "$TMP_DIR"
RUSTC_BOOTSTRAP=1 cargo doc --no-deps

echo "Copying docs to $STATIC_RUST_DIR..."
rm -rf "$STATIC_RUST_DIR"
mkdir -p "$STATIC_RUST_DIR"
cp -r target/doc/* "$STATIC_RUST_DIR/"

cache_save "rust-docs" "$STATIC_RUST_DIR" "$CACHE_KEY"
echo "Done. Rust docs available at static/sdk/rust/"
