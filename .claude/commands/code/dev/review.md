# Pre-PR Code Review Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    A comprehensive pre-PR code review command that analyzes uncommitted changes against requirements to determine if the implementation is fit for purpose. Focuses primarily on requirements compliance with secondary checks for security, architecture, error handling, code quality, and performance issues. Designed to work without prior context by orienting itself through repo documentation and git status.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Accept primary input via $ARGUMENTS (can reference requirements location)
    - Support optional --requirements/-r flag for explicit requirements file path
    - Abort if no uncommitted changes or no requirements found
    - Read .claude/repo-context.md for repository orientation
    - Analyze ALL uncommitted changes (staged and unstaged) via git status/diff
    - PRIMARY FOCUS: Verify code changes meet stated requirements exactly as written
    - SECONDARY: Check for security, architecture, error handling, code quality, performance issues
    - Skip binary and generated files automatically
    - Prompt user if >50 files changed
    - Interactive error handling - prompt user on failures
    - Save report to .plan/03_code_review/ with auto-incremented filename (01_review.md, 02_review.md, etc.)
    - Use sub-agents for parallel analysis of different aspects
    - Show progress at milestones and current file being reviewed
    - Problem-focused output with brief acknowledgment of good aspects
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <init>
       - Parse $ARGUMENTS and --requirements flag
       - Validate requirements source exists
       - Check for uncommitted changes via git status
       - Abort if no changes or no requirements
       - Create .plan/03_code_review/ directory if needed
       - Determine next available filename prefix
    </init>

    2. <orient>
       - Read .claude/repo-context.md if exists
       - Understand repository structure and purpose
       - Note any architectural patterns or guidelines
    </orient>

    3. <gather_changes>
       - Run git status to identify changed files
       - Run git diff --cached for staged changes
       - Run git diff for unstaged changes
       - Filter out binary/generated files
       - If >50 files, prompt user to continue
       - Display "Analyzing X files..."
    </gather_changes>

    4. <load_requirements>
       - Read requirements from specified source
       - Parse requirements as-is (no interpretation)
       - Extract individual requirement items
       - Display "Loaded Y requirements..."
    </load_requirements>

    5. <parallel_analysis>
       - Spawn sub-agents concurrently:

       a) Requirements-Compliance-Agent:
          - Map each requirement to code changes
          - Identify fully implemented requirements
          - Flag partial implementations and TODOs
          - Find requirements with no changes
          - Detect scope creep (changes beyond requirements)

       b) Security-Review-Agent:
          - Scan for hardcoded credentials
          - Check for injection vulnerabilities
          - Identify insecure data handling
          - Review authentication/authorization

       c) Architecture-Review-Agent:
          - Check adherence to repo patterns
          - Identify architectural violations
          - Review module boundaries
          - Assess coupling and cohesion

       d) Code-Quality-Agent:
          - Find missing error handling
          - Detect code smells and duplication
          - Check function/class complexity
          - Review test coverage for changes
    </parallel_analysis>

    6. <synthesize_report>
       - Merge findings from all agents
       - Structure report with two main sections:
         * Issues by Severity (Critical → High → Medium → Low)
         * Requirements Gaps and Missing Implementations
       - Include small code snippets for context
       - Use file:line references for large code blocks
       - Add brief "What's Good" summary at end
    </synthesize_report>

    7. <save_output>
       - Write report to .plan/03_code_review/XX_review.md
       - Display report to console
       - Show completion message with saved location
    </save_output>

  </execution>

  <!-- ---------- 4. VALIDATION CHECKLIST ---------- -->
  <validation>
    - [ ] Requirements source properly identified and loaded
    - [ ] All uncommitted changes analyzed (excluding binaries)
    - [ ] Each requirement mapped to implementation status
    - [ ] Security vulnerabilities checked
    - [ ] Architecture compliance verified
    - [ ] Error handling gaps identified
    - [ ] Code quality issues found
    - [ ] Report saved with correct auto-incremented filename
    - [ ] User prompted for >50 file scenarios
    - [ ] Interactive error handling implemented
    - [ ] Progress indicators shown during analysis
    - [ ] Problem-focused output with severity rankings
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Review with requirements in default location mentioned in args
    /code:review "Check implementation against requirements in docs/Requirements.json"

    # Review with explicit requirements file
    /code:review --requirements=./project-requirements.txt

    # Review with requirements file using short flag
    /code:review -r specs/user-stories.md "Please review the shopping cart implementation"

    # Minimal invocation (will prompt for requirements location)
    /code:review "Review my changes"
    ```

  </examples>

  <!-- ---------- 6. SUB-AGENTS ---------- -->
  <sub-agents>
    <agent name="Requirements-Compliance-Agent">
      <purpose>Verify code changes satisfy stated requirements exactly</purpose>
      <inputs>
        - List of requirements (verbatim)
        - Changed files and their diffs
        - Repository context
      </inputs>
      <analysis>
        - Match requirements to code changes
        - Track implementation completeness
        - Identify missing requirements
        - Flag over-implementation
      </analysis>
      <outputs>
        - Requirement-to-code mapping
        - Completion status per requirement
        - List of gaps and extras
      </outputs>
    </agent>

    <agent name="Security-Review-Agent">
      <purpose>Identify security vulnerabilities in changed code</purpose>
      <focus-areas>
        - Hardcoded secrets and credentials
        - Injection vulnerabilities (SQL, XSS, command)
        - Insecure data transmission/storage
        - Authentication/authorization flaws
        - Cryptographic weaknesses
      </focus-areas>
      <severity-ratings>
        - Critical: Exploitable vulnerabilities
        - High: Potential security risks
        - Medium: Best practice violations
        - Low: Minor security improvements
      </severity-ratings>
    </agent>

    <agent name="Architecture-Review-Agent">
      <purpose>Ensure code changes align with architectural patterns</purpose>
      <checks>
        - Pattern consistency with existing code
        - Module boundary violations
        - Dependency direction compliance
        - Separation of concerns
        - Interface segregation
      </checks>
    </agent>

    <agent name="Code-Quality-Agent">
      <purpose>Assess code quality and maintainability</purpose>
      <review-points>
        - Error handling completeness
        - Code duplication
        - Function/method complexity
        - Test coverage for changes
        - Naming conventions
        - Code organization
      </review-points>
    </agent>

  </sub-agents>

  <!-- ---------- 7. ERROR HANDLING ---------- -->
  <error-handling>
    <missing-repo-context>
      - Display: "Warning: .claude/repo-context.md not found"
      - Prompt: "Continue without repository context? (y/n)"
      - Allow user to proceed or provide alternative context
    </missing-repo-context>

    <git-failures>
      - Display exact git error message
      - Prompt: "Git command failed. How would you like to proceed?"
      - Options: Retry, skip, abort
    </git-failures>

    <file-read-errors>
      - Display: "Cannot read file: [filename]"
      - Prompt: "Skip this file and continue? (y/n)"
      - Track skipped files in report
    </file-read-errors>

    <no-changes>
      - Display: "No uncommitted changes found to review"
      - Exit gracefully
    </no-changes>

    <no-requirements>
      - Display: "No requirements specified or found"
      - Prompt: "Please provide requirements location:"
      - Allow interactive input or abort
    </no-requirements>

  </error-handling>

  <!-- ---------- 8. OUTPUT FORMAT ---------- -->
  <output-format>
    <structure>
      # Pre-PR Code Review Report
      Generated: [timestamp]
      Files Reviewed: [count]
      Requirements Analyzed: [count]

      ## Critical Issues
      [Issues that must be fixed before PR]

      ## High Priority Issues
      [Important problems that should be addressed]

      ## Medium Priority Issues
      [Quality improvements recommended]

      ## Low Priority Issues
      [Minor suggestions]

      ## Requirements Analysis
      ### ✅ Fully Implemented
      - [Requirement]: [Files implementing it]

      ### ⚠️ Partially Implemented
      - [Requirement]: [What's missing]

      ### ❌ Not Implemented
      - [Requirement]

      ### 🚨 Scope Creep
      - [Feature/change not in requirements]: [Files]

      ## What's Working Well
      [Brief acknowledgment of good implementations]

      ---
      Report saved to: .plan/03_code_review/XX_review.md
    </structure>

    <snippet-format>
      ```language
      // filename.ext:line
      [code snippet - max 5 lines]
      ```
    </snippet-format>

  </output-format>
</instructions>
