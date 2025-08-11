# Debug Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    General-purpose debugging command that applies first-principles debugging methodology
    to identify and resolve any type of software issue. Uses evidence-based analysis,
    systematic hypothesis testing, and comprehensive code investigation to determine
    root causes and provide actionable fix recommendations. Auto-adapts to different
    languages, frameworks, and problem types while maintaining a reproducibility-first
    approach.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Accept flexible input via $ARGUMENTS (error messages, file paths, problem descriptions,
      stack traces, test names, or any combination)
    - Auto-detect project context from:
      * Language and framework from file extensions and config files
      * Available tools (linters, type checkers, test runners)
      * Repository structure and conventions
      * .claude/repo-context.md and .claude/glossary.md if present
    - Core debugging principles:
      * Reproducibility over speculation - never fix what cannot be reproduced
      * Single hypothesis, single test - maintain tight formulate→test→observe loop
      * Evidence hierarchy - prioritize artifacts closest to fault
      * Fail fast, log smart - collect high-value debug logs without bloat
      * Guardrails first - use static analysis as front-line defense
    - Systematic investigation approach:
      * Minimum 3 hypotheses tested before concluding
      * Prioritize hypotheses by likelihood and common patterns
      * Full call graph analysis from error point
      * Temporary debug instrumentation (cleaned up after)
      * Progressive escalation: local → related files → commits → dependency graph
    - Output requirements:
      * Detailed analysis report with executive summary
      * Root cause identification with confidence level
      * Multiple fix options ranked by simplicity and long-term impact
      * Step-by-step analysis log
      * List of tested hypotheses (successful and failed)
      * Code snippets highlighting problematic areas
    - Progress communication:
      * Periodic summaries of findings
      * Progress indicators at major milestones
      * Silent during routine operations
    - Safety requirements:
      * Never auto-commit changes
      * Clean up all temporary modifications
      * Ask before running profiling tools or generating flame graphs
      * Ask user about test creation and test execution
    - Support for:
      * All programming languages (auto-detected)
      * Polyglot codebases and monorepos
      * Performance issues (with complexity analysis)
      * All log levels (ERROR, WARN, INFO, DEBUG)
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <init>
         - Parse $ARGUMENTS to understand the problem type
         - Detect language, framework, and project structure
         - Load context from .claude/repo-context.md and .claude/glossary.md if available
         - Identify available tools (linters, analyzers, test runners)
         - Show: "[Initializing debug session... Language: {lang}, Framework: {framework}]"

    2. <collect-artifacts>
         - Gather all relevant error artifacts:
           * Stack traces and error messages
           * Test failures and assertions
           * Recent commits (if git status is clean)
           * Configuration files
           * Log files (parse all levels)
         - Index codebase for semantic search capability
         - Build initial scope of investigation
         - Show: "[Progress: 10% | Collecting error context...]"

    3. <reproduce-deterministically>
         - Create minimal reproduction case:
           * Extract failing test or create new one
           * Isolate problem to smallest code unit
           * Verify consistent failure across runs
           * Document environment and dependencies
         - If cannot reproduce:
           * Expand artifact collection
           * Add strategic logging points
           * Request additional context from user
         - Show: "[Progress: 25% | Creating minimal reproduction...]"

    4. <static-reconnaissance>
         - Run all detected static analysis tools:
           * Language-specific linters
           * Type checkers
           * Security analyzers
           * Code complexity analyzers
         - Focus on modules near the error
         - Identify code smells and anti-patterns
         - Show: "[Progress: 40% | Running static analysis...]"

    5. <dynamic-instrumentation>
         - Add temporary debug logging:
           * Strategic points in call path
           * Variable state at key locations
           * Performance timing if needed
         - For performance issues:
           * Analyze algorithmic complexity
           * Check for common anti-patterns
           * Ask before using profiling tools
         - Track all modifications for cleanup
         - Show: "[Progress: 55% | Instrumenting code...]"

    6. <hypothesis-loop>
         - Generate initial hypotheses based on:
           * Error patterns and symptoms
           * Static analysis findings
           * Common bugs for the detected stack
           * Evidence hierarchy (closest to fault first)
         - For each hypothesis (minimum 3):
           * Form specific, falsifiable prediction
           * Design targeted test
           * Execute and observe
           * Document result
           * If contradicted, discard immediately
         - Show periodic summaries:
           "[Testing hypothesis 1/3: Null pointer in cache layer...]"
           "[Result: Hypothesis rejected - cache properly initialized]"
         - Continue until root cause identified or hypotheses exhausted

    7. <deep-analysis>
         - If initial hypotheses fail:
           * Analyze full call graph from error point
           * Examine all related/importing files
           * Check recent commits (if appropriate)
           * Build dependency graph if needed
         - Use progressive deepening:
           * Local scope → Module scope → Package scope → System scope
         - Show: "[Progress: 70% | Performing deep code analysis...]"

    8. <root-cause-synthesis>
         - Synthesize findings into root cause:
           * Correlate all evidence
           * Identify causal chain
           * Assess confidence level (high/medium/low)
           * Document supporting evidence
         - For complex issues:
           * Identify contributing factors
           * Distinguish root cause from symptoms
         - Show: "[Progress: 85% | Identifying root cause...]"

    9. <generate-fixes>
         - Develop fix recommendations:
           * Multiple approaches when possible
           * Rank by simplicity and long-term impact
           * Include code snippets
           * Consider edge cases
           * Suggest regression tests
         - Categories:
           * Quick fix (minimal change)
           * Proper fix (addresses root cause)
           * Refactor (prevents recurrence)
         - Show: "[Progress: 95% | Generating fix recommendations...]"

    10. <cleanup>
          - Remove all temporary modifications:
            * Debug log statements
            * Test instrumentation
            * Temporary files
          - Verify codebase returned to original state
          - Show: "[Progress: 100% | Cleaning up...]"

    11. <report>
          - Generate comprehensive report:
            ```
            ## Debug Analysis Report

            ### Executive Summary
            - Problem: {description}
            - Root Cause: {cause}
            - Confidence: {high|medium|low}
            - Impact: {scope}

            ### Detailed Analysis
            {step-by-step investigation log}

            ### Hypotheses Tested
            ✓ Hypothesis 1: {description} - {result}
            ✗ Hypothesis 2: {description} - {result}
            ✓ Hypothesis 3: {description} - {result}

            ### Root Cause Analysis
            {detailed explanation with code snippets}

            ### Recommended Fixes
            1. Quick Fix (Simplicity: ⭐⭐⭐⭐⭐)
               {code snippet}
               {explanation}

            2. Proper Fix (Long-term: ⭐⭐⭐⭐⭐)
               {code snippet}
               {explanation}

            3. Alternative Approach
               {code snippet}
               {explanation}

            ### Next Steps
            - {actionable recommendations}
            - {test suggestions}
            - {monitoring advice}
            ```
  </execution>

  <!-- ---------- 4. VALIDATION CHECKLIST ---------- -->
  <validation>
    - [ ] Problem successfully reproduced deterministically
    - [ ] All available static analysis tools executed
    - [ ] Minimum 3 hypotheses formulated and tested
    - [ ] Full call graph analyzed from error point
    - [ ] Root cause identified with evidence
    - [ ] Multiple fix options provided and ranked
    - [ ] All temporary changes cleaned up
    - [ ] Confidence level assessed and justified
    - [ ] Report includes all required sections
    - [ ] Code snippets properly highlighted
    - [ ] Performance anti-patterns checked (if applicable)
    - [ ] Language-specific debugging applied correctly
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Debug a test failure
    /code:dev:debug "Test 'user_authentication' failing with TypeError"

    # Debug with stack trace
    /code:dev:debug "Getting NullPointerException in UserService.java:45"

    # Debug performance issue
    /code:dev:debug "API endpoint /users/search taking 5+ seconds"

    # Debug with error message
    /code:dev:debug "Error: Cannot read property 'length' of undefined"

    # Debug integration issue
    /code:dev:debug "Redis connection timing out in production only"

    # Debug with general description
    /code:dev:debug "Users report data not saving correctly"
    ```
  </examples>

  <!-- ---------- 6. HYPOTHESIS GENERATION PATTERNS ---------- -->
  <hypothesis-patterns>
    <error-type-patterns>
      <null-undefined>
        - "Variable not initialized before use"
        - "Async operation returning before completion"
        - "Optional chaining needed"
        - "Default value missing"
      </null-undefined>

      <type-errors>
        - "Type mismatch in function arguments"
        - "Implicit type conversion issue"
        - "Generic type inference failure"
        - "Interface implementation incomplete"
      </type-errors>

      <performance>
        - "N+1 query problem"
        - "Missing database index"
        - "Inefficient algorithm (O(n²) or worse)"
        - "Memory leak or excessive allocation"
        - "Synchronous blocking operations"
      </performance>

      <concurrency>
        - "Race condition in shared state"
        - "Deadlock between resources"
        - "Missing synchronization"
        - "Incorrect lock ordering"
      </concurrency>

      <integration>
        - "API contract mismatch"
        - "Network timeout too short"
        - "Retry logic missing or incorrect"
        - "Authentication/authorization failure"
      </integration>
    </error-type-patterns>

    <prioritization>
      Score hypotheses by:
      1. Proximity to error location (closer = higher priority)
      2. Frequency in codebase's language/framework
      3. Matches with static analysis warnings
      4. Simplicity of test (faster to verify = higher priority)
      5. Recent code changes in area
    </prioritization>
  </hypothesis-patterns>

  <!-- ---------- 7. LANGUAGE-SPECIFIC STRATEGIES ---------- -->
  <language-strategies>
    <javascript-typescript>
      - Check for undefined/null before property access
      - Verify Promise handling and async/await usage
      - Look for this binding issues
      - Check for event listener memory leaks
    </javascript-typescript>

    <python>
      - Verify indentation consistency
      - Check for mutable default arguments
      - Look for circular imports
      - Verify exception handling completeness
    </python>

    <java>
      - Check for null pointer possibilities
      - Verify resource closure (try-with-resources)
      - Look for thread safety issues
      - Check exception propagation
    </java>

    <go>
      - Check for nil pointer dereferences
      - Verify goroutine synchronization
      - Look for channel deadlocks
      - Check error handling completeness
    </go>

    <rust>
      - Verify lifetime annotations
      - Check for move/borrow conflicts
      - Look for unsafe block issues
      - Verify trait implementations
    </rust>
  </language-strategies>
</instructions>
