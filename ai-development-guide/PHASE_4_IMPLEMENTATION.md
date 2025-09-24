# Phase 4: Implementation

**Goal**: Develop code following the plan, with comprehensive testing and validation at each step.

**🎯 Key Requirement**: Produce working, tested code that meets all acceptance criteria and quality gates.

## Key Documentation to Generate
- **ai-dev-context/CODE_CHANGES.md** - Summary of implemented features and changes
- **ai-dev-context/API_DOCUMENTATION.md** - API docs, usage examples
- **ai-dev-context/IMPLEMENTATION_NOTES.md** - Implementation details and patterns used
- **ai-dev-context/DEPLOYMENT_GUIDE.md** - Deployment and configuration instructions

## ⚠️ **Quality Assurance Requirements**

**For EACH implementation step, complete these quality gates:**
- ✅ **Unit Tests**: Create and run unit tests for all new code
- ✅ **Integration Tests**: Test component interactions and dependencies
- ✅ **Regression Tests**: Run existing test suite to prevent breaking changes
- ✅ **Acceptance Criteria Validation**: Verify implementation meets ai-dev-context/ACCEPTANCE_CRITERIA.md

### **Testing Commands**
```
"Test [component] implementation"    # → Run comprehensive tests
"Check for regressions"              # → Run existing tests to detect breaking changes
"Verify acceptance criteria"         # → Confirm requirements compliance
```

## Primary Commands to Use

**Use these SHORT commands when working with AI:**
```
"Implement [component/feature]"      # → Creates/updates code and CODE_CHANGES.md
"Test [component] implementation"    # → Comprehensive testing of new component
"Validate [integration point]"       # → Test integration with existing systems
"Check for regressions"              # → Run existing tests to detect breaking changes
"Review implementation [component]"  # → Validates against requirements
"Update documentation [changes]"     # → Updates API_DOCUMENTATION.md, etc.
"Transition to Phase 5"              # → Complete Phase 4 quality gates and move to validation phase
"Start session"                      # → Resume work session (same as universal "Start session" command)
"End session"                        # → Ends current session
```

## Detailed Command Reference

**AI interprets the SHORT commands above as these detailed instructions:**

**"Implement [component/feature]"** means:
```
"Implement [specific task/component] according to ai-dev-context/IMPLEMENTATION_PLAN.md.
Ask clarifying questions if implementation details, integration points, or error handling strategies are unclear.

Proceed with implementation:
- Follow architecture in ai-dev-context/ARCHITECTURE.md
- Meet requirements in ai-dev-context/REQUIREMENTS.md
- Document changes in ai-dev-context/CODE_CHANGES.md
- Complete all Quality Assurance Requirements"
```

**"Test [component] implementation"** means:
```
"Execute comprehensive testing for [component]:
- Ensure code builds successfully with no errors
- Run unit tests for new code
- Test integration with existing components
- Validate against ai-dev-context/ACCEPTANCE_CRITERIA.md
- Document test results and issues"
```

**"Validate [integration point]"** means:
```
"Test the integration between [component] and existing systems:
- Verify data flow and API compatibility
- Test error handling and edge cases
- Ensure existing functionality remains unaffected
- Document integration test results"
```

**"Check for regressions"** means:
```
"Run the existing test suite to detect any breaking changes:
- Execute all existing tests (unit, integration, Cypress)
- Compare results with baseline performance
- Identify any regressions or performance degradation
- Document findings and potential fixes"
```

**"Review implementation [component]"** means:
```
"Review the implemented [component/feature] against quality requirements:
- Verify all testing protocols have been followed
- Check functional requirements compliance
- Verify non-functional requirements (performance, security, etc.)
- Validate against acceptance criteria
- Identify any gaps or issues"
```

**"Update documentation [changes]"** means:
```
"Update documentation for the implemented changes:
- Create/update ai-dev-context/API_DOCUMENTATION.md
- Update code comments and README files
- Document configuration changes
- Create ai-dev-context/DEPLOYMENT_GUIDE.md
- Include testing and validation information"
```

**"Start session"** → See main guide Session Management section

**"End session"** → See main guide Session Management section

## Session End Protocol

When ending a Phase 4 session:
1. Update ai-dev-context/SESSION_STATUS.md with implementation progress
2. Verify all Quality Gates are complete for implemented components
3. Update ai-dev-context/CODE_CHANGES.md and ai-dev-context/API_DOCUMENTATION.md
4. Update ai-dev-context/todo/current_todo_list.md with completed tasks
5. Run regression tests to ensure system stability

## Phase 4 Quality Gates

Before transitioning to Phase 5, ensure:

- [ ] Core functionality implemented and Quality Gates passed
- [ ] Unit tests passing and integration working
- [ ] Code changes documented in ai-dev-context/CODE_CHANGES.md
- [ ] API documentation complete in ai-dev-context/API_DOCUMENTATION.md
- [ ] Implementation notes in ai-dev-context/IMPLEMENTATION_NOTES.md
- [ ] Deployment guide completed in ai-dev-context/DEPLOYMENT_GUIDE.md

## Transition to Phase 5

When Phase 4 quality gates are met, AI should ask:
```
"Phase 4 implementation is complete. All quality gates met:
✅ Core functionality implemented and Quality Gates passed
✅ Unit tests passing and integration working
✅ Code changes documented in ai-dev-context/CODE_CHANGES.md
✅ API documentation complete in ai-dev-context/API_DOCUMENTATION.md
✅ Implementation notes in ai-dev-context/IMPLEMENTATION_NOTES.md
✅ Deployment guide completed in ai-dev-context/DEPLOYMENT_GUIDE.md

Should I transition to Phase 5 (Validation & Refinement)?"
```

**🔑 Key Rule**: Only proceed with developer permission.
