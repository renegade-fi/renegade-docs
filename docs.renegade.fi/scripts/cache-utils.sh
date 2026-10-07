#!/usr/bin/env bash
# Shared build caching utilities.
# Uses node_modules/.cache/ which Vercel persists between builds.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CACHE_BASE="$PROJECT_ROOT/node_modules/.cache/renegade-docs"

# get_remote_head <repo_url>
# Prints the HEAD commit hash of a remote repo.
get_remote_head() {
  git ls-remote "$1" HEAD | cut -f1
}

# cache_check <cache_name> <cache_key>
# Returns 0 if a cached artifact exists for the given key.
cache_check() {
  local cache_dir="$CACHE_BASE/$1"
  [ -f "$cache_dir/$2.key" ]
}

# cache_restore <cache_name> <target_dir>
# Restores cached artifact into the target directory.
cache_restore() {
  local cache_dir="$CACHE_BASE/$1"
  rm -rf "$2"
  mkdir -p "$2"
  tar -xzf "$cache_dir/artifact.tar.gz" -C "$2"
}

# cache_save <cache_name> <cache_key> <source_dir>
# Saves a directory as a cached artifact, replacing any previous cache for this name.
cache_save() {
  local cache_dir="$CACHE_BASE/$1"
  rm -rf "$cache_dir"
  mkdir -p "$cache_dir"
  tar -czf "$cache_dir/artifact.tar.gz" -C "$2" .
  touch "$cache_dir/$3.key"
}
