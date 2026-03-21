#!/usr/bin/env bash
# Install build dependencies not available in Vercel's default build image
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/cache-utils.sh"

# Install Go
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
go version

# Install Python 3.13 via standalone build
PYTHON_VERSION="3.13.2"
if cache_check "python-toolchain" "$PYTHON_VERSION"; then
  echo "Cache hit for Python ${PYTHON_VERSION}, restoring..."
  mkdir -p /tmp/python
  cache_restore "python-toolchain" /tmp/python
else
  echo "Installing Python ${PYTHON_VERSION}..."
  curl -sL "https://github.com/astral-sh/python-build-standalone/releases/download/20250212/cpython-${PYTHON_VERSION}+20250212-x86_64-unknown-linux-gnu-install_only_stripped.tar.gz" | tar -xz -C /tmp
  cache_save "python-toolchain" /tmp/python "$PYTHON_VERSION"
fi
export PATH="/tmp/python/bin:$PATH"
python3 --version

# Install Rust nightly (Vercel has rustup pre-installed at /rust/bin)
RUST_NIGHTLY="nightly-2025-11-25"
echo "Installing Rust ${RUST_NIGHTLY}..."
rustup toolchain install "$RUST_NIGHTLY"
rustup default "$RUST_NIGHTLY"
rustc --version
