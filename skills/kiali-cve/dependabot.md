# Upstream Dependabot (master)

Reduce future downstream OSSM CVE noise by fixing vulnerable dependencies on
**upstream default branches** before they appear in product scans.

**Scope (v1):**

| In scope | Out of scope (for now) |
|----------|-------------------------|
| Repository `kiali/kiali` | `kiali-operator`, plugin, helm-charts |
| Target branch **`master`** only | Backport PRs to `v2.*` release branches |
| Open Dependabot alerts via GitHub | OSSM Jira triage/closure (use [triage.md](triage.md)) |
| Fix PRs and optional alert dismiss | Konflux / `kiali-rhel9` qualification |

When scope expands, update this section and the repo table in `SKILL.md`.

Prerequisites: complete **Step D0** (including an updated local `master`) before
any other step in this document. GitHub CLI setup is in [SKILL.md](SKILL.md).

## Master branch (required)

All Dependabot work is evaluated against **`kiali/kiali` `master`**, not the
user’s current local branch and not release branches.

| Activity | Rule |
|----------|------|
| Start every session | **Sync local `master` first** (Step D0) — nothing else until this succeeds |
| Read versions (`go.mod`, `yarn.lock`) | From the synced **`master`** working tree |
| Apply dependency bumps | Feature branch created **after** a fresh master sync (Step D4) |
| Open PR | **`--base master`**, head branch forked from **current** upstream master |

Working directory must be the **`kiali/kiali`** clone. Use remote **`upstream`**
when configured; otherwise **`origin`** (typically `kiali/kiali`).

Record **`master` HEAD** (short SHA + subject) in the session summary. Re-run
the full D0 master sync immediately before creating each fix branch.

## Output Formatting

- Link Dependabot alerts:
  `https://github.com/kiali/kiali/security/dependabot/<alert_number>`
- Link PRs: `https://github.com/kiali/kiali/pull/<number>`
- Prefer tables; group by ecosystem (Go module vs npm) and severity

## Session model (operator-driven)

Default mode: **walk the prioritized queue with the operator** until every item
is resolved or the operator **stops the session**. Do not batch-dismiss or open
PRs without operator decisions on each item (or an explicit batch the operator
approves).

### Work queue unit

Build queue entries from open alerts (Step D1). Prefer **one queue item per
package + ecosystem** on the same manifest (e.g. all open `axios` npm alerts),
investigating shared GHSA/CVE together. List constituent alert numbers in each
item.

### Resolution outcomes (exactly one per queue item)

| Outcome | Meaning | Alert state |
|---------|---------|-------------|
| **Fix (PR)** | Dependency change on a fix branch; session item resolved in the log | GitHub: per [alert tracking policy](#github-alert-tracking-operator-chooses-per-session) |
| **Pass** | Operator declines action **for now** (too risky, needs research, etc.) | Stays **open** on GitHub; revisit in a later session |
| **Close** | Operator accepts **no code change**; alert closed on GitHub | **Dismissed** via API (operator approval required) |

“Close” is **Dependabot alert dismissal**, not OSSM Jira. Prefer **Fix** when a
patched version exists.

### One PR per queue item (default)

Each **Fix** gets its **own** branch and **own** pull request against **`master`**
so reviewers can evaluate changes independently. Do **not** use **draft** PRs
unless the operator asks — open normal, reviewable PRs (request reviewer per
[SKILL.md](SKILL.md)).

**Branch naming:** `dependabot-<package>-<short-id>` (e.g. `dependabot-dompurify`,
`dependabot-undici`). The **`dependabot-` prefix** is the primary machine id.

**PR title:** must start with **`[dependabot/master]`** then a short description,
e.g. `[dependabot/master] Bump dompurify to 3.4.17 (GHSA-…)`.

Do **not** add GitHub labels for this workflow unless the operator asks.

**Per Fix workflow:**

1. Run **D0.1** (sync `master`) before creating the branch — every item, not only
   the first in a session.
2. Create a **new** branch from current `master`; implement one queue item only.
3. Push to the operator’s fork; `gh pr create --base master` (no `--draft` by default).
   Title **must** begin with `[dependabot/master]`.
4. Ask who should **review**; link all Dependabot alert URLs for that item in the
   PR description.
5. **Policy B:** dismiss that item’s alerts with `fix_started` + PR link when the
   PR is created.
6. Continue to the next queue item on a **new** branch (merge or rebase from
   updated `master` after prior PRs merge when possible).

**Optional batching:** only when the operator explicitly requests one PR for
multiple queue items (same branch, multiple commits). Default is **separate PRs**.

**`frontend/yarn.lock`:** parallel open PRs that both touch the lockfile conflict
easily — prefer **one frontend fix PR in flight** or merge/rebase before starting
the next yarn change.

When the session ends, list **each PR URL** created and items still **Pass** /
not reached.

### GitHub alert tracking (operator chooses per session)

The **session log** (Fix / Pass / Close per queue item) is the workflow record.
GitHub’s **open alert count** can disagree while a fix PR is in flight. At session
start (after D1 queue is built), ask which policy to use for **Fix (PR)** items:

| Policy | When to dismiss with `fix_started` | Open alerts on GitHub mean |
|--------|-----------------------------------|----------------------------|
| **A — PR is the signal** | Never until merge + rescan | Backlog **plus** items already in an open PR |
| **B — Dismiss on PR open** (recommended when keeping GitHub in sync with this workflow) | Dismiss each addressed alert when the fix PR is **created** (or first push) | Mostly **backlog** not yet in a PR |
| **C — Dismiss when PR complete** | Dismiss when the fix PR is marked ready for review (legacy; use **B** with one PR per item) | Same as **B** in practice |

All policies still **wait for auto-close (fixed)** after merge when possible; do
not re-dismiss after merge unless an alert incorrectly stays open (see lifecycle
below). **`fix_started`** is only for policy **B** or **C**, requires
**D0.3** scopes, and **operator approval** per alert (or per batch with listed
alert numbers). Link dismiss comment to the **PR URL for that queue item**.

If the operator does not specify, use **B** so open Dependabot alerts match
backlog items not yet tied to a session PR. Use **A** if they prefer zero
dismiss API calls until merge.

**Fix (PR)** in the resolution table means the **queue item** is handled in the
session log; GitHub alert state follows the chosen policy above.

## Step D0: Updated `master`, then tool access

**Do this step first.** Do not list alerts, read manifests, or change files until
local **`master`** is checked out and fast-forwarded to the remote.

### D0.1 Sync `master` (mandatory)

From the **`kiali/kiali`** repository root:

```bash
# REMOTE=upstream if that remote exists, else origin
git fetch "${REMOTE}" master
git checkout master
git pull "${REMOTE}" master
git status   # must be on branch master, clean or only intentional changes
git rev-parse --short HEAD
git log -1 --oneline
```

If checkout or pull fails (conflicts, dirty tree blocking pull), **stop** and
resolve with the user before continuing.

Report the commit SHA and one-line subject as **session baseline**.

### D0.2 GitHub access (after D0.1)

Run in parallel:

1. **Auth**

```bash
gh auth status
```

Require `repo` scope minimum for listing alerts.

2. **List alerts (smoke test)**

```bash
gh api 'repos/kiali/kiali/dependabot/alerts?state=open&per_page=1' \
  --jq 'length'
```

If this fails with 403/404, report whether Dependabot alerts are enabled for
the repo and whether the token can read security data. Stop if listing fails.

### D0.3 Dismiss scope (optional)

Only when the user may dismiss alerts this session. Before any real `PATCH`:

```bash
gh api -X PATCH repos/kiali/kiali/dependabot/alerts/0 \
  -f state=dismissed 2>&1 | head -1
```

A **404** on a fake alert number is acceptable (proves PATCH route works).
**403** or scope errors → stop and ask the user:

```bash
gh auth refresh -h github.com -s repo,security_events
```

Do **not** dismiss alerts until scope works and the user approves each dismiss.

### D0.4 In-flight PRs (inform operator before new work)

**Required at every session start** — after D0.1–D0.2, **before** Step D1 alert
collection. Query open workflow PRs:

```bash
gh pr list --repo kiali/kiali --base master --state open \
  --json number,title,headRefName,url,reviewDecision,isDraft,statusCheckRollup \
  --jq '[.[] | select(.headRefName | startswith("dependabot-"))]'
```

Fallback if branch names differ:

```bash
gh pr list --repo kiali/kiali --search 'in:title "[dependabot/master]" state:open' \
  --json number,title,headRefName,url,reviewDecision,isDraft,statusCheckRollup
```

**Tell the operator explicitly** what may need attention:

- If **none**: say no in-flight `[dependabot/master]` PRs; proceed to D1.
- If **any**: present a table (PR link, title, review state, CI summary) and note
  that these may need **review or merge** before or alongside new queue work.
  Ask whether to focus on review/merge first or continue the alert queue.

Do not start new **Fix** branches for a package that already has an open in-flight
PR for that package unless the operator asks to replace or amend it.

## Step D1: Collect Open Alerts

Paginate open alerts (default sort: `created`, descending):

```bash
gh api 'repos/kiali/kiali/dependabot/alerts?state=open&per_page=100' \
  --paginate \
  --jq '.[] | {
    number,
    created_at,
    severity: .security_vulnerability.severity,
    ghsa: .security_advisory.ghsa_id,
    cve: (.security_advisory.cve_id // "none"),
    package: .dependency.package.name,
    ecosystem: .dependency.package.ecosystem,
    manifest: .dependency.manifest_path,
    vulnerable_range: .security_vulnerability.vulnerable_version_range,
    first_patched: (.security_vulnerability.first_patched_version // "unknown")
  }'
```

Build the prioritized queue (Step D2.0) and present positions `1…N` with a
short summary table (severity, package, alert count). Skip or defer queue items
already covered by [in-flight PRs](#d04-in-flight-prs-inform-operator-before-new-work).

At session start, confirm with the operator:

- **Default**: process the full queue in order until done or stop
- **Optional filter**: e.g. critical+high only, or single package
- **Alert tracking policy**: **A**, **B**, or **C** (see [GitHub alert tracking](#github-alert-tracking-operator-chooses-per-session)); default **B** when not specified

Do not require a separate “report only” mode — the operator can **stop the
session** after the summary at any time without resolving remaining items.

## Step D2: Prioritize and iterate

### D2.0 Build queue order

1. **Severity**: critical → high → medium → low
2. **Within severity**: group by **package + ecosystem + manifest**
3. **Ties**: more alert numbers first, then older `created_at`

Skip embedding in the queue (still list at end of session as “not reached”):

- Items the operator filters out at session start

### D2.1 Session loop

Repeat for queue item `k = 1…N` until the operator **stops the session** or
`k > N`:

1. **Present item `k`**: alert link(s), severity, package, ecosystem, manifest,
   vulnerable vs **current on synced `master`**, patched version(s), whether the
   package appears in `frontend/package.json` **`resolutions`** / **`overrides`**,
   whether Kiali **directly imports** the package (see D2a), brief recommendation
2. **Operator chooses**: **Fix** | **Pass** | **Close** | **Stop session**
3. Execute the choice (D2a / D2b / D2c / exit to Step D3).
4. Record outcome in the running **session log** (Step D3 table).
5. Continue to item `k+1` unless the session stopped.

### D2a Fix (implement on master)

Qualify on **`master`** (synced at session start; re-read files from working tree).

| Ecosystem | Where to look |
|-----------|----------------|
| `go` | `go.mod`, `go.sum`; `go mod graph` if transitive |
| `npm` | `frontend/yarn.lock`, `frontend/package.json` |

If `master` already matches a patched version, recommend **Close** with
`fix_available` or **Pass** if waiting for GitHub rescan — do not bump blindly.

**Branch rules** (one PR per queue item — see [One PR per queue item](#one-pr-per-queue-item-default)):

- Run **D0.1**, then create a **new** branch for this item only:

```bash
git checkout -b dependabot-<package>-<short-id>
```

  (Operator may suggest a different name.)

- Do **not** add the next queue item to the same branch unless the operator
  explicitly chose batching.

Apply the bump:

- **Go**: `go get module@version`, `go mod tidy`; targeted tests
- **npm** (see [Yarn resolutions](#yarn-resolutions-kiali-frontend) below): update
  `frontend/yarn.lock`; prefer fixing without new resolutions

#### Yarn resolutions (Kiali frontend)

Kiali uses Yarn **`resolutions`** only when necessary (transitive conflicts,
PatternFly alignment, etc.). When fixing an npm Dependabot item:

1. Check `frontend/package.json` for **`resolutions`**, **`overrides`**, and
   direct **`dependencies`** / **`devDependencies`** entries.
2. Determine **usage** (do not guess):

```bash
# package name as in package.json / alert (adjust pattern for scoped packages)
rg "from ['\"]${PACKAGE}['\"]|require\\(['\"]${PACKAGE}['\"]\\)" frontend/src frontend/cypress
```

3. Inspect `frontend/yarn.lock` for **all** versions of the package (direct,
   transitive, resolution-pinned).

4. **Check parent** (before adding or keeping a **`resolutions`** entry):

```bash
cd frontend
yarn why "${PACKAGE}"
```

For each **parent** that pulls a vulnerable version, check whether a newer
parent release already depends on a **patched** version (compare to Dependabot
`first_patched_version` / advisory range):

```bash
npm view "${PARENT}@${CURRENT}" dependencies.${PACKAGE}
npm view "${PARENT}@latest" dependencies.${PACKAGE}
# optional: scan recent majors — npm view "${PARENT}" versions --json | jq ...
```

Present findings to the operator:

- If **`latest` (or a reasonable upgrade) ≥ patched version**: prefer **bumping
  the parent** in `dependencies` / `devDependencies`, then `yarn install`, then
  **try removing** any existing resolution for `${PACKAGE}`.
- If parent **latest still below patched** (common): parent bump may still be
  worth doing for hygiene, but document that a **resolution** (or direct dep when
  Kiali imports the package) remains required until the parent upstream updates
  — cite parent name and pinned transitive version in the PR.

Re-run `yarn why "${PACKAGE}"` after parent and/or resolution changes; every
instance must meet the patched version.

**If Kiali directly imports the package** (matches in application or test code):

- Bump an existing **direct** dependency entry to the patched version.
- If the package is imported but only listed under **`resolutions`**, discuss
  with the operator: **bump the resolution** to the patched version, or **move**
  to `dependencies` and **remove** the resolution if `yarn install` still
  resolves safely — do not leave it only in `resolutions` without a reason.
- Do **not** use a resolution when a direct dependency entry is sufficient.

**If the package is transitive only** (no Kiali import):

- **Do not** add it to `dependencies` / `devDependencies` to satisfy the alert.
- After **Check parent** (step 4): prefer **parent upgrade**, then **`yarn up`**
  to the patched version, then **bump an existing resolution** only if needed.
- **Try removing the resolution** after a bump: delete the `resolutions` entry,
  run `yarn install` from `frontend/`, confirm every lock entry meets the patched
  version.
- **Add a new resolution** only when the above still leaves a vulnerable transitive
  line — explain in the PR why it is required.

Present the plan to the operator before committing when the approach is
non-obvious (parent bump vs resolution vs remove resolution).

Verification before push (scope to change):

```bash
make test
cd frontend && yarn test   # when frontend lockfile changed
```

Push to fork; create PR (`--base master`; **not** draft unless operator asks).
PR conventions: [SKILL.md](SKILL.md) except **no `backport needed`**. No OSSM
Jira keys in the description. Link every Dependabot alert URL for **this queue
item**. Request reviewer per operator choice.

**Policy B:** when the PR is created, dismiss each alert number in this queue
item with `fix_started` and a comment linking the PR (see **D2c** PATCH format).

#### Dependabot alert lifecycle (fix PR)

| Phase | Policy A | Policy B (default) / C |
|-------|-------------------|--------------|
| **PR open** | Leave alerts open | **B:** dismiss `fix_started` when PR is created |
| **PR merged to `master`** | Wait for Dependabot **fixed** (auto-close) | Same |
| **PR closed without merge** | Alerts still open — revisit queue | Re-open dismissed alerts if policy B was used |
| **After merge, alert still open** | Investigate; optional `fix_available` after verified fix + wait | Same |

**Close (dismiss)** for **Pass**-style non-fixes (`not_used`, `incompatible`, …)
is separate from **`fix_started`** — do not use those interchangeably.

Merged fixes should **prove themselves on `master`**; manual dismiss after merge
is only for stale or incorrect alerts, not routine cleanup.

### D2b Pass

Log **Pass** with a short reason (operator’s or agreed). Alert stays open. Next
queue item.

### D2c Close (dismiss alert)

Operator approval required. Dismiss each alert number in the queue item:

```bash
gh api -X PATCH "repos/kiali/kiali/dependabot/alerts/<NUMBER>" \
  -f state=dismissed \
  -f dismissed_reason=<REASON> \
  -f dismissed_comment='<justification>'
```

| `dismissed_reason` | When to use |
|--------------------|-------------|
| `not_used` | Vulnerable path not present (verified) |
| `tolerable_risk` | Accepted risk (rare) |
| `incompatible` | Fix breaks supported Go/node on master |
| `fix_available` | Already patched on `master`; stale alert |
| `fix_started` | Fix landed in open session PR (use sparingly) |

Prefer **Fix** over **Close** when a patch exists. **Pass** vs **Close**: Pass
leaves the alert open; Close dismisses it.

### D2.2 Stop session

When the operator chooses **Stop session**, **always** produce [Step D3](#step-d3-session-summary)
immediately. Mark remaining queue items **not reached** (from the next index through `N`).

## Step D3: Session summary

**Required** when the operator stops the session or when the queue is finished.
Do not end the conversation without this summary.

Present:

1. **Session settings** — baseline `master` SHA, alert policy (**A/B/C**), repo scope
2. **In-flight PRs** — table of `[dependabot/master]` / `dependabot-*` PRs (number, title, URL, review/CI status if checked at session start)
3. **Queue log** — every item touched this session:

| # | Package / alerts | Outcome | PR / dismiss / pass | Notes |
|---|------------------|---------|---------------------|-------|

4. **Not reached** — next queue positions and packages if stopped early
5. **GitHub state** — approximate open Dependabot alert count; note policy **B** dismissals
6. **Skill / repo housekeeping** — local `ai-tools` branch changes not yet committed, if any
7. **Suggested next session** — next queue items, merge/rebase notes (e.g. merge open PRs before next `yarn.lock` change)

## Relationship to Triage and Review

| Workflow | Role |
|----------|------|
| **Dependabot (this doc)** | Preventive — harden `kiali/kiali` **master** |
| **Triage** | Reactive — OSSM Jira, all images, backports |
| **Review** | Merge CVE PR batches across branches |

A fix merged here on `master` may still need **triage backports** later when
OSSM Jira issues appear for supported release branches. That is expected until
backport scope is added to this feature.

## Future Extension (not implemented in v1)

- Repositories: `kiali/kiali-operator` (`master`), plugin, etc.
- Backport matrix aligned with Supported Branches in `AGENTS.md`
- Cross-link: optional Jira search for same CVE after upstream fix (read-only)
