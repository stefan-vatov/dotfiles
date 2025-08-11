# Feature-Refine Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Multi-agent orchestration command that runs a sequential workflow to refine feature plans
    before implementation. Coordinates four specialized agents (feature-architect, research-notes,
    action-planner, scope-guardian) to ensure comprehensive feature planning and scoping.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Must extract feature plan folder path from $ARGUMENTS text (no strict flag format required).
    - Must validate folder exists and contains at least one file with "Requirements" in the name.
    - Must run agents in strict sequence: feature-architect → research-notes → action-planner → scope-guardian.
    - Must wait for each agent to complete before starting the next (no timeouts).
    - Must pass through all user prompts/interactions directly to allow agent-user dialogue.
    - Must provide progress indicators between agent transitions.
    - Must handle agent failures by offering user choice to continue or abort workflow.
    - Must handle graceful cancellation (Ctrl+C) with appropriate messaging.
    - Should run all agents regardless of previous executions (no skipping).
    - Should not perform dependency checks or prerequisites validation.
    - Should not log execution history or agent outputs.
    - Must abort with clear error if folder doesn't exist or lacks Requirements file.
    - Must emit concise success summary upon workflow completion.
  </requirements>

  <best-tools>
    Use Repo Prompt and sequential thinking liberally and at will every time when applicable.
  </best-tools>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <init>
         - Parse $ARGUMENTS to extract folder path (flexible format).
         - Validate folder exists using filesystem check.
         - Verify folder contains file with "Requirements" in filename.
         - Display workflow start message with folder path.
    2. <orchestrate>
         - For each agent in sequence [feature-architect, research-notes, action-planner, scope-guardian]:
           a. Display progress: "Starting {agent-name}..."
           b. Invoke agent with folder path context
           c. Pass through all prompts/outputs directly
           d. Wait for agent completion (no timeout)
           e. On agent failure:
              - Display error message
              - Prompt user: "Agent failed. Continue workflow? (y/n)"
              - Abort if user chooses 'n'
           f. Display completion: "{agent-name} completed successfully"
    3. <handle-cancellation>
         - On SIGINT (Ctrl+C):
           - Display: "Workflow cancelled by user"
           - Clean exit with appropriate status code
    4. <complete>
         - Display success message: "Feature refinement workflow completed"
         - Exit with success status
  </execution>

  <!-- ---------- 4. VALIDATION CHECKLIST ---------- -->
  <validation>
    - [ ] Folder path extracted from $ARGUMENTS successfully.
    - [ ] Folder exists and contains Requirements file.
    - [ ] Agents execute in correct sequence.
    - [ ] User interactions passed through transparently.
    - [ ] Progress indicators displayed between agents.
    - [ ] Failure handling provides user choice.
    - [ ] Graceful cancellation implemented.
    - [ ] No timeouts interrupt agent execution.
    - [ ] Success summary displayed on completion.
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Standard invocation with feature folder
    /feature-refine "Please refine the feature in .plan/features/user-auth"

    # With relative path
    /feature-refine "Run refinement on ./features/payment-integration"

    # With absolute path
    /feature-refine "Process /home/user/project/.plan/features/api-v2"
    ```

  </examples>

  <!-- ---------- 6. ERROR HANDLING ---------- -->
  <error-handling>
    <folder-not-found>
      Error: Feature folder not found: {path}
      Please ensure the folder exists and try again.
    </folder-not-found>

    <missing-requirements>
      Error: No Requirements file found in {path}
      Feature folders must contain a file with "Requirements" in the name.
    </missing-requirements>

    <agent-failure>
      Error: {agent-name} encountered an error
      {error-details}

      Continue with remaining agents? (y/n):
    </agent-failure>

    <user-cancellation>
      Workflow cancelled by user.
      Partial progress may have been saved by individual agents.
    </user-cancellation>

  </error-handling>

  <!-- ---------- 7. AGENT SEQUENCE ---------- -->
  <agent-sequence>
    1. **feature-architect**: Analyzes requirements and creates technical architecture
    2. **research-notes**: Searches codebase for reusable patterns and conventions
    3. **action-planner**: Creates detailed implementation plan with task breakdown
    4. **scope-guardian**: Reviews and validates scope to prevent feature creep
  </agent-sequence>
</instructions>
