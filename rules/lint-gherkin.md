---
description: Run Gherkin linting on feature files to validate syntax, indentation, and formatting compliance.
alwaysApply: false
globs: "*.feature"
paths:
  - "**/*.feature"
---

# Gherkin Linting

Run Gherkin linting from the Kiali repository root (the directory that contains `frontend/`):

```bash
cd frontend && yarn lint:gherkin
```

The linting tool validates all `.feature` files under `cypress/integration/featureFiles/` and reports syntax or formatting issues.

**What it checks:**
- Valid Gherkin syntax
- Proper indentation (2-space for scenarios, 4-space for steps)
- No trailing spaces or excessive empty lines
- Named features and scenarios (no unnamed items)
- No duplicate names
- Newline at end of file
- No empty files or backgrounds

If errors are found, they will be displayed with line numbers and specific rule violations.
