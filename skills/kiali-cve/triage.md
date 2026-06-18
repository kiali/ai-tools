# CVE Triage

Identify new OSSM Jira CVE issues for Kiali, close inapplicable issues,
qualify vulnerabilities, and create fix PRs for master and supported branches.

Prerequisites: Tool access verified per SKILL.md.

## Step 1: Identify New CVE Issues

### JQL Queries

The combined `status = New AND summary ~ CVE` JQL does not work reliably.
Use this multi-step approach:

1. Primary query (component-based):

```
project = OSSM AND component = Kiali AND status != Closed ORDER BY created DESC
```

2. Filter client-side: **status** is `New` AND **summary** contains `CVE`.

3. Secondary query (catches issues under other components like "Istio", "Maistra"):

```
project = OSSM AND summary ~ kiali AND status != Closed ORDER BY created DESC
```

   Filter same way. Deduplicate.

4. Konflux image queries — run one per active OSSM version:

```
project = OSSM AND summary ~ "kiali-X-Y" AND status != Closed ORDER BY created DESC
```

   Derive `X-Y` from Supported Branches table in `AGENTS.md` (dots → hyphens).

Use `jira_search` with fields `summary,status,components,priority,assignee,created`
and `limit` of 50. Set `projects_filter` to `OSSM`.

### User-Provided Issues

If the user provides a Jira issue URL or key, fetch with `jira_get_issue`,
extract the CVE ID, then search:

```
project = OSSM AND summary ~ "CVE-YYYY-NNNNN" AND summary ~ kiali ORDER BY created DESC
```

### Presenting Results

Summarize grouped by CVE:
- CVE identifier, affected library, description
- Table of issue keys by image and OSSM version
- Total count
- Whether any are already assigned

### Multiple CVEs

Group issues by CVE identifier. Process each CVE independently through
the applicable steps:

- **JavaScript/NPM CVEs**: Steps 2–9 (including OSSMC in Step 8)
- **Go CVEs**: Steps 2–7, 9 (Step 8 does not apply)
- **Python CVEs**: Steps 2–3, then 4–5 for remaining issues
- **Other**: Steps 2, 4–5 (remaining handled manually)

## Step 2: Classify the Vulnerability Type

Ask: "What type of dependency is this? JavaScript/NPM, Go, Python, or Other?"

The answer determines the step sequence (see above).

## Step 3: Handle Operator and Bundle Issues

Identify by image strings in summary: `kiali-rhel9-operator`,
`kiali-operator-bundle`.

### 3a. Bundle Issues

`kiali-operator-bundle` is OLM metadata — no executable code. Close ALL
bundle issues regardless of type.

- Resolution: "Not a Bug"
- VEX: "Component not Present"
- Comment: "The kiali-operator-bundle is an OLM metadata image that does not
  contain executable code. It cannot be affected by code vulnerabilities."

### 3b. Operator — JavaScript/NPM CVEs

Operator is Python/Ansible-based, no JavaScript. Close ALL.

- Resolution: "Not a Bug"
- VEX: "Component not Present"
- Comment: "The Kiali operator is Python/Ansible-based and does not contain
  a JavaScript component. Any JavaScript dependency is transitive from the
  ansible-operator base image."

### 3c. Operator — Go CVEs

Only the latest operator release is supported.

**Older OSSM versions**: Close as "Won't Do":
"Closing as Won't Do because only the latest release of Kiali Operator is
supported, and handles all supported versions of Kiali. Users are encouraged
to update if they are using an older version."

**Latest OSSM version**: Ask: "Does Kiali expose this vulnerability?"
- **No**: Close as "Not a Bug", VEX "Component not Present":
  "The Kiali operator is Python/Ansible-based and does not contain a Go
  component. Any Go dependency is transitive from the ansible-operator
  base image."
- **Yes**: Leave open for Steps 4–5.

### 3d. Operator — Python CVEs

Close ALL.

- Resolution: "Not a Bug"
- VEX: "Vulnerable Code not in Execute Path"
- Comment: "Kiali Operator has minimal use of Python and does not expose
  this CVE. Kiali regularly updates the ansible operator base image when
  it is updated."

### 3e. Operator — Other CVEs

Skip — proceed to Steps 4–5 for manual handling.

Present all proposed closures in a single table for user approval.
Use closure sequences from SKILL.md.

## Step 4: Assign Remaining Open Issues

Ask: "Who should the remaining issues be assigned to?" (default: current user)

Use `jira_update_issue` with `{"assignee": "<email>"}` on each open issue.
Present list for approval first.

## Step 5: Move Issues to In Progress

Transition remaining open issues using `jira_transition_issue` with
transition_id `"41"`. Present list for approval first.

## Step 6: Qualify the Vulnerability

### 6a. Extract vulnerability details

Use `jira_get_issue` (fields `"description"`) and extract:
- Library name
- Fixed version
- Vulnerability type

### 6b. Check current dependency version

Fetch latest refs before inspecting:

```bash
git fetch upstream master <branch1> <branch2> ...
```

Use `git show upstream/<branch>:<file>` to check all supported branches.

**NPM/JS dependencies:**
1. Search `frontend/package.json` for the library
2. If not found, search `frontend/yarn.lock` (transitive)

**Go third-party dependencies:**
1. Search `go.mod` for the module
2. If not found, check `go.sum`

**Go standard library vulnerabilities** (CVE references stdlib package like
`crypto/x509`, `os`, `net/http`):
1. Check Go version in `go.mod` (`go X.Y.Z` directive)
2. Web search the CVE for affected/fixed Go versions
3. Determine if Kiali's Go version is in the affected range
4. If affected, search codebase for usage of the vulnerable function

### 6c. Present findings

Summarize:
- Library name and current version
- Direct or transitive dependency
- Fixed version from CVE description
- Whether already at or above the fix

Ask how to proceed.

### 6d. Early closure (not affected)

If Kiali is not affected:

1. **Go version not in affected range**:
   - VEX: `"Vulnerable Code not Present"`
   - Comment: "CVE-YYYY-NNNNN only affects Go X.Y (fixed in X.Y.Z).
     Kiali uses Go A.B.C, which is not vulnerable."

2. **Vulnerable function never called**:
   - VEX: `"Vulnerable Code not in Execute Path"`
   - Comment: "CVE-YYYY-NNNNN affects Go's PACKAGE.FUNCTION. Kiali does
     not use PACKAGE.FUNCTION anywhere in its codebase."

Use "Not a Bug" closure from SKILL.md. Steps 7–9 do not apply.

### Go CVEs: operator vs server

Operator fixes are manual (depends on ansible-operator upstream).
Server Go fixes proceed to Step 7.

## Step 7: Fix the Vulnerability

Create PR against master first. If CI passes, create backport PRs.

### NPM/JS upgrade

Do NOT add `resolutions` unless absolutely necessary.

**Common first step:**
1. Create branch from master (e.g. `CVE-YYYY-NNNNN-library-upgrade`)

**Direct dependencies** (in `frontend/package.json`):
2. Update to **latest version within same major**. Use
   `npm view <package> version` to find latest.
3. `yarn install --no-immutable` in `frontend/`

**Transitive dependencies** (only in `frontend/yarn.lock`):
2. Remove old entry from `frontend/yarn.lock` (use script, not manual edit)
3. `yarn install --no-immutable` in `frontend/`

**Verify:**
4. `make build-ui`
5. `make build-ui-test`
6. Present diff to user

### Go third-party module upgrade

1. Create branch from master
2. `go get <module>@latest`
3. `go mod tidy`

**Verify:**
4. `make build`
5. `make test`
6. Present diff to user

### Go standard library upgrade

**Master:**
1. Create branch from master
2. Update `go` directive in `go.mod`
3. `go mod tidy`
4. `make build` and `make test`

**Supported branches:** Verify Go version is available downstream first.

Check `skopeo` access:
```bash
skopeo inspect docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder 2>&1 | head -5
```

If auth fails, ask user to run `podman login brew.registry.redhat.io`.

List available tags:
```bash
skopeo inspect docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder 2>&1 \
  | python3 -c "import sys,json; tags=json.load(sys.stdin)['RepoTags']; [print(t) for t in sorted(tags) if '1.XX' in t]"
```

Skip branches where the fixed Go version is not available.

### After successful build

Ask user to commit and create PR. Ask for reviewer (see maintainers in
SKILL.md, exclude PR assignee).

PR description must reference CVE but **not** OSSM Jira keys.

After creating master PR:
1. Add `backport needed` label
2. Add to GitHub Project (see SKILL.md)
3. Request reviewer

### Backporting

Check code freeze first (see SKILL.md).

Ask which branches to backport to. Use Supported Branches table in `AGENTS.md`.

For each backport branch:
1. Create branch from `origin/<version>` (e.g. `CVE-YYYY-NNNNN-library-vX.Y`)
2. Apply same change:
   - **NPM/JS**: update `package.json`, remove lockfile entries,
     `yarn install --no-immutable`
   - **Go**: `go get <module>@latest`, `go mod tidy`
3. Commit, push, create PR targeting release branch
4. PR description **must** reference master PR number
   (e.g. "Backport of #<NUMBER> to <branch>.")
5. Assign to user, request reviewer, add to GitHub Project

## Step 8: Apply Fix to OSSMC (NPM/JS only)

Check Jira summaries for OSSMC images: `kiali-ossmc-rhel9`,
`kiali-ossmc-rhel8`, `kiali-X-Y-ossmc`.

If OSSMC issues exist, the fix must be applied to `kiali/openshift-servicemesh-plugin`.

OSSMC differences (see SKILL.md Repos table):
- Main branch: `main`
- Dependency path: `plugin/`
- Package file: `plugin/package.json`
- Lockfile: `plugin/yarn.lock`

Ask user for local OSSMC repo path.

Same procedure as Step 7 but using OSSMC paths:
1. Branch from `main`
2. Update `plugin/package.json` or `plugin/yarn.lock`
3. `yarn install --no-immutable` in `plugin/`
4. Verify build
5. Create PR against `main`, add `backport needed` label

Backports follow same process. Each OSSMC backport PR references
the OSSMC `main` PR.

## Step 9: Transition to Code Review

After all PRs are created (master + backports, both kiali and OSSMC if
applicable), transition the remaining open Jira issues to "Code Review".

### 9a. Set Git Pull Request field

Map each open issue to its corresponding PR URL based on the OSSM version
→ Kiali branch mapping (from Supported Branches table in `AGENTS.md`).

Kiali server issues and OSSMC issues are separate Jira tickets and map
to different repos/PRs.

Present a table for user approval:

| Issue | OSSM | Image | PR URL |
|-------|------|-------|--------|
| OSSM-12345 | 3.3 | kiali-rhel9 | kiali/kiali#101 |
| OSSM-12346 | 2.6 | kiali-ossmc-rhel9 | kiali/openshift-servicemesh-plugin#21 |

After approval, set each issue:
`jira_update_issue` with `{"customfield_10875": "<PR_URL>"}`

### 9b. Transition to Code Review

Discover the "Code Review" transition ID using `jira_get_transitions`
on one of the In Progress issues.

Transition all open issues for this CVE using `jira_transition_issue`
with the discovered transition ID.

Present list for user approval before executing.

### 9c. Handoff to review

After transitioning, inform the user:
"All PRs for CVE-YYYY-NNNNN are created and Jira issues are in Code Review.
The reviewer can use `kiali-cve:review` to review, merge PRs, and close
the issues."

## Step 10: Review Existing In Progress CVEs

After new CVEs are triaged, check for unblocked In Progress CVEs.

```
project = OSSM AND component = Kiali AND status = "In Progress" AND summary ~ CVE ORDER BY created DESC
```

Also:
```
project = OSSM AND summary ~ kiali AND status = "In Progress" AND summary ~ CVE ORDER BY created DESC
```

Deduplicate and group by CVE.

### 10a. Identify blockers

For each CVE group, **independently** determine the fix version required.
Look up each CVE to find the exact fix version before checking availability.

Common blockers:
- **Downstream builder not updated**: Check builder registry
- **Upstream PR not merged**: Check PR status on GitHub
- **Backport PRs pending**: Master merged but backports not created
- **Transition to Code Review pending**: PRs exist but Jira not updated

### 10b. Present findings

Per CVE:
- CVE identifier, description, issue count
- Assignee and days in progress
- Blocker status and whether resolved
- Recommended action

### 10c. Act on unblocked CVEs

**Assigned to current user**: Ask whether to proceed, then resume from
appropriate step.

**Assigned to another user**: Ask current user to either:
1. Take over (reassign and resume)
2. Notify assignee via `jira_add_comment`
