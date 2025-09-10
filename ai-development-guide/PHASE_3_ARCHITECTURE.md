# Phase 3: Architecture & Planning

**Goal**: Design the solution architecture and create detailed implementation plan.

**⚠️ Critical Phase 3 Requirement**: This phase MUST produce a complete architectural design and detailed implementation plan that serves as the roadmap for Phase 4.

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
"Design the architecture for [feature]. Before finalizing the design, ask clarifying questions about:
- Scalability expectations and anticipated load patterns
- Deployment environment preferences (cloud, on-premise, hybrid)
- Technology stack constraints or organizational preferences
- Integration requirements with existing services or databases
- Security architecture requirements and compliance needs
- Monitoring, logging, and observability expectations

Then create ai-dev-context/ARCHITECTURE.md including:
- Component breakdown
- Data flow diagrams
- Technology choices and rationale
- Integration patterns
- Security architecture"
```

**"Create implementation plan"** means:
```
"Create ai-dev-context/IMPLEMENTATION_PLAN.md with a detailed development roadmap:
- Task breakdown (use todo list tool)
- Dependencies and prerequisites
- Risk mitigation strategies
- Timeline estimates
- Success metrics"
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

**End architecture session:**
```
1. **Status Update**: AI will update ai-dev-context/SESSION_STATUS.md with architecture completion status using file tools
2. **Deliverable Validation**: AI will ensure ai-dev-context/ARCHITECTURE.md, ai-dev-context/IMPLEMENTATION_PLAN.md, ai-dev-context/SEQUENCE_DIAGRAMS.md, and ai-dev-context/TEST_STRATEGY.md are complete and meet quality standards
3. **Todo Management**: AI will update ai-dev-context/todo/current_todo_list.md with completed architecture tasks and prepare detailed todo list for implementation phase
4. **Decision Documentation**: AI will document key architectural decisions, technology choices, and design rationale in ai-dev-context/DECISIONS.md
5. **Context Preservation**: AI will create session summaries for ai-dev-context/archives/ and update ai-dev-context/PROGRESS.md with architecture achievements
6. **Next Phase Preparation**: AI will validate architecture against requirements and prepare implementation roadmap
```

## Phase 3 Quality Gates

Before transitioning to Phase 4 (Implementation), ensure:

- [ ] Architecture decisions documented in ai-dev-context/ARCHITECTURE.md
- [ ] Implementation plan created with detailed tasks in ai-dev-context/IMPLEMENTATION_PLAN.md
- [ ] Testing strategy defined in ai-dev-context/TEST_STRATEGY.md
- [ ] Sequence diagrams completed in ai-dev-context/SEQUENCE_DIAGRAMS.md
- [ ] All architecture deliverables complete and validated

**🔑 Critical Success Factor**: Phase 3 must produce a complete architectural design and detailed implementation plan that serves as the roadmap for Phase 4.

## Transition to Phase 4

When Phase 3 quality gates are met, AI should:
```
"All Phase 3 quality gates have been completed:
✅ Architecture decisions documented in ai-dev-context/ARCHITECTURE.md
✅ Implementation plan created with detailed tasks in ai-dev-context/IMPLEMENTATION_PLAN.md
✅ Testing strategy defined in ai-dev-context/TEST_STRATEGY.md
✅ Sequence diagrams completed in ai-dev-context/SEQUENCE_DIAGRAMS.md
✅ All architecture deliverables complete and validated

Phase 3 architecture & planning is complete. Should I transition to Phase 4 (Implementation)?"
```

Only proceed with transition if developer confirms.
