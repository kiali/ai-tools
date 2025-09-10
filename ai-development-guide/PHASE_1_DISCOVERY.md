# Phase 1: Discovery & Research

**Goal**: Understand the problem, explore the codebase, identify constraints, and research multiple solution approaches to prepare for requirements definition.

**⚠️ Critical Phase 1 Requirement**: This phase MUST include solution research and comparison of potential approaches. Solution selection will occur after requirements are defined to ensure the chosen approach best meets the documented requirements.

**🎯 Solution Discovery Strategy**: The most valuable Phase 1 outcomes emerge when multiple viable approaches are thoroughly explored and compared. Consider investigating different architectural patterns, technology stacks, implementation strategies, and integration approaches. This diversity of options provides the foundation for making optimal requirements-based decisions in Phase 2.

## Key Documentation to Generate
- **ai-dev-context/PROBLEM_ANALYSIS.md** - Problem statement, current state analysis, multiple solution approaches with detailed trade-off analysis
- **ai-dev-context/CODEBASE_EXPLORATION.md** - Existing architecture, relevant components, patterns, and integration opportunities
- **ai-dev-context/CONSTRAINTS.md** - Technical limitations, dependencies, business rules, and solution-shaping factors
- **ai-dev-context/SOLUTION_OPTIONS.md** - Comprehensive comparison of potential solutions for requirements evaluation, including alternative approaches and hybrid solutions

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
"Analyze this problem/request: [describe your feature/component]. Before proceeding, ask clarifying questions if:
- The problem scope is unclear or too broad
- Success criteria are not well-defined
- Business context or user needs are missing
- Technical constraints are not specified

Then generate ai-dev-context/PROBLEM_ANALYSIS.md that includes:
- Current state assessment
- Problem statement
- Success criteria
- Multiple potential solution approaches with detailed comparison (aim for 3 distinct approaches when feasible)
- Technology options with pros/cons analysis for each approach
- Implementation complexity assessment for each solution
- Resource and timeline implications for each approach
- Risks and assumptions for each solution
- Alternative implementation patterns and architectural styles to consider
- Hybrid approaches that combine elements from different solutions
- Recommendation of preferred approach with rationale, noting why alternatives were considered but not selected
- Any remaining questions that need developer input before moving to requirements phase"
```

**"Explore codebase [area]"** means:
```
"Explore the codebase for [specific functionality/area]. Create ai-dev-context/CODEBASE_EXPLORATION.md with:
- Key files and their purposes
- Existing patterns and architectures that could influence solution design
- Integration points and extension opportunities
- Code quality assessment
- Similar implementations or patterns already in use that could serve as templates
- Areas where different solution approaches might fit naturally within the existing architecture
- Potential integration challenges or opportunities that might favor certain solution approaches"
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
"If solution comparison in PROBLEM_ANALYSIS.md is too complex or lengthy, create a separate ai-dev-context/SOLUTION_OPTIONS.md with:
- Executive summary of all viable approaches (consider both conventional and innovative options)
- Side-by-side comparison table of solutions
- Technology stack implications for each option
- Development effort estimates (time/complexity)
- Pros and cons analysis with specific trade-offs
- Risk assessment for each approach
- Scalability and maintainability considerations for each solution
- Integration complexity with existing systems
- Long-term implications and future flexibility of each approach
- Scenarios where each solution would be optimal
- Clear recommendation with rationale
- Decision criteria framework for evaluation
Note: Only create this separate document if solution comparison exceeds reasonable length for PROBLEM_ANALYSIS.md. When multiple solutions exist, ensure each is given fair consideration with detailed analysis."
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

**"Start session"** means:
```
"Resume development work (universal session resumption command):
- Read ai-dev-context/SESSION_STATUS.md to determine current phase and progress
- Load appropriate PHASE_X file based on current phase from session status
- Load ai-dev-context/todo/current_todo_list.md for active tasks
- Review current phase deliverables and status
- Show next priority task from todo list and begin work
Note: This is the same command used across all phases - AI determines phase-specific actions based on SESSION_STATUS.md"
```

**"End session"** means:
```
"End current development session with full context preservation:
- Update ai-dev-context/SESSION_STATUS.md with current progress
- Archive conversation context if needed
- Ensure all work is documented and recoverable
- Prepare session for clean resumption"
```

## Session End Protocol

**End discovery session:**
```
1. **Status Update**: AI will update ai-dev-context/SESSION_STATUS.md with final research status using file tools
2. **Deliverable Validation**: AI will ensure ai-dev-context/PROBLEM_ANALYSIS.md, ai-dev-context/CODEBASE_EXPLORATION.md, ai-dev-context/CONSTRAINTS.md, and ai-dev-context/SOLUTION_OPTIONS.md (if created) are complete with comprehensive solution research
3. **Todo Management**: AI will update ai-dev-context/todo/current_todo_list.md with completed research tasks and new discoveries
4. **Decision Documentation**: AI will document any unresolved questions in ai-dev-context/ISSUES.md and key research decisions in ai-dev-context/DECISIONS.md
5. **Context Preservation**: AI will help create session summaries for ai-dev-context/archives/ if requested
6. **Next Phase Preparation**: AI will summarize key findings in ai-dev-context/PROGRESS.md and prepare for requirements definition phase with all researched solution options
```

## Phase 1 Quality Gates

Before transitioning to Phase 2 (Requirements), ensure:

- [ ] Problem clearly understood and documented in ai-dev-context/PROBLEM_ANALYSIS.md
- [ ] Multiple solution approaches researched and documented with detailed comparison
- [ ] Stakeholder needs identified and constraints documented in ai-dev-context/CONSTRAINTS.md
- [ ] High-level feasibility assessed and codebase explored in ai-dev-context/CODEBASE_EXPLORATION.md
- [ ] Solution options presented in ai-dev-context/SOLUTION_OPTIONS.md (if multiple viable approaches exist)
- [ ] All research deliverables complete and validated for requirements definition

**🔑 Critical Success Factor**: Phase 1 must produce multiple well-researched solution options. These will be evaluated against requirements in Phase 2 to select the optimal approach. Rushing to a single solution without proper exploration leads to suboptimal outcomes.

## Transition to Phase 2

When Phase 1 quality gates are met, AI should:
```
"All Phase 1 quality gates have been completed:
✅ Problem clearly understood and documented in ai-dev-context/PROBLEM_ANALYSIS.md
✅ Multiple solution approaches researched and documented with detailed comparison
✅ Stakeholder needs identified and constraints documented in ai-dev-context/CONSTRAINTS.md
✅ High-level feasibility assessed and codebase explored in ai-dev-context/CODEBASE_EXPLORATION.md
✅ Solution options presented in ai-dev-context/SOLUTION_OPTIONS.md (if multiple viable approaches exist)
✅ All research deliverables complete and validated for requirements definition

Phase 1 discovery is complete. Should I transition to Phase 2 (Requirements Definition)?"
```

Only proceed with transition if developer confirms.
