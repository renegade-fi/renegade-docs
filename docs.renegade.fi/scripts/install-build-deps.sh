#!/usr/bin/env bash
# Install build dependencies not available in Vercel's default build image
set -euo pipefail

# Install Go
GO_VERSION="1.23.6"
echo "Installing Go ${GO_VERSION}..."
curl -sL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" | tar -xz -C /tmp
export PATH="/tmp/go/bin:$PATH"
export GOPATH="/tmp/gopath"
export PATH="$GOPATH/bin:$PATH"
go version

# Install Python 3.13 via standalone build
PYTHON_VERSION="3.13.2"
echo "Installing Python ${PYTHON_VERSION}..."
curl -sL "https://github.com/indygreg/python-build-standalone/releases/download/20250212/cpython-${PYTHON_VERSION}+20250212-x86_64-unknown-linux-gnu-install_only_stripped.tar.gz" | tar -xz -C /tmp
export PATH="/tmp/python/bin:$PATH"
python3 --version

# Install Rust nightly
RUST_NIGHTLY="nightly-2025-11-25"
echo "Installing Rust ${RUST_NIGHTLY}..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain "$RUST_NIGHTLY"
export PATH="$HOME/.cargo/bin:$PATH"
rustc --version
