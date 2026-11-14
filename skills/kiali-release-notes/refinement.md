# Release notes title refinement

Raw GitHub issue titles are a **draft**. Published `release-notes.md` entries are
refined for scanability: one line each, a **category prefix**, plain language, and
**alphabetical** order within Features and Fixes.

## Workflow

1. **Generate** with `collect-candidates.sh` (prefixed draft; orphan PRs merged
   into Features/Fixes via `bug` label).
2. **Validate** with the user — drop by issue/PR number in the link; fix bad
   prefixes or titles using the rules below.
3. Edit `release-notes.md` after approval.

## Prefix conventions

Use a short `Category:` prefix (match recent releases). Common categories:

| Prefix | Use for |
|--------|---------|
| `AI:` | Chatbot, MCP, LLM tooling |
| `Ambient:` | Ambient mesh, waypoint, ztunnel |
| `API:` | HTTP/REST API behavior, swagger |
| `Auth:` | Login, OpenShift/OpenID, RBAC affecting console use |
| `CI:` | Jenkins, GitHub Actions, molecule, test infra |
| `Config:` | Kiali CR, server config, feature flags |
| `Graph:` | Traffic graph layout/find/highlight (not general UI chrome) |
| `Istio:` | Istio-version or mesh config integration |
| `Metrics:` | Prometheus, dashboards, federation |
| `Operator:` | Kiali operator or operand packaging |
| `OSSMC:` | OpenShift Service Mesh Console plugin |
| `Perses:` | Perses dashboards |
| `Tempo:` | Tracing backends |
| `UI:` | Console pages, navigation, tables, wizards |
| `UX:` | PatternFly migrations, themes, editors, modals |
| `Validation:` / `Validations:` | Kiali/Istio validators, KIA codes |

Pick one prefix per item. Prefer repo hints (`openshift-servicemesh-plugin` →
`OSSMC:`, `kiali-operator` → `Operator:`).

Omit the prefix only when the title is already a clear product statement (rare).

## Title editing

- **Reader-first:** what changed for users/admins, not internal task wording.
- **Drop scaffolding:** remove `(AI)`, `[CI]`, ticket noise, and duplicate prefixes.
- **Length:** one line; trim stack traces and parentheticals unless they identify the
  fix (e.g. a KIA code).
- **Features:** prefer active phrasing (“Add…”, “Support…”, “Show…”).
- **Fixes:** describe the bug or regression; “Fix …” is fine when it reads naturally.
- **Do not** change the linked URL to a different issue without confirming the work
  item.

## Ordering

Sort **Features** and **Fixes** separately, **case-insensitive A–Z** on the full
display string including the prefix (`AI: …` before `Ambient: …`).

## Examples (raw → refined)

| Raw issue title | Refined line |
|-----------------|--------------|
| `[(AI) Validation for MCP Tools]` | `AI: Validation for MCP Tools` |
| `Migrate deprecated PatternFly Modal API…` | `UX: Migrate deprecated PatternFly Modal API to PF6 composition-based Modal` |
| `(CI) process labels trigger…` | `CI: process labels trigger full skipped workflow runs and confuse PR merge status` |
| `OpenShift auth: a transient remote-cluster…` | `Auth: Transient remote-cluster namespace API failure ends a valid remote session` |

See `content/en/news/release-notes.md` sections `2.33.0`–`2.34.0` for tone.

## Orphan pull requests

Orphan merged PRs (Done, no `closingIssuesReferences`) are included automatically:
**Features** unless the PR has a `bug` label. Obvious CI PRs are filtered out.

- Link to the **PR** when there is no parent issue.
- If the PR duplicates an issue bullet, keep one entry (usually the issue).

## Upgrade / deprecation notes

If the sprint includes CRD/config removals or breaking changes, add a short
paragraph or bullet block **after** Fixes (see `2.33.0`). Not generated from the
project board; add manually when applicable.
