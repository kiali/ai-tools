#!/usr/bin/env bash
# Build a release-notes.md section from a Kiali org GitHub Project (ProjectV2).
# Uses gh GraphQL (same data as kiali.io/scripts/relnotes.py); no Python.
set -euo pipefail

# Kiali sprint board (ProjectV2): https://github.com/orgs/kiali/projects/67
readonly KIALI_SPRINT_PROJECT_NUMBER="${KIALI_SPRINT_PROJECT_NUMBER:-67}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "usage: $0 [--raw] [version] [projectNumber=${KIALI_SPRINT_PROJECT_NUMBER}]" >&2
  echo "  version defaults from project title (e.g. \"Kiali v2.35\" -> 2.35.0)" >&2
  echo "  default output is a sorted heuristic draft; agent refines per refinement.md" >&2
  echo "  --raw emits unrefined GitHub titles (sorted only)" >&2
  exit 1
}

version_from_project_title() {
  local title="$1"
  local raw
  raw="$(sed -nE 's/.*[Kk]iali v([0-9]+\.[0-9]+(\.[0-9]+)?).*/\1/p' <<<"$title")"
  if [[ -z "$raw" ]]; then
    return 1
  fi
  if [[ "$raw" =~ ^[0-9]+\.[0-9]+$ ]]; then
    echo "${raw}.0"
  else
    echo "$raw"
  fi
}

# First Monday strictly after today (Kiali upstream release cadence).
default_release_date() {
  if [[ -n "${RELEASE_DATE:-}" ]]; then
    echo "$RELEASE_DATE"
    return
  fi
  local day=1
  while [[ "$(date -d "+${day} days" +%u)" != "1" ]]; do
  day=$((day + 1))
  done
  date -d "+${day} days" +"%B %-d, %Y"
}

command -v gh >/dev/null 2>&1 || {
  echo "error: gh CLI is required" >&2
  exit 1
}
command -v jq >/dev/null 2>&1 || {
  echo "error: jq is required" >&2
  exit 1
}

raw_output=false
if [[ "${1:-}" == "--raw" ]]; then
  raw_output=true
  shift
fi

[[ $# -le 2 ]] || usage

version_override="${1:-}"
project_number="${2:-$KIALI_SPRINT_PROJECT_NUMBER}"

graphql_query='
query($projectNumber: Int!, $cursor: String) {
  organization(login: "kiali") {
    projectV2(number: $projectNumber) {
      title
      shortDescription
      items(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
          content {
            ... on Issue {
              title
              url
              state
              labels(first: 20) { nodes { name } }
            }
          }
        }
      }
    }
  }
}'

items_json='[]'
project_title=""
project_description=""
cursor=""

while true; do
  if [[ -z "$cursor" ]]; then
    page="$(gh api graphql \
      -f query="$graphql_query" \
      -F projectNumber="$project_number")"
  else
    page="$(gh api graphql \
      -f query="$graphql_query" \
      -F projectNumber="$project_number" \
      -f cursor="$cursor")"
  fi

  project_title="$(jq -r '.data.organization.projectV2.title // empty' <<<"$page")"
  project_description="$(jq -r '.data.organization.projectV2.shortDescription // empty' <<<"$page")"

  batch="$(jq -c '
    [
      .data.organization.projectV2.items.nodes[]?
      | select((.fieldValueByName.name // "") | test("Done$"))
      | .content
      | select(type == "object")
    ]
  ' <<<"$page")"
  items_json="$(jq -s 'add' <<<"${items_json}${batch}")"

  has_next="$(jq -r '.data.organization.projectV2.items.pageInfo.hasNextPage' <<<"$page")"
  cursor="$(jq -r '.data.organization.projectV2.items.pageInfo.endCursor // empty' <<<"$page")"

  [[ "$has_next" == "true" && -n "$cursor" ]] || break
done

if [[ -n "$version_override" ]]; then
  version="$version_override"
else
  version="$(version_from_project_title "$project_title")" || {
    echo "error: could not parse version from project title: ${project_title}" >&2
    echo "error: pass version explicitly as the first argument" >&2
    exit 1
  }
fi

release_date="$(default_release_date)"

closed_items="$(jq -c '
  [.[] | select(.state == "CLOSED" or .state == "MERGED")]
' <<<"$items_json")"

# Deduplicate by issue URL across paginated project pages.
closed_items="$(jq 'unique_by(.url)' <<<"$closed_items")"

if [[ "$raw_output" == true ]]; then
  feature_lines="$(jq -r '
    .[] |
    select(
      ([.labels.nodes[].name] | index("bug")) | not
    ) |
    (.title | gsub("\\["; "(") | gsub("\\]"; ")")) as $t |
    "* [\($t)](\(.url))"
  ' <<<"$closed_items" | LC_ALL=C sort -f)"

  fix_lines="$(jq -r '
    .[] |
    select([.labels.nodes[].name] | index("bug")) |
    (.title | gsub("\\["; "(") | gsub("\\]"; ")")) as $t |
    "* [\($t)](\(.url))"
  ' <<<"$closed_items" | LC_ALL=C sort -f)"
else
  refined="$(jq -f "${SCRIPT_DIR}/refine-items.jq" <<<"$closed_items")"
  feature_lines="$(jq -r '.features[]' <<<"$refined")"
  fix_lines="$(jq -r '.fixes[]' <<<"$refined")"
fi

{
  echo "## ${version}"
  echo "Release: ${release_date}"
  echo
  echo "Features:"
  echo
  if [[ -n "$feature_lines" ]]; then
    echo "$feature_lines"
  fi
  echo
  echo "Fixes:"
  echo
  if [[ -n "$fix_lines" ]]; then
    echo "$fix_lines"
  fi
} >&1

# Metadata for agent review (stderr, not part of pasted section)
echo "project: ${project_title} (#${project_number})" >&2
echo "version: ${version}" >&2
echo "release_date: ${release_date}" >&2
if [[ -n "$project_description" ]]; then
  echo "sprint_range: ${project_description}" >&2
fi
echo "closed items: $(jq 'length' <<<"$closed_items")" >&2
