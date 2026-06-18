# AI Tools for Kiali

This repository serves as a centralized location for AI-related resources, tools, prompts, and best practices for the Kiali project.

## Purpose

The ai-tools repository is designed to:

- **Provide AI Prompts**: Store commonly used AI prompts for development, documentation, testing, and other Kiali-related tasks
- **Share AI Tools**: Maintain scripts, utilities, and tools that leverage AI to assist with Kiali development workflows
- **Document Best Practices**: Capture proven approaches and guidelines for effectively using AI in the context of the Kiali project
- **Enable Collaboration**: Offer a shared space for team members to contribute and discover AI-powered solutions

## Repository Structure

```
ai-tools/
├── rules/              # Agnostic rules (work with both Cursor and Claude Code)
├── skills/             # Agnostic skills (work with both Cursor and Claude Code)
├── cursor/             # Cursor-specific resources (code-reviewer plugin, etc.)
├── claude/             # Claude Code-specific resources
└── ai-development-guide/
```

## Rules

Agnostic rules live in [`rules/`](./rules/). Each file uses dual frontmatter compatible with both Cursor (`alwaysApply`, `globs`) and Claude Code (`paths`).

To use them in a Kiali repo, symlink or copy into the tool-specific directory:

```bash
# Cursor
ln -s /path/to/ai-tools/rules <kiali-repo>/.cursor/rules

# Claude Code
ln -s /path/to/ai-tools/rules <kiali-repo>/.claude/rules
```

## Skills

Agnostic skills live in [`skills/`](./skills/), using the standard `skill-name/SKILL.md` layout. Both Cursor and Claude Code discover skills in this format.

| Skill | Description |
|-------|-------------|
| `kiali-backstage-validate-deps` | Validate dependency update PRs for the Kiali Backstage workspace |
| `kiali-cve` | Triage and review OSSM Jira CVE issues for the Kiali component |
| `progress-report` | Generate a progress report for the current task |
