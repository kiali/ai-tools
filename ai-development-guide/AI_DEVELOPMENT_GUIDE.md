# AI-Assisted Software Development Guide

This guide provides a structured approach to working with AI coding assistants across multiple sessions and context windows. It ensures comprehensive coverage from research through implementation and testing.

## Overview

The development process is divided into 5 key phases:

1. **Discovery & Research** - Understand the problem space and existing codebase
2. **Requirements Definition** - Specify detailed requirements and constraints
3. **Architecture & Planning** - Design the solution and create implementation plan
4. **Implementation** - Code development and unit testing
5. **Validation & Refinement** - Integration testing, bug fixes, and final adjustments

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
- Use `/progressreport` to track research progress
- End session with: "Summarize our research findings and create a research summary document"

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
- Reference previous phase documents
- Use: "Review and refine our requirements based on the research findings"
- End with: "Finalize requirements and prepare for planning phase"

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
- Reference requirements documents
- Use: "Design the architecture considering our defined requirements and constraints"
- Create detailed task lists for implementation

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
- Work through implementation plan tasks systematically
- Use todo lists to track progress
- Request code reviews at logical completion points
- Generate progress reports regularly

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
- Focus on fixing critical issues first
- Re-test after fixes
- Validate against all acceptance criteria
- Prepare for production deployment

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

## Example Session Flow

**Session 1:**
```
"Let's start implementing a user authentication system. First, analyze the current authentication setup and generate PROBLEM_ANALYSIS.md"
```

**Session 2:**
```
"Review PROBLEM_ANALYSIS.md and create detailed REQUIREMENTS.md for the authentication system"
```

**Session 3:**
```
"Based on REQUIREMENTS.md, design the architecture and create IMPLEMENTATION_PLAN.md"
```

**Session 4-6:**
```
"Start implementing the authentication system following IMPLEMENTATION_PLAN.md. Begin with the core authentication service."
```

**Session 7:**
```
"Execute comprehensive testing and generate TEST_RESULTS.md. Fix any critical issues found."
```

## Best Practices

1. **Always reference previous work** - Start each session by reviewing relevant documents
2. **Use specific commands** - Tell me exactly what to generate and why
3. **Break complex tasks** - Use todo lists for multi-step implementations
4. **Document decisions** - Keep rationale for architectural choices
5. **Regular progress reports** - Use `/progressreport` to track advancement
6. **Quality checkpoints** - Validate work against acceptance criteria
7. **Incremental delivery** - Aim for working functionality in each session

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

This guide ensures systematic progress while maintaining context across sessions and providing clear documentation at each stage.
