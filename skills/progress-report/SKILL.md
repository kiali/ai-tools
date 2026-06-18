---
name: progress-report
description: Generate a comprehensive progress report of the current task. Use when the user says "/progressreport", "/progress", "generate progress report", or similar trigger phrases.
---

# Progress Report

Generate a comprehensive progress report called "PROGRESS.md" covering the conversation since the timeframe specified by the user (session start, last major milestone, or when work began on a specific feature). Default to session start if not specified.

## Report Structure

### Approach
* Document the primary approach agreed upon
* If no clear agreement exists yet, list the main approaches discussed and their trade-offs

### Progress Completed
* List specific steps/tasks finished
* Include key files modified or created
* Note successful tests, builds, or validations

### Current Issue
* Describe the specific problem, failure, or sticking point being addressed
* Include relevant error messages, failed commands, or unexpected behavior
* Note which approaches have been tried that didn't work

### Technical Context
* File paths of code examined or modified
* Commands run and their outcomes
* Dependencies, frameworks, or tools involved

### Important Code Snippets
* Include key code changes made (with file paths and line numbers)
* Show problematic code causing issues
* Highlight working solutions or patterns discovered
* Add brief explanations of what each snippet does or why it's significant

### Next Steps
* Immediate actions needed to resolve current blocker
* Follow-up tasks once current issue is resolved

## Formatting

* Use proper Markdown formatting with appropriate headers, code blocks, and lists.
* Never put end of line spaces in any files or lines added or modified.
