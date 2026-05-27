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

## Claude

Claude-related resources live under [`claude/.claude`](./claude/.claude/). 

- Use `kiali-backstage-validate-deps` when validating dependency update PRs in the Kiali Backstage workspace.
- Invoke it in Claude with a request like: `Use the kiali-backstage-validate-deps skill to validate this dependency update PR.`
