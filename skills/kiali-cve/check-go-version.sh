#!/bin/bash
# Check which Go version compiled a binary inside a container image.
#
# Reads build metadata embedded in the binary (go version -m). This is the
# authoritative Go toolchain for the shipped product — not the latest
# openshift-golang-builder tag and not upstream go.mod.
#
# Usage:
#   ./check-go-version.sh <image> [binary-path]
#   ./check-go-version.sh --version-only <image> [binary-path]
#
# Examples:
#   ./check-go-version.sh registry.redhat.io/openshift-service-mesh/kiali-rhel9:v2.22
#   ./check-go-version.sh --version-only docker://registry.redhat.io/.../kiali-rhel9:v2.22
#
# Prerequisites:
#   podman, go (local CLI for "go version -m")
#   Red Hat registry auth — see SKILL.md (Terms-Based Registry service account)

set -euo pipefail

VERSION_ONLY=false
if [[ "${1:-}" == "--version-only" ]]; then
  VERSION_ONLY=true
  shift
fi

IMAGE="${1:?Usage: $0 [--version-only] <image> [binary-path]}"
BIN_PATH="${2:-/opt/kiali/kiali}"

CID=$(podman run -d --entrypoint sleep "$IMAGE" infinity)
TMP=$(mktemp)
trap 'rm -f "$TMP"; podman rm -f "$CID" >/dev/null 2>&1' EXIT

if ! podman cp "$CID:$BIN_PATH" "$TMP" 2>/dev/null; then
  echo "error: binary not found at $BIN_PATH in $IMAGE" >&2
  exit 1
fi

# sed -n '1p' avoids SIGPIPE from head -1 under set -o pipefail
OUTPUT=$(go version -m "$TMP" 2>&1 | sed -n '1p')
# e.g. /tmp/tmp.abc: go1.23.3
GO_VERSION=$(echo "$OUTPUT" | sed -n 's/.*: go\([0-9][0-9.]*\).*/\1/p')

if [[ -z "$GO_VERSION" ]]; then
  echo "error: could not parse Go version from: $OUTPUT" >&2
  exit 1
fi

if $VERSION_ONLY; then
  echo "$GO_VERSION"
else
  echo "$OUTPUT"
  echo "version=$GO_VERSION"
fi
