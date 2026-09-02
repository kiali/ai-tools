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

### All features

Before triage or review, verify in parallel:

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

### Triage: Go stdlib and container images

Before triage (or before qualifying Go stdlib CVEs), also verify local
CLIs and Red Hat registry authentication:

1. **Local CLIs** — all must be on `PATH`:

```bash
command -v go podman skopeo
```

   - `go` and `podman` — `skills/kiali-cve/check-go-version.sh` (released
     product Go version, Step 6b.1)
   - `skopeo` — builder image inspection (Step 6b.2)

2. **Red Hat registry auth** — test both registries (shared credentials
   via `podman login`; `skopeo` uses the same config):

```bash
skopeo inspect --no-tags \
  docker://registry.redhat.io/openshift-service-mesh/kiali-rhel9:v2.27 \
  >/dev/null 2>&1

skopeo inspect --no-tags \
  docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder \
  >/dev/null 2>&1
```

   Both commands must succeed (exit 0). If either fails with
   `unauthorized` or similar, stop and ask the user to log in — do not
   proceed with Go stdlib qualification until auth works.

#### Red Hat registry login (user setup)

Go stdlib triage needs **two** registries:

| Registry | Purpose |
|----------|---------|
| `registry.redhat.io` | Released `kiali-rhel9` product images |
| `brew.registry.redhat.io` | `openshift-golang-builder` pipeline images |

Use a **Terms-Based Registry service account** (recommended for
automation and shared team use):

1. Sign in to the [Red Hat Customer Portal](https://access.redhat.com/).
2. Open [Terms-Based Registry — Service Accounts](https://access.redhat.com/terms-based-registry/accounts).
3. Create a service account (or select an existing one).
4. Generate or copy the **token** for that account (treat it like a
   password; it is shown only when created/regenerated).
5. Log in to **both** registries with the service account **username**
   and **token**:

```bash
podman login registry.redhat.io -u '<service-account-name>' -p '<token>'
podman login brew.registry.redhat.io -u '<service-account-name>' -p '<token>'
```

   `skopeo login` works too; `podman login` is sufficient for both
   `podman` and `skopeo`.

6. Re-run the `skopeo inspect` checks above to confirm access.

If the user prefers not to pass the token on the command line, they can
run `podman login <registry>` interactively and enter the username and
token when prompted.

Customer Portal username/password may work for `registry.redhat.io`, but
the Terms-Based Registry service account is required for
`brew.registry.redhat.io` and is the supported path for CVE triage.

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
New → In Progress ─┬→ [6d close] → Closed (Not a Bug)     — no fix version
                   ├→ [6e no PR]  → Release Pending       — fix version required
                   ├→ [create PRs] → Code Review → [merge] → Release Pending
                   │                  ^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^
                   │                  triage Step 9   review Step R7
                   └→ [6d.3 already fixed] → Closed     — no fix version
```

Go stdlib CVEs may skip Code Review (6e). NPM/Go-module CVEs with no code
change may also use 6e or 6d.3.

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
- `jira_add_comment`: comment text parameter is **`body`** (per MCP tool
  schema — not `comment`)
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

### When fixVersions Are Required

Set `fixVersions` when we need to record **which OSSM release resolves
the CVE** for a given `[ossm-X.Y]` issue. This applies to every issue
transitioned to **Release Pending** (see below).

Set `customfield_10875` (Git Pull Request) when a Kiali PR introduced
the fix. Omit it when the CVE is resolved without a Kiali PR (e.g. Go
stdlib fixed by downstream builder rebuild — triage.md Step 6e).

Do **not** set fix versions for: operator/bundle Component not Present
closures, dependency version never in the vulnerable range (Step 6d.1),
vulnerable code not in execute path (Step 6d.2), or already-fixed
closures with no new PR (Step 6d.3).

### Fix Version Selection

Use `jira_get_project_versions` with `project_key` `"OSSM"`. For each
issue's OSSM minor version (`[ossm-X.Y]` in summary), list unreleased,
unarchived patch versions for that stream (e.g. `OSSM 3.3.7`, `OSSM 3.3.8`)
sorted by patch number.

| Term | Meaning |
|------|---------|
| **Lowest unreleased** | First patch in the sorted list (next OSSM release) |
| **Highest unreleased** | Last patch in the sorted list |

**Selection rules:**

1. **Only one unreleased patch** — use it.
2. **Multiple unreleased patches, lowest ≠ highest** — present both
   options to the user with a recommendation (see z-stream below) and
   **ask which to assign**. Do not pick silently.
3. **No unreleased version exists** — ask the user.

**Z-stream guidance** (for the recommendation in rule 2):

- **Kiali in imminent z-stream** — recommend **lowest** unreleased
  (the next OSSM release that includes Kiali).
- **Kiali excluded from imminent z-stream** — recommend the **second**
  unreleased patch (lowest + 1), not the highest. Example: imminent is
  `OSSM 3.3.7` but Kiali is not in that build → recommend `OSSM 3.3.8`.

**Determining z-stream inclusion** — when unsure, ask the user. Useful
signals (any may apply):

- Whether the imminent OSSM z-stream build already includes merged Kiali
  CVE PRs for this stream.
- Konflux snapshot / release candidate status for the OSSM patch.
- Release manager or team confirmation.

### Release Pending Sequence

**MANDATORY**: `fixVersions` MUST be set on every issue transitioned to
Release Pending. Without it, we cannot determine which release resolves
the CVE.

1. Determine fix version per issue using **Fix Version Selection** above.
2. `jira_update_issue` — set fix version (required). Set the PR field
   only when a Kiali PR introduced the fix:

   `{"fixVersions": [{"name": "<version>"}]}`

   When applicable, also set `"customfield_10875": "<PR_URL>"`. Omit
   `customfield_10875` for no-PR resolutions (e.g. Go stdlib builder
   rebuild — Step 6e).
3. `jira_transition_issue` — transition_id `"131"`
4. `jira_add_comment` — comment text (if needed)

### Go stdlib CVE disposition (summary)

Always check **two** versions per OSSM stream (see triage.md Step 6b):

- **Released** — `check-go-version.sh` on shipped `kiali-rhel9` (binary
  `go version -m`; uses `podman run --pull=always` so stale local images
  are not used). Only this justifies closing as not affected.
- **Builder** — current midstream `kiali.Containerfile` builder pin.
  Indicates whether the **next** rebuild is expected to be fixed.

| Released | Builder | Action |
|----------|---------|--------|
| Fixed | (any) | Close (Not a Bug) |
| Vulnerable | (any), API not used | Close (not in execute path) |
| Vulnerable | Fixed | Ask: Release Pending (typical) or In Progress |
| Vulnerable | Not fixed | In Progress (blocked on builder) |

Never close based on builder version when the released binary is still
vulnerable.

## Issue Naming and Image Classification

Pattern: `CVE-YYYY-NNNNN <registry>/<image>: <library>: <description> [ossm-X.Y]`

| Category | Image strings | Language |
|---|---|---|
| Operator | `kiali-rhel9-operator` | Python/Ansible |
| Bundle | `kiali-operator-bundle` | OLM metadata (no code) |
| Server | `kiali-rhel9`, `kiali-rhel8` (OSSM 2.6 EOL) | Go + JS frontend |
| OSSMC | `kiali-ossmc-rhel9`, `kiali-ossmc-rhel8` (OSSM 2.6 EOL) | JS |
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

Set `customfield_10875` (Git Pull Request) **only when a Kiali PR
introduced the fix**. Omit it for no-PR resolutions (Go stdlib builder
rebuild, Step 6e).

When applicable — before transitioning to **Code Review** (triage
Step 9a) or when backfilling during **review** (Step R7c) — map each
issue to the PR URL for the branch that corresponds to the issue's OSSM
version. Kiali server issues and OSSMC issues are separate Jira tickets,
so each issue maps to exactly one PR URL.

`jira_update_issue` with fields `{"customfield_10875": "<PR_URL>"}`

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

**GitLab unavailable** (DNS failure, auth error, timeout): **do not merge
backport PRs** until the check succeeds or the user explicitly waives the
check. Report the failure and ask how to proceed. Master/main PR merges
are not subject to this freeze file but still require user approval.

## Version Mapping

The OSSM-to-Kiali branch mapping is in the "Supported Branches" table in
`AGENTS.md`. Always read it before creating or reviewing backport PRs.
`master` maps to the next unreleased OSSM version (not a backport target).
Jira issues for that OSSM version may not exist yet — ask the user whether
to create a master PR without a matching Jira issue, or skip master until
issues are filed.

### Backport branch selection

Create backport PRs only for branches where the vulnerable dependency
exists. Before backporting, verify the library is present on each branch
(`git show upstream/<branch>:<file>`). **Skip branches** where the
dependency is absent or already at/above the fix version. Document skipped
branches in the triage summary.

## Repos

| Repo | Main branch | Dependency path | Image type |
|---|---|---|---|
| `kiali/kiali` | `master` | `frontend/` (JS), root (Go) | Server |
| `kiali/openshift-servicemesh-plugin` | `main` | `plugin/` (JS) | OSSMC |
| `kiali/kiali-operator` | `master` | root (Python/Ansible) | Operator |
