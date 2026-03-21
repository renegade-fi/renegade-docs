#!/usr/bin/env bash
# Generate Go SDK documentation using doc2go and copy into static/sdk/golang/
# so Docusaurus serves it at {baseUrl}/sdk/go/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATIC_GO_DIR="$PROJECT_ROOT/static/sdk/golang"

REPO_URL="https://github.com/renegade-fi/golang-sdk.git"

source "$SCRIPT_DIR/cache-utils.sh"

CACHE_KEY="$(get_remote_head "$REPO_URL")"
if cache_check "go-docs" "$CACHE_KEY"; then
  echo "Cache hit for Go docs ($CACHE_KEY), restoring..."
  cache_restore "go-docs" "$STATIC_GO_DIR"
  echo "Done. Go docs restored from cache."
  exit 0
fi

# Install Go (only needed on cache miss)
GO_VERSION="1.23.6"
if cache_check "go-toolchain" "$GO_VERSION"; then
  echo "Cache hit for Go ${GO_VERSION}, restoring..."
  mkdir -p /tmp/go
  cache_restore "go-toolchain" /tmp/go
else
  echo "Installing Go ${GO_VERSION}..."
  curl -sL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" | tar -xz -C /tmp
  cache_save "go-toolchain" /tmp/go "$GO_VERSION"
fi
export PATH="/tmp/go/bin:$PATH"
export GOPATH="/tmp/gopath"
export PATH="$GOPATH/bin:$PATH"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Cloning golang-sdk..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

echo "Installing doc2go..."
go install go.abhg.dev/doc2go@latest
export PATH="$(go env GOPATH)/bin:$PATH"

echo "Generating docs..."
cd "$TMP_DIR"
doc2go -out "$TMP_DIR/docs" ./...

echo "Copying docs..."
rm -rf "$STATIC_GO_DIR"
mkdir -p "$STATIC_GO_DIR"
cp -r "$TMP_DIR/docs/"* "$STATIC_GO_DIR/"

cache_save "go-docs" "$STATIC_GO_DIR" "$CACHE_KEY"
echo "Done. Go docs available at static/sdk/golang/"
