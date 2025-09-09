# AI-Assisted Software Development Guide

This guide provides a structured approach to working with AI coding assistants across multiple sessions and context windows. It ensures comprehensive coverage from research through implementation and testing.

## Overview

The development process is divided into 5 key phases:

1. **Discovery & Research** - Understand the problem space and existing codebase
2. **Requirements Definition** - Specify detailed requirements and constraints
3. **Architecture & Planning** - Design the solution and create implementation plan
4. **Implementation** - Code development and unit testing
5. **Validation & Refinement** - Integration testing, bug fixes, and final adjustments

## How to Use This Guide: User-AI Collaboration Model

### Your Role vs AI's Role

**You (Developer) Are Responsible For:**
- **Strategic Direction**: Defining project goals, business requirements, and success criteria
- **Quality Assurance**: Reviewing AI-generated work, testing implementations, making final decisions
- **Session Management**: Deciding when to start/end sessions based on your time availability and logical breakpoints
- **Context Preservation**: Ensuring session status is updated before ending sessions

**AI (Assistant) Is Responsible For:**
- **Technical Implementation**: Writing code, creating documentation, executing systematic tasks
- **Context Management**: Maintaining session status, updating progress files, following established protocols
- **Quality Following**: Adhering to requirements, implementing according to specifications
- **Progress Tracking**: Updating documentation files after each major action

### When to Start a New Session

**Start New Session When:**
- **Time Management**: You have 30-90 minutes available for focused work
- **Logical Breakpoint**: Completing a major component, phase transition, or reaching a decision point
- **Fresh Start Needed**: After context loss or when starting a new phase
- **Priority Shift**: When you want to focus on a different aspect of the project

**Don't Start New Session For:**
- Quick questions or clarifications (< 15 minutes)
- Simple file reviews
- Minor documentation updates

### When to End a Session

**End Session When:**
- **Time Expiring**: You're running low on available time
- **Logical Completion**: Major task/component is complete
- **Decision Point Reached**: You've reached a point requiring your review/decision
- **Context Window Warning**: AI indicates context is approaching limits
- **Quality Checkpoint**: You need to review and validate work completed

**Session End Indicators:**
- AI will prompt: "Would you like to end this session and archive progress?"
- You've completed 2-3 major tasks
- You're transitioning between development phases
- It's been 45-60 minutes of active work

### Session Management Workflow

#### Starting a Session
```
You: "Let's start a [phase] session for [project/component]. Resume from ai-dev-context/SESSION_STATUS.md"

AI: Reviews current status, shows priorities, begins work
```

#### During Session Work
```
AI: Implements features, updates documentation, tracks progress
AI: "Completed [task]. Ready for next task or session end?"

You: Continue with next task OR "Let's end this session"
```

#### Ending a Session
```
You: "End this session and preserve context"

AI: Updates SESSION_STATUS.md, archives progress, prepares resumption instructions
AI: "Session archived. Next session resume with: [specific command]"
```

## Session Management Commands You Should Use

### Starting Sessions
```
"Start [phase] session for [component/feature]"
"Resume work from ai-dev-context/SESSION_STATUS.md"
"Begin implementation of [specific task]"
```

### During Sessions
```
"Continue with [next task]"
"Review [completed work]"
"Test [implementation]"
```

### Ending Sessions
```
"End session and archive progress"
"Pause here, update ai-dev-context/SESSION_STATUS.md"
"Session complete, prepare for next phase"
```

### Quality Assurance
```
"Review [implementation] against ai-dev-context/REQUIREMENTS.md"
"Validate [component] meets ai-dev-context/ACCEPTANCE_CRITERIA.md"
"Check if [task] aligns with ai-dev-context/ARCHITECTURE.md"
```

### Central Documentation Hub

All AI development documentation is consolidated in the **`ai-dev-context/`** directory. This single directory serves as your project's central hub containing two categories of files:

#### 🎯 **Process Management Files** (How Development is Progressing)
- **SESSION_STATUS.md** - Current session state and priorities
- **PROGRESS.md** - Overall project advancement
- **DECISIONS.md** - Key architectural choices made
- **ISSUES.md** - Open questions and blockers
- **DOCUMENTATION_INDEX.md** - Reference to all project files

#### 📋 **Project Content Files** (What Product is Being Built)
- **CONSTRAINTS.md** - Technical and business limitations
- **REQUIREMENTS.md** - Functional specifications
- **USER_STORIES.md** - User-focused feature descriptions
- **ARCHITECTURE.md** - System design and components
- **TEST_RESULTS.md** - Validation outcomes
- And 15+ other specification and documentation files

This organization ensures that all context-related files are easy to find, manage, and reference throughout the development lifecycle.

## Phase 1: Discovery & Research

**Goal**: Understand the problem, explore the codebase, and identify constraints.

### Key Documentation to Generate
- **PROBLEM_ANALYSIS.md** - Problem statement, current state analysis, stakeholder needs
- **CODEBASE_EXPLORATION.md** - Existing architecture, relevant components, patterns
- **CONSTRAINTS.md** - Technical limitations, dependencies, business rules

### Commands to Use

**Initial Problem Understanding:**
```
"Analyze this problem/request: [describe your feature/component]. Generate a PROBLEM_ANALYSIS.md that includes:
- Current state assessment
- Problem statement
- Success criteria
- Potential approaches
- Risks and assumptions"
```

**Codebase Exploration:**
```
"Explore the codebase for [specific functionality/area]. Create CODEBASE_EXPLORATION.md with:
- Key files and their purposes
- Existing patterns and architectures
- Integration points
- Code quality assessment"
```

**Constraint Analysis:**
```
"Identify constraints for implementing [feature]. Generate CONSTRAINTS.md covering:
- Technical dependencies
- Business rules
- Performance requirements
- Security considerations
- Timeline/resource limitations"
```

### Session Management

**Session Commands:**
```
"Analyze this problem/request: [describe your feature/component]. Generate a PROBLEM_ANALYSIS.md that includes:
- Current state assessment
- Problem statement
- Success criteria
- Potential approaches
- Risks and assumptions"

"Explore the codebase for [specific functionality/area]. Create CODEBASE_EXPLORATION.md with:
- Key files and their purposes
- Existing patterns and architectures
- Integration points
- Code quality assessment"

"Identify constraints for implementing [feature]. Generate CONSTRAINTS.md covering:
- Technical dependencies
- Business rules
- Performance requirements
- Security considerations
- Timeline/resource limitations"
```

**Session End Protocol:**
```
"End research session:
1. Update ai-dev-context/SESSION_STATUS.md with final research status
2. Summarize key findings in ai-dev-context/PROGRESS.md
3. Archive current session files
4. Document any unresolved questions in ai-dev-context/ISSUES.md"
```

## Phase 2: Requirements Definition

**Goal**: Create detailed, actionable requirements with acceptance criteria.

### Key Documentation to Generate
- **REQUIREMENTS.md** - Functional and non-functional requirements
- **ACCEPTANCE_CRITERIA.md** - Specific conditions for completion
- **USER_STORIES.md** - User-focused descriptions of functionality
- **TECHNICAL_SPEC.md** - API specs, data models, interfaces

### Commands to Use

**Requirements Gathering:**
```
"Based on our research in PROBLEM_ANALYSIS.md, create detailed REQUIREMENTS.md including:
- Functional requirements
- Non-functional requirements (performance, security, scalability)
- Integration requirements
- Data requirements"
```

**Acceptance Criteria:**
```
"Generate ACCEPTANCE_CRITERIA.md with specific, testable criteria for [feature/component]:
- Functional acceptance tests
- Performance benchmarks
- Error handling scenarios
- Edge cases"
```

**Technical Specifications:**
```
"Create TECHNICAL_SPEC.md defining the technical implementation details:
- API endpoints and contracts
- Data models and schemas
- Component interfaces
- Error handling patterns"
```

### Session Management

**Session Commands:**
```
"Based on our research in PROBLEM_ANALYSIS.md, create detailed REQUIREMENTS.md including:
- Functional requirements
- Non-functional requirements (performance, security, scalability)
- Integration requirements
- Data requirements"

"Generate ACCEPTANCE_CRITERIA.md with specific, testable criteria for [feature/component]:
- Functional acceptance tests
- Performance benchmarks
- Error handling scenarios
- Edge cases"

"Create USER_STORIES.md defining user-focused requirements and scenarios"

"Create TECHNICAL_SPEC.md defining the technical implementation details:
- API endpoints and contracts
- Data models and schemas
- Component interfaces
- Error handling patterns"
```

**Session End Protocol:**
```
"End requirements session:
1. Update ai-dev-context/SESSION_STATUS.md with requirements completion status
2. Ensure ai-dev-context/REQUIREMENTS.md and ai-dev-context/USER_STORIES.md are complete
3. Archive session progress in ai-dev-context/archives/
4. Prepare for architecture phase"
```

## Phase 3: Architecture & Planning

**Goal**: Design the solution architecture and create detailed implementation plan.

### Key Documentation to Generate
- **ARCHITECTURE.md** - High-level design decisions and component relationships
- **IMPLEMENTATION_PLAN.md** - Step-by-step development plan with tasks
- **SEQUENCE_DIAGRAMS.md** - Interaction flows and data flows
- **TEST_STRATEGY.md** - Testing approach and test cases

### Commands to Use

**Architecture Design:**
```
"Design the architecture for [feature]. Create ARCHITECTURE.md including:
- Component breakdown
- Data flow diagrams
- Technology choices and rationale
- Integration patterns
- Security architecture"
```

**Implementation Planning:**
```
"Create IMPLEMENTATION_PLAN.md with a detailed development roadmap:
- Task breakdown (use todo list tool)
- Dependencies and prerequisites
- Risk mitigation strategies
- Timeline estimates
- Success metrics"
```

**Test Strategy:**
```
"Develop TEST_STRATEGY.md covering:
- Unit test coverage plan
- Integration test scenarios
- Performance test requirements
- Manual test cases
- Automated test frameworks to use"
```

### Session Management

**Session Commands:**
```
"Design the architecture for [feature]. Create ARCHITECTURE.md including:
- Component breakdown
- Data flow diagrams
- Technology choices and rationale
- Integration patterns
- Security architecture"

"Create IMPLEMENTATION_PLAN.md with a detailed development roadmap:
- Task breakdown (use todo list tool)
- Dependencies and prerequisites
- Risk mitigation strategies
- Timeline estimates
- Success metrics"

"Develop TEST_STRATEGY.md covering:
- Unit test coverage plan
- Integration test scenarios
- Performance test requirements
- Manual test cases
- Automated test frameworks to use"
```

**Session End Protocol:**
```
"End architecture session:
1. Update ai-dev-context/SESSION_STATUS.md with architecture completion status
2. Ensure ai-dev-context/ARCHITECTURE.md and ai-dev-context/IMPLEMENTATION_PLAN.md are complete
3. Archive session files in ai-dev-context/archives/
4. Prepare detailed todo list for implementation phase"
```

## Phase 4: Implementation

**Goal**: Develop code following the plan, with continuous testing and documentation.

### Key Documentation to Generate
- **CODE_CHANGES.md** - Summary of implemented features and changes
- **API_DOCUMENTATION.md** - API docs, usage examples
- **DEPLOYMENT_GUIDE.md** - Deployment and configuration instructions

### Commands to Use

**Task Implementation:**
```
"Implement the [specific task/component] according to our IMPLEMENTATION_PLAN.md.
- Follow the architecture defined in ARCHITECTURE.md
- Meet the requirements in REQUIREMENTS.md
- Use the patterns from CODEBASE_EXPLORATION.md"
```

**Code Review Preparation:**
```
"Review the implemented [component/feature] against our ACCEPTANCE_CRITERIA.md:
- Check functional requirements compliance
- Verify non-functional requirements
- Identify any gaps or issues"
```

**Documentation Updates:**
```
"Update documentation for the implemented changes:
- API documentation
- Code comments and README updates
- Configuration changes
- Deployment procedures"
```

### Session Management

**Session Commands:**
```
"Implement the [specific task/component] according to our IMPLEMENTATION_PLAN.md.
- Follow the architecture defined in ARCHITECTURE.md
- Meet the requirements in REQUIREMENTS.md
- Use the patterns from CODEBASE_EXPLORATION.md"

"Review the implemented [component/feature] against our ACCEPTANCE_CRITERIA.md:
- Check functional requirements compliance
- Verify non-functional requirements
- Identify any gaps or issues"

"Update documentation for the implemented changes:
- API documentation
- Code comments and README updates
- Configuration changes
- Deployment procedures"
```

**Session End Protocol:**
```
"End implementation session:
1. Update ai-dev-context/SESSION_STATUS.md with implementation progress
2. Document completed work in ai-dev-context/IMPLEMENTATION_NOTES.md
3. Update ai-dev-context/PROGRESS.md with achievements
4. Archive session progress in ai-dev-context/archives/
5. Prepare for next implementation session or testing phase"
```

## Phase 5: Validation & Refinement

**Goal**: Comprehensive testing, bug fixes, and final optimization.

### Key Documentation to Generate
- **TEST_RESULTS.md** - Test execution results and coverage reports
- **BUG_REPORT.md** - Identified issues and fix status
- **PERFORMANCE_REPORT.md** - Performance test results and optimizations
- **RELEASE_NOTES.md** - Summary of changes and known issues

### Commands to Use

**Testing Execution:**
```
"Execute comprehensive testing according to TEST_STRATEGY.md:
- Run unit tests and report coverage
- Execute integration tests
- Perform manual testing against ACCEPTANCE_CRITERIA.md
- Document all test results in TEST_RESULTS.md"
```

**Bug Tracking:**
```
"Analyze test failures and create BUG_REPORT.md with:
- Detailed bug descriptions
- Reproduction steps
- Priority and severity assessment
- Proposed fixes"
```

**Performance Validation:**
```
"Conduct performance testing and generate PERFORMANCE_REPORT.md:
- Benchmark results vs requirements
- Bottleneck identification
- Optimization recommendations
- Scalability assessment"
```

### Session Management

**Session Commands:**
```
"Execute comprehensive testing according to TEST_STRATEGY.md:
- Run unit tests and report coverage
- Execute integration tests
- Perform manual testing against ACCEPTANCE_CRITERIA.md
- Document all test results in TEST_RESULTS.md"

"Analyze test failures and create BUG_REPORT.md with:
- Detailed bug descriptions
- Reproduction steps
- Priority and severity assessment
- Proposed fixes"

"Conduct performance testing and generate PERFORMANCE_REPORT.md:
- Benchmark results vs requirements
- Bottleneck identification
- Optimization recommendations
- Scalability assessment"
```

**Session End Protocol:**
```
"End validation session:
1. Update ai-dev-context/SESSION_STATUS.md with validation progress
2. Document test results in ai-dev-context/TEST_RESULTS.md
3. Update ai-dev-context/BUG_REPORT.md with any new issues found
4. Archive session progress in ai-dev-context/archives/
5. Prepare release notes in ai-dev-context/RELEASE_NOTES.md"
```

## Context Management Across Sessions

### Session Start Commands
```
"Resume work on [project/feature]. Review our progress from the last session and show me:
- Current status from our todo list
- Key documents we've created
- Next priority tasks"
```

### Session End Commands
```
"Generate a progress report for this session and update our documentation index"
```

### Documentation Index
Maintain a `DOCUMENTATION_INDEX.md` that tracks:
- All generated documents and their purposes
- Current phase and status
- Key decisions and rationale
- Outstanding issues and next steps

## Enhanced Context Preservation System

### Automatic Progress Recording

**After Every Major Action:**
```
"Document this change in our progress files:
- Update ai-dev-context/PROGRESS.md with the completed task
- Add any new decisions to ai-dev-context/DECISIONS.md
- Note any open questions or blockers in ai-dev-context/ISSUES.md
- Update the current status in ai-dev-context/SESSION_STATUS.md"
```

### Session Status File (SESSION_STATUS.md)

Create and maintain a `SESSION_STATUS.md` file with this structure:

```markdown
# Session Status - Last Updated: [Date Time]

## Current Phase
**Phase:** [1-5] - [Phase Name]
**Status:** [Active/Paused/Completed]

## Last Completed Task
**Task:** [Specific task that was just completed]
**Timestamp:** [When it was completed]
**Files Modified:** [List of files changed]

## Next Priority Tasks
1. [Task 1] - [Status: pending/in_progress/completed]
2. [Task 2] - [Status: pending/in_progress/completed]
3. [Task 3] - [Status: pending/in_progress/completed]

## Open Questions/Blockers
- [Question/Blocker 1] - [Status: unresolved/resolved]
- [Question/Blocker 2] - [Status: unresolved/resolved]

## Key Context for Next Session
**Current Focus:** [What we were working on when session ended]
**Important Files:** [Files that contain critical context]
**Dependencies:** [Any prerequisites for next session]
**Testing Status:** [Current state of tests/validation]

## Recent Decisions
- [Decision 1] - [Brief rationale]
- [Decision 2] - [Brief rationale]

## TODO List Reference
See [main todo list file] for complete task tracking
```

### Context Window Recovery Commands

**When Context is Lost:**
```
"Emergency context recovery: Read our ai-dev-context/SESSION_STATUS.md, ai-dev-context/PROGRESS.md, and ai-dev-context/DOCUMENTATION_INDEX.md to understand where we left off and what the current priorities are."
```

**Mid-Session Context Check:**
```
"Quick status check: Show me our current phase, last completed task, and next priority from ai-dev-context/SESSION_STATUS.md"
```

### Progress Archive System

**Create Progress Archives:**
```
"Create a progress archive for this session:
- Generate ai-dev-context/archives/PROGRESS_ARCHIVE_[date].md with complete session summary
- Archive current ai-dev-context/SESSION_STATUS.md as ai-dev-context/archives/SESSION_STATUS_[date].md
- Update master ai-dev-context/PROGRESS.md with session highlights
- Reset ai-dev-context/SESSION_STATUS.md for next session"
```

### Integration with Todo System

**Todo-Based Progress Tracking:**
```
"Update our todo list and session status after completing [task]:
- Mark [task] as completed in todo list
- Update ai-dev-context/SESSION_STATUS.md with completion details
- Identify and prioritize next task
- Generate brief progress note"
```

### Session Resumption Protocol

**Complete Resumption Process:**
```
"Resume development session:
1. Read ai-dev-context/SESSION_STATUS.md for current state
2. Review ai-dev-context/PROGRESS.md for overall project status
3. Check ai-dev-context/DOCUMENTATION_INDEX.md for key documents
4. Load active todo list
5. Show me the next priority task and current blockers"
```

### Automated Context Preservation

**After Each Implementation Step:**
```
"Preserve context after implementing [component/feature]:
- Update ai-dev-context/SESSION_STATUS.md with completion details
- Add implementation notes to ai-dev-context/IMPLEMENTATION_NOTES.md
- Update ai-dev-context/PROGRESS.md with key achievements
- Note any new dependencies or requirements discovered"
```

**After Each Documentation Update:**
```
"Document the documentation update:
- Add new document to ai-dev-context/DOCUMENTATION_INDEX.md
- Update ai-dev-context/SESSION_STATUS.md with documentation completion
- Cross-reference related documents
- Note any decisions documented"
```

### Recovery Mechanisms

**Context Loss Recovery:**
```
"Context lost - recovery protocol:
1. Read most recent ai-dev-context/SESSION_STATUS.md
2. Check ai-dev-context/PROGRESS.md for project timeline
3. Review ai-dev-context/DOCUMENTATION_INDEX.md for key files
4. Examine code changes since last session
5. Reconstruct current state and priorities"
```

**Session Interruption Recovery:**
```
"Resume after interruption:
- Check what was being worked on in ai-dev-context/SESSION_STATUS.md
- Review any partial changes in the codebase
- Identify what needs to be completed or rolled back
- Update status and continue from logical breakpoint"
```

### Quality Assurance for Context Management

**Context Completeness Checklist:**
- [ ] ai-dev-context/SESSION_STATUS.md is up to date
- [ ] ai-dev-context/PROGRESS.md reflects current achievements
- [ ] ai-dev-context/DOCUMENTATION_INDEX.md includes all documents
- [ ] Todo list is current and prioritized
- [ ] Key decisions are documented
- [ ] Open questions/blockers are noted
- [ ] Next session priorities are clear

**Session End Protocol:**
```
"End session with full context preservation:
1. Update ai-dev-context/SESSION_STATUS.md with final status
2. Generate session progress archive in ai-dev-context/archives/
3. Update master ai-dev-context/PROGRESS.md
4. Ensure todo list reflects current state
5. Document any critical context for next session
6. Confirm all key files in ai-dev-context/ are committed/saved"
```

## Quality Assurance Checklist

Before moving between phases, ask:

**Phase 1 → 2:**
- [ ] Problem clearly understood and documented
- [ ] Stakeholder needs identified
- [ ] High-level feasibility assessed

**Phase 2 → 3:**
- [ ] Requirements are specific and testable
- [ ] Acceptance criteria defined
- [ ] Technical constraints identified

**Phase 3 → 4:**
- [ ] Architecture decisions documented
- [ ] Implementation plan created with tasks
- [ ] Testing strategy defined

**Phase 4 → 5:**
- [ ] Core functionality implemented
- [ ] Unit tests passing
- [ ] Basic integration working

**Phase 5 Completion:**
- [ ] All acceptance criteria met
- [ ] Performance requirements satisfied
- [ ] Documentation complete
- [ ] Production deployment ready

## Practical Example: User Authentication System

### Real-World Session Flow

**Session 1 (Discovery - 45 minutes):**
```
You: "Start discovery session for user authentication system. Analyze current auth setup."

AI: Explores codebase, asks clarifying questions, creates PROBLEM_ANALYSIS.md
AI: "Completed analysis. Ready to end session or continue?"

You: "End session and archive progress"
AI: Updates ai-dev-context/SESSION_STATUS.md, creates archive
```

**Session 2 (Requirements - 60 minutes):**
```
You: "Start requirements session. Resume from ai-dev-context/SESSION_STATUS.md"

AI: Reviews previous work, shows current status
AI: Creates REQUIREMENTS.md, USER_STORIES.md, ACCEPTANCE_CRITERIA.md
AI: "Requirements documented. Should we end session here?"

You: "Yes, end session. I want to review the requirements first."
AI: Archives session, updates status for next phase
```

**Session 3 (Architecture - 75 minutes):**
```
You: "Start architecture session after reviewing requirements."

AI: Validates requirements alignment, designs architecture
AI: Creates ARCHITECTURE.md, IMPLEMENTATION_PLAN.md
AI: "Architecture complete. Continue with implementation or end session?"

You: "End session - I need to approve the architecture approach."
```

**Sessions 4-6 (Implementation - Multiple 60-minute sessions):**
```
You: "Resume implementation from ai-dev-context/SESSION_STATUS.md"

AI: Shows current progress, implements components systematically
AI: Updates code, tests, documentation after each component
AI: "Component complete. Continue with next or end session?"

You: "Continue with [next component]" or "End session"
```

**Session 7 (Validation - 90 minutes):**
```
You: "Start validation session for completed authentication system."

AI: Executes tests, validates against requirements, documents results
AI: "Found issues in ai-dev-context/BUG_REPORT.md. Ready to fix or end?"

You: "Fix critical issues, then end session."
```

### Session Decision-Making Guide

**When You Should Intervene:**
- Review AI work at phase transitions
- Make architectural decisions
- Approve major implementation approaches
- Validate against business requirements
- Decide on trade-offs or compromises

**When AI Can Proceed Independently:**
- Implement approved designs
- Write code following specifications
- Create documentation
- Execute systematic tasks
- Update progress tracking

**Session Length Guidelines:**
- **30-45 minutes**: Quick implementation tasks, documentation updates
- **60-75 minutes**: Major component development, architecture design
- **90+ minutes**: Complex implementation, comprehensive testing

### Quality Gates Between Sessions

**Discovery → Requirements:**
- [ ] PROBLEM_ANALYSIS.md clearly identifies the problem
- [ ] CONSTRAINTS.md documents all limitations
- [ ] You approve problem understanding

**Requirements → Architecture:**
- [ ] REQUIREMENTS.md contains testable specifications
- [ ] USER_STORIES.md covers all user scenarios
- [ ] You approve requirement scope

**Architecture → Implementation:**
- [ ] ARCHITECTURE.md addresses all requirements
- [ ] IMPLEMENTATION_PLAN.md provides clear roadmap
- [ ] You approve technical approach

**Implementation → Validation:**
- [ ] Core functionality implemented and tested
- [ ] Documentation updated
- [ ] Ready for comprehensive validation

## Best Practices

1. **Always reference previous work** - Start each session by reviewing relevant documents
2. **Use specific commands** - Tell me exactly what to generate and why
3. **Break complex tasks** - Use todo lists for multi-step implementations
4. **Document decisions** - Keep rationale for architectural choices
5. **Regular progress reports** - Use `/progressreport` to track advancement
6. **Quality checkpoints** - Validate work against acceptance criteria
7. **Incremental delivery** - Aim for working functionality in each session

### Context Preservation Best Practices

8. **Systematic Status Updates** - Update ai-dev-context/SESSION_STATUS.md after every major action
9. **Context Window Awareness** - Monitor conversation length and proactively archive context
10. **Recovery-First Mindset** - Always assume sessions will be interrupted and prepare accordingly
11. **Documentation Discipline** - Never complete a task without updating relevant tracking files
12. **Session Hygiene** - Follow the complete session end protocol to ensure clean handoffs
13. **Archive Regularly** - Create progress archives at logical completion points
14. **Cross-Reference Everything** - Link related documents and decisions for easy navigation

### User-AI Collaboration Best Practices

15. **Clear Session Boundaries** - Start and end sessions at logical breakpoints with clear goals
16. **Quality Gate Reviews** - Always review AI work against your requirements before proceeding
17. **Strategic Decision Making** - Make architectural and business decisions yourself, let AI handle implementation
18. **Time-Boxed Sessions** - Plan for 30-90 minute focused sessions with clear objectives
19. **Progressive Validation** - Test and validate work incrementally rather than at the end
20. **Context Preservation Discipline** - Never end a session without updating ai-dev-context/SESSION_STATUS.md
21. **Decision Documentation** - Record your decisions in ai-dev-context/DECISIONS.md for future reference

## Recommended Project Structure for Context Management

Set up your project with this structure to support effective context preservation. All AI development documentation is consolidated in the `ai-dev-context/` directory:

```
project-root/
├── ai-dev-context/
│   ├── SESSION_STATUS.md              # Current session status (PROCESS MANAGEMENT)
│   ├── PROGRESS.md                    # Overall project progress (PROCESS MANAGEMENT)
│   ├── DOCUMENTATION_INDEX.md         # All documents reference (PROCESS MANAGEMENT)
│   ├── DECISIONS.md                  # Key decisions log (PROCESS MANAGEMENT)
│   ├── ISSUES.md                     # Open questions/blockers (PROCESS MANAGEMENT)
│   ├── PROBLEM_ANALYSIS.md           # Problem statement and analysis (PROJECT CONTENT)
│   ├── CODEBASE_EXPLORATION.md       # Existing code analysis (PROJECT CONTENT)
│   ├── CONSTRAINTS.md                # Technical and business constraints (PROJECT CONTENT)
│   ├── REQUIREMENTS.md               # Functional requirements (PROJECT CONTENT)
│   ├── ACCEPTANCE_CRITERIA.md        # Success criteria (PROJECT CONTENT)
│   ├── USER_STORIES.md               # User-focused requirements (PROJECT CONTENT)
│   ├── TECHNICAL_SPEC.md             # Technical specifications (PROJECT CONTENT)
│   ├── ARCHITECTURE.md               # System architecture (PROJECT CONTENT)
│   ├── IMPLEMENTATION_PLAN.md        # Development roadmap (PROJECT CONTENT)
│   ├── SEQUENCE_DIAGRAMS.md          # System interactions (PROJECT CONTENT)
│   ├── TEST_STRATEGY.md              # Testing approach (PROJECT CONTENT)
│   ├── CODE_CHANGES.md               # Implementation summary (PROJECT CONTENT)
│   ├── API_DOCUMENTATION.md          # API documentation (PROJECT CONTENT)
│   ├── IMPLEMENTATION_NOTES.md       # Implementation details (PROJECT CONTENT)
│   ├── DEPLOYMENT_GUIDE.md           # Deployment instructions (PROJECT CONTENT)
│   ├── TEST_RESULTS.md               # Test execution results (PROJECT CONTENT)
│   ├── BUG_REPORT.md                 # Identified issues (PROJECT CONTENT)
│   ├── PERFORMANCE_REPORT.md         # Performance analysis (PROJECT CONTENT)
│   ├── RELEASE_NOTES.md              # Release information (PROJECT CONTENT)
│   └── archives/
│       ├── PROGRESS_ARCHIVE_2024-01-15.md
│       ├── SESSION_STATUS_2024-01-15.md
│       └── ...
└── .todo/
    ├── current_todo_list.md
    └── completed_tasks.md
```

## Understanding File Categories in ai-dev-context

The `ai-dev-context/` directory contains two distinct categories of files with different purposes:

### 🎯 **Process Management Files** (About the Development Process)
These files track **how** the AI-assisted development is progressing:

- **`SESSION_STATUS.md`** - Current development session state, last completed tasks, next priorities
- **`PROGRESS.md`** - Overall project advancement across all phases
- **`DOCUMENTATION_INDEX.md`** - Reference guide to all project documents
- **`DECISIONS.md`** - Log of key architectural and implementation decisions
- **`ISSUES.md`** - Open questions, blockers, and unresolved items

**Purpose**: These files ensure continuity when resuming development sessions and prevent context loss.

### 📋 **Project Content Files** (About the Product Being Built)
These files document **what** is being built and how it should work:

- **`PROBLEM_ANALYSIS.md`** - Understanding of the problem to solve
- **`CODEBASE_EXPLORATION.md`** - Analysis of existing code structure
- **`CONSTRAINTS.md`** - Technical limitations and business rules
- **`REQUIREMENTS.md`** - Functional specifications
- **`USER_STORIES.md`** - User-focused feature descriptions
- **`ARCHITECTURE.md`** - System design and component relationships
- **`IMPLEMENTATION_PLAN.md`** - Step-by-step development roadmap
- **`TEST_RESULTS.md`** - Actual test execution outcomes
- **`API_DOCUMENTATION.md`** - How to use the implemented functionality

**Purpose**: These files capture the requirements, design, and implementation details of the actual software product.

### 🔄 **Key Differences**

| Aspect | Process Management Files | Project Content Files |
|--------|------------------------|----------------------|
| **Focus** | How development is progressing | What product is being built |
| **Audience** | AI assistant + developers | End users + stakeholders |
| **Updates** | After each session/task | When requirements/design change |
| **Content Type** | Status reports, decisions, blockers | Specifications, designs, docs |
| **Lifespan** | Current development cycle | Product lifetime |
| **Examples** | "Session paused at 3:45 PM", "Decided to use React" | "User must authenticate", "API returns JSON" |

### 📂 **Practical Example**
Imagine building a user authentication system:

**Process Files Track:**
- "Currently implementing login endpoint (started 2 hours ago)"
- "Decided to use JWT tokens over sessions"
- "Need clarification on password complexity rules"
- "Completed 3/5 test cases, blocked on database setup"

**Project Files Document:**
- "Users must provide email + password to log in"
- "System validates credentials against user database"
- "Returns JWT token valid for 24 hours"
- "API endpoint: POST /api/auth/login"

## Finding and Navigating AI Development Context Files

### Directory Location
All AI development documentation is stored in the **`ai-dev-context/`** directory at your project root. This directory serves as the central hub for maintaining context across development sessions.

### How to Access the Directory

**From Project Root:**
```bash
cd ai-dev-context/
```

**List All Context Files:**
```bash
ls -la ai-dev-context/
```

**Quick File Finder Commands:**
```bash
# Find all documentation files
find ai-dev-context/ -name "*.md" -type f

# Find specific file types
find ai-dev-context/ -name "*STATUS*" -o -name "*PROGRESS*"

# Search for content across all files
grep -r "search_term" ai-dev-context/
```

### File Organization Principles

1. **Process Management Files** - Core context tracking files in root of `ai-dev-context/`
   - `SESSION_STATUS.md` - Current development session state
   - `PROGRESS.md` - Overall project advancement
   - `DOCUMENTATION_INDEX.md` - Reference to all project documents
   - `DECISIONS.md` - Key architectural decisions log
   - `ISSUES.md` - Open questions and blockers

2. **Project Content Files** - Product specifications and documentation in `ai-dev-context/`
   - **Discovery Phase**: `PROBLEM_ANALYSIS.md`, `CODEBASE_EXPLORATION.md`, `CONSTRAINTS.md`
   - **Requirements Phase**: `REQUIREMENTS.md`, `ACCEPTANCE_CRITERIA.md`, `USER_STORIES.md`
   - **Architecture Phase**: `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `SEQUENCE_DIAGRAMS.md`
   - **Implementation Phase**: `CODE_CHANGES.md`, `API_DOCUMENTATION.md`, `IMPLEMENTATION_NOTES.md`
   - **Validation Phase**: `TEST_RESULTS.md`, `BUG_REPORT.md`, `PERFORMANCE_REPORT.md`

3. **Archives** - Historical snapshots in `ai-dev-context/archives/`
   - Previous session statuses and progress reports
   - Dated backups for recovery and reference

### Quick Start Setup Commands

**Initial Project Setup:**
```
"Set up the AI development context structure for this project:
1. Create the ai-dev-context/ directory at project root
2. Initialize SESSION_STATUS.md with current date and phase
3. Create DOCUMENTATION_INDEX.md skeleton
4. Set up PROGRESS.md with project overview
5. Initialize DECISIONS.md and ISSUES.md"
```

**Daily Session Setup:**
```
"Prepare for today's development session:
1. Navigate to ai-dev-context/ directory
2. Read SESSION_STATUS.md to understand current state
3. Review any updates in PROGRESS.md
4. Check ISSUES.md for blockers
5. Load the current todo list
6. Show me the top priority task"
```

### File Navigation Commands

**For Process Management (Development Status):**
```
"Read the current session status from ai-dev-context/SESSION_STATUS.md"
"Check the latest progress updates in ai-dev-context/PROGRESS.md"
"Review our key decisions in ai-dev-context/DECISIONS.md"
"Check for any blockers in ai-dev-context/ISSUES.md"
```

**For Project Content (Product Specifications):**
```
"Locate and read ai-dev-context/REQUIREMENTS.md for functional specifications"
"Review user stories in ai-dev-context/USER_STORIES.md"
"Check technical constraints in ai-dev-context/CONSTRAINTS.md"
"Read the architecture design from ai-dev-context/ARCHITECTURE.md"
```

**Quick Category Searches:**
```bash
# Find all process management files
ls ai-dev-context/ | grep -E "(STATUS|PROGRESS|DECISIONS|ISSUES)"

# Find all requirement-related files
ls ai-dev-context/ | grep -E "(REQUIREMENTS|USER_STORIES|ACCEPTANCE)"

# Find all architecture and design files
ls ai-dev-context/ | grep -E "(ARCHITECTURE|IMPLEMENTATION|SEQUENCE)"

# Find all testing and validation files
ls ai-dev-context/ | grep -E "(TEST|BUG|PERFORMANCE)"
```

**List All Available Documents:**
```
"Show me the DOCUMENTATION_INDEX.md from ai-dev-context/ to see all available files"
```

## Common Commands Reference

**Documentation Generation:**
- "Create [DOCUMENT_NAME.md] covering [specific topics]"
- "Generate [type] documentation for [component]"
- "Update [existing document] with [new information]"

**Code Analysis:**
- "Analyze [code/file/component] for [specific aspects]"
- "Review [implementation] against [requirements/criteria]"
- "Identify [issues/patterns] in [codebase area]"

**Implementation:**
- "Implement [feature/task] according to [plan/document]"
- "Create [component] following [architecture/patterns]"
- "Add [functionality] with [specific requirements]"

**Testing & Validation:**
- "Test [component/feature] against [criteria/document]"
- "Validate [implementation] for [requirements]"
- "Execute [test type] and report results"

## Context Window Management Strategies

### Proactive Context Archiving Triggers

**Archive when approaching these thresholds:**
- **Conversation Length:** Every 50-100 messages or 10,000+ tokens
- **Major Phase Transitions:** End of each development phase
- **Complex Implementation:** After completing major features/components
- **Decision Points:** When key architectural decisions are made
- **Weekly Milestones:** End of each development week
- **Before Risky Changes:** Before potentially breaking changes

**Context Window Health Check:**
```
"Monitor context window usage:
- Estimate current conversation length in tokens
- Identify information that can be safely archived
- Create summary of completed work for archive
- Preserve only essential active context"
```

### Context Compression Techniques

**Summarize Completed Work:**
```
"Compress context for [completed feature/task]:
- Extract key decisions and rationale
- Summarize implementation approach
- Note important files and changes
- Preserve lessons learned"
```

**Create Context Snapshots:**
```
"Create context snapshot for [current state]:
- Document current phase and progress
- List active tasks and priorities
- Note critical dependencies
- Archive non-essential details"
```

### Emergency Context Recovery

**When Context Window is Full:**
```
"Emergency context reset:
1. Immediately archive current ai-dev-context/SESSION_STATUS.md
2. Create ai-dev-context/PROGRESS_SUMMARY.md with key achievements
3. Archive conversation highlights
4. Start fresh with recovery command"
```

**Recovery Command:**
```
"Recover from context loss:
- Read most recent ai-dev-context/archives/ files
- Reconstruct current state from ai-dev-context/ documentation
- Identify next priority tasks
- Continue from logical breakpoint"
```

## Benefits of the ai-dev-context Directory Approach

### 🎯 **Simplified File Management**
- **Single Location** - All AI development files in one directory
- **Predictable Structure** - Consistent file organization across projects
- **Easy Navigation** - Clear directory structure with logical grouping
- **Reduced Cognitive Load** - No need to remember multiple directory paths

### 🔄 **Enhanced Context Preservation**
- **Centralized Context** - All session-related information in one place
- **Systematic Updates** - Clear protocols for updating progress files
- **Archive Integration** - Historical data stored alongside current files
- **Recovery Ready** - Easy to reconstruct state from single directory

### 🚀 **Improved Development Workflow**
- **Quick Access** - Fast navigation to any documentation file
- **Session Continuity** - Seamless handoffs between development sessions
- **Progress Tracking** - Clear visibility into project advancement
- **Quality Assurance** - Built-in checklists for completeness verification

### 📁 **Directory Benefits Summary**
- **Consistency** - Same structure across all AI-assisted projects
- **Discoverability** - Easy to find files with simple commands
- **Maintainability** - Single directory to backup, version control, or share
- **Scalability** - Works for small features or large multi-phase projects

### 🔍 **Quick Reference Commands**
```bash
# Navigate to context directory
cd ai-dev-context/

# List all documentation files
ls -la ai-dev-context/

# Find specific files
find ai-dev-context/ -name "*STATUS*" -o -name "*PROGRESS*"

# Search across all files
grep -r "search_term" ai-dev-context/
```

This guide ensures systematic progress while maintaining context across sessions and providing clear documentation at each stage. The consolidated `ai-dev-context/` directory approach makes AI-assisted development more efficient, reliable, and manageable.
