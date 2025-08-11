# Repository Context Generator

<instructions>
  <context>
    Automatically generates a comprehensive `.claude/repo-context.md` file that provides optimal technical context about the codebase. This file enables AI assistants to understand the repository structure, tech stack, dependencies, and codebase specifics for better planning and solution development. Supports both single repositories and monorepos.
  </context>

  <requirements>
    - Generate `.claude/repo-context.md` with complete technical analysis
    - Support `--update` flag to refresh existing context file
    - Analyze all file types for comprehensive coverage
    - Handle monorepo structures with multiple packages/projects
    - Perform deep file content analysis and dependency scanning
    - Use parallel sub-agents for efficient analysis
    - Include repository purpose, tech stack, directory structure, and key technical details
    - Exclude setup/install instructions, usage examples, and dev workflow
    - Focus purely on technical specifications and codebase understanding
  </requirements>

  <execution>
    1. <init>
         - Check if `.claude/repo-context.md` exists (warn if updating without --update flag)
         - Detect if repository is monorepo (multiple package.json, workspace configs, etc.)
         - Initialize parallel analysis tasks
    2. <parallel-analysis>
         - Spawn sub-agents for concurrent analysis:
             * Directory Structure Analyzer
             * Monorepo Structure Detector (workspaces, packages, sub-projects)
             * Dependency Scanner (package.json, requirements.txt, Cargo.toml, etc.)
             * File Content Analyzer (configs, scripts, source files)
             * Tech Stack Detector
             * Key Files Identifier
    3. <aggregate>
         - Collect results from all sub-agents
         - Cross-reference findings for consistency
         - Identify primary technologies and frameworks per package/project
         - Map monorepo relationships and shared dependencies
    4. <generate>
         - Create structured repo-context.md with sections:
             * Repository Overview (single repo vs monorepo)
             * Technology Stack (per package if monorepo)
             * Dependencies & Packages (organized by workspace/package)
             * Directory Structure (with monorepo package mapping)
             * Key Files & Components
             * Configuration Details
             * Technical Architecture Notes
             * Monorepo Structure (if applicable)
    5. <write>
         - Write/overwrite `.claude/repo-context.md`
         - Validate file structure and completeness
    6. <report>
         - Echo success message with file location and analysis summary
  </execution>

  <flags>
    --update    Update existing repo-context.md file (default: fail if exists)
  </flags>

  <sub-agents>
    Directory Structure Analyzer:
      - Map complete directory tree
      - Identify key organizational patterns
      - Note important subdirectories and their purposes
      - Detect workspace/package boundaries in monorepos

    Monorepo Structure Detector:
      - Identify workspace configurations (lerna.json, nx.json, etc.)
      - Map package relationships and dependencies
      - Detect shared tooling and configurations
      - Analyze inter-package dependencies

    Dependency Scanner:
      - Scan package.json, requirements.txt, Cargo.toml, go.mod, etc.
      - Extract direct and development dependencies per package
      - Identify version constraints and package managers
      - Map shared vs package-specific dependencies in monorepos

    File Content Analyzer:
      - Parse configuration files (.json, .yaml, .toml, .ini, etc.)
      - Analyze script files for functionality
      - Extract import/require statements
      - Identify framework usage patterns
      - Detect cross-package imports in monorepos

    Tech Stack Detector:
      - Determine primary programming languages per package
      - Identify frameworks and libraries in use
      - Detect build tools and bundlers
      - Note testing frameworks and tools
      - Map technology variations across monorepo packages

    Key Files Identifier:
      - Locate main entry points per package
      - Find configuration files (root and package-level)
      - Identify build/deployment scripts
      - Note documentation and schema files
      - Detect monorepo tooling configs

  </sub-agents>

  <validation>
    - [ ] All file types analyzed comprehensively
    - [ ] Dependencies correctly identified and listed
    - [ ] Technical stack accurately represented
    - [ ] Directory structure clearly mapped
    - [ ] Monorepo structure properly detected and documented
    - [ ] File serves as optimal AI context
  </validation>

  <examples>
    ```bash
    # Generate initial context file
    /code:plan:gen-context

    # Update existing context file
    /code:plan:gen-context --update
    ```

  </examples>

  <output-format>
    The generated `.claude/repo-context.md` should follow this structure:

    ```markdown
    # Repository Context

    ## Overview
    [Brief description of repository purpose and scope, monorepo vs single repo]

    ## Repository Type
    [Single repository or Monorepo with package count and organization]

    ## Technology Stack
    [Primary languages, frameworks, tools - organized by package if monorepo]

    ## Dependencies & Packages
    [Organized by package manager/language/workspace]

    ## Directory Structure
    [Tree view with explanations of key directories and package boundaries]

    ## Monorepo Structure (if applicable)
    [Workspace configuration, package relationships, shared tooling]

    ## Key Files & Components
    [Important files and their purposes, per package if relevant]

    ## Configuration Details
    [Config files and their significance, root vs package-level]

    ## Technical Architecture Notes
    [Important patterns, conventions, or architectural decisions]
    ```
  </output-format>
</instructions>
