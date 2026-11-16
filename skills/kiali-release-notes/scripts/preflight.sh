#!/usr/bin/env bash
# Verify CLI tools and GitHub access for release-notes collection (project 67).
set -euo pipefail

readonly KIALI_SPRINT_PROJECT_NUMBER="${KIALI_SPRINT_PROJECT_NUMBER:-67}"

fail() {
  echo "error: $*" >&2
  exit 1
}

hint_refresh() {
  cat >&2 <<'EOF'
Fix GitHub CLI auth for org projects:
  gh auth login
  gh auth refresh -h github.com -s read:org -s read:project
Verify:
  gh auth status -h github.com
  gh project list --owner kiali --limit 3
EOF
}

for bin in gh jq git; do
  command -v "$bin" >/dev/null 2>&1 || fail "$bin is not on PATH"
done

if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "error: gh is not logged in to github.com" >&2
  hint_refresh
  exit 1
fi

if ! gh project list --owner kiali --limit 1 >/dev/null 2>&1; then
  echo "error: cannot list projects for org kiali (missing read:org or read:project?)" >&2
  hint_refresh
  exit 1
fi

graphql_query='
query($projectNumber: Int!) {
  organization(login: "kiali") {
    projectV2(number: $projectNumber) {
      title
    }
  }
}
'

if ! response="$(gh api graphql -f query="$graphql_query" -F projectNumber="$KIALI_SPRINT_PROJECT_NUMBER" 2>&1)"; then
  echo "error: GraphQL request failed for project ${KIALI_SPRINT_PROJECT_NUMBER}" >&2
  echo "$response" >&2
  if grep -q 'INSUFFICIENT_SCOPES' <<<"$response"; then
    echo "error: token needs read:project (and read:org) for sprint board access" >&2
  fi
  hint_refresh
  exit 1
fi

if echo "$response" | jq -e '.errors | length > 0' >/dev/null 2>&1; then
  echo "error: GraphQL returned errors for project ${KIALI_SPRINT_PROJECT_NUMBER}" >&2
  jq -r '.errors[]?.message // .' <<<"$response" >&2
  hint_refresh
  exit 1
fi

title="$(jq -r '.data.organization.projectV2.title // empty' <<<"$response")"
[[ -n "$title" ]] || fail "project ${KIALI_SPRINT_PROJECT_NUMBER} not found or not visible to this token"

echo "preflight ok"
echo "  tools: gh, jq, git"
echo "  github: authenticated"
echo "  project ${KIALI_SPRINT_PROJECT_NUMBER}: ${title}"