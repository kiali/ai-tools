---
description: Validate syntax of uncommitted files in kiali.io repository
---

Analyze the uncommitted changes in the kiali.io repository and validate syntax:

1. First, locate the kiali.io repository:
   - Look for a kiali.io directory in common parent directories (../kiali.io, ../../kiali.io)
   - If not found, ask the user for the repository location

2. Get the diff of all modified files:
   ```bash
   cd <kiali.io-path> && git diff --name-only --diff-filter=ACMR
   ```

3. For each modified file, check its syntax based on file type:

   **Markdown files (.md, .markdown):**
   - Get the full diff: `git diff -- '*.md'`
   - Check for:
     * Unclosed code blocks (``` should appear in pairs)
     * Unclosed Hugo shortcodes ({{< should match >}})
     * Unclosed front matter (--- should appear in pairs at the start)
     * Malformed links
     * Broken internal references
     * Spelling and grammar errors

   **TOML files (config.toml):**
   - Get the diff: `git diff config.toml`
   - Validate TOML syntax structure
   - Check for unclosed quotes, brackets, or braces

   **JSON files (.json):**
   - Get the diff: `git diff -- '*.json'`
   - Validate JSON syntax
   - Check for trailing commas, unclosed brackets/braces

   **HTML/Template files (.html):**
   - Get the diff: `git diff -- '*.html'`
   - Check for unclosed HTML tags
   - Validate Go template syntax ({{ }})

4. Output format for each issue found:
   - File name and path
   - Line number
   - Issue type (e.g., "Unclosed code block", "Spelling error")
   - Current text (show the problematic line)
   - **Suggested:** Provide the corrected version

5. After presenting all issues:
   - Ask the user if they want to apply the suggested fixes
   - If approved, use the Edit tool to apply all corrections automatically
   - Show a summary of applied changes

6. Final summary:
   - Total files checked
   - Total issues found
   - Total fixes applied (if any)
   - Status: ✓ if no issues, ✗ if issues found

Focus on both syntax validation and content quality (spelling/grammar). Be concise and actionable in your suggestions.
