# CVE Triage

Identify new OSSM Jira CVE issues for Kiali, close inapplicable issues,
qualify vulnerabilities, and create fix PRs for master and supported branches.

Prerequisites: Tool access verified per SKILL.md.

## Output Formatting

- Always present PR references as clickable links:
  `https://github.com/<owner>/<repo>/pull/<number>` (not just `#123`)
- Keep output concise — prefer tables over verbose prose
- Jira issue keys should link to the issue:
  `https://issues.redhat.com/browse/<KEY>`

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

### 3f. End-of-Life (EOL) OSSM Version Issues

Issues for OSSM versions no longer in the Supported Branches table
(see `AGENTS.md`) should be closed regardless of CVE type.

Identify EOL issues by the `[ossm-X.Y]` suffix in the summary or by
the image name (e.g. `kiali-rhel8` and `kiali-ossmc-rhel8` are
OSSM 2.6 only).

- Resolution: "Won't Do"
- Comment: "OSSM X.Y is out of support."
- No VEX for Won't Do.

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
- Fixed version(s) — **for every affected major version line**
- Vulnerability type

**Multiple major version lines:** Many CVEs affect more than one major
version of a library (e.g. both the 1.x and 2.x lines). Web-search the
CVE record to identify ALL affected version ranges and their respective
fix versions. Record each range separately. Every range present in the
lockfile must be upgraded.

### 6b. Check current dependency version

Fetch latest refs before inspecting:

```bash
git fetch upstream master <branch1> <branch2> ...
```

Use `git show upstream/<branch>:<file>` to check all supported branches.

**NPM/JS dependencies:**
1. Search `frontend/package.json` for the library
2. **Always** also search the lockfile (`frontend/yarn.lock` or
   `plugin/yarn.lock`) for ALL entries of the library — there may be
   multiple major version lines (e.g. `lib@1.x` as a transitive dep
   alongside `lib@2.x` as a direct dep). Each entry must be
   checked against the fix version for its major range (from Step 6a).

**Go third-party dependencies:**
1. Search `go.mod` for the module
2. If not found, check `go.sum`

**Go standard library vulnerabilities** (CVE references stdlib package like
`crypto/x509`, `os`, `net/http`):

Do **not** use upstream `go.mod` alone to decide whether the **released
product** is affected. The Go toolchain linked into `kiali-rhel9` comes
from the `openshift-golang-builder` image, which may differ
from the `go` directive in `go.mod`.

**Product Go version (required for server image CVEs)** — for every
supported OSSM version, obtain the Go version used to build the latest
released `kiali-rhel9` image (`skopeo inspect --no-tags` → `GO_VERSION` env):

1. Map OSSM → Kiali image tag from the Supported Branches table /
   midstream (`tags.yaml` pattern): e.g. OSSM 3.0→`v2.4`, 3.1→`v2.11`,
   3.2→`v2.17`, 3.3→`v2.22`, 3.4→`v2.27`.
2. Inspect the released product image (use `--no-tags`):

```bash
skopeo inspect --no-tags \
  docker://registry.redhat.io/openshift-service-mesh/kiali-rhel9:<tag>
```

   Record `Labels.version`, `Created`, and
   `Labels.org.opencontainers.image.revision` (midstream git SHA).

   If auth fails for `registry.redhat.io`, ask the user to run
   `skopeo login registry.redhat.io` (or `podman login registry.redhat.io`).

3. From that midstream revision, read the golang-builder pin in
   `kiali.Containerfile` on `istio/konflux/kiali`:

```bash
glab api --hostname gitlab.cee.redhat.com \
  "projects/istio%2Fkonflux%2Fkiali/repository/files/kiali.Containerfile/raw?ref=<revision>"
```

   Extract the `FROM brew.registry.redhat.io/rh-osbs/openshift-golang-builder:...`
   line (tag + digest).

4. Inspect that **exact** builder digest and read `GO_VERSION` from Env:

```bash
skopeo inspect --no-tags \
  docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder@sha256:<digest>
```

   Prefer `Env` entry `GO_VERSION=vX.Y.Z`. Optional: `podman run --rm
   --pull=always <builder-ref> go version` if Env is missing.

   If brew auth fails, ask the user to run
   `skopeo login brew.registry.redhat.io`.

5. Web-search the CVE for affected/fixed Go versions. Compare each
   OSSM version's product `GO_VERSION` to the affected ranges.
6. Also note upstream `go.mod` on the corresponding Kiali branch for
   community/backport planning — but **product vulnerability status
   follows the builder `GO_VERSION`**, not `go.mod`.
7. If the product Go version is affected, search the codebase for usage
   of the vulnerable function / API.

Present a table: OSSM | image tag | product version | builder ref |
`GO_VERSION` | affected?

### 6c. Present findings

Summarize:
- Library name and current version
- Direct or transitive dependency
- Fixed version from CVE description
- Whether already at or above the fix
- For Go stdlib: product `GO_VERSION` per OSSM (from Step 6b), not only
  upstream `go.mod`

Ask how to proceed.

### 6d. Early closure (not affected)

If Kiali is not affected:

1. **Product Go version not in affected range** (builder `GO_VERSION`
   outside the CVE range):
   - VEX: `"Vulnerable Code not Present"`
   - Comment: "CVE-YYYY-NNNNN only affects Go <A.B.C / other ranges
     (fixed in …). The released openshift-service-mesh/kiali-rhel9 image
     for this OSSM version is built with
     openshift-golang-builder (GO_VERSION=vX.Y.Z), which is not
     vulnerable."

2. **Vulnerable function never called**:
   - VEX: `"Vulnerable Code not in Execute Path"`
   - Comment: "CVE-YYYY-NNNNN affects Go's PACKAGE.FUNCTION. Kiali does
     not use PACKAGE.FUNCTION anywhere in its codebase."

Use "Not a Bug" closure from SKILL.md. Steps 7–9 do not apply.

### 6e. Direct to Release Pending (no PR needed)

Some CVEs are resolved without PRs — e.g. Go stdlib CVEs fixed
automatically by the downstream Go builder image update. In this case,
skip Steps 7–9 and transition directly to Release Pending.

**IMPORTANT**: Follow the Release Pending Sequence in SKILL.md. This
requires setting `fixVersions` on every issue before transitioning.
Never transition to Release Pending without a fix version.

1. Determine fix versions per OSSM minor version (see SKILL.md)
2. Set fix versions via `jira_update_issue`
3. Transition to Release Pending (ID `"131"`)
4. Add comment explaining why no PR is needed (e.g. "Fixed automatically
   by downstream Go builder update to Go X.Y.Z.")

Present all proposed updates in a table for user approval before executing.

### Go CVEs: operator vs server

Operator fixes are manual (depends on ansible-operator upstream).
Server Go fixes proceed to Step 7.

## Step 7: Fix the Vulnerability

Create PR against master first. If CI passes, create backport PRs.

### NPM/JS upgrade

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
6. **Lockfile audit** — after install, run `yarn dedupe <library>` to
   consolidate caret-range entries. Then grep the lockfile for ALL
   remaining entries of the vulnerable library and verify every resolved
   version meets or exceeds the fix version for its major range
   (from Step 6a):
   ```bash
   yarn dedupe <library>
   rg '"<library>@npm:' <lockfile>
   ```
   If any entry is still below its fix version, follow the
   "Handling vulnerable transitive dependencies" section below.
7. Present diff to user

#### Handling vulnerable transitive dependencies

Keep the `resolutions` section in `package.json` as small as possible.
Do NOT add `resolutions` entries unless absolutely necessary — they are
overrides that mask the real dependency tree and add maintenance burden.

When a transitive dependency brings in a vulnerable version, follow
the same approach on all branches (master/main and backports):

1. Run `yarn dedupe <library>` — it handles caret-range entries by
   consolidating to the highest compatible version already in the
   lockfile. Never add resolutions for caret ranges.

2. For remaining vulnerable entries, evaluate both options:
   - **Bump the parent package** to a version whose transitive tree
     no longer pulls in the vulnerable version.
   - **Add a resolution** to force the fixed version for that major
     line. This covers exact-version pins that `yarn dedupe` cannot
     override, and older major versions pulled in transitively that
     are not at the CVE fix version.

3. Present both options to the user with preference for bumping the
   parent package. Include: which package, from which version to which
   version, whether it is a major version bump, and the potential
   consequences. **Wait for explicit user approval** before proceeding.

   **Backport consistency:** If the vulnerable transitive dependency
   only exists on backport branches (not on master), prefer the
   resolution entry. If master used the bump parent approach, use the
   same approach on backports for consistency.

4. After applying the chosen fix, run `yarn install --no-immutable` and
   `yarn dedupe <library>`, then re-audit the lockfile.

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

Ask user to commit and create PR. Ask for reviewer (see "Requesting a
reviewer" in SKILL.md, exclude PR assignee).

PR description must reference CVE but **not** OSSM Jira keys.

After creating **every** CVE PR, assign it to the user (use
`issue_write` with `method: "update"` and the PR number, since
`create_pull_request` does not support assignees).

Adding PRs to the Kiali GitHub Project is a **separate step that
requires user approval** — see GitHub Project Setup in SKILL.md.
Do not add PRs to the project automatically.

After creating master PR:
1. Add `backport needed` label
2. Request reviewer
3. Ask user about adding to GitHub Project (see SKILL.md)

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
4. PR title **must** start with the branch version prefix
   (e.g. `[vX.Y] CVE-YYYY-NNNNN: ...`)
5. PR description **must** reference master PR number
   (e.g. "Backport of #<NUMBER> to <branch>.")
6. Assign to user, request reviewer; add to the GitHub project only if
   the user has approved project tracking (see GitHub Project Setup in
   SKILL.md)

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
5. Create PR against `main` and assign to the user; add `backport needed`
   label; add to the GitHub project only if the user has approved project
   tracking (see GitHub Project Setup in SKILL.md)

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
| [OSSM-12345](https://issues.redhat.com/browse/OSSM-12345) | 3.3 | kiali-rhel9 | [kiali/kiali#101](https://github.com/kiali/kiali/pull/101) |
| [OSSM-12346](https://issues.redhat.com/browse/OSSM-12346) | 2.6 | kiali-ossmc-rhel9 | [kiali/openshift-servicemesh-plugin#21](https://github.com/kiali/openshift-servicemesh-plugin/pull/21) |

After approval, set each issue:
`jira_update_issue` with `{"customfield_10875": "<PR_URL>"}`

### 9b. Transition to Code Review

Discover the "Code Review" transition ID using `jira_get_transitions`
on one of the In Progress issues.

Transition all open issues for this CVE using `jira_transition_issue`
with the discovered transition ID.

Present list for user approval before executing.

### 9c. Final triage verification

Before handing off, run a full verification of all triage outputs.

**GitHub PRs** — for each repo involved (kiali/kiali and/or
kiali/openshift-servicemesh-plugin), list open CVE PRs:

```bash
gh pr list --repo <owner>/<repo> --search "CVE-YYYY-NNNNN in:title state:open" \
  --json number,title,baseRefName,url
```

Verify:
- One PR per supported branch (master/main + all backports from the
  Supported Branches table in `AGENTS.md`)
- Each PR has the `backport needed` label (master/main only)
- Each PR has an assignee and reviewer set
- No PR has merge conflicts (check `mergeable` field if needed)

**Jira issues** — fetch all issues for this CVE (batch of 3–4 at a time
with `jira_get_issue`) and verify each has:

- `status` = "Code Review"
- `assignee` = current user
- `customfield_10875` (Git Pull Request) is set and contains a valid
  GitHub PR URL matching the issue's OSSM version and image

Present a combined summary table:

| Issue | OSSM | Image | Status | Assignee | PR Field | Matching GH PR |
|-------|------|-------|--------|----------|----------|----------------|
| OSSM-XXXXX | 3.3 | kiali-rhel9 | Code Review | user | set | kiali/kiali#NNN |

If any item is missing or incorrect, fix it before proceeding.

### 9d. Handoff to review

After verification passes, inform the user:
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
- **Downstream builder not updated**: For Go stdlib CVEs, re-run the
  product `GO_VERSION` method in Step 6b (released `kiali-rhel9` →
  midstream `kiali.Containerfile` builder pin → builder `GO_VERSION`).
  Also check whether a newer fixed builder tag exists on brew.
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
