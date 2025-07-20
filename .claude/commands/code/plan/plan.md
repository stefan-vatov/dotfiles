# Plan Generator Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Interactive command that converts a Product Requirements Document (PRD) into a structured
    implementation plan with detailed task breakdowns. Analyzes PRD content, extracts key
    requirements, and generates comprehensive phase-based action plans (Research → Design →
    Implementation → Testing) with detailed task lists for project execution.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS FOR THE COMMAND ---------- -->
  <requirements>
    - Must accept file path as $ARGUMENTS (path to PRD document) and optional flags (-o/--output-dir, -p/--phases, -d/--detail-level).
    - Must validate PRD file exists, is readable, and within allowed directories (docs/, specs/, requirements/, .plan/01_requirements).
    - Must implement strict path validation to prevent directory traversal attacks.
    - Must parse and analyze PRD content with file size limits (10MB max) and encoding validation.
    - Must generate structured phases: Research, Design, Implementation, Testing with detailed breakdowns.
    - Must create specific, actionable tasks with acceptance criteria and complexity estimates.
    - Must auto-increment file numbering by scanning .plan/02_tasks/ directory for next NN_ prefix.
    - Must write output to .plan/02_tasks/NN_<project-name>.md using sanitized project names.
    - Should support custom output directory via -o/--output-dir flag (restricted to .plan/ subdirectories).
    - Should allow phase selection via -p/--phases flag (comma-separated: research,design,implementation,testing).
    - Should provide detail level control via -d/--detail-level flag (low/medium/high with defined task counts).
    - Should include dependency mapping between tasks and phases.
    - Should extract meaningful project name from PRD content or filename with sanitization.
    - Should create output directory structure if it doesn't exist within allowed paths.
    - Could include --dry-run flag for preview without writing files.
    - Could add progress indicators during processing.
    - Must abort with clear error if PRD file missing, unreadable, or contains path traversal sequences.
    - Must abort if output directory creation fails or is outside allowed paths.
    - Must emit comprehensive success summary with file path and task counts.
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <init>
         - Validate $ARGUMENTS contains file path and sanitize against directory traversal.
         - Verify file exists within allowed directories (docs/, specs/, requirements/, .plan/01_requirements).
         - Check file size limits (10MB max) and readability permissions.
         - Scan .plan/02_tasks/ directory for existing files to determine next NN_ prefix.
         - Validate and create output directory structure within .plan/ hierarchy.
    2. <analyze-prd>
         - Read and parse PRD document with encoding validation (UTF-8).
         - Extract project name with sanitization ([a-zA-Z0-9_-] only).
         - Parse content for scope, features, requirements, and constraints.
         - Determine project complexity for appropriate task granularity.
    3. <structure-phases>
         - Research: Market analysis, competitive research, technical feasibility, requirements gathering.
         - Design: System architecture, UI/UX design, API specifications, database schema, security design.
         - Implementation: Feature development, backend/frontend coding, integrations, infrastructure setup.
         - Testing: Unit testing, integration testing, performance testing, user acceptance testing.
    4. <generate-tasks>
         - Break phases into SMART tasks with acceptance criteria & complexity estimates.
         - Map inter-phase dependencies; include risk mitigation tasks.
         - Apply detail level: low (3-5 tasks), medium (6-10 tasks), high (10+ with subtasks).
         - Filter sensitive content patterns before inclusion in output.
    5. <format-output>
         - Structure as Markdown with phase headers and task checklists.
         - Include metadata: creation date, PRD source, task counts, estimated effort.
         - Format with checkboxes, priorities, and complexity indicators.
    6. <write-file>
         - Generate sanitized filename: NN_<safe-project-name>.md with auto-increment.
         - Write to validated output directory with proper error handling.
         - Set appropriate file permissions and validate write success.
    7. <report>
         - Echo output file path, phases created, and task count summary.
         - Report parsing warnings without exposing sensitive paths.
         - Suggest next steps for project execution.
  </execution>

  <!-- ---------- 4. VALIDATION / QUALITY GATES ---------- -->
  <validation>
    - [ ] $ARGUMENTS contains valid file path within allowed directories.
    - [ ] Input file path validated against directory traversal sequences.
    - [ ] File extension matches whitelist (.md, .txt, .docx) and size under 10MB.
    - [ ] Project name contains only safe characters [a-zA-Z0-9_-].
    - [ ] Output directory is within .plan/ hierarchy with no traversal sequences.
    - [ ] PRD content successfully parsed within memory and time limits.
    - [ ] All specified phases include detailed task breakdowns.
    - [ ] Each task has acceptance criteria and complexity estimates.
    - [ ] Sensitive data patterns filtered from output content.
    - [ ] Output file follows NN_<project-name>.md naming convention.
    - [ ] File numbering auto-increments correctly from existing files.
    - [ ] Markdown formatting is valid and properly structured.
    - [ ] File permissions validated before read/write operations.
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Basic usage with PRD file
    /code:plan:gen-plan "docs/mobile-app-requirements.md"

    # Custom output directory (within .plan/)
    /code:plan:gen-plan -o ".plan/projects" "requirements/web-platform-prd.md"

    # Specific phases only
    /code:plan:gen-plan -p "design,implementation" "specs/api-service.md"

    # High detail level for complex projects
    /code:plan:gen-plan -d high "docs/enterprise-platform-prd.md"

    # Dry run to preview output
    /code:plan:gen-plan --dry-run "requirements/prototype.md"

    # Error cases
    /code:plan:gen-plan "../../../etc/passwd"          # Error: Invalid file path
    /code:plan:gen-plan "nonexistent.md"               # Error: File not found
    /code:plan:gen-plan -p "invalid-phase" "doc.md"    # Error: Invalid phase name
    ```
  </examples>
</instructions>
