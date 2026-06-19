---
name: kiali-cve
description: Triage and review OSSM Jira CVE issues for the Kiali component. Two features - triage (find new CVEs, close inapplicable issues, create fix PRs for master and supported branches) and review (review fix PRs across branches, verify consistency and CI, approve, merge, update Jira). Use when the user mentions CVE triage, CVE review, OSSM CVE, or kiali-cve.
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
The same approval rule applies to adding CVE PRs to the Kiali GitHub Project
— ask first, then act only after the user confirms.

## Tool Access Verification

Before either feature, verify all tools in parallel:

1. **Jira MCP**: `jira_search` with query
   `project = OSSM AND summary ~ CVE ORDER BY created DESC` (limit 1)
2. **GitHub CLI**: `gh auth status` (`repo` scope minimum for PR creation).
   Project-board access is verified separately when the user approves
   adding PRs to the project (see GitHub Project Setup). Do not block
   triage on project scopes at Step 0.
3. **GitLab CLI**: `glab auth status --hostname gitlab.cee.redhat.com`

If any fails, report and stop:
- Jira: "The Jira MCP server is not connected. Check MCP configuration."
- GitHub: "Run: `gh auth login`"
- GitHub Project (when adding PRs to the project): "Run:
  `gh auth refresh -h github.com -s read:org,read:project,project` and
  complete the browser/device authorization. Verify with
  `gh project list --owner kiali`."
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
- Backport PR descriptions **must** reference master/main PR number
  (e.g. "Backport of #<NUMBER> to <branch>.") for GitHub cross-references
- All PRs added to the Kiali GitHub Project with "In review" status
  (requires user approval — see GitHub Project Setup)
- Merge method: `squash` (kiali repos only allow squash merge)

### Requesting a reviewer

Before creating the first PR (master/main), ask the user who should
review the PRs. Look up repository collaborators with write access
using `gh api repos/<owner>/<repo>/collaborators --jq '.[].login'`,
**exclude the PR assignee** (cannot review own PR), and present the
list as options.

The selected reviewer applies to **all** PRs for this CVE (master,
backports, and OSSMC). After creating each PR, request review:

```bash
gh pr edit <PR_NUMBER> --repo <REPO> --add-reviewer <REVIEWER>
```

### Adding "backport needed" label to master/main PRs

After creating the PR against `master` (or `main` for OSSMC), add the
`backport needed` label:

```bash
gh pr edit <PR_NUMBER> --repo <REPO> --add-label "backport needed"
```

This label is only added to the master/main PR, not to backport PRs.

### Setting the Git Pull Request field on Jira issues

Before transitioning issues to Code Review or Release Pending, set
the "Git Pull Request" custom field (`customfield_10875`) on each
issue with the PR URL for the branch that corresponds to the issue's
OSSM version. Kiali server issues and OSSMC issues are separate Jira
tickets, so each issue maps to exactly one PR URL.

`jira_update_issue` with fields
`{"customfield_10875": "<PR_URL>"}`

### GitHub Project Setup

CVE PRs should be tracked on the Kiali GitHub Project. This applies to
all repositories and branches:

- `kiali/kiali` — master and backport PRs
- `kiali/openshift-servicemesh-plugin` — main and backport PRs

**Do not execute project updates without explicit user approval**, the
same as Jira changes. When PRs are ready (after creating the master/main
PR, after creating backports, or when backfilling an existing batch):

1. **Ask the user** whether to add the PR(s) to the project and set
   status to "In review". Present a list of PR URLs that would be updated.

2. **Verify token access** before running any `gh project` commands:

   ```bash
   gh auth status
   gh project list --owner kiali --format json
   ```

   Required token scopes: `read:org`, `read:project`, and `project`.
   If `gh auth status` shows missing scopes, or project commands fail
   with `unknown owner type` or `INSUFFICIENT_SCOPES`, stop and ask the
   user to refresh:

   ```bash
   gh auth refresh -h github.com -s read:org,read:project,project
   ```

   Complete the browser/device authorization when prompted, then re-run
   `gh project list --owner kiali` to confirm access before proceeding.

3. **After the user confirms and access is verified**, look up the
   project number (there is only one Kiali project):

   ```bash
   gh project list --owner kiali --format json
   ```

   Add each approved PR:

   ```bash
   gh project item-add <PROJECT_NUMBER> --owner kiali --url <PR_URL>
   ```

   Then set the project status to "In review". First, find the item ID
   and the Status field metadata:

   ```bash
   gh project item-list <PROJECT_NUMBER> --owner kiali --format json --limit 200
   gh project field-list <PROJECT_NUMBER> --owner kiali --format json
   ```

   From the field list, find the Status field ID (type
   `ProjectV2SingleSelectField`, name `Status`) and the "In review"
   option ID. Then update each item:

   ```bash
   gh project item-edit \
     --project-id <PROJECT_ID> \
     --id <ITEM_ID> \
     --field-id <STATUS_FIELD_ID> \
     --single-select-option-id <IN_REVIEW_OPTION_ID>
   ```

   The user may approve adding PRs one at a time or as a batch. Only
   update the PRs the user explicitly approved.

If access cannot be restored, provide the `gh project` commands for the
user to run manually, or ask them to add the PRs via the GitHub UI.

## Code Freeze Check

Before creating or merging backport PRs, check downstream code freeze:

```bash
glab api --hostname gitlab.cee.redhat.com \
  "projects/istio%2Fkonflux%2Fkiali-fbc/repository/files/renovate.json/raw?ref=main"
```

**Interpreting the result:** Parse `packageRules` and check whether any
rule with `"automerge": false` matches the **target branch** (the branch
the backport PR targets). If so, code freeze is active for that branch.

If code freeze is active for the target branch, warn the user and ask
whether to proceed with "Do Not Merge" labels or skip that branch.

## Version Mapping

The OSSM-to-Kiali branch mapping is in the "Supported Branches" table in
`AGENTS.md`. Always read it before creating or reviewing backport PRs.
`master` maps to the next unreleased OSSM version (not a backport target).

## Repos

| Repo | Main branch | Dependency path | Image type |
|---|---|---|---|
| `kiali/kiali` | `master` | `frontend/` (JS), root (Go) | Server |
| `kiali/openshift-servicemesh-plugin` | `main` | `plugin/` (JS) | OSSMC |
| `kiali/kiali-operator` | `master` | root (Python/Ansible) | Operator |
