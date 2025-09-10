# AI-Assisted Software Development Guide

This guide provides a structured approach to working with AI coding assistants across multiple sessions and context windows. It ensures comprehensive coverage from research through implementation and testing. This guide ensures systematic progress while maintaining context across sessions and providing clear documentation at each stage. The consolidated `ai-dev-context/` directory approach makes AI-assisted development more efficient, reliable, and manageable.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🚀 Quick Start](#-quick-start)
- [🤝 How to Use This Guide: User-AI Collaboration Model](#-how-to-use-this-guide-user-ai-collaboration-model)
- [⚡ Primary Commands to Use](#-primary-commands-to-use)
- [📑 Development Phases](#-development-phases)
- [📁 Central Documentation Hub](#-central-documentation-hub)
- [🔄 Context Management Across Sessions](#-context-management-across-sessions)
- [🛡️ Unified Quality Assurance System](#️-unified-quality-assurance-system)
- [💡 Best Practices](#-best-practices)
- [🔧 Troubleshooting and Recovery Guide](#-troubleshooting-and-recovery-guide)

## 🎯 Overview

The development process is divided into 5 key phases:

1. **Discovery & Research** - Understand the problem space, explore existing codebase, and research multiple solution approaches
2. **Requirements Definition** - Specify detailed requirements and constraints, then evaluate and select the optimal solution approach based on requirements
3. **Architecture & Planning** - Design the chosen solution architecture and create detailed implementation plan
4. **Implementation** - Code development with comprehensive testing and validation at each step
5. **Validation & Refinement** - Integration testing, performance analysis, bug fixes, and final adjustments

## 🚀 Quick Start

### ✨ How to Start a New Project

**Command:**
```
"Start Phase 1"
```

**What This Does:**
- Loads PHASE_1_DISCOVERY.md for discovery phase instructions
- Sets up ai-dev-context/ directory structure
- Begins discovery and research activities

**Then Use Phase 1 Commands:**
- `"Analyze [problem/feature]"` - Creates PROBLEM_ANALYSIS.md
- `"Explore codebase [area]"` - Creates CODEBASE_EXPLORATION.md
- `"Identify constraints [feature]"` - Creates CONSTRAINTS.md
- `"Present solution options"` - Creates SOLUTION_OPTIONS.md

**Your Role:**
- Provide requirements and answer AI's questions
- Use SHORT commands from each phase section
- Review AI work at decision points

## 🤝 How to Use This Guide: User-AI Collaboration Model

### 👥 Your Role vs AI's Role

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
- **Active Clarification**: Asking questions when requirements are unclear, ambiguous, or incomplete
- **Guidance Seeking**: Requesting developer input for architectural decisions, trade-offs, and business logic

### ▶️ When to Start a New Session

**Start New Session When:**
- **Time Available**: You have 30-90 minutes for focused development work
- **Phase Transition**: Moving from one development phase to another
- **Logical Breakpoint**: Completing a major component or reaching a decision point
- **Fresh Context**: After context loss or when starting a new feature
- **Priority Change**: Shifting focus to a different project aspect

**Don't Start New Session For:**
- Quick clarifications or questions (< 15 minutes)
- Simple code reviews without implementation
- Minor documentation updates only
- Pure research or exploration tasks

### ⏹️ When to End a Session

**End Session When:**
- **Time Management**: Approaching your time limit or need a break
- **Task Completion**: Major component or feature is functionally complete
- **Decision Required**: You've reached a point needing your strategic input
- **Context Pressure**: Conversation becomes lengthy and may benefit from summarization
- **Quality Review**: Work needs validation before proceeding
- **Phase Boundary**: Ready to transition between development phases

**Session End Indicators:**
- You may want to end sessions at logical breakpoints
- You've completed 2-3 major tasks or components
- Session duration reaches 60-90 minutes of focused work
- Conversation becomes lengthy (AI can suggest summarizing, but user decides when)
- You've reached a decision point requiring your strategic input
- Quality checkpoint needed before proceeding to next phase

**⚠️ Troubleshooting Reference:** If experiencing persistent context loss or session issues, see the [Troubleshooting and Recovery Guide](#troubleshooting-and-recovery-guide) section.

### 🔄 Session Management Workflow

#### Starting a Session
```
You: "Start session"

AI: AI will read ai-dev-context/SESSION_STATUS.md to determine current phase
AI: AI will load appropriate PHASE_X_[NAME].md file based on current phase from session status
AI: AI will review current status files, show priorities, and begin work
AI: AI will update ai-dev-context/SESSION_STATUS.md with session start time and initial priorities using file tools
AI: AI will load and review ai-dev-context/todo/current_todo_list.md for task status
```

#### During Session Work
```
AI: AI implements features, updates documentation, and tracks progress using available tools
AI: AI will update ai-dev-context/SESSION_STATUS.md after each major task completion when requested
AI: AI will update ai-dev-context/todo/current_todo_list.md when tasks are completed or new tasks discovered
AI: AI will suggest archiving context when conversations become lengthy, but user controls when this happens
AI: "Completed [task]. Ready for next task or session end?"

You: Continue with next task OR "End session"
```

#### Ending a Session
```
You: "End session"

AI: AI will update ai-dev-context/SESSION_STATUS.md with final status using file tools
AI: AI will update ai-dev-context/todo/current_todo_list.md with completed tasks and new discoveries
AI: AI will help create a conversation summary and archive entry if requested
AI: AI will update ai-dev-context/PROGRESS.md with session accomplishments
AI: AI will provide resumption instructions for next session
AI: "Session documented. Next session resume with: [specific command]"
```

#### AI's Session Management Capabilities
```
AI can help with:
- Context preservation during session (when user requests file updates)
- Progress tracking and documentation updates (using file tools user can see)
- Todo list management and task tracking (with user direction)
- Session boundary suggestions (user decides when to start/end)
- Context summarization when needed (at user request)
- Recovery preparation for next session (by updating status files)
- Asking clarifying questions when requirements or instructions are unclear
- Seeking guidance on architectural decisions and business logic choices
- Requesting additional context when needed to complete tasks effectively
```

### 🤔 AI Questioning and Clarification Guidelines

**AI Should Always Ask Questions When:**
- Requirements are ambiguous or incomplete
- Multiple valid implementation approaches exist without clear preference
- Business logic or user experience decisions need to be made
- Technical constraints or preferences are unclear
- Trade-offs between different solutions need developer input
- Security, performance, or architectural implications are significant
- Integration details with existing systems are uncertain
- Error handling strategies or edge case behavior is undefined
- Architectural decisions would affect multiple components
- Conflicting requirements or constraints are encountered
- Features could impact existing user workflows
- Assumptions about business logic or user behavior would be risky

**Examples of Good AI Questions:**
```
"I see two ways to implement this authentication system: 
1. Using JWT tokens with local storage
2. Using session-based auth with secure cookies
Which approach aligns better with your security requirements?"

"The requirements mention 'fast response times' - do you have specific 
performance targets in mind? (e.g., < 200ms for API calls)"

"I found existing user management code in the auth/ directory. Should I 
extend this existing system or create a new independent module?"

"This feature could impact the existing payment flow. Should I implement 
it as a separate service or integrate it into the current payment module?"

"The user story mentions 'admin users can manage settings' - what specific 
settings should they be able to modify, and are there any restrictions?"
```

**How AI Should Ask Questions:**
- Be specific about what information is needed
- Provide context about why the question matters
- Offer multiple options when possible
- Explain the implications of different choices
- Ask one focused question at a time rather than overwhelming with multiple questions

**"Generate progress report"** means:
```
"Create a comprehensive progress report covering:
- Current development phase and completion status
- Completed tasks from ai-dev-context/todo/current_todo_list.md
- Open issues from ai-dev-context/ISSUES.md
- Key decisions from ai-dev-context/DECISIONS.md
- Next priority tasks and milestones
- Any blockers or challenges encountered
- Update ai-dev-context/PROGRESS.md with current status"
```

### 🔄 Phase Management Command References

**"Start Phase [X]"** means:
```
"Begin a NEW phase (typically after completing previous phase or transitioning):
- Read PHASE_X_[NAME].md for detailed phase instructions
- Update ai-dev-context/SESSION_STATUS.md with new phase status
- Load ai-dev-context/todo/current_todo_list.md for active tasks
- Initialize phase-specific activities according to the loaded phase guide
- Focus exclusively on the current phase objectives without seeing other phase details
- Use this when moving to a new phase, not when resuming interrupted work in the same phase"
```

## ⚡ Primary Commands to Use

**🎯 Use these SHORT (Swift Helpful Operational Request Templates) commands. AI automatically interprets them as the detailed instructions shown in each phase section.**

**SHORT commands are designed to be:**
- **Swift**: Quick to type and remember
- **Helpful**: Provide comprehensive AI assistance
- **Operational**: Focused on development actions
- **Request**: Commands that request detailed AI work
- **Templates**: Standardized command patterns

### 🌐 Universal Session Commands
```
"Restart session"            # Resume work automatically (AI reads SESSION_STATUS.md to determine phase)
"End session"                # End current session with full context preservation
"Generate progress report"   # Create comprehensive progress summary
```

### 🎯 Phase-Specific SHORT Commands

**Phase 1 - Discovery & Research:**
```
"Analyze [problem/feature]"          # → Creates PROBLEM_ANALYSIS.md
"Explore codebase [area]"            # → Creates CODEBASE_EXPLORATION.md
"Identify constraints [feature]"     # → Creates CONSTRAINTS.md
"Present solution options"           # → Creates SOLUTION_OPTIONS.md for requirements evaluation
"Transition to Phase 2"              # → Complete Phase 1 quality gates and move to requirements phase
"Start session"                      # → Begin work session within discovery phase
"End session"                        # → Ends current session
```

**Phase 2 - Requirements:**
```
"Define requirements"                # → Creates REQUIREMENTS.md
"Create acceptance criteria"         # → Creates ACCEPTANCE_CRITERIA.md
"Write user stories"                 # → Creates USER_STORIES.md
"Design technical specs"             # → Creates TECHNICAL_SPEC.md
"Evaluate solution options"          # → Compares solutions against requirements
"Select solution [approach]"         # → Documents chosen solution and rationale
"Transition to Phase 3"              # → Complete Phase 2 quality gates and move to architecture phase
"Start session"                      # → Begin work session within requirements phase
"End session"                        # → Ends current session
```

**Phase 3 - Architecture:**
```
"Design architecture [feature]"      # → Creates ARCHITECTURE.md
"Create implementation plan"         # → Creates IMPLEMENTATION_PLAN.md
"Develop test strategy"              # → Creates TEST_STRATEGY.md
"Transition to Phase 4"              # → Complete Phase 3 quality gates and move to implementation phase
"Start session"                      # → Begin work session within architecture phase
"End session"                        # → Ends current session
```

**Phase 4 - Implementation:**
```
"Implement [component/feature]"      # → Creates/updates code and CODE_CHANGES.md
"Test [component] implementation"    # → Comprehensive testing of new component
"Validate [integration point]"       # → Test integration with existing systems
"Check for regressions"              # → Run existing tests to detect breaking changes
"Review implementation [component]"  # → Validates against requirements
"Update documentation [changes]"     # → Updates API_DOCUMENTATION.md, etc.
"Transition to Phase 5"              # → Complete Phase 4 quality gates and move to validation phase
"Start session"                      # → Begin work session within implementation phase
"End session"                        # → Ends current session
```

**Phase 5 - Validation:**
```
"Run tests [component]"              # → Executes tests, creates TEST_RESULTS.md
"Analyze test failures"              # → Creates BUG_REPORT.md
"Test performance [component]"       # → Creates PERFORMANCE_REPORT.md
"Complete project"                   # → Complete Phase 5 quality gates and finalize project
"Start session"                      # → Begin work session within validation phase
"End session"                        # → Ends current session
```

### 🚀 Project Entry Point

**Starting New Projects:**
```
"Start Phase 1"   # → Load PHASE_1_DISCOVERY.md and begin NEW discovery phase (project entry point)
```

### 🔄 Phase Transition Command Details

**"Transition to Phase 2"** means:
```
"Complete Phase 1 → Phase 2 transition with quality gate validation:
1. **Sequential Validation**: Verify current phase is Phase 1
2. **Quality Gate Check**: Verify Phase 1 deliverables complete (PROBLEM_ANALYSIS.md, CODEBASE_EXPLORATION.md, CONSTRAINTS.md, SOLUTION_OPTIONS.md)
3. **Status Update**: Update ai-dev-context/SESSION_STATUS.md with phase completion
4. **Progress Documentation**: Record Phase 1 achievements in ai-dev-context/PROGRESS.md
5. **Decision Documentation**: Archive key decisions from Phase 1 in ai-dev-context/DECISIONS.md
6. **Phase Loading**: Read and load PHASE_2_REQUIREMENTS.md for requirements phase instructions
7. **Context Preparation**: Set focus on requirements and solution selection objectives
8. **Todo Update**: Update todo list with Phase 2 tasks and mark Phase 1 complete"
```

**"Transition to Phase 3"** means:
```
"Complete Phase 2 → Phase 3 transition with quality gate validation:
1. **Sequential Validation**: Verify current phase is Phase 2
2. **Quality Gate Check**: Verify Phase 2 deliverables complete (REQUIREMENTS.md, ACCEPTANCE_CRITERIA.md, USER_STORIES.md, TECHNICAL_SPEC.md, solution selected)
3. **Status Update**: Update ai-dev-context/SESSION_STATUS.md with phase completion
4. **Progress Documentation**: Record Phase 2 achievements in ai-dev-context/PROGRESS.md
5. **Decision Documentation**: Archive key decisions from Phase 2 in ai-dev-context/DECISIONS.md
6. **Phase Loading**: Read and load PHASE_3_ARCHITECTURE.md for architecture phase instructions
7. **Context Preparation**: Set focus on architecture design and implementation planning
8. **Todo Update**: Update todo list with Phase 3 tasks and mark Phase 2 complete"
```

**"Transition to Phase 4"** means:
```
"Complete Phase 3 → Phase 4 transition with quality gate validation:
1. **Sequential Validation**: Verify current phase is Phase 3
2. **Quality Gate Check**: Verify Phase 3 deliverables complete (ARCHITECTURE.md, IMPLEMENTATION_PLAN.md, TEST_STRATEGY.md, SEQUENCE_DIAGRAMS.md)
3. **Status Update**: Update ai-dev-context/SESSION_STATUS.md with phase completion
4. **Progress Documentation**: Record Phase 3 achievements in ai-dev-context/PROGRESS.md
5. **Decision Documentation**: Archive key decisions from Phase 3 in ai-dev-context/DECISIONS.md
6. **Phase Loading**: Read and load PHASE_4_IMPLEMENTATION.md for implementation phase instructions
7. **Context Preparation**: Set focus on coding, testing, and documentation objectives
8. **Todo Update**: Update todo list with Phase 4 tasks and mark Phase 3 complete"
```

**"Transition to Phase 5"** means:
```
"Complete Phase 4 → Phase 5 transition with quality gate validation:
1. **Sequential Validation**: Verify current phase is Phase 4
2. **Quality Gate Check**: Verify Phase 4 deliverables complete (CODE_CHANGES.md, API_DOCUMENTATION.md, IMPLEMENTATION_NOTES.md, DEPLOYMENT_GUIDE.md, core functionality working)
3. **Status Update**: Update ai-dev-context/SESSION_STATUS.md with phase completion
4. **Progress Documentation**: Record Phase 4 achievements in ai-dev-context/PROGRESS.md
5. **Decision Documentation**: Archive key decisions from Phase 4 in ai-dev-context/DECISIONS.md
6. **Phase Loading**: Read and load PHASE_5_VALIDATION.md for validation phase instructions
7. **Context Preparation**: Set focus on comprehensive testing, bug fixing, and performance validation
8. **Todo Update**: Update todo list with Phase 5 tasks and mark Phase 4 complete"
```

**"Complete project"** means:
```
"Finalize project with comprehensive validation:
1. **Sequential Validation**: Verify current phase is Phase 5
2. **Final Quality Gates**: Verify all Phase 5 deliverables complete and production-ready (TEST_RESULTS.md, BUG_REPORT.md, PERFORMANCE_REPORT.md, RELEASE_NOTES.md)
3. **Documentation Review**: Ensure all ai-dev-context/ files are current and complete
4. **Project Summary**: Create final project summary in ai-dev-context/PROGRESS.md
5. **Deployment Preparation**: Validate deployment readiness and documentation
6. **Archive Creation**: Archive final project state in ai-dev-context/archives/
7. **Success Validation**: Confirm all acceptance criteria and requirements are met
8. **Status Update**: Mark project as complete in ai-dev-context/SESSION_STATUS.md"
```

### Quality Assurance Commands
```
"Review implementation [component]" # Validate work against requirements
"Validate requirements"             # Check requirements completeness
"Check architecture [feature]"      # Review architectural decisions
```

### Troubleshooting SHORT Commands
```
"Emergency recovery"                    # → Execute full context recovery protocol
"Validate context"                      # → Cross-reference documentation integrity
"Check hallucinations"                  # → Detect and correct AI hallucinations
"Resolve conflicts"                     # → Handle conflicting AI suggestions
"Reset AI understanding"                # → Fix persistent poor suggestions
"Handle implementation failure"         # → Recover from partial implementation problems
"Fix documentation corruption"          # → Resolve conflicting documentation states
"Assess session restart"                # → Evaluate restart vs continue decision
"Critical failure protocol"             # → Execute emergency response procedures
"Prevent issues"                        # → Run prevention checklist and validation
```

## 📑 Development Phases

**🔑 Phase Isolation Strategy**: Each phase has detailed instructions in separate files to prevent AI from jumping ahead to implementation before proper discovery and requirements are complete.

### Phase Overview

| Phase | File | Focus | Key Deliverables |
|-------|------|-------|------------------|
| **1** | `PHASE_1_DISCOVERY.md` | Research & Analysis | Problem analysis, solution options, constraints |
| **2** | `PHASE_2_REQUIREMENTS.md` | Requirements & Selection | Requirements, acceptance criteria, solution choice |
| **3** | `PHASE_3_ARCHITECTURE.md` | Design & Planning | Architecture, implementation plan, test strategy |
| **4** | `PHASE_4_IMPLEMENTATION.md` | Coding & Testing | Code changes, documentation, deployment guide |
| **5** | `PHASE_5_VALIDATION.md` | Testing & Refinement | Test results, bug reports, performance analysis |

### How to Use Phase Files

**Starting a New Project:**
```
You: "Start Phase 1"
AI: [Loads PHASE_1_DISCOVERY.md, focuses on research and analysis only]
```

**Sequential Phase Transitions:**
```
You: "Transition to Phase 2" (only valid from Phase 1)
AI: [Validates Phase 1 deliverables, then loads PHASE_2_REQUIREMENTS.md]

You: "Transition to Phase 3" (only valid from Phase 2)
AI: [Validates Phase 2 deliverables, then loads PHASE_3_ARCHITECTURE.md]
```

## 📁 Central Documentation Hub

The **`ai-dev-context/`** directory serves as the single source of truth for all AI-assisted development documentation, ensuring consistent context preservation across sessions.

### 🗃️ Directory Structure & Organization

Set up your project with this structure to support effective context preservation:

```
project-root/
├── ai-dev-context/
│   ├── SESSION_STATUS.md             # Current session status (PROCESS MANAGEMENT)
│   ├── PROGRESS.md                   # Overall project progress (PROCESS MANAGEMENT)
│   ├── DOCUMENTATION_INDEX.md        # Master index of all documentation files (PROCESS MANAGEMENT)
│   ├── DECISIONS.md                  # Key decisions log (PROCESS MANAGEMENT)
│   ├── ISSUES.md                     # Open questions/blockers (PROCESS MANAGEMENT)
│   ├── PROBLEM_ANALYSIS.md           # Problem statement and analysis (PROJECT CONTENT)
│   ├── CODEBASE_EXPLORATION.md       # Existing code analysis (PROJECT CONTENT)
│   ├── CONSTRAINTS.md                # Technical and business constraints (PROJECT CONTENT)
│   ├── SOLUTION_OPTIONS.md           # Solution comparison for decision-making (PROJECT CONTENT)
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
│   ├── todo/
│   │   ├── current_todo_list.md    # Active tasks for current development cycle
│   │   └── completed_tasks.md      # Archive of completed tasks
│   └── archives/
│       ├── PROGRESS_ARCHIVE_2024-01-15.md
│       ├── SESSION_STATUS_2024-01-15.md
│       └── ...
```

### 🎯 File Categories & Organization

The `ai-dev-context/` directory contains three file categories:

#### **Process Management Files** - Track development progress
- `SESSION_STATUS.md` - Current session state and priorities
- `PROGRESS.md` - Overall project advancement
- `DOCUMENTATION_INDEX.md` - Master reference to all documents
- `DECISIONS.md` - Key architectural decisions
- `ISSUES.md` - Open questions and blockers

#### **Project Content Files** - Document what's being built
Organized by development phase:
- **Phase 1**: `PROBLEM_ANALYSIS.md`, `CODEBASE_EXPLORATION.md`, `CONSTRAINTS.md`, `SOLUTION_OPTIONS.md`
- **Phase 2**: `REQUIREMENTS.md`, `ACCEPTANCE_CRITERIA.md`, `USER_STORIES.md`, `TECHNICAL_SPEC.md`
- **Phase 3**: `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `SEQUENCE_DIAGRAMS.md`, `TEST_STRATEGY.md`
- **Phase 4**: `CODE_CHANGES.md`, `API_DOCUMENTATION.md`, `IMPLEMENTATION_NOTES.md`, `DEPLOYMENT_GUIDE.md`
- **Phase 5**: `TEST_RESULTS.md`, `BUG_REPORT.md`, `PERFORMANCE_REPORT.md`, `RELEASE_NOTES.md`

#### **Task Management Files** - Track work items
- `todo/current_todo_list.md` - Active tasks with priority levels
- `todo/completed_tasks.md` - Archived completed tasks

### 🔄 File Category Distinctions

| Category | Focus | Updates | Lifespan |
|----------|-------|---------|----------|
| **Process Management** | How development progresses | After sessions/tasks | Development cycle |
| **Project Content** | What product does | When requirements change | Product lifetime |
| **Task Management** | Work breakdown | Continuous during development | Development cycle |

### 🧭 File Access Commands
**For Process Management:**
```
"Read the current session status from ai-dev-context/SESSION_STATUS.md"
"Check the latest progress updates in ai-dev-context/PROGRESS.md"
"Review key decisions in ai-dev-context/DECISIONS.md"
```

**For Project Content:**
```
"Locate and read ai-dev-context/REQUIREMENTS.md for functional specifications"
"Review user stories in ai-dev-context/USER_STORIES.md"
"Read the architecture design from ai-dev-context/ARCHITECTURE.md"
```

### ✅ Todo List Management

The **`todo/`** directory contains task tracking files that AI automatically manages throughout development:

#### **📋 Todo File Structure**
- **`ai-dev-context/todo/current_todo_list.md`** - Active tasks for current development cycle
- **`ai-dev-context/todo/completed_tasks.md`** - Archive of completed tasks with timestamps

#### **🤖 AI Todo Management Instructions**

**AI must automatically update todo lists when:**
- Starting a new development phase
- Breaking down complex tasks into smaller steps
- Completing individual tasks
- Identifying new requirements or issues
- Ending development sessions

**Todo List Format:**
```markdown
# Current Development Tasks

## Phase 1: Discovery & Research
- [x] Analyze user authentication requirements
- [ ] Explore existing authentication codebase
- [ ] Identify security constraints
- [ ] Document findings in PROBLEM_ANALYSIS.md

## Phase 2: Requirements Definition
- [ ] Create REQUIREMENTS.md
- [ ] Define acceptance criteria
- [ ] Write user stories

## Completed Tasks
- [x] Set up ai-dev-context/ directory structure (2024-01-15)
- [x] Initialize SESSION_STATUS.md (2024-01-15)
```

#### **🔄 Todo Update Commands**

**AI should automatically execute these todo operations:**

**When Starting Tasks:**
```
"Add new task to todo list: [task description]"
"Break down [complex task] into subtasks in todo list"
```

**When Completing Tasks:**
```
"Mark [task] as completed in todo list"
"Update todo list with task completion: [task name]"
```

**When Adding New Tasks:**
```
"Add blocking issue to todo list: [issue description]"
"Add new requirement to todo list: [requirement]"
```

#### **📊 Todo Integration with Development**

**AI must reference todo lists in:**
- **Session Status Updates**: "Working on task 3 of 5 from todo list"
- **Progress Reports**: "Completed 2/5 tasks from current todo list"
- **Planning**: "Next priority task from todo list is [task]"
- **Session End**: "Updated todo list with completed tasks before ending session"

**Todo List Priority Levels:**
- 🔴 **High Priority**: Blocking issues, critical bugs
- 🟡 **Medium Priority**: Feature implementation, documentation
- 🟢 **Low Priority**: Code cleanup, optimization, minor improvements

#### **🔗 Todo List Synchronization**

**AI must ensure todo lists stay synchronized with:**
- **SESSION_STATUS.md**: Current task status
- **PROGRESS.md**: Overall project completion
- **ISSUES.md**: Blocking items and open questions

**Daily Todo Workflow:**
1. **Session Start**: Load and review current todo list
2. **Task Execution**: Update todo status as tasks are completed
3. **New Tasks**: Add discovered requirements/issues to todo list
4. **Session End**: Ensure todo list reflects current progress
5. **Planning**: Use todo list to prioritize next session work

## 🔄 Context Management Across Sessions

This comprehensive section covers all aspects of maintaining context across AI-assisted development sessions, from basic preservation to advanced recovery strategies.

### Session Status File (SESSION_STATUS.md)

Create and maintain a `ai-dev-context/SESSION_STATUS.md` file with this structure:

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
**Current Focus:** [What was being worked on when session ended]
**Important Files:** [Files that contain critical context]
**Dependencies:** [Any prerequisites for next session]
**Testing Status:** [Current state of tests/validation]

## Recent Decisions
- [Decision 1] - [Brief rationale]
- [Decision 2] - [Brief rationale]

## TODO List Reference
See ai-dev-context/todo/current_todo_list.md for complete task tracking
```

### Context Preservation and Recovery Commands

**Emergency Context Recovery:**
```
"Emergency context recovery: Read ai-dev-context/SESSION_STATUS.md, ai-dev-context/PROGRESS.md, and ai-dev-context/DOCUMENTATION_INDEX.md to understand where work left off and what the current priorities are."
```

**Mid-Session Context Check:**
```
"Quick status check: Show current phase, last completed task, and next priority from ai-dev-context/SESSION_STATUS.md"
```

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

### Session Resumption Protocol

**Complete Resumption Process:**
```
"Resume development session:
1. Read ai-dev-context/SESSION_STATUS.md for current state
2. Load appropriate PHASE_X_[NAME].md file based on current phase from session status
3. Review ai-dev-context/PROGRESS.md for overall project status
4. Check ai-dev-context/DOCUMENTATION_INDEX.md for key documents
5. Load and review ai-dev-context/todo/current_todo_list.md for active tasks
6. Show me the next priority task from todo list and current blockers"
```

### Progress Tracking and Documentation

**Collaborative Progress Recording:**
```
"AI will help document this change in progress files when requested:
- Update ai-dev-context/PROGRESS.md with the completed task using file tools
- Add any new decisions to ai-dev-context/DECISIONS.md
- Note any open questions or blockers in ai-dev-context/ISSUES.md
- Update the current status in ai-dev-context/SESSION_STATUS.md"
```

**Todo-Based Progress Tracking:**
```
"Update todo list and session status after completing [task]:
- Mark [task] as completed in ai-dev-context/todo/current_todo_list.md
- Move completed task to ai-dev-context/todo/completed_tasks.md with timestamp
- Update ai-dev-context/SESSION_STATUS.md with completion details
- Identify and prioritize next task from todo list
- Generate brief progress note"
```

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

### Progress Archive System

**Create Progress Archives:**
```
"Create a progress archive for this session:
- Generate ai-dev-context/archives/PROGRESS_ARCHIVE_[date].md with complete session summary
- Archive current ai-dev-context/SESSION_STATUS.md as ai-dev-context/archives/SESSION_STATUS_[date].md
- Update master ai-dev-context/PROGRESS.md with session highlights
- Reset ai-dev-context/SESSION_STATUS.md for next session"
```

### Context Window Management

**Context Management Triggers (User-Initiated):**
- **🔴 High Priority**: Very long conversations (you may want to request summarization)
- **🟠 Medium Priority**: Session duration >90 minutes (consider ending session)
- **🟡 Low Priority**: Major phase transition or key architectural decision point
- **🟢 Maintenance**: Logical task completion or quality checkpoint

**Context Management Decision Guide:**
```
You should consider context management when:
1. Conversations become very lengthy (AI can suggest summarization)
2. Session duration exceeds 90 minutes (consider ending session)
3. Major phase transitions or key decisions occur
4. Logical completion points or quality checkpoints are reached
```

**Context Summarization Support:**
```
AI can help compress context by:
1. Extracting key decisions and rationale from conversations
2. Summarizing implementation approaches and patterns used
3. Documenting file references and change summaries
4. Recording dependency relationships and constraints
5. Capturing lessons learned and best practices discovered
```

**Create Context Snapshots:**
```
"Create context snapshot for [current state]:
- Document current phase and progress
- List active tasks and priorities
- Note critical dependencies
- Archive non-essential details"
```

**When Context Window is Full:**
```
"Emergency context reset:
1. Immediately archive current ai-dev-context/SESSION_STATUS.md
2. Create ai-dev-context/PROGRESS_SUMMARY.md with key achievements
3. Archive conversation highlights
4. Start fresh with recovery command"
```

### AI's Context Support Capabilities

**What AI Can Help With:**
```
AI can help by:
1. Tracking conversation flow and decision points within the current session
2. Reading and understanding current development phase from status files
3. Referencing technical constraints and requirements from documentation files
4. Understanding file relationships and dependencies when provided
5. Learning implementation patterns and best practices during the work
6. Providing session continuity through structured documentation
7. Suggesting context summarization when conversations become lengthy
8. Creating session summaries when requested
9. Updating progress files when asked
10. Reading project state from documentation files
11. Documenting critical technical decisions in files when requested
12. Tracking outstanding issues and dependencies in documentation
13. Asking clarifying questions when requirements or instructions are incomplete
14. Seeking guidance on architectural choices and business logic decisions
15. Requesting additional context when assumptions would be risky
16. Proactively identifying areas where developer input is needed
```

**AI's Session Resumption Support:**
```
When resuming, AI can help by:
- Reading current ai-dev-context/SESSION_STATUS.md when asked
- Reviewing recent progress updates from documentation files
- Identifying next logical tasks from todo lists and status files
- Understanding previous decisions from documentation
- Reading technical context and constraints from files
- Continuing from the last documented state
```

### User Support for AI Context Management

**What You Should Do to Help AI:**

1. **Clear Session Boundaries:**
   - Always use "Start session" and "End session" commands
   - Provide clear task descriptions when beginning work
   - End sessions at logical completion points

2. **Consistent Documentation References:**
   - Reference specific files in ai-dev-context/ when giving tasks
   - Use consistent terminology for components and features
   - Update requirements when they change

3. **Context Preservation Commands:**
   - Use "Update progress" commands after major changes
   - Request "Context summary" when uncertain
   - Ask for "Session status" before ending work

4. **Quality Session Handoffs:**
   - Ensure ai-dev-context/SESSION_STATUS.md is current before ending
   - Document any unresolved questions in ai-dev-context/ISSUES.md
   - Archive important decisions in ai-dev-context/DECISIONS.md

**Collaborative Approach:**
```
You control:
- Starting/ending sessions explicitly
- Providing initial project requirements
- Making key architectural decisions
- Reviewing completed work at phase boundaries
- Requesting file updates and documentation changes

AI assists with:
- Context preservation through documentation (when you request it)
- Progress tracking and documentation (using visible file tools)
- Session continuity through structured files
- Technical implementation details
- Quality assurance and testing guidance
```

**🔧 Detailed Recovery Procedures:** For comprehensive recovery protocols and troubleshooting scenarios, see the [Troubleshooting and Recovery Guide](#troubleshooting-and-recovery-guide) section.

### Quality Assurance for Context Management

**Context Completeness Checklist:**
- [ ] ai-dev-context/SESSION_STATUS.md is up to date
- [ ] ai-dev-context/PROGRESS.md reflects current achievements
- [ ] ai-dev-context/DOCUMENTATION_INDEX.md includes all documents
- [ ] ai-dev-context/todo/current_todo_list.md is current and prioritized
- [ ] ai-dev-context/todo/completed_tasks.md contains recent completions
- [ ] Key decisions are documented in ai-dev-context/DECISIONS.md
- [ ] Open questions/blockers are noted in ai-dev-context/ISSUES.md
- [ ] Next session priorities are clear from todo list

## 🛡️ Unified Quality Assurance System

### **Implementation Quality Gates** (Apply to Every Implementation Task)
Before marking any implementation task as complete:
```
□ All code builds successfully with no compile errors and all structured files have no syntax errors
□ Unit tests pass for new code
□ Integration tests pass with existing components
□ Existing test suite passes (no regressions detected)
□ Acceptance criteria validated against ai-dev-context/ACCEPTANCE_CRITERIA.md
□ Implementation meets technical specifications in ai-dev-context/TECHNICAL_SPEC.md
□ Documentation updated in relevant files
□ Code follows established patterns and standards
□ Security requirements validated (if applicable)
□ Manual testing confirms expected behavior
```

### **Phase Transition Quality Gates** (Apply Before Moving Between Phases)

**Phase 1 → 2 (Discovery to Requirements):**
- [ ] Problem clearly understood and documented in ai-dev-context/PROBLEM_ANALYSIS.md
- [ ] Multiple solution approaches researched and documented with detailed comparison
- [ ] Stakeholder needs identified and constraints documented in ai-dev-context/CONSTRAINTS.md
- [ ] High-level feasibility assessed and codebase explored in ai-dev-context/CODEBASE_EXPLORATION.md
- [ ] Solution options presented in ai-dev-context/SOLUTION_OPTIONS.md (if multiple viable approaches exist)
- [ ] All research deliverables complete and validated for requirements definition

**Phase 2 → 3 (Requirements to Architecture):**
- [ ] Requirements are specific and testable in ai-dev-context/REQUIREMENTS.md
- [ ] Acceptance criteria defined in ai-dev-context/ACCEPTANCE_CRITERIA.md
- [ ] Technical specifications documented in ai-dev-context/TECHNICAL_SPEC.md
- [ ] User stories complete and validated in ai-dev-context/USER_STORIES.md
- [ ] **CRITICAL**: Solution options evaluated against requirements and optimal solution selected
- [ ] Solution selection documented in ai-dev-context/DECISIONS.md with requirements-based rationale
- [ ] Chosen solution aligns with all functional and non-functional requirements

**Phase 3 → 4 (Architecture to Implementation):**
- [ ] Architecture decisions documented in ai-dev-context/ARCHITECTURE.md
- [ ] Implementation plan created with detailed tasks in ai-dev-context/IMPLEMENTATION_PLAN.md
- [ ] Testing strategy defined in ai-dev-context/TEST_STRATEGY.md
- [ ] Sequence diagrams completed in ai-dev-context/SEQUENCE_DIAGRAMS.md
- [ ] All architecture deliverables complete and validated

**Phase 4 → 5 (Implementation to Validation):**
- [ ] Core functionality implemented and Implementation Quality Gates passed
- [ ] Unit tests passing and integration working
- [ ] All code changes documented in ai-dev-context/CODE_CHANGES.md
- [ ] API documentation complete and current in ai-dev-context/API_DOCUMENTATION.md
- [ ] Implementation notes documented in ai-dev-context/IMPLEMENTATION_NOTES.md
- [ ] Deployment guide completed in ai-dev-context/DEPLOYMENT_GUIDE.md

**Phase 5 Completion (Validation Complete):**
- [ ] All acceptance criteria met and validated
- [ ] Performance requirements satisfied
- [ ] Documentation complete and deployment ready
- [ ] All test results documented and issues resolved

### **Phase Transition Decision Process**
- **✅ All Gates Passed**: Proceed to next phase immediately
- **⚠️ Minor Gaps**: Document gaps in ai-dev-context/ISSUES.md, proceed with caution, address gaps early in next phase
- **❌ Major Gaps**: Must complete missing deliverables before proceeding to next phase

**🚨 Need Help?** If experiencing issues during any phase, refer to the [Troubleshooting and Recovery Guide](#troubleshooting-and-recovery-guide) section for specific problem resolution strategies.

## 💡 Best Practices

### 🔧 Development Process Best Practices

- **Always reference previous work** - Start each session by reviewing relevant documents
- **Use specific commands** - Tell me exactly what to generate and why
- **Break complex tasks** - Use todo lists for multi-step implementations
- **Incremental delivery** - Aim for working functionality in each session
- **Progressive validation** - Test and validate work incrementally rather than at the end
- **Regular progress reports** - Use "Generate progress report" to track advancement
- **Expect AI questions** - AI should ask clarifying questions when requirements are unclear or incomplete
- **Encourage AI guidance-seeking** - AI should request developer input for architectural decisions and trade-offs

### 🛡️ Quality Assurance Best Practices

- **Quality gate compliance** - Complete all Implementation Quality Gates before marking tasks as done
- **Rigorous testing protocol** - Never implement without comprehensive testing (unit, integration, regression)
- **Quality gate reviews** - Always review AI work against your requirements before proceeding
- **Validate against acceptance criteria** - Ensure all work meets documented requirements

### 📝 Task and Documentation Management

- **Todo list management** - Keep ai-dev-context/todo/current_todo_list.md synchronized with development progress and update after every task completion
- **Prioritize systematically** - Use todo list priority levels for task management
- **Decision documentation** - Record your decisions in ai-dev-context/DECISIONS.md with rationale for architectural choices
- **Documentation discipline** - Never complete a task without updating relevant tracking files
- **Cross-reference everything** - Link related documents and decisions for easy navigation

### 🕐 Session Management Best Practices

- **Clear session boundaries** - Start and end sessions at logical breakpoints with clear goals
- **Time-boxed sessions** - Plan for 30-90 minute focused sessions with clear objectives
- **Strategic decision making** - Make architectural and business decisions yourself, let AI handle implementation
- **Session hygiene** - Follow the complete session end protocol to ensure clean handoffs
- **Know when to intervene** - Review AI work at phase transitions, make architectural decisions, approve major implementation approaches, validate against business requirements, and decide on trade-offs or compromises
- **Let AI work independently** - Allow AI to implement approved designs, write code following specifications, create documentation, execute systematic tasks, and update progress tracking
- **Match session length to task complexity** - Use 30-45 minutes for quick implementation tasks and documentation updates, 60-75 minutes for major component development and architecture design, and 90+ minutes for complex implementation and comprehensive testing

### 💾 Context Preservation Best Practices

- **Systematic status updates** - Update ai-dev-context/SESSION_STATUS.md after every major action and never end a session without updating it
- **Context window awareness** - Monitor conversation length and proactively archive context
- **Recovery-first mindset** - Always assume sessions will be interrupted and prepare accordingly
- **Archive regularly** - Create progress archives at logical completion points

## 🔧 Troubleshooting and Recovery Guide

### 🔨 Quick Problem Solver

**Got a problem? Use these simple commands:**

| Problem | Command | What It Does |
|---------|---------|--------------|
| **AI lost context** | `"Emergency recovery"` | Restores session from status files |
| **AI giving wrong answers** | `"Check hallucinations"` | Validates AI suggestions against reality |
| **AI won't stop being wrong** | `"Reset AI understanding"` | Fresh start with correct context |
| **Code partially broken** | `"Handle implementation failure"` | Rolls back or fixes broken code |
| **Documentation is messy** | `"Fix documentation corruption"` | Cleans up conflicting files |
| **AI suggests conflicting things** | `"Resolve conflicts"` | Systematically picks best option |
| **Session feels stuck** | `"Assess session restart"` | Decides whether to restart or continue |
| **Everything is broken** | `"Critical failure protocol"` | Emergency procedures |

### Common Problems & Solutions

#### 🔄 Context Loss (AI forgets what we're doing)

**Signs:**
- AI asks about things we already discussed
- References old/wrong information
- Gives generic responses

**Fix:**
```
"Emergency recovery"
```
This command makes AI read all your status files and get back on track.

#### 🤖 AI Hallucinations (AI makes things up)

**Signs:**
- Suggests code that doesn't exist
- References functions/files that aren't there
- Misunderstands your project completely

**Fix:**
```
"Check hallucinations"
```
This validates AI suggestions against your actual codebase.

#### 🔧 Broken Implementation (Code doesn't work)

**Signs:**
- Tests failing after AI changes
- Features partially working
- Breaking existing functionality

**Fix:**
```
"Handle implementation failure"
```
This assesses damage and creates a recovery plan.

#### 📄 Documentation Problems (Files don't match)

**Signs:**
- ai-dev-context/ files contradict each other
- Requirements don't match implementation
- Status files are outdated

**Fix:**
```
"Fix documentation corruption"
```
This cleans up conflicting documentation.

### When to Restart Your Session

**🔴 Restart Now:**
- AI has lost >50% of session context
- Session longer than 2 hours
- AI persistently misunderstands requirements
- Critical files corrupted

**🟡 Consider Restarting:**
- Multiple failed attempts on same task
- AI keeps changing its mind
- Documentation getting messy

**🟢 Keep Going:**
- Minor context gaps
- Single failed attempt
- AI understands but suggests variations

### Prevention Tips

**Before Starting:**
- [ ] Update ai-dev-context/SESSION_STATUS.md
- [ ] Check ai-dev-context/todo/current_todo_list.md
- [ ] Verify requirements are clear

**During Work:**
- [ ] Test frequently in small pieces
- [ ] Update documentation after major changes
- [ ] Use consistent terminology

**Before Ending:**
- [ ] Update session status
- [ ] Mark completed tasks
- [ ] Document any decisions made

### Emergency Procedures

If everything goes wrong:

1. **Stop immediately** - Don't make it worse
2. **Use `"Critical failure protocol"`** - Let AI guide recovery
3. **Document what happened** - Learn from it
4. **Start fresh if needed** - Sometimes it's faster

### What Each Command Actually Does

**"Emergency recovery":**
- Reads your status files
- Figures out where you left off
- Tells you what to do next

**"Check hallucinations":**
- Compares AI suggestions to your actual code
- Fixes wrong references
- Provides corrected implementation

**"Reset AI understanding":**
- Stops current work
- Reloads correct context from files
- Breaks tasks into smaller pieces

**"Handle implementation failure":**
- Stops implementation
- Runs tests to find all problems
- Creates plan to fix or rollback

**"Fix documentation corruption":**
- Checks all ai-dev-context/ files
- Finds conflicts and inconsistencies
- Updates files to match reality

**"Resolve conflicts":**
- Lists all conflicting suggestions
- Evaluates against your requirements
- Picks the best option with reasoning

**"Assess session restart":**
- Measures how much context is lost
- Checks documentation sync
- Recommends restart or continue

**"Critical failure protocol":**
- Emergency stop procedures
- Damage assessment
- Step-by-step recovery guidance