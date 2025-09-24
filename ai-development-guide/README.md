# AI Development Guide

A structured approach for AI-assisted software development across multiple sessions.

## Overview

This guide provides a systematic 5-phase process for developing software with AI assistance:

1. **Discovery & Research** - Understand problems and research solution approaches
2. **Requirements Definition** - Define requirements and select optimal solutions
3. **Architecture & Planning** - Design architecture and create implementation plans
4. **Implementation** - Build and test code with quality gates
5. **Validation & Refinement** - Final testing and optimization

## Key Features

- **Phase isolation**: Prevents jumping to implementation before proper discovery
- **Quality gates**: Ensures testing and validation at each step
- **Session management**: Maintains context across conversations
- **Documentation**: All work tracked in `ai-dev-context/` directory
- **Permission-based transitions**: You control phase progression

## Files

- **`AI_DEVELOPMENT_GUIDE.md`** - Main guide with commands and structure
- **`PHASE_X_*.md`** - Detailed instructions for each phase
- **`ai-dev-context/`** - Generated documentation directory

## Usage

The AI loads phase-specific instructions and creates structured documentation as you progress through development. Each phase has specific commands and quality gates that must be met before proceeding to the next phase.

Your role: Provide requirements, make strategic decisions, review AI work
AI's role: Implementation, documentation, systematic tasks, quality assurance

## Quick Command Reference

### Universal Commands
- `"Start session"` - Resume work (AI reads current phase and context)
- `"End session"` - End session with context preservation
- `"Avoid [approach]"` - Record failed approach to prevent repetition

### Phase Commands
- `"Start Phase 1"` - Begin new project with discovery
- `"Analyze [problem]"` - Create problem analysis (Phase 1)
- `"Define requirements"` - Create requirements document (Phase 2)
- `"Select solution [approach]"` - Document chosen solution (Phase 2)
- `"Design architecture"` - Create architecture design (Phase 3)
- `"Implement [component]"` - Build and test component (Phase 4)
- `"Run tests"` - Execute comprehensive testing (Phase 5)
- `"Transition to Phase X"` - Move between phases (requires permission)
