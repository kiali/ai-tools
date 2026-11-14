#!/usr/bin/env bash
# Build candidate release notes (prefixed titles) from Done issues + orphan Done PRs.
set -euo pipefail

readonly KIALI_SPRINT_PROJECT_NUMBER="${KIALI_SPRINT_PROJECT_NUMBER:-67}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "usage: $0 [--include-ci] [version] [projectNumber=${KIALI_SPRINT_PROJECT_NUMBER}]" >&2
  echo "  Candidate release-notes block with suggested prefixes and titles." >&2
  echo "  Orphan PRs are classified Features vs Fixes using the bug label." >&2
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

include_ci=false
if [[ "${1:-}" == "--include-ci" ]]; then
  include_ci=true
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
            __typename
            ... on Issue {
              title
              url
              state
              labels(first: 20) { nodes { name } }
            }
            ... on PullRequest {
              title
              url
              merged
              state
              repository { name owner { login } }
              labels(first: 20) { nodes { name } }
              closingIssuesReferences(first: 20) {
                nodes { url }
              }
            }
          }
        }
      }
    }
  }
}'

all_items_json='[]'
project_title=""
cursor=""

while true; do
  if [[ -z "$cursor" ]]; then
    page="$(gh api graphql -f query="$graphql_query" -F projectNumber="$project_number")"
  else
    page="$(gh api graphql \
      -f query="$graphql_query" \
      -F projectNumber="$project_number" \
      -f cursor="$cursor")"
  fi

  project_title="$(jq -r '.data.organization.projectV2.title // empty' <<<"$page")"

  batch="$(jq -c '
    [
      .data.organization.projectV2.items.nodes[]?
      | select((.fieldValueByName.name // "") | test("Done$"))
      | .content
      | if .__typename == "Issue" and (.state == "CLOSED" or .state == "MERGED") then
          {title, url, labels}
        elif .__typename == "PullRequest"
          and .merged == true
          and ((.closingIssuesReferences.nodes // []) | length) == 0
          and (.url | test("^https://github\\.com/kiali/"))
          and ((.title | test("^\\[v2\\.[0-9]+\\]")) | not)
          and (.repository.name != "kiali.io" and .repository.name != "ai-tools") then
          {title, url, labels: (.labels // {nodes: []})}
        else
          empty
        end
    ]
  ' <<<"$page")"
  all_items_json="$(jq -s 'add' <<<"${all_items_json}${batch}")"

  has_next="$(jq -r '.data.organization.projectV2.items.pageInfo.hasNextPage' <<<"$page")"
  cursor="$(jq -r '.data.organization.projectV2.items.pageInfo.endCursor // empty' <<<"$page")"
  [[ "$has_next" == "true" && -n "$cursor" ]] || break
done

all_items_json="$(jq 'unique_by(.url)' <<<"$all_items_json")"

if [[ "$include_ci" == false ]]; then
  all_items_json="$(jq -f "${SCRIPT_DIR}/filter-items.jq" <<<"$all_items_json")"
fi

if [[ -n "$version_override" ]]; then
  version="$version_override"
else
  version="$(version_from_project_title "$project_title")" || {
    echo "error: could not parse version from project title: ${project_title}" >&2
    exit 1
  }
fi

release_date="$(default_release_date)"
refined="$(jq -f "${SCRIPT_DIR}/refine-items.jq" <<<"$all_items_json")"
feature_lines="$(jq -r '.features[]' <<<"$refined")"
fix_lines="$(jq -r '.fixes[]' <<<"$refined")"

{
  echo "<!-- Candidate release notes for review. Drop rows by issue/PR number in the link URL. -->"
  echo
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

echo "project: ${project_title} (#${project_number})" >&2
echo "version: ${version}" >&2
echo "release_date: ${release_date}" >&2
echo "items: $(jq 'length' <<<"$all_items_json")" >&2
echo "features: $(jq '.features | length' <<<"$refined")" >&2
echo "fixes: $(jq '.fixes | length' <<<"$refined")" >&2
