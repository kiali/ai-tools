# Phase 3: Architecture & Planning

**Goal**: Design the solution architecture and create detailed implementation plan.

**🎯 Key Requirement**: Produce complete architectural design and implementation roadmap.

## Key Documentation to Generate
- **ai-dev-context/ARCHITECTURE.md** - High-level design decisions and component relationships
- **ai-dev-context/IMPLEMENTATION_PLAN.md** - Step-by-step development plan with tasks
- **ai-dev-context/SEQUENCE_DIAGRAMS.md** - Interaction flows and data flows
- **ai-dev-context/TEST_STRATEGY.md** - Testing approach and test cases

## Primary Commands to Use

**Use these SHORT commands when working with AI:**
```
"Design architecture [feature]"      # → Creates ARCHITECTURE.md
"Create implementation plan"         # → Creates IMPLEMENTATION_PLAN.md
"Design sequence diagrams"           # → Creates SEQUENCE_DIAGRAMS.md
"Develop test strategy"              # → Creates TEST_STRATEGY.md
"Transition to Phase 4"              # → Complete Phase 3 quality gates and move to implementation phase
"Start session"                      # → Resume work session (same as universal "Start session" command)
"End session"                        # → Ends current session
```

## Detailed Command Reference

**AI interprets the SHORT commands above as these detailed instructions:**

**"Design architecture [feature]"** means:
```
"Design the architecture for [feature]. Ask clarifying questions about scalability, deployment, technology constraints, and security requirements.

Create ai-dev-context/ARCHITECTURE.md with:
- Component breakdown
- Data flow diagrams
- Technology choices and rationale
- Integration patterns
- Security architecture"
```

**"Create implementation plan"** means:
```
"Create ai-dev-context/IMPLEMENTATION_PLAN.md with:
- Task breakdown (use todo list tool)
- Dependencies and prerequisites
- Timeline estimates
- Risk mitigation strategies"
```

**"Design sequence diagrams"** means:
```
"Create ai-dev-context/SEQUENCE_DIAGRAMS.md documenting:
- System interaction flows
- Data flow sequences
- Component communication patterns
- Error handling flows
- User interaction sequences"
```

**"Develop test strategy"** means:
```
"Develop ai-dev-context/TEST_STRATEGY.md covering:
- Unit test coverage plan
- Integration test scenarios
- Performance test requirements
- Manual test cases
- Automated test frameworks to use"
```

**"Start session"** → See main guide Session Management section

**"End session"** → See main guide Session Management section

## Session End Protocol

When ending a Phase 3 session:
1. Update ai-dev-context/SESSION_STATUS.md with current progress
2. Ensure architecture documents are complete
3. Update ai-dev-context/todo/current_todo_list.md with implementation tasks
4. Document architectural decisions in ai-dev-context/DECISIONS.md

## Phase 3 Quality Gates

Before transitioning to Phase 4, ensure:

- [ ] Architecture documented in ai-dev-context/ARCHITECTURE.md
- [ ] Implementation plan created in ai-dev-context/IMPLEMENTATION_PLAN.md
- [ ] Testing strategy defined in ai-dev-context/TEST_STRATEGY.md
- [ ] Sequence diagrams completed in ai-dev-context/SEQUENCE_DIAGRAMS.md

## Transition to Phase 4

When Phase 3 quality gates are met, AI should ask:
```
"Phase 3 architecture & planning is complete. All quality gates met:
✅ Architecture documented in ai-dev-context/ARCHITECTURE.md
✅ Implementation plan created in ai-dev-context/IMPLEMENTATION_PLAN.md
✅ Testing strategy defined in ai-dev-context/TEST_STRATEGY.md
✅ Sequence diagrams completed in ai-dev-context/SEQUENCE_DIAGRAMS.md

Should I transition to Phase 4 (Implementation)?"
```

**🔑 Key Rule**: Only proceed with developer permission.
