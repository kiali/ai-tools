---
name: kiali-release-notes
description: >-
  Generate Kiali sprint release notes from the org GitHub Project board and open
  a pull request against kiali/kiali.io. Use when the user asks for release notes,
  relnotes, updating release-notes.md, or preparing a kiali.io docs PR for a
  version (for example 2.35.0).
disable-model-invocation: false
allowed-tools: Bash(gh *), Bash(git *), Bash(jq *), Bash(./skills/kiali-release-notes/scripts/*)
---

# Kiali.io Release Notes PR

Build release notes from the **Kiali sprint GitHub Project** ([project 67](https://github.com/orgs/kiali/projects/67)),
insert them into `content/en/news/release-notes.md`, and open a PR on
`kiali/kiali.io`.

Do **not** use `kiali.io/scripts/relnotes.py` unless the user explicitly asks
for the legacy script. Prefer GitHub MCP (projects toolset) or `gh api graphql`.

## Constants

| Constant | Value |
|----------|-------|
| GitHub org | `kiali` |
| Sprint project number | **67** (`KIALI_SPRINT_PROJECT_NUMBER` in the helper scripts) |

Only ask for a different project number if the user says the board moved; do not
prompt for project ID on every run.

## Inputs

| Input | Example | Notes |
|-------|---------|-------|
| **Version** | *(optional)* | Default: parse from project **67** title (`Kiali v2.35` → `2.35.0`) |

Optional:

- **Release date** — default is the **first Monday after today** (see
  [reference.md](reference.md)); override via user request or `RELEASE_DATE`.
- **kiali.io path** — sibling clone `../kiali.io` or `~/go/src/github.com/kiali/kiali.io`

## Authentication

- **GitHub MCP (remote):** uses the PAT configured on the MCP server.
- **`gh api graphql`:** uses `gh auth login` token (must include `read:org` and
  `read:project`).

```bash
gh auth status
gh auth refresh -h github.com -s read:org -s read:project
```

## Workflow overview

1. **Generate candidates** — prefixed, sorted draft (`collect-candidates.sh`).
2. **Present once** in a fenced code block (raw markdown) so `/issues/NNNN` and
   `/pull/NNNN` are visible; apply any quick chat edits the user asks for before
   step 3.
3. **Prepare `kiali.io` for direct editing** — create branch `release-notes-<version>`
   from the repo default branch (`staging` on `kiali/kiali.io`), insert the
   `## version` block into `content/en/news/release-notes.md` (no HTML comments),
   **do not commit** unless the user asks. Give the user an **absolute path** to
   the file and the branch name so they can edit in the IDE.
4. User polishes the file locally (drops, titles, prefixes, re-sort Features/Fixes
   A–Z). Agent helps on request; no need to relist the full block in chat unless
   asked.
5. **Related kiali.io updates** — before commit/push, walk through the checklist
   in [Step 4b](#step-4b-related-kialiio-updates-checklist). Ask each question in
   order; apply changes on the same `release-notes-<version>` branch when needed.
6. When the user is ready: show `git diff`, propose commit message, then commit,
   push to **personal fork**, and open the PR (Step 7).

## Step 1: Locate kiali.io

Search `../kiali.io`, `../../kiali.io`, or `~/go/src/github.com/kiali/kiali.io`.
Clone a **personal fork** if missing: `gh repo clone <github-user>/kiali.io`.

## Step 2: Generate candidate release notes (`collect-candidates.sh`)

```bash
cd /path/to/ai-tools
./skills/kiali-release-notes/scripts/collect-candidates.sh > /tmp/kiali-rn-candidates.md
```

Output is a **`## version`** block with **Features** and **Fixes**, suggested
`Prefix:` titles (via `refine-items.jq`), and **Release:** date (first Monday
after today unless `RELEASE_DATE` is set).

Sources (project **67**, **Status → Done** only):

| Source | Features | Fixes |
|--------|----------|-------|
| Closed issues | no `bug` label | `bug` label |
| Orphan merged PRs | no `bug` label | `bug` label |

Obvious CI/infra rows are removed by default (`filter-items.jq`); use
`--include-ci` to keep them. Orphan PRs skip backports, dependabot, and
`kiali.io` / `ai-tools` repos.

Present the file to the user. Review comments use the **issue or PR number in the
link** (e.g. “drop 10477, 10452” or “remove pull 10508”).

### GitHub MCP (equivalent)

Same rules: Done only, classify by `bug` label, merge orphan PRs into Features or
Fixes, apply [refinement.md](refinement.md) heuristics, drop obvious CI entries.

## Step 3: Branch and insert draft

```bash
cd /path/to/kiali.io
git fetch origin
git checkout -B release-notes-<version> origin/staging   # kiali.io default is staging, not main
```

Insert the block from `/tmp/kiali-rn-candidates-<version>.md` (or the working file)
**after** the introductory paragraph and **before** the previous `##` heading.
Strip the HTML review comment. Do not duplicate an existing `## <version>` section.

Tell the user:

- Absolute path: `/path/to/kiali.io/content/en/news/release-notes.md`
- Branch: `release-notes-<version>`
- They can edit Features/Fixes directly; re-sort A–Z (case-insensitive) on the
  full bullet text when changing prefixes or titles (see [refinement.md](refinement.md)).
- **Edit only the new `## version` block** — match existing `*` list style; avoid
  format-on-save that rewrites the whole file. If that happens, restore from
  `origin/staging` and re-insert the section.

Optional chat polish before insert: drop rows by issue/PR number, dedupe issue+PR.
Do **not** add per-issue overrides to skill scripts.

## Step 4: User edits in the repo (preferred)

User edits `release-notes.md` in the IDE. Commit/push/PR only after they say so.

## Step 4b: Related kiali.io updates (checklist)

After release notes content is ready, **before** commit and push, ask the user each
question below (AskQuestion tool or plain chat). If they want
updates, edit the listed paths on the same branch and include them in the PR.

1. **Compatibility charts** — ask exactly:

   > Do we need to update any compatibility charts?

   If yes, usual files:

   | Chart | Data file | Docs page |
   |-------|-----------|-----------|
   | Kiali ↔ Istio | `data/compatibility/istio.yaml` | `content/en/docs/Installation/installation-guide/prerequisites.md` (`{{<compat-table-istio>}}`) |
   | Kiali ↔ OSSMC | `data/compatibility/ossmc.yaml` | same (`{{<compat-table-ossmc>}}`) |

   See [reference.md](reference.md#compatibility-charts).

2. **Releases dropdown** — ask exactly:

   > Do we need to make changes to the Releases dropdown menu (in config.toml)?

   If yes, edit `config.toml` at the repo root: `version_menu = "Releases"` and
   the `[[params.versions]]` entries under `# Add your release versions here`
   (use the `## NEXT PARAMS.VERSIONS PLACEHOLDER` comment for where to insert).
   See [reference.md](reference.md#releases-dropdown-configtoml).

   **AskQuestion options (if used):** No; Yes — user specifies label/URL in chat;
   Other. **Do not** offer a preset such as “add the previous minor version
   snapshot” — the team does not follow an automatic prior-version rule.

3. **Extra release-notes prose** — ask exactly:

   > Do you need to add any additional text to this version's release notes?

   If yes, edit the new `## <version>` block in `content/en/news/release-notes.md`
   **after** the Fixes list (not from the project board). Typical patterns:
   `#### Upgrade Change Notes:`, CR fields ignored or removed, deprecation
   paragraphs — see [refinement.md](refinement.md#upgrade--deprecation-notes) and
   earlier sections in `release-notes.md` (e.g. `2.33.0`).

   **AskQuestion options (if used):** No; Yes — user provides text or edits in the
   IDE; Other.

4. *(More checklist items — add here as the team defines them.)*

## Step 5: Validate (optional)

Run the `kiali-check-syntax` skill on the diff, or:

```bash
cd /path/to/kiali.io && git diff content/en/news/release-notes.md
```

## Step 7: Branch, commit, push, PR

Follow `ai-tools` no-auto-commit rule (`.cursor/rules/no-auto-commit.mdc`): show
diff and proposed commit message; commit and push only after explicit approval.

PRs come from a **personal fork**, not a branch on `kiali/kiali.io`.

```bash
cd /path/to/kiali.io
git fetch origin
git checkout -B release-notes-<version> origin/staging
git add content/en/news/release-notes.md
git commit -m "Release notes for Kiali <version>"
git push -u <fork-remote> release-notes-<version>

gh pr create \
  --repo kiali/kiali.io \
  --head <github-user>:release-notes-<version> \
  --base staging \
  --title "Release notes for Kiali <version>" \
  --body "$(cat <<'EOF'
## Summary

- Add release notes for Kiali <version> from [Kiali sprint project 67](https://github.com/orgs/kiali/projects/67).

## Test plan

- [ ] Review Features and Fixes against the sprint project board
- [ ] Confirm release date line
- [ ] Hugo/docs build (if required by maintainers)

EOF
)"
```

Return the PR URL.

## Helper scripts

| Script | When |
|--------|------|
| `collect-candidates.sh` | **Start here** — candidate `## version` block |
| `list-standalone-prs.sh` | Orphan PRs only (debugging) |
| `generate-section.sh` | Legacy issues-only draft |

## Legacy Python script

`kiali.io/scripts/relnotes.py` remains for manual use only.

## Reference

- [reference.md](reference.md) — data source, dates, versions, Done column
- [refinement.md](refinement.md) — title prefixes, editing, ordering
