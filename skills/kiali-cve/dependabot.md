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
| Apply dependency bumps | Feature branch created **after** a fresh master sync (D0.1) |
| Open PR | **`--base master`**, head branch forked from **current** upstream master |

Working directory must be the **`kiali/kiali`** clone. Use remote **`upstream`**
when configured; otherwise **`origin`** (typically `kiali/kiali`).

Record **`master` HEAD** (short SHA + subject) in the session summary. Re-run
the full D0 master sync immediately before creating each fix branch.

## Workflow overview

Same shape as [triage.md](triage.md): find work, qualify, fix or close, defer
when needed — but **GitHub Dependabot alerts** replace **OSSM Jira issues**, and
everything targets **`kiali/kiali` `master`** only (v1).

| Triage (Jira) | Dependabot (GitHub) |
|---------------|----------------------|
| Find **New** CVE issues (Step 1) | List **open** alerts (D1) |
| Close inapplicable (Steps 3, 6d) | Qualify **Close** vs **Fix** (D1.5) |
| Qualify affected versions / path (Step 6) | Compare alert to **`master`** manifests (`D2` / D2a) |
| **Fix** — open PR(s) (Step 7) | **Fix** — branch + PR + link alerts (D2a); use [remediation.md](remediation.md) |
| **Close** inapplicable (Not a Bug, VEX) | **Close** — PATCH dismiss with reason + comment (D2c) |
| **Pass** / defer | **Pass** — leave alert open |
| Code Review / merge (review skill) | Merge happens **outside** this run; next session re-syncs `master` and rechecks alerts |

Details below (D0–D3) spell out commands and approvals.

## Output Formatting

- Link Dependabot alerts:
  `https://github.com/kiali/kiali/security/dependabot/<alert_number>`
- Link PRs: `https://github.com/kiali/kiali/pull/<number>`
- Prefer tables; group by ecosystem (Go module vs npm) and severity

## Session model (operator-driven)

Walk the queue **one item at a time** (see [Workflow overview](#workflow-overview)): present,
get a decision, execute — no batch dismissals or PRs without operator approval.

**Hard stop before implementation:** After Step D1, present the **full prioritized
queue** (table with positions `1…N`). For each item, present **that item’s**
detail and **wait** for **Fix** | **Pass** | **Close** | **Stop session** before
any `git checkout -b`, manifest/lockfile edit, commit, push, or `gh pr create`.
Recommendations (including “prefer grpc while a `yarn.lock` PR is in flight”) are
fine; they are **not** permission to start the fix. The operator may also choose
a **different queue number** than `k` (e.g. skip item 1 until another PR merges).

### Work queue unit

Build queue entries from open alerts (D1). Prefer **one queue item per
package + ecosystem** on the same manifest (e.g. all open `axios` npm alerts),
investigating shared GHSA/CVE together. List constituent alert numbers in each
item.

### Resolution outcomes (exactly one per queue item)

| Outcome | Like Jira triage | Alert on GitHub |
|---------|------------------|-----------------|
| **Fix (PR)** | Open a fix PR | **Leave open** until merge + rescan; **no PATCH** when the PR opens |
| **Pass** | Defer / needs research | Stays **open** |
| **Close** | Not a Bug / inapplicable | **Dismiss** via PATCH (D2c), operator approves |

Prefer **Fix** when a patch exists. **Close** only when closing is justified (see D2c reasons).

### One PR per queue item (default)

Each **Fix** gets its **own** branch and **own** pull request against **`master`**
so reviewers can evaluate changes independently. Do **not** use **draft** PRs
unless the operator asks — open normal, reviewable PRs (request reviewer per
[SKILL.md](SKILL.md)).

**Branch naming:** `dependabot-<package>-<short-id>` (e.g. `dependabot-dompurify`,
`dependabot-undici`). The **`dependabot-` prefix** is the primary machine id.

**PR title:** must start with **`[dependabot]`** then a short description,
e.g. `[dependabot] Bump dompurify to 3.4.17 (GHSA-…)`.

**PR description:** every Fix PR must include a **### How this PR was built**
subsection (after **Summary**) so reviewers see intentional scope. Use the
commands actually run — do not paraphrase.

| Ecosystem | Document in the PR |
|-----------|-------------------|
| **Go** | `go get <module>@<patched-version>` and `go mod tidy`. State that only the CVE module was targeted explicitly; explain that **`go mod tidy` may bump `golang.org/x/*`** (and other shared modules) because the patched module’s `go.mod` requires newer versions — not manual drive-by upgrades. |
| **npm (direct)** | `package.json` version change + `cd frontend && yarn install`. Note if **`resolutions`** were **not** added. Call out expected transitive lockfile moves (e.g. `follow-redirects` with `axios`). |
| **npm (lockfile-only / transitive)** | `yarn install` or `yarn up` path used; **no new `resolutions`** unless required (say why). |

Copy-paste templates (include in the PR body under **Summary**):

**Go example:**

    ### How this PR was built

    go get google.golang.org/grpc@v1.83.2
    go mod tidy

    Only the **CVE target** was chosen explicitly (`google.golang.org/grpc` **v1.83.2**).

    `go mod tidy` also updates some `golang.org/x/*` modules because the patched module requires newer versions than the previous release. Those lines are Go toolchain resolution across the full module graph, not separate manual bumps.

**npm (direct) example:**

    ### How this PR was built

    - Updated direct dependency in `frontend/package.json`: `<pkg>` …
    - Regenerated lockfile: `cd frontend && yarn install`

    No new `package.json` `resolutions`. …

Do **not** add GitHub labels for this workflow unless the operator asks.

**Per Fix workflow:**

1. Run **D0.1** (sync `master`) before creating the branch — every item, not only
   the first in a session.
2. Create a **new** branch from current `master`; implement one queue item only.
3. Push to the operator’s fork; `gh pr create --base master` (no `--draft` by default).
   Title **must** begin with **`[dependabot]`**.
4. Ask who should **review**; link all Dependabot alert URLs for that item in the
   PR description.
5. **Assign** the PR to the **current GitHub user** (operator running the skill) and
   **add it to the Kiali GitHub Project** with status **In review** — see
   [PR tracking (required)](#pr-tracking-required). Do this for every Fix PR
   immediately after `gh pr create` (do not wait for operator approval; unlike
   Jira/CVE triage).
6. **Do not** dismiss or PATCH alerts when the PR opens — wait for merge + rescan
   (see [GitHub alert handling](#github-alert-handling-when-fixing-default)).
7. Continue to the next queue item on a **new** branch (merge or rebase from
   updated `master` after prior PRs merge when possible).

**Optional batching:** only when the operator explicitly requests one PR for
multiple queue items (same branch, multiple commits). Default is **separate PRs**.

### PR tracking (required)

After each **`gh pr create`** for a Fix item:

1. **Assignee** — the GitHub login of the user executing the skill (same as
   `gh auth status` / `gh api user`):

```bash
GITHUB_USER="$(gh api user --jq .login)"
gh pr edit <PR_NUMBER> --repo kiali/kiali --add-assignee "${GITHUB_USER}"
```

2. **Kiali GitHub Project** — add the PR and set **In review**. Unlike CVE
   triage ([SKILL.md](SKILL.md) GitHub Project Setup), **do not ask** for
   approval; this is mandatory for every Dependabot Fix PR.

   Verify project token scopes once per session (extend D0.2 if not already done):

```bash
gh auth refresh -h github.com -s read:org,read:project,project
gh project list --owner kiali --format json
```

   Add the PR (use the single active Kiali project number from the list):

```bash
PR_URL="https://github.com/kiali/kiali/pull/<PR_NUMBER>"
gh project item-add <PROJECT_NUMBER> --owner kiali --url "${PR_URL}"
```

   Set status to **In review** (field/option IDs vary; look up each session or
   after add):

```bash
gh project field-list <PROJECT_NUMBER> --owner kiali --format json \
  --jq '.fields[] | select(.name=="Status") | {id, options: [.options[] | select(.name | test("In review"; "i"))]}'
```

```bash
ITEM_ID="$(gh project item-list <PROJECT_NUMBER> --owner kiali --format json --limit 200 \
  --jq '.items[] | select(.content.url=="'"${PR_URL}"'") | .id')"
gh project item-edit \
  --project-id <PROJECT_ID> \
  --id "${ITEM_ID}" \
  --field-id <STATUS_FIELD_ID> \
  --single-select-option-id <IN_REVIEW_OPTION_ID>
```

   If `gh project` fails (scopes, item not found), report the error and give the
   operator the commands to run manually; **do not** treat the Fix item as
   complete until assignee + project are confirmed or the operator waives tracking.

3. **Reviewer** — after assignee/project, `gh pr edit ... --add-reviewer` per
   operator choice (see [SKILL.md](SKILL.md)).

Record assignee and project status in the session log (Step D3).

**`frontend/yarn.lock`:** parallel open PRs that both touch the lockfile conflict
easily — prefer **one frontend fix PR in flight** or merge/rebase before starting
the next yarn change.

When the session ends, list **each PR URL** created and items still **Pass** /
not reached.

### GitHub alert handling when fixing (default)

For **Fix (PR)** items:

1. **Open the fix PR** and link alert URLs in the description.
2. **Do not** PATCH alerts when the PR opens. Dependabot should close them as
   **fixed** after the PR **merges** and the default branch is rescanned.

This matches **periodic runs** (e.g. every few weeks): an alert may still show
**open** while review and merge happen — that is expected. The session log records
the Fix; GitHub catches up after merge.

If an alert is **still open** after merge + a reasonable rescan wait, treat it in
a **later session** (**Close** with `inaccurate` if truly stale, or **Pass**
to investigate).

**Fix (PR)** in the resolution table means the **queue item** is handled in the
session log; **PATCH** is only for **Close** (inapplicable / stale) in **D2c** — like
closing a Jira issue as Not a Bug in [triage.md](triage.md), not for routine fix
PRs.

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
gh pr list --repo kiali/kiali --search 'in:title "[dependabot]" state:open' \
  --json number,title,headRefName,url,reviewDecision,isDraft,statusCheckRollup
```

**Tell the operator explicitly** what may need attention:

- If **none**: say no in-flight **`[dependabot]`** PRs; proceed to D1.
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

Do not require a separate “report only” mode — the operator can **stop the
session** after the summary at any time without resolving remaining items.

## Step D1.5: Qualify close / ignore candidates

Before building the **Fix** queue (D2.0), classify every open alert (or each
**package + ecosystem** group) into one of: **Fix**, **Close (dismiss)**,
**Defer (Pass)**, or **Fix queue only**. Present a **Close candidates** table
for operator approval — same approval model as Jira [triage.md](triage.md) Step 3
(do **not** PATCH until the operator approves each row).

GitHub allows only these `dismissed_reason` values:
`fix_started`, `inaccurate`, `no_bandwidth`, `not_used`, `tolerable_risk`.
This workflow does **not** use `fix_started` for open fix PRs (alerts stay open
until merge + rescan).

### Team default: dismiss medium/low dev-only alerts

**Policy (Kiali upstream Dependabot):** Recommend **Close (dismiss)** when **all**
of the following hold (after verification in D1.5.2):

1. **Severity** is **medium** or **low** (not high or critical).
2. The vulnerable package is **not user-facing** — dev, test, build, or CI
   tooling only; it does not ship in the production UI bundle or server binary.

Use `dismissed_reason: not_used` and a short comment citing `yarn why` / Go test-only
evidence. Present these rows in the **Close candidates** table (D1.5.6); operator
approval is still required before PATCH.

**Outside this policy** (default to **Fix** or **Pass**, not auto-Close):

| Case | Default |
|------|---------|
| **High / critical**, any scope | **Fix** queue (or **Pass** with reason — do not dismiss without explicit operator request) |
| **Medium / low** but **runtime** (`dependencies`, `go.mod` server path, imported from `frontend/src/`) | **Fix** queue |
| **Medium / low** dev-only but operator wants to fix hygiene anyway | **Fix** or **Pass** per operator |

High-severity dev-only alerts (e.g. Cypress transitive) are **not** covered by this
default dismiss rule — treat as **Pass** or bump the dev parent when the operator
chooses.

### D1.5.1 Already fixed on `master` (stale alert)

**When:** Resolved version on synced `master` satisfies `first_patched_version`
from the alert, but GitHub still shows **open**.

**Verify:**

| Ecosystem | Command / check |
|-----------|-----------------|
| **Go** | `grep` module in `go.mod` / `go list -m <module>@version` vs patched |
| **npm direct** | `frontend/package.json` semver range admits patched version in `yarn.lock` |
| **npm transitive** | `yarn.lock` resolution line for `name@npm:…` ≥ patched |

**Recommend:** **Close** — `dismissed_reason: inaccurate` — comment cites
resolved version on `master` SHA from D0.1 and expected rescan lag.

Do **not** open a bump PR when already patched.

### D1.5.2 Dev / test only (not user-facing)

**When:** The vulnerable package does not ship in the **production** frontend or
backend binary (not user-facing). If severity is **medium** or **low**, apply
[Team default: dismiss medium/low dev-only alerts](#team-default-dismiss-mediumlow-dev-only-alerts)
unless verification below fails.

Operator may still choose **Fix** or **Pass** instead of **Close** for any item.

**Verify (npm):**

```bash
cd frontend
yarn why <package-name>   # all paths should be dev/test/tooling only
yarn npm audit --environment production 2>&1 | rg <package> || true
```

Treat as dev-only when **every** `yarn why` path is under typical dev chains,
for example:

- `cypress`, `mocha`, `cypress-multi-reporters`, `eslint` / `@typescript-eslint`,
  `@rsbuild/*` (build), `@svgr/*`, `i18next-parser`, `prettier`, test reporters

**Do not** auto-close as dev-only when:

- The package is a **`dependencies`** entry in `frontend/package.json`
- `yarn npm audit --environment production` still reports the GHSA
- The package is imported from `frontend/src/` (grep source)

**Recommend:** **Close** — `not_used` — use the [D2c standard comment](#d2c-close-dismiss-alert)
(optional one-line `yarn why` evidence in the Close candidates table).

**Go:** If the module appears only in `*_test.go` or integration test modules and
not in the server binary path, **Close** — `not_used` with file references.
If it is a normal `require` used at runtime, queue **Fix**.

### D1.5.3 Not applicable / wrong target (lockfile noise)

Use **`inaccurate`** here when the alert does not describe a real exposure on
`master` (wrong target), not when the dependency is simply **already patched**
— that is [D1.5.1](#d151-already-fixed-on-master-stale-alert).

**When (unreachable lockfile resolution — rare):**

- Alert cites a **vulnerable `yarn.lock` entry** that `yarn why` shows is **not**
  on any install path used by `dependencies` or production audit, **and** the
  resolved version on paths that *do* matter is already ≥ `first_patched`.

**Verify (npm):**

```bash
cd frontend
yarn why <package-name>                    # note every resolved version on each path
yarn npm audit --environment production    # GHSA should be absent if truly unreachable
rg '<package>@' yarn.lock                  # compare vulnerable line vs lines on live paths
```

**When (multiple open alerts, same GHSA or package):**

- GitHub may show **several alert numbers** for one advisory (different manifests,
  duplicate detections, or pre/post-merge lag). **Still list each alert #** in
  D1.5.6 and PATCH each approved row (D2c) — do not collapse to one dismiss and
  assume the rest auto-close.
- After a **Fix** PR merges or one alert is dismissed, **re-run Step D1**
  before bulk **`inaccurate`** on siblings; only dismiss numbers still open with
  evidence each is stale or not applicable.
- **Do not** dismiss duplicates with **`not_used`** if any sibling alert still
  reflects a reachable vulnerable path (use **Fix** or D1.5.2 per alert).

**Recommend:** **Close** — `inaccurate` — comment cites unreachable lock path,
wrong manifest, or post-fix/rescan stale duplicate (include alert # and
`yarn why` / lock evidence). Present **one Close row per alert #** unless
Step D1 shows the number already closed.

### D1.5.4 Accepted deferral (ignore for now, stay open)

**When:** Operator policy defers work without dismissing (e.g. **high/critical**
dev-only — **not** auto-dismissed under team default; wait for dev parent bump or
explicit **tolerable_risk** dismiss).

**Recommend:** **Pass** / **Defer** — alert stays **open**; log in session
summary. Optional **`tolerable_risk`** dismiss only if operator explicitly wants
the alert off the dashboard with documented acceptance.

**When:** Fix requires breaking change (e.g. major router migration) and no patch
on current major.

**Recommend:** **Pass** with reason; **not** `no_bandwidth` unless operator
chooses that GitHub reason.

### D1.5.5 Must stay on the Fix queue

**Never** recommend **Close** without verification when:

- Package is a **direct** `frontend/package.json` **`dependencies`** entry
- **`go.mod`** direct or runtime `require` for server code
- Resolved version is **inside** the vulnerable range on `master`
- Operator asked for **runtime/prod-first** queue ordering

### D1.5.6 Output (required before D2 Fix queue)

Present two tables. **List one row per alert number** in table A (do not collapse
multiple alerts into one row without listing every `#`). The summary count must
match the number of PATCH operations in D2c.

**A. Close candidates** (operator approves before any PATCH):

| Alert # | Package | Severity | Proposed reason | Evidence (1 line) |
|---------|---------|----------|-----------------|-------------------|

**B. Fix queue** (remaining items, ordered per D2.0 — typically prod direct
first if operator requested):

| Rank | Package | Severity | Direct runtime? | Alert count |
|------|---------|----------|-----------------|-------------|

**C. Excluded from dismiss** (optional, when helpful):

| Alert # | Package | Severity | Why not Close (Fix / Pass / high dev) |
|---------|---------|----------|----------------------------------------|

Operator may: approve all closes, approve subset, reclassify a row to **Fix** or
**Pass**, then proceed to D2.

After approved **Close** rows, run [D2c batch dismiss](#d2c-close-dismiss-alert).

### D1.5.7 Dismissal decision procedure

For **each open alert number** from Step D1 (not grouped summaries):

1. Read `security_vulnerability.severity` → if **high** or **critical**, stop:
   default **Pass** or **Fix** (dev parent bump); **not** team dismiss policy.
2. If **medium** or **low**, check **user-facing** (D1.5.5 exclusions first):
   - **npm:** name in `frontend/package.json` **`dependencies`** → **Fix**
   - **npm:** `grep` imports in `frontend/src/` → **Fix**
   - **npm:** transitive under runtime **`dependencies`** (e.g.
     `@patternfly/chatbot` → `@opentelemetry/*`) → **Fix**
   - **Go:** imported from non-test server packages (e.g. `observability/`,
     `kubernetes/`, `server/`) → **Fix**
3. If still candidate, verify **dev-only** paths:
   - `cd frontend && yarn why <package>` — every path must be dev/test/build/CI
   - Optional: `yarn npm audit --environment production` must not implicate the GHSA
   - **Go:** only `*_test.go` / `tests/` requires — else **Fix**
4. If steps 1–3 pass → add row to **Close candidates** with `not_used` (or
   `inaccurate` for D1.5.1 stale-only cases).
5. **Mixed severities on one package:** dismiss **only** the medium/low alert
   numbers; leave high alerts open (e.g. `minimatch` medium vs high).

Collect alerts for listing:

```bash
gh api 'repos/kiali/kiali/dependabot/alerts?state=open&per_page=100' \
  --jq '.[] | {number, severity: .security_vulnerability.severity, pkg: .dependency.package.name}'
```

### D1.5.8 Kiali runtime exclusions (do not dismiss)

Treat as **Fix queue** (runtime / user-facing) unless the operator overrides:

| Area | Packages (examples) | Check |
|------|---------------------|-------|
| UI routing | `react-router`, `react-router-dom`, `@remix-run/router` | Direct or via `react-router-dom-v5-compat` in `dependencies` |
| UI HTTP / i18n | `axios`, `i18next-http-backend`, `dompurify`, `moment` | Direct `dependencies` |
| Chat / OTel JS | `@opentelemetry/core` | Transitive of `@patternfly/chatbot` (runtime) |
| Server tracing | `go.opentelemetry.io/otel/...` | `observability/tracing.go`, `server/`, `kubernetes/` |

Common **dismiss** targets when severity is medium/low and paths are dev-only:

| Package (examples) | Typical `yarn why` root |
|--------------------|-------------------------|
| `qs`, `uuid`, `ip-address`, `tmp` | `cypress`, `@cypress/request`, `socks` |
| `brace-expansion`, `minimatch` (med/low only) | `eslint`, `@typescript-eslint/*` |
| `serialize-javascript` (med/low only) | `mocha`, Cypress reporters |
| `svgo` (med/low only) | `@rsbuild/plugin-svgr`, `@svgr/*` |
| `systeminformation` (med/low only) | `cypress` |
| `deepmerge`, `esbuild`, `picomatch` | `@rsbuild/*`, `i18next-parser`, watchers |

High-severity alerts on those packages stay **open** until a dev parent bump or
explicit operator dismiss.

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
2. **Operator chooses**: **Fix** | **Pass** | **Close** | **Stop session** (or
   “work item `m` instead” — then present item `m` and get a fresh choice).
   **Do not** implement on **maybe**, **test remediation**, or session goals alone.
3. Execute the choice (D2a / D2b / D2c / exit to Step D3) — only after step 2.
4. Record outcome in the running **session log** (Step D3 table).
5. Continue to item `k+1` unless the session stopped.

### D2a Fix (implement on master)

Qualify on **`master`** (synced at session start; re-read files from working tree).

| Ecosystem | Where to look |
|-----------|----------------|
| `go` | `go.mod`, `go.sum`; `go mod graph` if transitive |
| `npm` | `frontend/yarn.lock`, `frontend/package.json` |

If `master` already matches a patched version, recommend **Close** with
`inaccurate` (see D1.5.1) or **Pass** if waiting for GitHub rescan — do not bump
blindly.

**Branch rules** (one PR per queue item — see [One PR per queue item](#one-pr-per-queue-item-default)):

- Run **D0.1**, then create a **new** branch for this item only:

```bash
git checkout -b dependabot-<package>-<short-id>
```

  (Operator may suggest a different name.)

- Do **not** add the next queue item to the same branch unless the operator
  explicitly chose batching.

**Apply the bump** using [remediation.md](remediation.md): use **`frontend/`** as
`<js-root>` for npm; follow the **Go** sections for modules and stdlib as written
(same repo). Use **`go get`** with the **patched version required by the alert**
when it is not satisfied by `@latest`. Compare resolved versions to the alert’s
patched / vulnerable range (`first_patched_version` from Step D1), not only to
Jira text.

Verification before push (scope to change):

```bash
make test
cd frontend && yarn test   # when frontend lockfile changed
```

Push to fork; create PR (`--base master`; **not** draft unless operator asks).
PR conventions: [SKILL.md](SKILL.md) except **no `backport needed`**. No OSSM
Jira keys in the description. Link every Dependabot alert URL for **this queue
item**. Then [PR tracking (required)](#pr-tracking-required): assignee,
project **In review**, reviewer per operator choice.

**Do not** PATCH alerts when the PR opens — see [GitHub alert handling when fixing](#github-alert-handling-when-fixing-default).

#### Dependabot alert lifecycle (fix PR)

| Phase | Expected behavior |
|-------|-------------------|
| **PR open** | Alerts typically stay **open** until merge (no dismiss API on PR open) |
| **PR merged to `master`** | Dependabot marks alerts **fixed** after rescan |
| **PR closed without merge** | Revisit the queue item in a later session |
| **After merge, alert still open** | Next session: verify; **Close** with `inaccurate` if stale, or **Pass** to investigate |

**Close (dismiss)** in **D2c** is for **inapplicable or stale** alerts (`not_used`,
`inaccurate`, etc.) — like **Not a Bug** in Jira triage — **not** for every
fix PR. Do not use **`fix_started`** in this workflow unless an operator
explicitly wants that older pattern.

### D2b Pass

Log **Pass** with a short reason (operator’s or agreed). Alert stays open. Next
queue item.

### D2c Close (dismiss alert)

**Operator approval required** for the full Close candidates table from D1.5.6
(not per-alert re-approval unless the operator changed the list).

**Standard comment** (team default — `not_used`, medium/low dev-only):

```text
Not user-facing: transitive dev/test/build dependency only (yarn why). Team policy: medium/low severity, not in production UI or server runtime.
```

Adjust only when using another `dismissed_reason` or the operator supplies wording.

Dismiss **each approved alert number** (one PATCH per alert):

```bash
COMMENT='Not user-facing: transitive dev/test/build dependency only (yarn why). Team policy: medium/low severity, not in production UI or server runtime.'

gh api -X PATCH "repos/kiali/kiali/dependabot/alerts/<NUMBER>" \
  -f state=dismissed \
  -f dismissed_reason=not_used \
  -f dismissed_comment="$COMMENT"
```

Batch example (operator-approved list only):

```bash
for n in <ALERT_NUMBERS>; do
  gh api -X PATCH "repos/kiali/kiali/dependabot/alerts/${n}" \
    -f state=dismissed \
    -f dismissed_reason=not_used \
    -f dismissed_comment="$COMMENT" \
    --jq '{number, state: .state, reason: .dismissed_reason}' || echo "FAIL $n"
done
```

Requires `gh` token with permission to update Dependabot alerts (`security_events`
scope if PATCH returns 403 — see D0.3).

| `dismissed_reason` | When to use |
|--------------------|-------------|
| `not_used` | Team default: medium/low, dev-only, not user-facing (D1.5.2, D1.5.7) |
| `inaccurate` | Already patched on `master`; stale or duplicate alert (D1.5.1, D1.5.3) |
| `tolerable_risk` | Operator accepts documented risk; rare |
| `no_bandwidth` | Operator explicitly defers with this GitHub reason only |

**`fix_started`** (dismiss because a fix PR is open) is **not** used in this
workflow; leave alerts open until merge + rescan when you chose **Fix (PR)**.

Prefer **Fix** over **Close** when a patch exists. **Pass** vs **Close**: Pass
leaves the alert open; Close dismisses it.

After batch dismiss, re-query open count and list remaining alerts for the session
summary (D3).

### D2.2 Stop session

When the operator chooses **Stop session**, **always** produce [Step D3](#step-d3-session-summary)
immediately. Mark remaining queue items **not reached** (from the next index through `N`).

## Step D3: Session summary

**Required** when the operator stops the session or when the queue is finished.
Do not end the conversation without this summary.

Present:

1. **Session settings** — baseline `master` SHA, repo scope
2. **In-flight PRs** — table of **`[dependabot]`** / `dependabot-*` PRs (number, title, URL, review/CI status if checked at session start)
3. **Queue log** — every item touched this session:

| # | Package / alerts | Outcome | PR / dismiss / pass | Notes |
|---|------------------|---------|---------------------|-------|

4. **Not reached** — next queue positions and packages if stopped early
5. **GitHub state** — open Dependabot alert count before/after session; list
   **dismissed alert numbers** and `dismissed_reason` when PATCH was used
6. **Skill / repo housekeeping** — local `ai-tools` branch changes not yet committed, if any
7. **Suggested next session** — next queue items, merge/rebase notes (e.g. merge open PRs before next `yarn.lock` change)

## Relationship to Triage and Review

| Workflow | Role |
|----------|------|
| **Dependabot (this doc)** | Preventive — harden `kiali/kiali` **master** |
| **Triage** | Reactive — OSSM Jira, all images, backports |
| **Review** | Merge CVE PR batches across branches |

NPM/Go dependency edits follow [remediation.md](remediation.md) in both **Triage**
and **Dependabot**; this doc and [triage.md](triage.md) differ in intake (GitHub
alerts vs Jira), scope (`master` vs supported branches), and ticket handling.

A fix merged here on `master` may still need **triage backports** later when
OSSM Jira issues appear for supported release branches. That is expected until
backport scope is added to this feature.

## Future Extension (not implemented in v1)

- Repositories: `kiali/kiali-operator` (`master`), plugin, etc.
- Backport matrix aligned with Supported Branches in `AGENTS.md`
- Cross-link: optional Jira search for same CVE after upstream fix (read-only)
