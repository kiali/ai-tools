---
name: sprint-demo
description: Prepare upstream Kiali community meeting sprint demo slides by gathering changes since the last release across kiali, OSSMC, docs, operator, and helm-charts repos. Use when the user says "/sprint-demo", "prepare sprint demo", "community meeting slides", or similar.
disable-model-invocation: false
allowed-tools: Bash(git *), Bash(gh *), Bash(jq *), Bash(curl *)
---

# Sprint Demo Skill

Gather release activity since the last Kiali version tag and produce slide-ready content for the community meeting.

## What you need from the user

Ask only if neither is already provided:

- **Target version** — e.g. `v2.33`, or
- **Sprint label** — e.g. `26-13`

One of the two is enough. Do not ask for anything else up front.

**Infer everything else automatically:**

| Input | How to resolve |
|-------|----------------|
| Missing version | Next minor after latest `gh release` for `kiali/kiali` (e.g. `v2.32.0` → `v2.33`) |
| Missing sprint | Increment the sprint label from the user's last demo, or derive from version if known |
| Previous release tag | Latest published GitHub release for `kiali/kiali` |
| Commit/PR date range | Publish date of that release |
| Local repo paths | Use local clones when present; otherwise `gh api` / `gh pr list` |
| Meeting date | Omit from the title slide unless the user mentions it |

## Repositories to scan

| Repo | GitHub | Version tags | Scope |
|------|--------|--------------|-------|
| Kiali server + UI | `kiali/kiali` | `v2.X.X` | Primary — features, fixes, AI, mesh, CI |
| Kiali Operator | `kiali/kiali-operator` | `v2.X.X` | CRD/operator changes, deployment |
| OSSMC plugin | `kiali/openshift-servicemesh-plugin` | `v2.X.X` | OpenShift console integration |
| Documentation | `kiali/kiali.io` | none (use release date) | Docs, release notes, guides |
| Helm charts | `kiali/helm-charts` | independent | Chart values, templates |

Also check merged PRs and closed issues labeled `feature` or `bug` on `kiali/kiali` for context the commit log may miss.

See [reference.md](./reference.md) for `gh`/`git` commands per repo.

## Step 1 — Determine the commit range

```bash
# Latest published release (default baseline)
gh release view --repo kiali/kiali --json tagName,publishedAt \
  --jq '{tag: .tagName, date: .publishedAt}'

# Commits on master since last tag (kiali)
git -C <kiali-path> log v2.32.0..HEAD --oneline --no-merges

# Or via GitHub API (no local clone)
gh api repos/kiali/kiali/compare/v2.32.0...master \
  --jq '.commits[] | .commit.message' | head -80
```

Repeat for `kiali/kiali-operator` and `kiali/openshift-servicemesh-plugin` using the same tag.

For `kiali/kiali.io`, use commits since the previous release date:

```bash
gh api "repos/kiali/kiali.io/commits?since=2026-09-13T00:00:00Z&per_page=100" \
  --jq '.[].commit.message'
```

For `kiali/helm-charts`, list merged PRs since the release date:

```bash
gh pr list --repo kiali/helm-charts --state merged \
  --search "merged:>=2026-09-13" --limit 50 \
  --json number,title,mergedAt
```

## Step 2 — Gather merged PRs (richer than commit subjects)

```bash
gh pr list --repo kiali/kiali --state merged \
  --search "merged:>=2026-09-13" --limit 100 \
  --json number,title,labels,mergedAt,author

gh pr list --repo kiali/openshift-servicemesh-plugin --state merged \
  --search "merged:>=2026-09-13" --limit 50 \
  --json number,title,mergedAt
```

Cross-reference with `kiali/kiali.io` release notes draft if one exists:

```
content/en/news/release-notes.md
```

## Step 3 — Classify changes

Assign each item a **category tag** (prefix in slide bullets):

| Tag | Examples |
|-----|----------|
| `[AI]` | Chatbot, MCP tools, providers, prompts |
| `[UI]` | PatternFly upgrades, themes, pages, wizards, i18n |
| `[Mesh]` | Mesh page, multicluster, ambient, ztunnel, istiod |
| `[Config]` | CR settings, mesh config file, operator values |
| `[Design]` | KEPs, architecture proposals, federation bundles |
| `[Perf]` | Caching, graph appenders, query optimization |
| `[CI]` | Workflows, test infra, image updates |
| `[Testing]` | Cypress fixes, flaky test skips |
| `[Security]` | CVE dependency upgrades |
| `[Docs]` | kiali.io content, guides |
| `[OSSMC]` | Console plugin changes (`openshift-servicemesh-plugin`) |
| `[Operator]` | Operator-only changes |

**Notable changes** — user-facing features, significant refactors, dependency upgrades (PatternFly, Istio CRDs), new docs. One line each, include PR number: `(#10257)`.

**Bug fixes** — regressions fixed, CVEs, flaky tests, CI hardening.

**Deep-dive topics** — pick 2–3 themes worth a dedicated slide (not just a bullet). Good candidates:
- Large UX changes with before/after story
- New architecture (metric federation, canary upgrades)
- Cross-repo efforts (OSSMC, operator, docs, or helm-charts aligned with a Kiali feature)
- Documentation or design proposals with external links

Skip noise: version-bump commits (`Prepare for next version`), merge commits, routine dependency bumps (unless security/CVE), lint-only changes.

## Step 4 — Produce slide content

Output a markdown block the user can paste into their presentation. Use this layout:

### Slide 1 — Title

```
Kiali v<VERSION>
Sprint <SPRINT>
Community Meeting
```

### Slide 2 — Section divider

```
V<VERSION> Activity
```

### Slides 3–N — Deep-dive topics (2–3 slides)

One major theme per slide. Include:
- Short title (feature area)
- 3–6 bullet points explaining the change
- Navigation hint where useful (`Overview → Namespaces`)
- Link to docs if available (`kiali.io/docs/...`)

### Slide — Notable changes

```
Notable changes

[AI] ...
[UI] ...
[Mesh] ...
...
```

Order: features first (by impact), then infra/CI. Keep to ~8–12 bullets.

### Slide — Bug fixes

```
Bug fixes

[Security] Upgraded <pkg> to <ver>, fixing CVE-XXXX-NNNNN. (#NNNN)
[Mesh] Fixed ... (#NNNN)
...
```

Group security CVEs first.

### Slide — Next sprint

```
Sprint <NEXT_SPRINT>: v<NEXT_VERSION>
Project board: https://github.com/orgs/kiali/projects/67
```

Increment sprint number and version unless the user specifies otherwise.

### Slide — Closing

```
Community Discussion
Thank You !
https://github.com/kiali
https://www.youtube.com/@KialiProject
https://www.linkedin.com/company/kiali/
https://x.com/KialiProject
```

## Step 5 — Review with the user

Present the draft and ask:

1. Which deep-dive topics to keep/drop/add?
2. Any items to emphasize for the live demo (need screenshots)?
3. Should release notes on kiali.io be updated with the same content?

## Output format

Emit a single `## Sprint Demo Draft` section containing all slide text, then a `## Sources` section listing:
- Baseline tag and date
- Commit/PR count per repo
- Any items excluded as noise

## Quality checklist

- [ ] Every bullet has a category tag `[...]`
- [ ] PR numbers included where available `(#NNNN)`
- [ ] CVE fixes list package, version, and CVE id
- [ ] OSSMC-specific items sourced from `openshift-servicemesh-plugin`, not duplicated from kiali
- [ ] No duplicate bullets across notable changes and bug fixes
- [ ] Deep-dive slides cover the most demo-worthy themes, not every bullet
