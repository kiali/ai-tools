# AI Tools for Kiali

This repository serves as a centralized location for AI-related resources, tools, prompts, and best practices for the Kiali project.

## Purpose

The ai-tools repository is designed to:

- **Provide AI Prompts**: Store commonly used AI prompts for development, documentation, testing, and other Kiali-related tasks
- **Share AI Tools**: Maintain scripts, utilities, and tools that leverage AI to assist with Kiali development workflows
- **Document Best Practices**: Capture proven approaches and guidelines for effectively using AI in the context of the Kiali project
- **Enable Collaboration**: Offer a shared space for team members to contribute and discover AI-powered solutions

## Cursor

Find cursor related resources [here](./cursor/). Add cursor rules to your Kiali repo under `<kiali-repo-root>/.cursor/rules`.

- In Cursor, ask with a request like: `Validate this dependency update PR in the Kiali Backstage workspace.`

## Claude

Claude-related resources live under [`claude/.claude`](./claude/.claude/), with skills stored using the standard `skill-name/SKILL.md` layout.

- Use `kiali-backstage-validate-deps` when validating dependency update PRs in the Kiali Backstage workspace.
- The Cursor rule and Claude skill now share the detailed workflow in `claude/.claude/skills/kiali-backstage-validate-deps/reference.md`, while keeping tool-specific entrypoints.
- Invoke it in Claude with a request like: `Use the kiali-backstage-validate-deps skill to validate this dependency update PR.`
