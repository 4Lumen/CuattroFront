# Cline Development Guide - Version 3

## Table of Contents
1. [Core Principles](#core-principles)
2. [Development Goals](#development-goals)
3. [Project Lifecycle](#project-lifecycle)
4. [Memory Management](#memory-management)
5. [Operating Constraints](#operating-constraints)
6. [Memory Bank System](#memory-bank-system)
7. [MCP Integration](#mcp-integration)
8. [Tools & Capabilities](#tools--capabilities)
9. [Troubleshooting](#troubleshooting)
10. [Version History](#version-history)

## Core Principles
- **Single Source of Truth**: Memory Bank contains all project knowledge
- **Documentation First**: Complete documentation before development
- **Change Tracking**: All modifications must be documented
- **Context Verification**: Always verify context before proceeding

## Development Goals
1. Create maintainable software systems
2. Follow documented development patterns
3. Maintain complete project context
4. Ensure reproducible development processes

## Project Lifecycle
### 1. Requirements Gathering
- Identify objectives and use cases
- Define success criteria and constraints
- Document functional and non-functional requirements

### 2. Data Modeling
- Identify core entities and relationships
- Create appropriate data structures
- Develop database schema or class diagrams

### 3. Development Workflow
#### Initialization
- Verify Memory Bank files
- Create missing documentation
- Read and verify complete context

#### Execution
- Analyze task requirements
- Break down into achievable goals
- Use tools sequentially for each goal
- Document all changes and progress

#### Error Handling
- Detect and document ambiguities
- Request clarification when needed
- Update documentation with clarified information

## Memory Management
### Short-Term Memory
- Track current task context
- Maintain recent actions and next steps
- Document open questions and temporary notes

### Documentation Standards
- Maintain version control
- Use consistent formatting
- Include diagrams and visual aids
- Document assumptions and decisions

## Operating Constraints
1. Memory resets require complete documentation
2. Tools must be used sequentially
3. Each tool use requires confirmation
4. Development must follow documented patterns
5. Do not ask to run commands in terminal, just run them
6. Never use '&&' on terminal. Always use ';' instead (IMPORTANT)
7. Keep the LLM running while terminal commands are executing to maintain context and enable real-time interaction
8. Always proceed while running - do not wait for terminal commands to complete before continuing other work

## Memory Bank System
### Required Files
| File | Purpose |
|------|---------|
| productContext.md | Project purpose and problem space |
| activeContext.md | Current work and next steps |
| systemPatterns.md | Technical architecture and decisions |
| techContext.md | Technology stack and setup |
| progress.md | Current status and remaining work |

### Core Workflows
#### Starting Tasks
1. Check for Memory Bank files
2. If ANY files missing, stop and create them
3. Read ALL files before proceeding
4. Verify complete context
5. Begin development

#### During Development
1. Follow Memory Bank patterns
2. Update docs after significant changes
3. For troubleshooting:
   - Perform confidence checks (0-10)
   - If confidence < 9, document:
     * What you know
     * What you're unsure about
     * What needs investigation
   - Only proceed when confidence ≥ 9
   - Document findings for future reference

## MCP Integration
### Key Concepts
- **Tools**: Functions Cline can execute through MCP
- **Resources**: Read-only data access points
- **Security**: Isolated credentials and explicit user approval

### Use Cases
1. Web Services and API Integration
2. Browser Automation
3. Database Queries
4. Project and Task Management
5. Codebase Documentation

## Tools & Capabilities

### File Operations
- **write_to_file**: Create or overwrite files with complete content
  - Use for new files or complete rewrites
  - Always provide full file content
  - Example: Creating configuration files or templates

- **read_file**: Read file contents
  - Use to examine existing files
  - Handles text, PDF, and DOCX files
  - Example: Reading configuration or source code files

- **replace_in_file**: Make targeted edits using SEARCH/REPLACE blocks
  - Use for precise, line-based modifications
  - Requires exact line matches
  - Example: Updating specific function implementations

- **search_files**: Search using regex across files
  - Use for finding patterns or specific content
  - Provides context-rich results
  - Example: Finding all TODO comments in a project

- **list_files**: List directory contents
  - Use to explore project structure
  - Supports recursive listing
  - Example: Listing all TypeScript files in a directory

### Terminal Operations
- **execute_command**: Run CLI commands
  - Use for system operations and development tasks
  - Always explain the command's purpose
  - Example: Running build commands or starting servers
  - Best Practices:
    * Use ';' instead of '&&' for command chaining
    * Keep commands simple and focused
    * Avoid interactive commands when possible

- **list_code_definition_names**: List code definitions
  - Use to understand codebase structure
  - Provides high-level overview of code constructs
  - Example: Listing all classes and functions in a directory

### MCP Tools
- **use_mcp_tool**: Use MCP server tools
  - Use for extended capabilities through MCP servers
  - Requires server name and tool parameters
  - Example: Using weather API tools

- **access_mcp_resource**: Access MCP resources
  - Use to read data from MCP servers
  - Provides read-only access to resources
  - Example: Accessing database records

### Interaction Tools
- **ask_followup_question**: Request clarification
  - Use when additional information is needed
  - Keep questions specific and actionable
  - Example: Asking for API credentials

- **attempt_completion**: Present final results
  - Use to conclude tasks
  - Must include complete results
  - Example: Presenting a completed feature implementation

### Tool Usage Guidelines
1. Use one tool at a time
2. Wait for confirmation before proceeding
3. Document tool usage in progress.md
4. Handle errors gracefully
5. Use the simplest tool that can accomplish the task
6. Prefer targeted edits over complete rewrites
7. Always verify tool results before continuing

## Troubleshooting
### Common Issues
1. Missing context
2. Tool execution failures
3. Memory Bank inconsistencies
4. MCP connection problems

### Resolution Process
1. Identify the issue
2. Check relevant documentation
3. Verify system state
4. Document findings
5. Implement solution
6. Update documentation

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2023-10-01 | Initial version |
| 2.0 | 2023-10-15 | Restructured content, added TOC, improved formatting |
| 3.0 | 2023-11-01 | Added terminal command execution rules |
| 4.0 | 2024-01-15 | Enhanced tool descriptions and usage guidelines |
