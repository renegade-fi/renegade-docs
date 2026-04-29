#!/usr/bin/env bash
# Generate Python SDK documentation using pdoc and copy into static/sdk/python/
# so Docusaurus serves it at {baseUrl}/sdk/python/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
STATIC_PY_DIR="$PROJECT_ROOT/static/sdk/python"

REPO_URL="https://github.com/renegade-fi/python-sdk.git"

source "$SCRIPT_DIR/cache-utils.sh"

CACHE_KEY="$(get_remote_head "$REPO_URL")"
if cache_check "python-docs" "$CACHE_KEY"; then
  echo "Cache hit for Python docs ($CACHE_KEY), restoring..."
  cache_restore "python-docs" "$STATIC_PY_DIR"
  echo "Done. Python docs restored from cache."
  exit 0
fi

# Install Python (only needed on cache miss)
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

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning python-sdk into $TMP_DIR..."
git clone --depth 1 "$REPO_URL" "$TMP_DIR"

echo "Installing dependencies..."
cd "$TMP_DIR"
python3 -m venv "$TMP_DIR/.venv"
source "$TMP_DIR/.venv/bin/activate"
pip install .
pip install pdoc

echo "Generating docs..."
pdoc ./renegade -o "$TMP_DIR/docs"

echo "Copying docs to $STATIC_PY_DIR..."
rm -rf "$STATIC_PY_DIR"
mkdir -p "$STATIC_PY_DIR"
cp -r "$TMP_DIR/docs/"* "$STATIC_PY_DIR/"

cache_save "python-docs" "$STATIC_PY_DIR" "$CACHE_KEY"
echo "Done. Python docs available at static/sdk/python/"
