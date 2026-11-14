# Release notes reference

## Data source

Sprint scope lives on the Kiali org **ProjectV2** board **#67**:

https://github.com/orgs/kiali/projects/67

Override only if the team moves to a new board (`KIALI_SPRINT_PROJECT_NUMBER` env var
or the second argument to `generate-section.sh`).

### Version from project title

The sprint project title includes the release target, for example:

`Kiali Sprint 26-15 | Kiali v2.35`

Parse the substring after `Kiali v` (case-insensitive):

| Title fragment | Release notes heading |
|----------------|------------------------|
| `Kiali v2.35` | `## 2.35.0` |
| `Kiali v2.35.0` | `## 2.35.0` |

When only major.minor is present, append `.0` to match `release-notes.md`.

Use an explicit version only when the title is missing or does not match this pattern.

### Project Status column

Release notes include only cards in the project **Status → Done** column (GitHub
label `✅ Done`). Scripts read `fieldValueByName(name: "Status")` on each project item.

For standalone PRs, also require **`merged: true`** on the pull request.

### Item classification (same as legacy `relnotes.py`)

| Section | Rule |
|---------|------|
| Features | Issue state `CLOSED` (or `MERGED` if present), and **no** `bug` label |
| Fixes | Issue state `CLOSED` / `MERGED`, and **has** `bug` label |

Open items are omitted. Draft cards without linked issues are skipped.

Title formatting for bullets: replace `[` / `]` with `(` / `)` in the issue title.

### Release date line

Default (no override):

```markdown
Release: <first Monday after today>
```

- Count from **tomorrow** (strictly after the current calendar date).
- Format: English month name, day without leading zero, year — e.g. `November 16, 2026`.
- Override for the helper script: set env `RELEASE_DATE="November 20, 2026"`.
- Override in the agent/MCP flow: user says an explicit date or adjust before opening the PR.

The project `shortDescription` sprint range is informational only; do not use it
for the `Release:` line unless the user asks.

## Published format (current)

File: `kiali.io/content/en/news/release-notes.md`

```markdown
## X.Y.Z
Release: <Month DD, YYYY>

Features:

* [Title](https://github.com/...)

Fixes:

* [Title](https://github.com/...)
```

Some releases add deprecation notes after Fixes; add those manually when needed.

## GitHub MCP (`projects` toolset)

| Task | Approach |
|------|----------|
| List items | `projects_list` → `list_project_items`, owner `kiali`, `project_number: 67` |
| Project metadata | Project title / short description for release date |
| Auth | PAT with `read:org`, `read:project` on the MCP server |

Enable toolset: `X-MCP-Toolsets` includes `projects` (see SKILL.md).

Consolidated MCP tools may rename over time; if `projects_list` is missing, use
`gh api graphql` via `generate-section.sh`.

## Compatibility charts

Published on the installation prerequisites page. Hugo loads YAML from `data/compatibility/`.

| File | Shortcode |
|------|-----------|
| `data/compatibility/istio.yaml` | `{{<compat-table-istio>}}` |
| `data/compatibility/ossmc.yaml` | `{{<compat-table-ossmc>}}` |

Update these when a release changes supported Istio or OSSMC version pairings.

## Releases dropdown (`config.toml`)

The site navbar **Releases** menu is driven by Hugo params in the repo-root
`config.toml`:

- `version_menu = "Releases"` — menu label
- `[[params.versions]]` — one block per archived doc site (newest entries near
  `# Add your release versions here` / `## NEXT PARAMS.VERSIONS PLACEHOLDER`)

Each entry is typically:

```toml
[[ params.versions ]]
  version = "v2.34"
  url = "https://v2-34.kiali.io"
```

Labels sometimes include Istio/OSSM hints (e.g. `v2.26  [istio v1.30]`). Always
ask the user for the exact `version` and `url` to add; do not infer a new menu
entry from the release-notes version (e.g. no rule like “add v2.34 when shipping
2.35.0”).

## `gh` GraphQL fallback

Equivalent query to the legacy script, with pagination via `items(first: 100, after: $cursor)`.

Requires:

```bash
gh auth refresh -h github.com -s read:org -s read:project
```

## Token scopes (MCP PAT or classic PAT)

- `read:org`
- `read:project`
- `public_repo` (legacy script documented this; read paths use the first two)
