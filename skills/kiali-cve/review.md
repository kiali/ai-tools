# CVE Review

Review fix PRs created by triage, verify cross-branch consistency,
approve, merge, and transition Jira issues to Release Pending.

This feature solves the problem of reviewing N near-identical PRs per CVE
(one per supported branch). Instead of manually reviewing each PR, the
agent summarizes the fix once and verifies consistency across branches.

Prerequisites: Tool access verified per SKILL.md. Additionally, review
uses the GitHub MCP server for PR operations (`get_pull_request`,
`get_pull_request_files`, `get_pull_request_status`,
`create_pull_request_review`, `merge_pull_request`). Verify the GitHub
MCP server is connected before proceeding.

## Step R1: Find CVEs Pending Review

GitHub PRs are the primary source of truth. Search for open CVE PRs
first, then look up corresponding Jira issues.

### 1a. Search GitHub for open CVE PRs

Search all three repos **in parallel**:

```bash
gh pr list --repo kiali/kiali \
  --search "CVE in:title state:open" \
  --json number,title,headRefName,baseRefName,url,author \
  --limit 50
```

```bash
gh pr list --repo kiali/openshift-servicemesh-plugin \
  --search "CVE in:title state:open" \
  --json number,title,headRefName,baseRefName,url,author \
  --limit 50
```

```bash
gh pr list --repo kiali/kiali-operator \
  --search "CVE in:title state:open" \
  --json number,title,headRefName,baseRefName,url,author \
  --limit 50
```

Group results by CVE identifier (extracted from PR title). Each CVE
will have a master/main PR plus backport PRs across supported branches.

### 1b. Find corresponding Jira issues

For each CVE found in GitHub, search Jira for related issues:

```
project = OSSM AND summary ~ "CVE-YYYY-NNNNN" AND summary ~ kiali ORDER BY created DESC
```

Also run Konflux queries per active OSSM version:

```
project = OSSM AND summary ~ "kiali-X-Y" AND summary ~ "CVE-YYYY-NNNNN" ORDER BY created DESC
```

Use `jira_search` with fields
`summary,status,components,priority,assignee,created,customfield_10875`
and `limit` of 50. Set `projects_filter` to `OSSM`.

Report the Jira status of each issue (typically "Code Review" or
"In Progress") so the user knows the current state.

### User-provided input

If user provides a specific CVE ID, PR URL, or Jira issue key, use that
as the starting point and find all related PRs and issues.

### Present overview

| CVE | Library | PRs (kiali) | PRs (OSSMC) | PRs (operator) | Jira Issues (status) |
|-----|---------|-------------|-------------|----------------|----------------------|
| CVE-YYYY-NNNNN | library-name | #101, #102, #103 | #21, #22 | — | 8 issues (Code Review) |
| CVE-YYYY-MMMMM | other-lib | #201, #202 | — | #51 | 4 issues (In Progress) |

## Step R2: Gather PR Details

For each PR in the group, collect in parallel:

1. **PR metadata**: `get_pull_request` (GitHub MCP) — title, description,
   base branch, state, mergeable status
2. **Changed files**: `get_pull_request_files` (GitHub MCP) — file list
   with additions/deletions
3. **CI status**: `get_pull_request_status` (GitHub MCP) — combined check
   status
4. **Diff**: `gh pr diff <number> --repo <owner>/<repo>` — actual changes

For lockfile-only changes (yarn.lock, go.sum), reading the full diff is
unnecessary. Focus on source file diffs (package.json, go.mod).

## Step R3: Summarize Fix for Reviewer

Present a single unified summary per CVE. The reviewer should understand
the fix without reading each PR individually.

### Fix Summary Template

```
## CVE-YYYY-NNNNN — <library>: <vulnerability description>

**Type**: NPM/JS direct dependency | NPM/JS transitive | Go third-party | Go stdlib
**Library**: <name>
**Version change**: <old> → <new>
**Fix mechanism**: package.json update | yarn.lock regeneration | go.mod update | Go version bump

### What changed
<1-3 sentence description of the actual code change>

### Key diff (from master/main PR)
<Show version bump in package.json or go.mod — the meaningful part of the diff>

### Files changed
- package.json (version bump)
- yarn.lock (regenerated)
```

For Go stdlib CVEs, also note:
- Which Go version fixes the CVE
- Whether the vulnerable function is used by Kiali

## Step R4: Cross-Branch Consistency Check

Verify all PRs for the same CVE+repo make equivalent changes.

### Checks

1. **Same dependency target**: All PRs bump to the same library version.
   Extract the target version from each PR's package.json or go.mod diff.

2. **Same files changed**: All PRs modify the same set of source files.
   Lockfile sizes may vary (different dependency trees per branch) but
   source files should match.

3. **No unexpected changes**: Flag any PR that modifies files beyond
   the expected set (package.json + yarn.lock for JS, go.mod + go.sum
   for Go).

4. **Correct target branches**: Each PR targets the expected release
   branch per the Supported Branches table in `AGENTS.md`.

5. **PR descriptions**: Backport PRs reference the master/main PR number.

6. **No merge conflicts**: All PRs are in a mergeable state.

### Report format

```
### Consistency Report

| PR | Branch | Target version | Files | Extra changes | Mergeable |
|----|--------|---------------|-------|---------------|-----------|
| #101 | master | 1.15.2 | 2 | None | Yes |
| #102 | v2.22 | 1.15.2 | 2 | None | Yes |
| #103 | v1.73 | 1.15.2 | 2 | None | Yes |

Result: ✅ All PRs consistent
```

If inconsistencies are found, detail them and ask the user how to proceed.

## Step R5: Check CI Status

For each PR, check CI using `get_pull_request_status` (GitHub MCP).

### Possible states

| Status | Action |
|--------|--------|
| All checks pass | Proceed to merge |
| Checks pending | Wait and re-check (poll every 2 min, up to 20 min) |
| Checks failing | Report which checks failed and on which PRs. Ask user. |

### Polling for pending checks

```bash
gh pr checks <number> --repo <owner>/<repo> --json name,state,conclusion
```

If checks are pending, inform the user and offer to:
1. Wait and poll periodically
2. Skip the failing PR and continue with others
3. Abort the review

## Step R6: Approve and Merge

**Do not proceed without explicit user approval for each step.**

### Pre-merge checklist

Present to user:
- [ ] Fix summary reviewed (Step R3)
- [ ] All branches consistent (Step R4)
- [ ] All CI checks pass (Step R5)
- [ ] Code freeze status checked (see SKILL.md)

If code freeze is active, warn and ask whether to proceed (PRs would need
"Do Not Merge" label removed first, or freeze must be lifted).

### Merge order

Process repos separately. Within each repo:

1. **Master/main PR first** (if not already merged)
2. **Backport PRs** from newest to oldest branch

For each PR:

1. **Approve**:
   ```bash
   gh pr review <PR_NUMBER> --repo <owner>/<repo> --approve \
     --body "CVE-YYYY-NNNNN fix reviewed. Dependency upgraded from X to Y. Cross-branch consistency verified. CI passing."
   ```

2. **Merge** (squash — kiali repos only allow squash merge):
   ```bash
   gh pr merge <PR_NUMBER> --repo <owner>/<repo> --squash
   ```

3. **Verify merge succeeded**: Check exit code. If merge fails
   (conflicts, branch protection), report and skip. Continue with
   remaining PRs.

### After all PRs merged

Remove `backport needed` label from master/main PR:
```bash
gh pr edit <PR_NUMBER> --repo <owner>/<repo> --remove-label "backport needed"
```

## Step R7: Update Jira

After all PRs for a CVE are merged, update the Jira issues.

### 7a. Use issues already found in Step R1

The Jira issues for this CVE were already found in Step R1b. Use that
same set — no need to re-query.

Issues may be in statuses other than "Code Review" (e.g. "In Progress"
if triage didn't transition them). The transition in Step 7d should
handle moving from the current status to Release Pending — verify the
available transitions with `jira_get_transitions` first.

### 7b. Determine fix versions

Use `jira_get_project_versions` with `project_key` `"OSSM"`.

For each issue's OSSM minor version (`[ossm-X.Y]` in summary), pick the
lowest unreleased, unarchived patch version.

If no unreleased version exists, ask the user.

### 7c. Set fix versions

The Git Pull Request field (`customfield_10875`) was already set by
triage in Step 9a. Review only needs to set fix versions.

If any issue is missing the PR field, set it now by mapping the issue
to its PR URL based on the OSSM version → Kiali branch mapping
(from Supported Branches table in `AGENTS.md`).

For each issue, prepare:
- Fix version: `{"fixVersions": [{"name": "<version>"}]}`

Present a table for user approval:

| Issue | OSSM | Image | Fix Version | PR URL (already set) |
|-------|------|-------|-------------|----------------------|
| OSSM-12345 | 3.3 | kiali-rhel9 | OSSM 3.3.1 | kiali/kiali#101 |
| OSSM-12346 | 2.6 | kiali-rhel9 | OSSM 2.6.5 | kiali/kiali#103 |

After approval, execute updates via `jira_update_issue`.

### 7d. Transition to Release Pending

Verify the Release Pending transition ID using `jira_get_transitions`
on one of the Code Review issues (expected ID `"131"` but always confirm).

Transition all updated issues using `jira_transition_issue` with
the verified transition ID.

Present list for user approval before executing.

### 7e. Summary

After all updates, present final summary:

```
## CVE-YYYY-NNNNN — Complete

### PRs merged
| Repo | PR | Branch | Merged |
|------|-----|--------|--------|
| kiali/kiali | #101 | master | ✅ |
| kiali/kiali | #102 | v2.22 | ✅ |

### Jira issues updated
| Issue | Status | Fix Version |
|-------|--------|-------------|
| OSSM-12345 | Release Pending | OSSM 3.3.1 |
| OSSM-12346 | Release Pending | OSSM 2.6.5 |
```
