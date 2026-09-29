# Sprint Demo — Reference Commands

## Per-repo commands

### kiali/kiali

```bash
PREV=v2.32.0

# Commits (local)
git log ${PREV}..HEAD --oneline --no-merges

# Merged PRs since release date
gh pr list --repo kiali/kiali --state merged \
  --search "merged:>=2026-09-13" --limit 100 \
  --json number,title,labels

# Security-related
git log ${PREV}..HEAD --oneline --no-merges --grep='CVE\|security\|bump\|upgrade' -i

# Compare stats
gh api repos/kiali/kiali/compare/${PREV}...master \
  --jq '{total: .total_commits, files: .files | length}'
```

### kiali/kiali-operator

```bash
git log ${PREV}..HEAD --oneline --no-merges   # when on matching tag branch
gh pr list --repo kiali/kiali-operator --state merged \
  --search "merged:>=2026-09-13" --limit 50 --json number,title
```

### kiali/openshift-servicemesh-plugin

```bash
git log ${PREV}..HEAD --oneline --no-merges
gh pr list --repo kiali/openshift-servicemesh-plugin --state merged \
  --search "merged:>=2026-09-13" --limit 50 --json number,title
```

### kiali/kiali.io

No version tags — filter by release publish date:

```bash
SINCE=2026-09-13T00:00:00Z
gh api "repos/kiali/kiali.io/commits?since=${SINCE}&per_page=100" \
  --jq '.[] | "\(.sha[0:7]) \(.commit.message | split("\n")[0])"'

# Check for release-notes draft
gh api repos/kiali/kiali.io/contents/content/en/news/release-notes.md \
  --jq '.content' | base64 -d | head -60
```

### kiali/helm-charts

```bash
gh pr list --repo kiali/helm-charts --state merged \
  --search "merged:>=2026-09-13" --limit 50 --json number,title,mergedAt
```

## Useful links

| Resource | URL |
|----------|-----|
| Kiali project board | https://github.com/orgs/kiali/projects/67 |
| Release notes | https://kiali.io/news/release-notes/ |
| Sprint demo videos | https://www.youtube.com/@KialiProject |

## Typical local clone layout

```
kiali_sources/
├── kiali/
├── kiali-operator/          # or kiali/operator symlink
├── helm-charts/
├── kiali.io/
└── openshift-servicemesh-plugin/
```

If local clones are unavailable, use `gh api` and `gh pr list` exclusively.

## Categorization heuristics

| Commit/PR signal | Category |
|------------------|----------|
| `i18n`, `translation`, PatternFly, theme, page, wizard | `[UI]` |
| `chat`, `MCP`, `anthropic`, `AI` prefix | `[AI]` |
| `mesh`, `ztunnel`, `ambient`, `multicluster`, `istiod` | `[Mesh]` |
| `operator`, `CRD`, `CSV`, `molecule` | `[Operator]` |
| `ossmc`, `console plugin`, `openshift-servicemesh-plugin` | `[OSSMC]` |
| `CVE`, `dependabot`, `bump .* to` (security advisory) | `[Security]` |
| `cypress`, `e2e`, `flake`, `skip` | `[Testing]` |
| `workflow`, `jenkins`, `ci`, `hack/` CI scripts | `[CI]` |
| `kiali.io`, `docs:` | `[Docs]` |
| `KEP`, `design`, `proposal` | `[Design]` |
| `perf`, `cache`, `optimization` | `[Perf]` |
