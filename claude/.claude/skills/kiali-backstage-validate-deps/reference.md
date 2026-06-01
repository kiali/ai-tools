# Kiali Backstage Dependency Validation Reference

This reference contains the full workflow for validating dependency update changes in the Kiali Backstage workspace.

## When To Use This Workflow

- Dependency update PRs for the Kiali Backstage workspace
- Backstage version upgrades
- Changes to `package.json`, `yarn.lock`, or Playwright E2E tests in that workspace
- Any request to validate the Kiali Backstage frontend after dependency changes

## Repository Context

The command examples below assume a checkout of [`backstage/community-plugins`](https://github.com/backstage/community-plugins/), where the Kiali Backstage workspace root is `workspaces/kiali`.

## Prerequisites Check

Before running the validation, verify:

### 1. Kiali Environment Running

Check if Kiali is deployed and accessible:

```bash
kubectl get pods -n istio-system | grep kiali
```

Expected: Kiali pod should be running

### 2. Port-Forward to Kiali

Verify port-forward is active on port 20001:

```bash
lsof -i :20001 || netstat -tuln | grep 20001
```

If not running, start it:

```bash
kubectl port-forward -n istio-system svc/kiali 20001:20001 &
```

### 3. Kiali Endpoint Configuration

Ensure `KIALI_ENDPOINT` is properly configured:

```bash
echo $KIALI_ENDPOINT
```

Expected: Should show the Kiali endpoint (for example `http://localhost:20001`)

## Validation Steps

### Step 0: Verify Node.js Version

**MUST RUN FIRST**. Abort validation if Node.js is not `v22.x.x`, because wrong versions cause false failures.

```bash
node --version
```

If needed:

```bash
nvm use 22
```

Why this matters:

- The Kiali workspace requires Node.js 22 (specified in package.json engines).
- Wrong Node version can cause dependency installation failures.
- Native modules may fail to build with the wrong Node version.
- Tests may behave differently or fail with the wrong Node version.

### Step 1: Navigate to the Workspace Root

```bash
cd workspaces/kiali
```

### Step 2: Clean Install Dependencies

Install fresh dependencies to avoid stale packages:

```bash
yarn install
```

Check for:

- No errors during installation
- No high or critical security vulnerabilities
- Correct dependency resolution
- Native modules building successfully

### Step 3: Type Check

Verify TypeScript compilation:

```bash
yarn tsc
```

Check for:

- No TypeScript compilation errors
- No type mismatches

### Step 4: Run E2E Tests

Execute the end-to-end test suite:

```bash
yarn test:e2e
```

Check for:

- All tests passing
- No timeouts
- No flaky test behavior
- Kiali UI components rendering correctly

Common test scenarios validated:

- Header components (provider selector, namespace selector, cluster info)
- Overview page with metrics and sparklines
- Traffic Graph tab with topology visualization
- Workloads tab with table and drawer
- Services tab with health indicators
- Applications tab with namespace info
- Istio Config tab with validation

### Step 5: Interactive Test (Optional)

For deeper validation, run tests in UI mode:

```bash
yarn playwright test --ui
```

This helps with:

- Visual inspection of test execution
- Debugging failed tests
- Watching component interactions

## Manual Review Checklist

After automated tests pass, perform manual verification:

### UI/UX Review

- [ ] Start the development server: `yarn start`
- [ ] Navigate to `http://localhost:3000/kiali`
- [ ] Test key user flows:
  - [ ] Navigate through all tabs (Overview, Traffic Graph, Workloads, Services, Applications, Istio Config)
  - [ ] Test namespace selector (Select All / Deselect All)
  - [ ] Verify charts and sparklines render correctly
  - [ ] Open and close drawers for workloads, services, and applications
  - [ ] Check that icons and buttons are functional
  - [ ] Verify no console errors in browser DevTools

### Dependency-Specific Checks

- [ ] Review `package.json` changes
- [ ] Check for breaking changes in updated packages
- [ ] Verify compatibility with the Backstage version
- [ ] Check [RHDH compatibility](https://github.com/redhat-developer/rhdh-plugin-export-overlays?tab=readme-ov-file#backstage-compatibility) if Backstage was updated
- [ ] Review lock file changes for unexpected updates

### Regression Testing

- [ ] Verify existing features still work
- [ ] Check that performance has not degraded
- [ ] Ensure accessibility features remain intact
- [ ] Test with different Kiali configurations when applicable

## Common Issues and Solutions

### Wrong Node.js Version

**Problem:** Using the wrong Node.js version

**Solution:**

```bash
# Check current version
node --version

# Switch to Node 22 using nvm
nvm use 22

# Or install if not available
nvm install 22
nvm use 22

# Using volta
volta pin node@22
```

Symptoms of a wrong Node version:

- Native module build failures (`better-sqlite3`, `canvas`, `isolated-vm`)
- Unexpected dependency resolution issues
- Tests failing with cryptic errors

### Port-Forward Issues

**Problem:** Port `20001` is not accessible

**Solution:**

```bash
# Kill existing port-forward
pkill -f "port-forward.*kiali"
# Restart port-forward
kubectl port-forward -n istio-system svc/kiali 20001:20001 &
```

### Test Timeout Issues

**Problem:** E2E tests time out

**Solution:**

- Verify Kiali is responding: `curl http://localhost:20001/kiali/api/status`
- Check if test data (`bookinfo`) is deployed
- Increase timeout in `playwright.config.ts` if needed

### Dependency Conflicts

**Problem:** `yarn install` fails with dependency conflicts

**Solution:**

```bash
yarn dedupe
yarn install
```

### TypeScript Errors After Update

**Problem:** New TypeScript errors after a dependency update

**Solution:**

- Check if `@types/*` packages also need updates
- Review breaking changes in updated packages
- Make code changes if the new dependency API requires them

## Report Format

After validation, provide a summary like this:

```markdown
Environment Check
- Node.js version: [v22.x.x/Wrong Version]
- Kiali pod: [Running/Not Running]
- Port-forward: [Active on 20001/Not Active]
- Endpoint: [Configured/Not Configured]

Installation
- Dependencies installed: [Success/Failed]
- Security vulnerabilities: [None/List]

Compilation
- TypeScript: [Passed/Failed with X errors]

E2E Tests
- Test results: [X/Y passed]
- Duration: [time]
- Failed tests: [list if any]

Manual Review Required
- [ ] UI/UX verification
- [ ] Dependency change review
- [ ] Regression testing
```

## Notes

- Always verify Node.js 22 before starting validation.
- Node.js version mismatches are the most common source of false-positive failures.
- Always run tests with a clean Kiali environment.
- E2E tests expect the `bookinfo` application to be deployed in the cluster.
- Some tests may be flaky, so re-running can be reasonable after checking the environment.
- For Backstage version upgrades, follow the upgrade guide in `DEVELOPMENT.md`.
- Consider running tests in CI before merging.
- If native modules fail to build, verify Node.js first before investigating other causes.

## Related Documentation

- See `DEVELOPMENT.md` in the Kiali Backstage repository
- See `packages/app/e2e-tests/` in the Kiali Backstage repository
- [RHDH Compatibility Matrix](https://github.com/redhat-developer/rhdh-plugin-export-overlays?tab=readme-ov-file#backstage-compatibility)
