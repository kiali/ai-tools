# CVE dependency remediation (`kiali/kiali` and OSSMC)

**Shared** steps for **implementing** a dependency fix after qualification (Jira
triage: [triage.md](triage.md) Step 6; Dependabot: alert + synced `master` in
[dependabot.md](dependabot.md)). **Ticket lifecycle** (OSSM Jira vs GitHub
alerts) stays in those workflows — this doc is only how to change `package.json`
/ lockfile / `go.mod`.

## Paths (substitute for OSSMC)

| Context | Repo | Default branch | JS package dir | `yarn` working dir |
|---------|------|----------------|----------------|-------------------|
| Kiali server | `kiali/kiali` | `master` | `frontend/package.json` | `frontend/` |
| OSSMC | `kiali/openshift-servicemesh-plugin` | `main` | `plugin/package.json` | `plugin/` |

**Go** paths are repo root (`go.mod`, `go.sum`) for `kiali/kiali` only in this
doc; OSSMC is JS-only for remediation here (see [triage.md](triage.md) Step 8).

Below, **`<js-root>`** means `frontend` (server) or `plugin` (OSSMC). Commands
assume `kiali/kiali` unless noted — for OSSMC use `plugin/` and branch/PR rules
from triage Step 8.

**Fix version source:** In Jira triage use the ranges from Step 6a (and lockfile
checks). For Dependabot use the alert’s patched version / range and re-read
`<js-root>/yarn.lock` and `go.mod` on **synced** `master` before editing.

---

## NPM/JS upgrade (`<js-root>/`)

**Common first step:**
1. Create branch from the target default branch (e.g. triage:
   `CVE-YYYY-NNNNN-library-upgrade`; Dependabot: `dependabot-<package>-<short-id>`
   per [dependabot.md](dependabot.md)).

**Direct dependencies** (in `<js-root>/package.json`):
2. Update to **latest version within same major**. Use
   `npm view <package> version` to find latest.
3. `yarn install --no-immutable` in `<js-root>/`

**Transitive dependencies** (only in `<js-root>/yarn.lock`):
2. Remove old entry from `<js-root>/yarn.lock` (use script, not manual edit)
3. `yarn install --no-immutable` in `<js-root>/`

**Verify:**
4. `make build-ui` (server) or OSSMC’s equivalent build for `plugin/`
5. `make build-ui-test` when available (server)
6. **Lockfile audit** — after install, run `yarn dedupe <library>` to
   consolidate caret-range entries. Then grep the lockfile for ALL
   remaining entries of the vulnerable library and verify every resolved
   version meets or exceeds the fix version for its major range
   (from triage Step 6a, or the Dependabot patched version / advisory):
   ```bash
   yarn dedupe <library>
   rg '"<library>@npm:' <js-root>/yarn.lock
   ```
   If any entry is still below its fix version, follow **Handling vulnerable
   transitive dependencies** below.
7. Present diff to user / operator

### Handling vulnerable transitive dependencies

Keep the `resolutions` section in `<js-root>/package.json` as small as possible.
Do NOT add `resolutions` entries unless absolutely necessary — they are
overrides that mask the real dependency tree and add maintenance burden.

When a transitive dependency brings in a vulnerable version, follow
the same approach on all branches (`master`/`main` and backports):

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
   only exists on backport branches (not on `master`), prefer the
   resolution entry. If `master` used the bump parent approach, use the
   same approach on backports for consistency.

4. After applying the chosen fix, run `yarn install --no-immutable` and
   `yarn dedupe <library>`, then re-audit the lockfile.

#### Check parent (before adding or keeping a resolution) — Kiali frontend / plugin

Use when choosing between parent bump vs resolution (especially Dependabot
transitive alerts):

```bash
cd <js-root>
yarn why "${PACKAGE}"
```

For each parent that pulls a vulnerable version, check whether a newer parent
release already depends on a **patched** version (compare to the CVE / advisory
fix):

```bash
npm view "${PARENT}@${CURRENT}" dependencies.${PACKAGE}
npm view "${PARENT}@latest" dependencies.${PACKAGE}
```

**If Kiali directly imports the package** (matches in app or test code):

```bash
# adjust pattern for scoped packages
rg "from ['\"]${PACKAGE}['\"]|require\\(['\"]${PACKAGE}['\"]\\)" \
  <js-root>/src <js-root>/cypress
```

- Bump an existing **direct** dependency entry to the patched version.
- If the package is imported but only listed under **`resolutions`**, discuss
  with the user: bump the resolution, or move to `dependencies` and remove
  the resolution if `yarn install` still resolves safely.
- Do **not** use a resolution when a direct dependency entry is sufficient.

**If the package is transitive only** (no Kiali import):

- Do **not** add it to `dependencies` / `devDependencies` to satisfy the alert.
- After **Check parent**: prefer **parent upgrade**, then **`yarn up`** toward the
  patched version, then **bump an existing resolution** only if needed.
- **Try removing the resolution** after a bump: delete the `resolutions` entry,
  run `yarn install` from `<js-root>/`, confirm every lock entry meets the patched
  version.
- **Add a new resolution** only when the above still leaves a vulnerable transitive
  line — explain in the PR why it is required.

---

## Go third-party module upgrade

1. Create branch from target branch (`master` or release branch)
2. `go get <module>@latest` (or a specific patched version when required)
3. `go mod tidy`

**Verify:**
4. `make build`
5. `make test`
6. Present diff to user / operator

---

## Go standard library upgrade

**`master`:**
1. Create branch from `master`
2. Update `go` directive in `go.mod`
3. `go mod tidy`
4. `make build` and `make test`

**Supported branches:** Verify Go version is available downstream first.

Check `skopeo` access (or rely on triage-start verification in [SKILL.md](SKILL.md)):

```bash
skopeo inspect --no-tags \
  docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder \
  >/dev/null 2>&1
```

If auth fails, see **Red Hat registry login** in [SKILL.md](SKILL.md).

List available tags:

```bash
skopeo inspect docker://brew.registry.redhat.io/rh-osbs/openshift-golang-builder 2>&1 \
  | python3 -c "import sys,json; tags=json.load(sys.stdin)['RepoTags']; [print(t) for t in sorted(tags) if '1.XX' in t]"
```

Skip branches where the fixed Go version is not available.
