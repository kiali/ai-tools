# Phase 2: Requirements Definition

**Goal**: Create detailed requirements and select the optimal solution approach.

**🎯 Key Requirement**: Must conclude with solution selection based on requirements analysis.

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
"Create ai-dev-context/REQUIREMENTS.md based on research in ai-dev-context/PROBLEM_ANALYSIS.md.
Ask clarifying questions about performance, security, integration, and user experience expectations.

Include:
- Functional requirements
- Non-functional requirements (performance, security, scalability)
- Integration requirements
- Data requirements
- Constraints and dependencies"
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
"Evaluate solution options from Phase 1 against documented requirements:
- Compare each solution against ai-dev-context/REQUIREMENTS.md
- Assess alignment with ai-dev-context/ACCEPTANCE_CRITERIA.md
- Create evaluation matrix showing how each solution meets requirements
- Provide recommendation with rationale"
```

**"Select solution [approach]"** means:
```
"Document the chosen solution in ai-dev-context/DECISIONS.md with:
- Selected approach with description
- Rationale based on requirements analysis
- How solution meets requirements
- Rejected alternatives and reasons
- Key assumptions and dependencies
- Update ai-dev-context/SESSION_STATUS.md with selection milestone"
```

**"Start session"** → See main guide Session Management section

**"End session"** → See main guide Session Management section

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

When ending a Phase 2 session:
1. Update ai-dev-context/SESSION_STATUS.md with current progress
2. Ensure requirements documents are complete
3. Update ai-dev-context/todo/current_todo_list.md
4. Document solution selection in ai-dev-context/DECISIONS.md

## Phase 2 Quality Gates

Before transitioning to Phase 3, ensure:

- [ ] Requirements documented in ai-dev-context/REQUIREMENTS.md
- [ ] Acceptance criteria defined in ai-dev-context/ACCEPTANCE_CRITERIA.md
- [ ] Technical specs documented in ai-dev-context/TECHNICAL_SPEC.md
- [ ] User stories complete in ai-dev-context/USER_STORIES.md
- [ ] **CRITICAL**: Solution selected and documented in ai-dev-context/DECISIONS.md
- [ ] Chosen solution aligns with requirements

## Transition to Phase 3

When Phase 2 quality gates are met, AI should ask:
```
"Phase 2 requirements definition is complete. All quality gates met:
✅ Requirements documented in ai-dev-context/REQUIREMENTS.md
✅ Acceptance criteria defined in ai-dev-context/ACCEPTANCE_CRITERIA.md
✅ Technical specs documented in ai-dev-context/TECHNICAL_SPEC.md
✅ User stories complete in ai-dev-context/USER_STORIES.md
✅ Solution selected and documented in ai-dev-context/DECISIONS.md

Should I transition to Phase 3 (Architecture & Planning)?"
```

**🔑 Key Rule**: Only proceed with developer permission.
