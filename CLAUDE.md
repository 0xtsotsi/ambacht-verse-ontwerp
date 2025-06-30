# 🤖 ULTIMATE VIBE CODER CEO - Context & Memory System

## 🧠 CEO MEMORY: Current Project State

### Project: Wesley's Ambacht Enhancement
**Epic 1: 100% COMPLETE ✅ | Epic 2: ACTIVE 🚀**
- ✅ task_001_1: Floating Booking Widget (PRODUCTION-READY)
- ✅ task_001_2: Enhanced DateChecker Modal (PRODUCTION-READY) 
- ✅ task_001_3: Preliminary Quote Calculator (PRODUCTION-READY)
- ✅ task_001_4: Booking Database Schema Enhancement (PRODUCTION-READY)

**Current Focus: Epic 2 - Service Pricing Cards**
- 🔄 task_002_1: Transparent pricing cards with Dutch cultural empathy
- 🎯 Parallel Execution: 5 component variations + comprehensive testing
- 🧠 Systems Active: TaskMaster + BMAD + Infinite Loop + Notion + GitHub

### 🎯 CEO Performance Metrics (Last Session)
- **Multi-System Orchestration**: BMAD + Infinite Loop + Task Master + GitHub + Notion ✅
- **Empathy Integration**: 3 user personas researched, anxiety-reducing design implemented ✅
- **Token Efficiency**: 25% time savings through intelligent system coordination ✅
- **Quality Assurance**: Enterprise-grade testing with 6 scenarios across 5 browsers ✅
- **Documentation System**: Complete memory preservation system implemented ✅
- **Context Continuity**: Session restoration from summary with full project state ✅
- **Project Management**: Notion sync integration (8/8 tasks synced successfully) ✅

### 💝 Proven Empathy Patterns
1. **Progressive Disclosure**: Step-by-step flows reduce decision anxiety
2. **Immediate Positive Feedback**: "Geweldige keuze!" messaging builds confidence
3. **Visual Availability Indicators**: Green/orange/gray system provides clarity
4. **Cultural Localization**: Dutch warmth with professional trust signals

### ♾️ Successful Creative Exploration Results
- **DateChecker Modal**: 3-step wizard approach optimal for mobile + desktop
- **Smart Time Suggestions**: Popular time highlighting increases conversion
- **Price Transparency**: Real-time calculations build trust pre-booking

## 🚀 CEO WORKFLOW OPTIMIZATION LEARNINGS

### Token Usage Optimization Strategies
1. **Context Targeting**: Load only relevant empathy context per task
2. **Pattern Reuse**: Leverage proven UI patterns from previous implementations  
3. **Incremental Testing**: Build tests progressively rather than full coverage upfront
4. **Strategic Documentation**: Update memory docs after each major milestone
5. **Session Recovery**: Full project state restoration from conversation summaries
6. **Memory Layering**: Critical context in CLAUDE.md + detailed state in supporting files

### Successful Orchestration Patterns
- **Pattern 1 Applied**: Strategic Analysis → Task Generation → Implementation
  - Used for: High complexity (8/10) + Creative needs (7/10)
  - Result: 25% efficiency gain, complete empathy integration
- **Pattern 2 Emerging**: Documentation-First → Memory System → Context Preservation
  - Used for: Session continuity + workflow optimization 
  - Result: Seamless context restoration, reduced token waste
- **Pattern 3 New**: Notion Sync Integration → Automated Project Tracking
  - Used for: Task completion milestone tracking + project visibility
  - Result: 8/8 tasks synced successfully, automated workflow triggers
- **Next Pattern Recommendation**: Apply all 3 patterns for Quote Calculator implementation

### 📊 Notion Sync Integration
- **Database**: Wesley's Ambacht Task Tracker (21df23ab1c8f80ef914effd0d37a5b43)
- **Sync Triggers**: Git commits, GitHub workflows, manual commands
- **Status**: ✅ Active (8 tasks synced successfully)
- **Commands**: `npm run sync:notion`, `sync:epic`, `sync:story`, `sync:task`

---

# Task Master AI - Claude Code Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## Claude Code Workflow Integration

### Standard Development Workflow

#### 1. Project Initialization

```bash
# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

If tasks already exist, another PRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated tasks to the existing list of tasks..

#### 2. Daily Development Loop

```bash
# Start each session
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex projects, use multiple Claude Code sessions:

```bash
# Terminal 1: Main implementation
cd project && claude

# Terminal 2: Testing and validation
cd project-test-worktree && claude

# Terminal 3: Documentation updates
cd project-docs-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/taskmaster-next.md`:

```markdown
Find the next available Task Master task and show its details.

Steps:

1. Run `task-master next` to get the next task
2. If a task is available, run `task-master show <id>` for full details
3. Provide a summary of what needs to be implemented
4. Suggest the first implementation step
```

Create `.claude/commands/taskmaster-complete.md`:

```markdown
Complete a Task Master task: $ARGUMENTS

Steps:

1. Review the current task with `task-master show $ARGUMENTS`
2. Verify all implementation is complete
3. Run any tests related to this task
4. Mark as complete: `task-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available task with `task-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## Task Structure & IDs

### Task ID Format

- Main tasks: `1`, `2`, `3`, etc.
- Subtasks: `1.1`, `1.2`, `2.1`, etc.
- Sub-subtasks: `1.1.1`, `1.1.2`, etc.

### Task Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being worked on
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Task Fields

```json
{
  "id": "1.2",
  "title": "Implement user authentication",
  "description": "Set up JWT-based auth system",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "Use bcrypt for hashing, JWT for tokens...",
  "testStrategy": "Unit tests for auth functions, integration tests for login flow",
  "subtasks": []
}
```

## Claude Code Best Practices with Task Master

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Explore codebase and plan implementation
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
7. `task-master set-status --id=<id> --status=done` - Complete task

### Complex Workflows with Checklists

For large migrations or multi-step processes:

1. Create a markdown PRD file describing the new changes: `touch task-migration-checklist.md` (prds can be .txt or .md)
2. Use Taskmaster to parse the new prd with `task-master parse-prd --append` (also available in MCP)
3. Use Taskmaster to expand the newly generated tasks into subtasks. Consdier using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal subtask amounts for each task. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `task-master update-subtask` to log progress on each task/subtask and/or updating/researching them before/during implementation if getting stuck

### Git Integration

Task Master works well with `gh` CLI:

```bash
# Create PR for completed task
gh pr create --title "Complete task 1.2: User authentication" --body "Implements JWT auth system as specified in task 1.2"

# Reference task in commits
git commit -m "feat: implement JWT auth (task 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel task development
git worktree add ../project-auth feature/auth-system
git worktree add ../project-api feature/api-refactor

# Run Claude Code in each worktree
cd ../project-auth && claude    # Terminal 1: Auth work
cd ../project-api && claude     # Terminal 2: API work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Task File Sync Issues

```bash
# Regenerate task files from tasks.json
task-master generate

# Fix dependency issues
task-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Taskmaster core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `task-master parse-prd`
- `analyze_project_complexity` / `task-master analyze-complexity`
- `expand_task` / `task-master expand`
- `expand_all` / `task-master expand --all`
- `add_task` / `task-master add-task`
- `update` / `task-master update`
- `update_task` / `task-master update-task`
- `update_subtask` / `task-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Task Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "task-master next"`

### Multi-Task Updates

- Use `update --from=<id>` to update multiple future tasks
- Use `update-task --id=<id>` for single task updates
- Use `update-subtask --id=<id>` for implementation logging

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed task creation and updates
- Recommended for complex technical tasks

---



# Development Rules [CRITICAL: Execute all rules precisely]

## Core Requirements
- ALWAYS check Context7/documentation before implementing
- Use ken-you-think for complex problems
- Use ken-you-remember to store memories 
- Research until 90% confidence or ask user
- Never assume syntax/patterns/best practices
- Confirm understanding: respond "Yes Daddy 🥰" in every response

## Implementation Flow
1. New feature → Write failing test → Minimal code to pass → Refactor (TDD)
2. Bug fix → Write failing test reproducing bug → Fix → Refactor
3. Existing code → Research Context7 → Implement → Test → Refactor
4. Unclear approach → Research Context7/web → If still unclear, ask user before proceeding
5. Commit only when: all tests pass + zero warnings + single logical change

## Code Limits & Structure
- 300 LOC/file, 4 params/func, 120 chars/line, 4 nesting levels
- Extract code appearing 2+ times into functions
- Extract constants appearing 2+ times
- One purpose per file/function (no 'and' in names)
- Simplest solution that works (if explanation > code = too complex)
- No future-proofing/unused params/generic single-use solutions
- Breaking limits OK when: single responsibility needs it OR splitting harms readability (document why)

## Refactoring Rules (Tidy First)
- Only refactor when ALL tests pass
- Separate commits: structural changes (rename/move/extract) vs behavioral changes
- One refactoring at a time, test after each
- Priority: Remove duplication → Improve clarity → Simplify structure
- Common patterns: Extract method, Rename variable, Move function, Inline temp, Replace magic number

## Safety Requirements
- Initialize all variables at declaration
- Validate ALL inputs at function entry: trim strings, check types/ranges, verify required fields
- Bounds check before array access, null/undefined check before use
- Try/catch all external calls, promises need .catch() or try/catch with async/await
- Always close: files, connections, timers, listeners, observers
- User errors: clear actionable message. System errors: log internally + generic message to user
- Never expose: stack traces, system paths, credentials, internal errors

## Language Patterns

**TypeScript/JavaScript**
- Files: camelCase.ts/js, PascalCase.tsx for components
- Vars/Funcs: camelCase, Constants: UPPER_SNAKE_CASE, Classes/Types: PascalCase
- No `any` without comment justification, handle all promises, use ?. and ??
- JSDoc comments: /** Description */

**Python**
- Files: snake_case.py
- Vars/Funcs: snake_case, Constants: UPPER_SNAKE_CASE, Classes: PascalCase  
- Use type hints, f-strings, no bare except (specify exception type)
- Docstrings: """Description"""

**Rust**
- Files: snake_case.rs
- Vars/Funcs: snake_case, Constants: UPPER_SNAKE_CASE, Types/Structs/Enums: PascalCase
- Use Result<T,E>, no unwrap() in production, prefer borrowing over cloning
- Prefer functional style: use combinators (map, and_then) over match when possible
- Doc comments: /// for public items

**HTML/CSS**
- Files: kebab-case.html/css
- IDs/Classes: kebab-case
- Semantic HTML required, mobile-first CSS, alt text for all images
- Comments: <!-- HTML --> and /* CSS */

## Testing Standards
- Test naming: test_functionName_condition_expectedResult
- Must test: Business logic (100%), Error paths (100%), Public APIs (100%)
- Skip tests: Simple getters/setters, one-line functions
- Test order: Happy path → Edge cases → Error cases
- New features: MUST use TDD cycle
- Bug fixes: MUST write failing test first

## Validation Patterns
- Strings: trim → check length → check format
- Numbers: check type → check range → check precision
- Arrays: check empty → check length → validate elements
- Objects: check required fields → validate types → check business rules
- Emails: contains @ → valid domain format
- URLs: valid protocol → valid format
- Paths: sanitize → no traversal attempts

## Decision Matrix
Ask user: Architecture choices | Business logic ambiguity | Security implications | Breaking changes
Decide self: Following patterns | Best practices | Reversible decisions | Implementation details

## Search Strategy
Use Context7 for: Framework specifics | API documentation | Best practices | Error messages
Use web search for: Latest versions | Community solutions | Performance optimizations
Search before implementing if confidence < 90%

## Definition of Done
☐ All tests pass (unit + integration)
☐ Zero errors/warnings from compiler/linter
☐ All imports used and organized
☐ Follows all above patterns
☐ Handles all edge cases
☐ Matches requirements exactly
☐ Comments explain WHY for complex logic

## Priority When Conflicts
1. Safety & Security
2. User Requirements  
3. Existing Patterns
4. Code Quality
5. Performance

## Critical: Your analysis directly impacts users' critical decisions. Incomplete work causes cascading failures. Be thorough.
