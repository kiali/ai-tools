# Phase 1: Discovery & Research

**Goal**: Understand the problem, explore the codebase, and research multiple solution approaches.

**🎯 Key Requirement**: Research multiple solution approaches for evaluation in Phase 2.

## Key Documentation to Generate
- **ai-dev-context/PROBLEM_ANALYSIS.md** - Problem statement and multiple solution approaches
- **ai-dev-context/CODEBASE_EXPLORATION.md** - Existing architecture and integration opportunities
- **ai-dev-context/CONSTRAINTS.md** - Technical limitations and business rules
- **ai-dev-context/SOLUTION_OPTIONS.md** - Comparison of potential solutions (if needed)

## Primary Commands to Use

**Use these SHORT commands when working with AI:**
```
"Analyze [problem/feature]"          # → Creates PROBLEM_ANALYSIS.md with solution options
"Explore codebase [area]"            # → Creates CODEBASE_EXPLORATION.md
"Identify constraints [feature]"     # → Creates CONSTRAINTS.md
"Present solution options"           # → Creates comparison summary for requirements evaluation
"Transition to Phase 2"              # → Complete Phase 1 quality gates and move to requirements phase
"Start session"                      # → Resume work session (same as universal "Start session" command)
"End session"                        # → Ends current session
```

## Detailed Command Reference

**AI interprets the SHORT commands above as these detailed instructions:**

**"Analyze [problem/feature]"** means:
```
"Analyze this problem/request: [describe your feature/component].
Ask clarifying questions if the problem scope, success criteria, or constraints are unclear.

Generate ai-dev-context/PROBLEM_ANALYSIS.md with:
- Current state assessment
- Problem statement and success criteria
- Multiple potential solution approaches (aim for 2-3 distinct approaches)
- Technology options with pros/cons for each approach
- Implementation complexity and resource implications
- Recommendation with rationale"
```

**"Explore codebase [area]"** means:
```
"Explore the codebase for [specific functionality/area]. Create ai-dev-context/CODEBASE_EXPLORATION.md with:
- Key files and their purposes
- Existing patterns and architectures
- Integration points and extension opportunities
- Code quality assessment"
```

**"Identify constraints [feature]"** means:
```
"Identify constraints for implementing [feature]. Generate ai-dev-context/CONSTRAINTS.md covering:
- Technical dependencies
- Business rules
- Performance requirements
- Security considerations
- Timeline/resource limitations"
```

**"Present solution options"** means:
```
"Create ai-dev-context/SOLUTION_OPTIONS.md with:
- Summary of all viable approaches
- Side-by-side comparison table
- Pros and cons for each option
- Development effort estimates
- Clear recommendation with rationale
Note: Only create if solution comparison is too lengthy for PROBLEM_ANALYSIS.md"
```

**"Transition to Phase 2"** means:
```
"Complete Phase 1 quality gates and prepare for requirements definition:
- Validate all discovery deliverables are complete
- Ensure multiple solution approaches have been thoroughly researched
- Confirm problem analysis and constraints are documented
- Prepare solution options summary for requirements evaluation
- Update session status and progress documentation"
```

**"Start session"** → See main guide Session Management section

**"End session"** → See main guide Session Management section

## Session End Protocol

When ending a Phase 1 session:
1. Update ai-dev-context/SESSION_STATUS.md with current progress
2. Ensure key deliverables are documented
3. Update ai-dev-context/todo/current_todo_list.md
4. Document unresolved questions in ai-dev-context/ISSUES.md

## Phase 1 Quality Gates

Before transitioning to Phase 2, ensure:

- [ ] Problem documented in ai-dev-context/PROBLEM_ANALYSIS.md
- [ ] Multiple solution approaches researched and compared
- [ ] Constraints documented in ai-dev-context/CONSTRAINTS.md
- [ ] Codebase explored in ai-dev-context/CODEBASE_EXPLORATION.md
- [ ] Solution options ready for requirements evaluation

## Transition to Phase 2

When Phase 1 quality gates are met, AI should ask:
```
"Phase 1 discovery is complete. All quality gates met:
✅ Problem documented in ai-dev-context/PROBLEM_ANALYSIS.md
✅ Multiple solution approaches researched
✅ Constraints documented in ai-dev-context/CONSTRAINTS.md
✅ Codebase explored in ai-dev-context/CODEBASE_EXPLORATION.md

Should I transition to Phase 2 (Requirements Definition)?"
```

**🔑 Key Rule**: Only proceed with developer permission.
