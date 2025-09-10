# Phase 2: Requirements Definition

**Goal**: Create detailed, actionable requirements with acceptance criteria, then evaluate solution options against these requirements to select the optimal approach before proceeding to architecture.

**⚠️ Critical Phase 2 Requirement**: This phase MUST conclude with solution selection based on how well each researched approach meets the documented requirements. Phase transition to architecture cannot happen until the solution decision is made and documented.

## Key Documentation to Generate
- **ai-dev-context/REQUIREMENTS.md** - Functional and non-functional requirements
- **ai-dev-context/ACCEPTANCE_CRITERIA.md** - Specific conditions for completion
- **ai-dev-context/USER_STORIES.md** - User-focused descriptions of functionality
- **ai-dev-context/TECHNICAL_SPEC.md** - API specs, data models, interfaces

## Primary Commands to Use

**Use these SHORT commands when working with AI:**
```
"Define requirements"                # → Creates REQUIREMENTS.md
"Create acceptance criteria"         # → Creates ACCEPTANCE_CRITERIA.md
"Write user stories"                 # → Creates USER_STORIES.md
"Design technical specs"             # → Creates TECHNICAL_SPEC.md
"Evaluate solution options"          # → Compares solutions against requirements
"Select solution [approach]"         # → Documents chosen solution and rationale
"Transition to Phase 3"              # → Complete Phase 2 quality gates and move to architecture phase
"Start session"                      # → Resume work session (same as universal "Start session" command)
"End session"                        # → Ends current session
```

## Detailed Command Reference

**AI interprets the SHORT commands above as these detailed instructions:**

**"Define requirements"** means:
```
"Based on selected solution from ai-dev-context/DECISIONS.md and research in ai-dev-context/PROBLEM_ANALYSIS.md, create detailed ai-dev-context/REQUIREMENTS.md. Before finalizing requirements, ask clarifying questions about:
- Specific performance expectations or SLA requirements
- Security and compliance requirements that may not be obvious
- User experience expectations and workflow preferences
- Integration requirements with existing systems
- Data handling, storage, and privacy requirements
- Error handling and edge case behavior expectations

Then include in the requirements document:
- Functional requirements specific to chosen solution
- Non-functional requirements (performance, security, scalability)
- Integration requirements aligned with selected approach
- Data requirements for the chosen technology stack
- Solution-specific constraints and dependencies"
```

**"Create acceptance criteria"** means:
```
"Generate ai-dev-context/ACCEPTANCE_CRITERIA.md with specific, testable criteria for [feature/component]:
- Functional acceptance tests
- Performance benchmarks
- Error handling scenarios
- Edge cases
- User acceptance criteria"
```

**"Write user stories"** means:
```
"Create ai-dev-context/USER_STORIES.md with user-focused descriptions of functionality:
- User personas and roles
- Feature scenarios and use cases
- User workflow descriptions
- Acceptance criteria from user perspective"
```

**"Design technical specs"** means:
```
"Create ai-dev-context/TECHNICAL_SPEC.md defining the technical implementation details:
- API endpoints and contracts
- Data models and schemas
- Component interfaces
- Error handling patterns
- Integration specifications"
```

**"Evaluate solution options"** means:
```
"Evaluate the researched solution options from ai-dev-context/SOLUTION_OPTIONS.md against the documented requirements:
- Compare each solution approach against functional requirements in ai-dev-context/REQUIREMENTS.md
- Assess alignment with acceptance criteria in ai-dev-context/ACCEPTANCE_CRITERIA.md
- Evaluate technical feasibility against constraints in ai-dev-context/CONSTRAINTS.md
- Consider user story fulfillment from ai-dev-context/USER_STORIES.md
- Document evaluation matrix showing how each solution meets requirements
- Provide recommendation for optimal solution with detailed rationale"
```

**"Select solution [approach]"** means:
```
"Document the chosen solution and prepare for architecture phase. Update ai-dev-context/DECISIONS.md with:
- Selected approach with detailed description
- Rationale for selection based on requirements analysis
- How chosen solution meets functional and non-functional requirements
- Rejected alternatives with specific reasons based on requirements gaps
- Key assumptions and dependencies for chosen solution
- Success metrics and validation criteria
- Next steps and transition to architecture phase
- Update ai-dev-context/SESSION_STATUS.md with solution selection milestone"
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

## Solution Selection Commands

**Essential commands for solution decision process:**
```
"Explain [solution name] approach"       # → Get detailed explanation of specific solution
"Compare [solution A] vs [solution B]"   # → Direct comparison between two options
"Evaluate solution options"              # → Compare all solutions against requirements
"Recommend best solution"                # → AI recommendation with requirements-based reasoning
"Select solution [chosen approach]"      # → Document final decision and rationale
"Validate solution choice"               # → Check chosen solution against constraints
```

## Session End Protocol

**End requirements session:**
```
1. **Status Update**: AI will update ai-dev-context/SESSION_STATUS.md with requirements completion status and solution selection using file tools
2. **Deliverable Validation**: AI will ensure ai-dev-context/REQUIREMENTS.md, ai-dev-context/USER_STORIES.md, ai-dev-context/ACCEPTANCE_CRITERIA.md, and ai-dev-context/TECHNICAL_SPEC.md are complete and meet quality standards, and solution has been selected and documented in ai-dev-context/DECISIONS.md
3. **Todo Management**: AI will update ai-dev-context/todo/current_todo_list.md with completed requirements tasks and solution selection
4. **Decision Documentation**: AI will document solution selection rationale and key requirement decisions in ai-dev-context/DECISIONS.md
5. **Context Preservation**: AI will create session summaries for ai-dev-context/archives/ and update ai-dev-context/PROGRESS.md with requirements achievements
6. **Next Phase Preparation**: AI will prepare for architecture phase with validated requirements baseline and chosen solution approach
```

## Phase 2 Quality Gates

Before transitioning to Phase 3 (Architecture), ensure:

- [ ] Requirements are specific and testable in ai-dev-context/REQUIREMENTS.md
- [ ] Acceptance criteria defined in ai-dev-context/ACCEPTANCE_CRITERIA.md
- [ ] Technical specifications documented in ai-dev-context/TECHNICAL_SPEC.md
- [ ] User stories complete and validated in ai-dev-context/USER_STORIES.md
- [ ] **CRITICAL**: Solution options evaluated against requirements and optimal solution selected
- [ ] Solution selection documented in ai-dev-context/DECISIONS.md with requirements-based rationale
- [ ] Chosen solution aligns with all functional and non-functional requirements

**🔑 Critical Success Factor**: Phase 2 must conclude with a clear solution selection based on requirements analysis. This prevents architecture phase from proceeding without a validated approach.

## Transition to Phase 3

When Phase 2 quality gates are met, AI should:
```
"All Phase 2 quality gates have been completed:
✅ Requirements are specific and testable in ai-dev-context/REQUIREMENTS.md
✅ Acceptance criteria defined in ai-dev-context/ACCEPTANCE_CRITERIA.md
✅ Technical specifications documented in ai-dev-context/TECHNICAL_SPEC.md
✅ User stories complete and validated in ai-dev-context/USER_STORIES.md
✅ Solution options evaluated against requirements and optimal solution selected
✅ Solution selection documented in ai-dev-context/DECISIONS.md with requirements-based rationale
✅ Chosen solution aligns with all functional and non-functional requirements

Phase 2 requirements definition is complete. Should I transition to Phase 3 (Architecture & Planning)?"
```

Only proceed with transition if developer confirms.
