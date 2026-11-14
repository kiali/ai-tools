#!/usr/bin/env bash
# Merged PRs on the sprint project in Status Done, with no linked closing issue.
set -euo pipefail

readonly KIALI_SPRINT_PROJECT_NUMBER="${KIALI_SPRINT_PROJECT_NUMBER:-67}"
command -v gh >/dev/null 2>&1 || {
  echo "error: gh CLI is required" >&2
  exit 1
}
command -v jq >/dev/null 2>&1 || {
  echo "error: jq is required" >&2
  exit 1
}

show_all=false
project_number="$KIALI_SPRINT_PROJECT_NUMBER"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --all) show_all=true; shift ;;
    -h|--help)
      echo "usage: $0 [--all] [projectNumber=${KIALI_SPRINT_PROJECT_NUMBER}]" >&2
      echo "  Lists merged PRs in project Status Done with no closingIssuesReferences." >&2
      echo "  Default filters hide backports, dependabot, CI, and non-product repos." >&2
      exit 0
      ;;
    *)
      project_number="$1"
      shift
      ;;
  esac
done

graphql_query='
query($projectNumber: Int!, $cursor: String) {
  organization(login: "kiali") {
    projectV2(number: $projectNumber) {
      title
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
            ... on PullRequest {
              title
              url
              merged
              state
              repository { name owner { login } }
              closingIssuesReferences(first: 20) {
                nodes { url number }
              }
            }
          }
        }
      }
    }
  }
}'

prs_json='[]'
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
      | select(
          . != null
          and .__typename == "PullRequest"
          and .merged == true
          and ((.closingIssuesReferences.nodes // []) | length) == 0
        )
    ]
  ' <<<"$page")"
  prs_json="$(jq -s 'add' <<<"${prs_json}${batch}")"

  has_next="$(jq -r '.data.organization.projectV2.items.pageInfo.hasNextPage' <<<"$page")"
  cursor="$(jq -r '.data.organization.projectV2.items.pageInfo.endCursor // empty' <<<"$page")"
  [[ "$has_next" == "true" && -n "$cursor" ]] || break
done

prs_json="$(jq 'unique_by(.url)' <<<"$prs_json")"

if [[ "$show_all" == true ]]; then
  filtered="$prs_json"
else
  filtered="$(jq '
    [
      .[] |
      select(.url | test("^https://github\\.com/kiali/")) |
      select(
        (.title | test("\\[dependabot\\]"; "i")) | not
      ) |
      select(
        (.title | test("^\\[v2\\.[0-9]+\\]")) | not
      ) |
      select(
        (.title | test("^\\[CI\\]|^\\[tests\\]|Rebase epic|tag-release-creator|mirror\\.openshift"; "i")) | not
      ) |
      select(
        (.repository.name == "kiali.io" or .repository.name == "ai-tools") | not
      ) |
      select(
        (.title | test("Bump Go|CVE-[0-9]|dependabot|bookinfo.*traffic"; "i")) | not
      )
    ]
  ' <<<"$prs_json")"
fi

count="$(jq 'length' <<<"$filtered")"
total="$(jq 'length' <<<"$prs_json")"

echo "# Standalone PRs (Status Done, merged, no linked closing issue)" >&2
echo "project: ${project_title} (#${project_number})" >&2
echo "candidates: ${total} (showing ${count} after noise filters; use --all for full list)" >&2
echo >&2

if [[ "$count" -eq 0 ]]; then
  echo "_No candidates after filtering._"
  exit 0
fi

jq -r '
  sort_by(.repository.name, (.title | ascii_downcase))
  | .[]
  | "- [\(.repository.name)] [\(.title)](\(.url))"
' <<<"$filtered"
