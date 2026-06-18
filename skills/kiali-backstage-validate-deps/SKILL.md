---
name: kiali-backstage-validate-deps
description: Validate dependency update PRs for the Kiali Backstage workspace by checking Node.js version, Kiali environment, running tests, and verifying compilation
---

# Kiali Backstage Dependency Validation Skill

Use this skill for dependency update PRs, Backstage upgrades, or changes to `package.json`, `yarn.lock`, or Playwright E2E tests in `workspaces/kiali`.

Invoke it in Claude with a request like: "Use the `kiali-backstage-validate-deps` skill to validate this dependency update PR."

## Repository Context

The command examples below assume a checkout of [`backstage/community-plugins`](https://github.com/backstage/community-plugins/), where the Kiali Backstage workspace root is `workspaces/kiali`.

## Quick Start

1. Verify Node.js 22 before doing anything else:

   ```bash
   node --version
   ```

   Abort validation if the version is not `v22.x.x`.

2. Confirm the Kiali environment is ready:

   ```bash
   kubectl get pods -n istio-system | grep kiali
   lsof -i :20001 || netstat -tuln | grep 20001
   echo $KIALI_ENDPOINT
   ```

3. Run the core validation from `workspaces/kiali`:

   ```bash
   yarn install
   yarn tsc
   yarn test:e2e
   ```

4. Finish with a short report covering environment, installation, compilation, E2E results, and remaining manual review.

## Output Template

Use this report structure:

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

## Additional Resources

- For the full workflow, manual checklist, and troubleshooting, see [reference.md](reference.md).
- See `DEVELOPMENT.md` in the Kiali Backstage repository.
- See `packages/app/e2e-tests/` in the Kiali Backstage repository.
- Check the [RHDH Compatibility Matrix](https://github.com/redhat-developer/rhdh-plugin-export-overlays?tab=readme-ov-file#backstage-compatibility) when Backstage is updated.
