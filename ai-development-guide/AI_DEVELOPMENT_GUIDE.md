# AI-Assisted Software Development Guide

This guide provides a structured approach to working with AI coding assistants across multiple sessions. It ensures systematic progress from research through implementation with clear documentation at each stage.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🚀 Quick Start](#-quick-start)
- [⚡ Primary Commands](#-primary-commands)
- [📑 Development Phases](#-development-phases)
- [📁 Documentation Structure](#-documentation-structure)
- [🔄 Session Management](#-session-management)
- [🛡️ Quality Assurance](#️-quality-assurance)
- [💡 Best Practices](#-best-practices)
- [🔧 Troubleshooting](#-troubleshooting)

## 🎯 Overview

The development process follows 5 sequential phases:

1. **Discovery & Research** - Understand the problem and research solution approaches
2. **Requirements Definition** - Define requirements and select the best solution approach
3. **Architecture & Planning** - Design the solution architecture and implementation plan
4. **Implementation** - Build and test the solution
5. **Validation & Refinement** - Final testing and optimization

Each phase has detailed instructions in separate files (see [Development Phases](#-development-phases)).

## 🚀 Quick Start

To start a new project:

1. **Begin Discovery**: Use `"Start Phase 1"` command
2. **Use Phase Commands**: AI will load `ai-development-guide/PHASE_1_DISCOVERY.md` and guide you through phase-specific commands
3. **Progress Through Phases**: Use `"Transition to Phase X"` commands to move between phases
4. **Review at Decision Points**: Approve phase transitions and architectural decisions

**Your Role**: Provide requirements, make strategic decisions, review AI work
**AI's Role**: Implementation, documentation, systematic tasks, quality assurance

## ⚡ Primary Commands

### 🌐 Universal Session Commands
```
"Start session"          # Resume work (AI reads SESSION_STATUS.md to determine phase and avoid past mistakes)
"End session"            # End session with context preservation
"Avoid [approach]"       # Add failed approach to SESSION_STATUS.md to prevent repetition
```

### 🎯 Phase-Specific Commands

Each phase has specific commands. AI loads the appropriate phase file and provides phase-specific guidance:

**Phase 1 - Discovery**: `"Analyze [problem]"`, `"Explore codebase [area]"`, `"Transition to Phase 2"`
**Phase 2 - Requirements**: `"Define requirements"`, `"Select solution [approach]"`, `"Transition to Phase 3"`
**Phase 3 - Architecture**: `"Design architecture"`, `"Create implementation plan"`, `"Transition to Phase 4"`
**Phase 4 - Implementation**: `"Implement [component]"`, `"Test [component]"`, `"Transition to Phase 5"`
**Phase 5 - Validation**: `"Run tests"`, `"Test performance"`, `"Complete project"`

**🔑 Key Rule**: AI must ask permission before transitioning between phases.

## 📑 Development Phases

**🔑 Phase Isolation**: Each phase has detailed instructions in separate files to prevent jumping ahead to implementation before proper discovery and requirements are complete.

| Phase | File | Focus |
|-------|------|-------|
| **1** | `ai-development-guide/PHASE_1_DISCOVERY.md` | Research & Analysis |
| **2** | `ai-development-guide/PHASE_2_REQUIREMENTS.md` | Requirements & Selection |
| **3** | `ai-development-guide/PHASE_3_ARCHITECTURE.md` | Design & Planning |
| **4** | `ai-development-guide/PHASE_4_IMPLEMENTATION.md` | Coding & Testing |
| **5** | `ai-development-guide/PHASE_5_VALIDATION.md` | Testing & Refinement |

**How to Use**:
- Start with `"Start Phase 1"` for new projects
- AI loads the appropriate phase file based on current progress
- Use phase-specific commands from the loaded file
- Transition between phases only with explicit permission

## 📁 Documentation Structure

The `ai-dev-context/` directory serves as the single source of truth for all development documentation:

```
project-root/
├── ai-dev-context/
│   ├── SESSION_STATUS.md           # Current session state
│   ├── PROBLEM_ANALYSIS.md         # Phase 1: Problem statement and analysis
│   ├── CODEBASE_EXPLORATION.md     # Phase 1: Existing architecture and integration opportunities
│   ├── CONSTRAINTS.md              # Phase 1: Technical limitations and business rules
│   ├── SOLUTION_OPTIONS.md         # Phase 1: Comparison of potential solutions
│   ├── ISSUES.md                   # Phase 1: Unresolved questions and concerns
│   ├── REQUIREMENTS.md             # Phase 2: Functional and non-functional requirements
│   ├── ACCEPTANCE_CRITERIA.md      # Phase 2: Specific conditions for completion
│   ├── USER_STORIES.md             # Phase 2: User-focused descriptions of functionality
│   ├── TECHNICAL_SPEC.md           # Phase 2: API specs, data models, interfaces
│   ├── DECISIONS.md                # Phase 2: Solution selection and rationale
│   ├── ARCHITECTURE.md             # Phase 3: High-level design decisions and component relationships
│   ├── IMPLEMENTATION_PLAN.md      # Phase 3: Step-by-step development plan with tasks
│   ├── SEQUENCE_DIAGRAMS.md        # Phase 3: Interaction flows and data flows
│   ├── TEST_STRATEGY.md            # Phase 3: Testing approach and test cases
│   ├── CODE_CHANGES.md             # Phase 4: Summary of implemented features and changes
│   ├── API_DOCUMENTATION.md        # Phase 4: API docs, usage examples
│   ├── IMPLEMENTATION_NOTES.md     # Phase 4: Implementation details and patterns used
│   ├── DEPLOYMENT_GUIDE.md         # Phase 4: Deployment and configuration instructions
│   ├── TEST_RESULTS.md             # Phase 5: Test execution results and coverage reports
│   ├── BUG_REPORT.md               # Phase 5: Identified issues and fix status
│   ├── PERFORMANCE_REPORT.md       # Phase 5: Performance test results and optimizations
│   ├── RELEASE_NOTES.md            # Phase 5: Summary of changes and known issues
│   │
│   └── todo/
│       └── current_todo_list.md    # Active tasks
```

**Key Files**:
- **SESSION_STATUS.md**: Current phase, priorities, and context
- **Phase-specific files**: Created as needed during each phase
- **todo/current_todo_list.md**: Active tasks that persist across sessions

**Task Management**: AI uses dual todo system:
- **Built-in todo tool**: For within-session task tracking and progress
- **File-based todos**: For cross-session persistence in ai-dev-context/todo/current_todo_list.md

## 🔄 Session Management

### Starting a Session
```
"Start session" → AI reads SESSION_STATUS.md → AI reads ai-dev-context/todo/current_todo_list.md → AI loads appropriate phase file → AI shows priorities and resumes todos
```

**CRITICAL**: AI must always read ai-dev-context/SESSION_STATUS.md and ai-dev-context/todo/current_todo_list.md at session start to restore task context

### During a Session
- AI implements features and updates documentation
- AI tracks progress using built-in todo system (within session)
- AI asks clarifying questions when needed
- AI requests permission for phase transitions

### Ending a Session
```
"End session" → AI updates SESSION_STATUS.md → AI writes ai-dev-context/todo/current_todo_list.md → AI provides next session instructions
```

**CRITICAL**: AI must always update ai-dev-context/SESSION_STATUS.md and write current todo status to ai-dev-context/todo/current_todo_list.md before ending session for cross-session continuity

### Session Guidelines
- **Start sessions** when you have 30-90 minutes for focused work
- **End sessions** at logical breakpoints or when needing strategic input
- **Review work** at phase transitions and decision points


## 🛡️ Quality Assurance

### Implementation Quality Gates
Before marking any implementation task complete:
- [ ] Code builds successfully with no errors
- [ ] Unit tests pass for new code
- [ ] Integration tests pass with existing components
- [ ] Existing test suite passes (no regressions)
- [ ] Acceptance criteria validated
- [ ] Documentation updated

### Phase Transition Gates
Each phase has specific quality gates that must be met before transitioning to the next phase. See individual phase files for detailed requirements.

### Testing Commands
```
"Test [component] implementation"    # Run comprehensive tests
"Check for regressions"              # Run existing tests
"Verify acceptance criteria"         # Confirm requirements compliance
```

## 💡 Best Practices

### Development Process
- **Reference previous work** - Always review relevant documents before starting
- **Use specific commands** - Tell AI exactly what to generate
- **Break complex tasks** - Use todo lists for multi-step implementations
- **Test incrementally** - Validate work at each step
- **Document decisions** - Record architectural choices and rationale

### Session Management
- **Clear boundaries** - Start and end sessions at logical points
- **Time-boxed sessions** - Plan 30-90 minute focused sessions
- **Strategic decisions** - You make architectural decisions, AI handles implementation
- **Context preservation** - Always update SESSION_STATUS.md before ending

### Quality Assurance
- **Complete quality gates** - Never skip implementation quality checks
- **Test rigorously** - Unit, integration, and regression testing required
- **Validate requirements** - Ensure all work meets acceptance criteria

## 🔧 Troubleshooting

### Quick Problem Solver

| Problem | Command | What It Does |
|---------|---------|--------------|
| **AI lost context** | `"Emergency recovery"` | Restores session from status files |
| **AI giving wrong answers** | `"Check hallucinations"` | Validates AI suggestions against reality |
| **Code partially broken** | `"Handle implementation failure"` | Rolls back or fixes broken code |
| **AI repeating same mistake** | `"Avoid [approach]"` | Adds failed approach to SESSION_STATUS.md to prevent repetition |
| **Session feels stuck** | `"Assess session restart"` | Decides whether to restart or continue |

### Common Problems

**Context Loss** - AI forgets what we're doing
- **Fix**: Use `"Emergency recovery"` to reload from status files

**Implementation Failures** - Code doesn't work
- **Fix**: Use `"Handle implementation failure"` to assess and fix

**Repeated Mistakes** - AI tries same failed approach again
- **Fix**: Use `"Avoid [approach]"` to add it to SESSION_STATUS.md
- **Prevention**: AI reads failed approaches in SESSION_STATUS.md at session start

**Documentation Issues** - Files don't match
- **Fix**: Use `"Fix documentation corruption"` to clean up conflicts

### Prevention
- Update SESSION_STATUS.md regularly
- **Avoid repeated mistakes** - Use `"Avoid [approach]"` when something doesn't work
- Test frequently in small pieces
- Use consistent terminology
- Document decisions as you make them

---

This simplified guide maintains all essential functionality while removing excessive complexity. For detailed phase-specific instructions, AI should read the appropriate `ai-development-guide/PHASE_X_*.md` file based on the current development phase.
