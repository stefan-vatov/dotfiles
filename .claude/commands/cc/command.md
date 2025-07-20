# Command-Builder Command

<instructions>
  <context>
    Interactive meta-command that converts a brief idea into a fully-fledged Claude Code
    command spec (pseudo-XML by default).  Leverages a template registry, iterative
    clarification, and multi-agent review to ensure high quality, minimal hallucination
    and consistent flag ergonomics.
  </context>

  <requirements>
    - Accept single-string $ARGUMENTS and optional flags (--fast, --dest, --overwrite).
    - Comprehensive clarification strategy:
      * Minimum 12-15 questions for standard commands
      * 18-25 questions for complex multi-agent commands
      * Fast mode: minimum 6-8 essential questions
      * Track coverage across 15+ command design categories
    - Dynamic question generation based on command complexity and type
    - Multi-level questioning with intelligent follow-ups
    - Show clarification progress: "[Questions: 8/12 | Coverage: 67%]"
    - Suggest output folder by scanning .claude/commands/* sub-dirs.
    - Choose next NN_ prefix; write file as Markdown.
    - Use template from .claude/templates (default pseudo-xml.md).
    - Add reviewer sub-agents (Pattern-Compliance, CLI-UX, Safety) automatically.
    - Self-critique checklist: flag syntax, MoSCoW < 60 % Must, schema validity, no TBDs.
    - Abort with clear error if template registry missing and autogeneration fails.
    - Always ask the clarifying questions one by one, in sequence, after each questions evaluate if and how many other questions are needed.
    - Every generated command must make use of the $ARGUMENTS variable where applicable in order to use the user input appropriately.
    - Allow users to request more questions with /more or skip with /skip
    - Emit concise success summary to stdout.
  </requirements>

  <execution>
    1. <init>
         - Load template_catalogue.json or create default if absent (warn user).
         - Scan .claude/commands for sub-folders.
    2. <clarify>
         - Initialize question categories for command design:
           * Purpose & Goals: What problem does this command solve?
           * Input/Output: What inputs does it accept? What outputs does it produce?
           * Arguments & Flags: Required vs optional parameters, flag behaviors
           * Validation: Input validation rules, error conditions
           * Edge Cases: Boundary conditions, error scenarios
           * Performance: Expected execution time, resource usage
           * Dependencies: External tools, file access, network requirements
           * Security: Permission requirements, sensitive data handling
           * User Experience: Interactive prompts, progress indicators, output format
           * Error Handling: Failure modes, recovery strategies, error messages
           * Integration: How it fits with other commands, pipeline usage
           * Configuration: Settings, environment variables, config files
           * Testing: Test scenarios, validation criteria
           * Documentation: Usage examples, help text requirements
           * Workflow: Multi-step processes, sub-agent coordination
         - Ask questions sequentially, tracking coverage
         - Generate follow-up questions based on responses:
           * If multi-step: ask about each step's details
           * If file manipulation: ask about validation and safety
           * If external integration: ask about failure handling
         - Show progress after every 3 questions
         - Continue until minimum coverage achieved
    3. <draft>
         - Fill template placeholders (name, flags, workflow, examples).
    4. <self-critique>
         - Run comprehensive internal checklist:
           * Minimum questions asked (12 normal, 6 fast)?
           * All critical categories covered?
           * Command purpose clearly understood?
           * Input/output specifications complete?
           * Error handling comprehensive?
           * Edge cases identified and addressed?
         - Revise draft based on gaps found
    5. <review>
         - Spawn sub-agents:
             * Pattern-Compliance Reviewer
             * CLI-UX Reviewer
             * Safety Reviewer
         - Merge feedback, update spec.
    6. <validate>
         - Apply JSON schema guard; fail fast on errors.
    7. <write>
         - Write `.claude/commands/NN_<slug>.md` (or --dest) using Markdown format.
    8. <report>
         - Echo file path, rounds used, any open TODOs.
  </execution>

  <validation>
    - [ ] Minimum 12 clarification questions asked (6 in fast mode).
    - [ ] Coverage across all 15+ command design categories.
    - [ ] Critical categories have 2-3 clarifications each.
    - [ ] Follow-up questions generated for complex features.
    - [ ] Command purpose and workflow clearly defined.
    - [ ] Flags conform to POSIX long-option syntax.
    - [ ] MoSCoW ≤ 60 % Must.
    - [ ] Template placeholders fully resolved.
    - [ ] $ARGUMENTS variable properly utilized.
    - [ ] Error scenarios comprehensively covered.
    - [ ] Reviewer agents signed off.
    - [ ] JSON schema passes.
  </validation>

  <examples>
    ```bash
    # Full interactive flow
    /claude:gen-command "Add a /utils:count-lines command that counts lines in files"

    # Fast mode (minimum 6-8 questions), custom destination
    /claude:gen-command --fast --dest=.claude/commands/utils "Quick grep wrapper"
    ```

  </examples>

  <!-- ---------- 6. QUESTION TEMPLATES & ADAPTIVE LOGIC ---------- -->
  <question-templates>
    <initial-questions>
      <!-- Foundation questions - always ask these first -->
      1. "What specific problem or task will this command solve?"
      2. "What inputs/arguments will the command accept?"
      3. "What should the command output or produce?"
      4. "Are there any existing similar commands this should integrate with?"
      5. "What are the main steps the command needs to perform?"
    </initial-questions>

    <complexity-based-questions>
      <simple-command>
        - "What validation is needed for the inputs?"
        - "What error messages should be shown to users?"
        - "Should this command support a --dry-run mode?"
      </simple-command>

      <multi-step-command>
        - "What are the individual steps in order?"
        - "Can any steps run in parallel?"
        - "What happens if a step fails - continue or abort?"
        - "Should there be progress indicators?"
      </multi-step-command>

      <file-manipulation-command>
        - "What file types/extensions are allowed?"
        - "How should the command handle existing files?"
        - "What are the size limits or constraints?"
        - "Should backups be created before modifications?"
      </file-manipulation-command>

      <integration-command>
        - "Which external tools/APIs does this interact with?"
        - "How should connection failures be handled?"
        - "Are there rate limits or quotas to consider?"
        - "What authentication/credentials are needed?"
      </integration-command>
    </complexity-based-questions>

    <follow-up-patterns>
      <if-mentions keywords="analyze, scan, search">
        - "What specific patterns or criteria to look for?"
        - "How deep should the analysis go (files, directories, recursion)?"
        - "What format should the analysis results be in?"
      </if-mentions>

      <if-mentions keywords="generate, create, build">
        - "What templates or patterns should be used?"
        - "How should naming conflicts be resolved?"
        - "Should the command be idempotent?"
      </if-mentions>

      <if-mentions keywords="config, settings, options">
        - "Where should configuration be stored?"
        - "What are the default values?"
        - "Can users override settings with flags?"
      </if-mentions>
    </follow-up-patterns>

    <edge-case-probing>
      - "What should happen with invalid or malformed input?"
      - "How should the command behave with no arguments?"
      - "What are the performance considerations for large inputs?"
      - "Should there be confirmation prompts for destructive actions?"
    </edge-case-probing>

  </question-templates>

  <!-- ---------- 7. COVERAGE TRACKING ---------- -->
  <coverage-tracking>
    Categories tracked:
    1. Purpose & Goals (weight: 2.0)
    2. Input/Output specs (weight: 2.0)
    3. Arguments & Flags (weight: 1.5)
    4. Validation rules (weight: 1.5)
    5. Error handling (weight: 2.0)
    6. Edge cases (weight: 1.5)
    7. Performance (weight: 1.0)
    8. Dependencies (weight: 1.0)
    9. Security (weight: 2.0)
    10. User Experience (weight: 1.5)
    11. Integration (weight: 1.0)
    12. Configuration (weight: 1.0)
    13. Testing approach (weight: 1.0)
    14. Documentation (weight: 1.0)
    15. Workflow/Sub-agents (weight: 1.5)

    Progress display:
    - Show after every 3 questions: "[Progress: 45% | Questions: 6/12 | Critical: 3/5]"
    - Highlight uncovered critical areas
    - Allow /status to see detailed category coverage

  </coverage-tracking>
</instructions>
