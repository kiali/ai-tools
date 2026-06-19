---
name: kiali-check-syntax
description: Validate syntax and content quality of uncommitted files in the kiali.io documentation repository. Use when the user says "check syntax", "validate docs", or similar.
---

# Kiali Documentation Syntax Check

Analyze uncommitted changes in the kiali.io repository and validate
syntax and content quality.

## Step 1: Locate the kiali.io Repository

Look for a `kiali.io` directory in common parent directories
(`../kiali.io`, `../../kiali.io`). If not found, ask the user for the
repository location.

## Step 2: Get Modified Files

```bash
cd <kiali.io-path> && git diff --name-only --diff-filter=ACMR
```

## Step 3: Validate Each Modified File

For each modified file, check its syntax based on file type:

### Markdown files (`.md`, `.markdown`)

Get the full diff with `git diff -- '*.md'` and check for:

- Unclosed code blocks (triple backticks should appear in pairs)
- Unclosed Hugo shortcodes (`{{<` should match `>}}`)
- Unclosed front matter (`---` should appear in pairs at the start)
- Malformed links
- Broken internal references
- Spelling and grammar errors

### TOML files (`config.toml`)

Get the diff with `git diff config.toml` and validate:

- TOML syntax structure
- Unclosed quotes, brackets, or braces

### JSON files (`.json`)

Get the diff with `git diff -- '*.json'` and validate:

- JSON syntax
- Trailing commas, unclosed brackets/braces

### HTML/Template files (`.html`)

Get the diff with `git diff -- '*.html'` and check for:

- Unclosed HTML tags
- Go template syntax (`{{ }}`)

## Step 4: Report Issues

For each issue found, report:

- **File** name and path
- **Line** number
- **Type** (e.g. "Unclosed code block", "Spelling error")
- **Current** text (the problematic line)
- **Suggested** corrected version

## Step 5: Apply Fixes

After presenting all issues:

1. Ask the user if they want to apply the suggested fixes
2. If approved, apply all corrections automatically
3. Show a summary of applied changes

## Step 6: Final Summary

Report:

- Total files checked
- Total issues found
- Total fixes applied (if any)
- Status: pass if no issues, fail if issues found
