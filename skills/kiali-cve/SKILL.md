---
name: kiali-cve
description: Triage and review OSSM Jira CVE issues for the Kiali component. Two features - triage (find new CVEs, close inapplicable issues, create fix PRs for master and supported branches) and review (review fix PRs across branches, verify consistency and CI, approve, merge, update Jira). Use when the user mentions CVE triage, CVE review, OSSM CVE, or kiali-cve.
disable-model-invocation: true
---

# Kiali CVE Management

Two features: **triage** and **review**.

| Trigger | Feature | Action |
|---------|---------|--------|
| "triage", "kiali-cve:triage", "new CVEs" | Triage | Read [triage.md](triage.md) and follow its steps |
| "review", "kiali-cve:review", "review CVE PRs" | Review | Read [review.md](review.md) and follow its steps |

If intent is unclear, ask the user which feature they want.

IMPORTANT: Never modify Jira issues without explicit user approval. Present all
proposed changes and wait for confirmation before executing any updates.

## Tool Access Verification

Before either feature, verify all tools in parallel:

1. **Jira MCP**: `jira_search` with query
   `project = OSSM AND summary ~ CVE ORDER BY created DESC` (limit 1)
2. **GitHub CLI**: `gh auth status`
3. **GitLab CLI**: `glab auth status --hostname gitlab.cee.redhat.com`

If any fails, report and stop:
- Jira: "The Jira MCP server is not connected. Check MCP configuration."
- GitHub: "Run: `gh auth login`"
- GitLab: "Run: `glab auth login --hostname gitlab.cee.redhat.com`"

## Jira API Reference

### Transition IDs

| Transition | ID | Notes |
|---|---|---|
| New | 11 | |
| In Progress | 41 | |
| Closed | 61 | |
| Code Review | — | Discover via `jira_get_transitions` on first use |
| Release Pending | 131 | |

The "Code Review" transition ID is not hardcoded. On first use, call
`jira_get_transitions` on any In Progress OSSM issue and cache the ID
for the session. Always verify transition IDs before transitioning.

### CVE Lifecycle

```
New → In Progress → [create PRs] → Code Review → [merge PRs] → Release Pending
                                    ^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                    triage sets    review sets
```

### Custom Fields

| Field | ID | Type | Notes |
|---|---|---|---|
| VEX Justification | `customfield_10873` | Select | Values below |
| Git Pull Request | `customfield_10875` | Textarea | GitHub PR URL |

### VEX Justification Values (case-sensitive)

- `"Component not Present"` — language component absent (e.g. JS CVE on Python operator)
- `"Vulnerable Code not Present"` — code doesn't exist (e.g. CVE targets Go 1.26, Kiali uses 1.25)
- `"Vulnerable Code not in Execute Path"` — code exists but never called by Kiali

### API Parameter Notes

- `jira_transition_issue`: `fields` is an **object**
  (e.g. `{"resolution": {"name": "Not a Bug"}}`)
- `jira_add_comment`: comment text parameter is **`comment`**
- `jira_update_issue`: `fields` is an **object**; for assignee use flat email
  string (e.g. `{"assignee": "user@example.com"}`)
- Comments cannot be included in `jira_transition_issue` (ADF format error).
  Add separately via `jira_add_comment`.
- VEX cannot be set in transition call. Set via `jira_update_issue` after.

### Closure Sequences

**"Not a Bug"** (JS operator issues, Go not-exposed, early closures):
1. `jira_transition_issue` — transition_id `"61"`,
   fields `{"resolution": {"name": "Not a Bug"}}`
2. `jira_add_comment` — comment text
3. `jira_update_issue` —
   `{"customfield_10873": {"value": "<VEX value>"}}`

**"Won't Do"** (Go older operator versions):
1. `jira_transition_issue` — transition_id `"61"`,
   fields `{"resolution": {"name": "Won't Do"}}`
2. `jira_add_comment` — comment text
3. No VEX for Won't Do.

## Issue Naming and Image Classification

Pattern: `CVE-YYYY-NNNNN <registry>/<image>: <library>: <description> [ossm-X.Y]`

| Category | Image strings | Language |
|---|---|---|
| Operator | `kiali-rhel9-operator` | Python/Ansible |
| Bundle | `kiali-operator-bundle` | OLM metadata (no code) |
| Server | `kiali-rhel9`, `kiali-rhel8` | Go + JS frontend |
| OSSMC | `kiali-ossmc-rhel9`, `kiali-ossmc-rhel8` | JS |
| Konflux | `redhat-user-workloads/kiali-X-Y` | Varies |
| Konflux OSSMC | `kiali-X-Y-ossmc` | JS |

## PR Conventions

- PRs **must not** reference OSSM Jira issue keys (public repo, internal issues)
- Master/main PRs get `backport needed` label
- Backport PR descriptions reference master PR number for cross-linking
- All PRs added to the Kiali GitHub Project with "In review" status
- Merge method: `merge` (not squash or rebase)

### GitHub Project Setup

After creating a PR, add it to the Kiali project:

```bash
gh project list --owner kiali --format json
gh project item-add <PROJECT_NUMBER> --owner kiali --url <PR_URL>
```

Then set status to "In review":
```bash
gh project item-list <PROJECT_NUMBER> --owner kiali --format json --limit 200
gh project field-list <PROJECT_NUMBER> --owner kiali --format json
gh project item-edit \
  --project-id <PROJECT_ID> \
  --id <ITEM_ID> \
  --field-id <STATUS_FIELD_ID> \
  --single-select-option-id <IN_REVIEW_OPTION_ID>
```

## Code Freeze Check

Before creating or merging backport PRs, check downstream code freeze:

```bash
glab api --hostname gitlab.cee.redhat.com \
  "projects/istio%2Fkonflux%2Fkiali-fbc/repository/files/renovate.json/raw?ref=main"
```

If `"automerge": false` in `packageRules`, code freeze is enabled.
Warn the user and ask whether to proceed with "Do Not Merge" labels or skip.

## Version Mapping

The OSSM-to-Kiali branch mapping is in the "Supported Branches" table in
`AGENTS.md`. Always read it before creating or reviewing backport PRs.
`master` maps to the next unreleased OSSM version (not a backport target).

## Kiali Maintainers (for reviewer selection)

Exclude the PR assignee (cannot review own PR):
- `jshaughn`
- `ferhoyos`
- `hhovsepy`

## Repos

| Repo | Main branch | Dependency path | Image type |
|---|---|---|---|
| `kiali/kiali` | `master` | `frontend/` (JS), root (Go) | Server |
| `kiali/openshift-servicemesh-plugin` | `main` | `plugin/` (JS) | OSSMC |
