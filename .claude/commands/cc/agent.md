# Agent-Builder Command

<instructions>
  <context>
    Interactive meta-command that transforms a brief agent concept into a production-ready
    Claude Code agent specification with YAML frontmatter and comprehensive instructions.
    Leverages systematic clarification, template-based generation, and multi-agent review
    to ensure agents are effective, well-bounded, and aligned with best practices.
  </context>

  <requirements>
    - Accept single-string $ARGUMENTS describing the agent concept
    - Support flags: --fast (minimal questions), --dest (output location), --type (workflow/autonomous)
    - Comprehensive clarification strategy:
      * Minimum 15-20 questions for standard agents
      * 25-30 questions for complex multi-tool agents
      * Fast mode: minimum 8-10 essential questions
      * Track coverage across 18+ agent design categories
    - Dynamic question generation based on agent complexity and domain
    - Multi-level questioning with intelligent follow-ups
    - Show clarification progress: "[Questions: 12/20 | Coverage: 72%]"
    - Suggest output folder by scanning .claude/commands/* for agent directories
    - write file as Markdown with YAML frontmatter
    - Add reviewer sub-agents (Tool-Selection, Boundary-Definition, Instruction-Clarity)
    - Self-critique checklist: YAML validity, tool appropriateness, clear boundaries
    - Always ask clarifying questions sequentially, evaluating need for follow-ups
    - Every agent must have clear trigger conditions in description
    - Emit concise success summary with agent capabilities overview
    - Save the agent under `.claude/agents`
    - Make the final file use the templates/pseudo-xml style! Except for the YAML frontmatter
  </requirements>

  <execution>
    1. <init>
         - Scan .claude/commands for existing agents and patterns
         - Determine agent type from initial description
    2. <clarify>
         - Initialize question categories for agent design:
           * Core Purpose: What specific problem domain does this agent address?
           * Trigger Conditions: When should Claude use this agent?
           * Capabilities: What tasks can the agent perform?
           * Boundaries: What must the agent NOT do?
           * Tools Required: Which tools does the agent need?
           * Interaction Style: How should the agent communicate?
           * Domain Expertise: What knowledge areas are crucial?
           * Decision Making: How autonomous should the agent be?
           * Error Recovery: How should the agent handle failures?
           * Quality Metrics: How is success measured?
           * User Guidance: What information does the agent need from users?
           * Workflow Patterns: Sequential steps vs dynamic decisions?
           * Output Format: What should the agent produce?
           * Edge Cases: Unusual scenarios to handle?
           * Integration: How does it work with other agents?
           * Performance: Expected complexity and runtime?
           * Safety: Risk assessment and mitigation?
           * Examples: Concrete usage scenarios?
         - Ask questions sequentially, tracking coverage
         - Generate follow-up questions based on responses:
           * If multi-tool: ask about tool coordination
           * If autonomous: ask about decision boundaries
           * If specialized: ask about domain-specific needs
         - Show progress after every 3 questions
         - Continue until minimum coverage achieved
    3. <draft>
         - Generate YAML frontmatter (name, description with examples, tools, color)
         - Create comprehensive agent instructions
         - Include concrete behavioral examples
    4. <self-critique>
         - Run comprehensive internal checklist:
           * Minimum questions asked (15 normal, 8 fast)?
           * All critical categories covered?
           * Agent purpose crystal clear?
           * Trigger conditions well-defined?
           * Boundaries explicitly stated?
           * Tool selection appropriate?
           * Instructions actionable and specific?
         - Revise draft based on gaps found
    5. <review>
         - Spawn sub-agents:
             * Tool-Selection Reviewer (are tools necessary and sufficient?)
             * Boundary-Definition Reviewer (are limits clear?)
             * Instruction-Clarity Reviewer (can another LLM follow these?)
         - Merge feedback, update specification
    6. <validate>
         - Verify YAML syntax and required fields
         - Check description includes trigger examples
         - Ensure instructions follow best practices
    7. <write>
         - Write `.claude/agents/<agent-name>.md` (or --dest)
         - Format: YAML frontmatter + markdown instructions
    8. <report>
         - Echo file path, agent capabilities summary
         - List tools selected and key boundaries
  </execution>

  <validation>
    - [ ] Minimum 15 clarification questions asked (8 in fast mode)
    - [ ] Coverage across all 18+ agent design categories
    - [ ] Critical categories have 3-4 clarifications each
    - [ ] Follow-up questions generated for complex features
    - [ ] Agent purpose and triggers clearly defined
    - [ ] Tool selection justified and minimal
    - [ ] Boundaries and limitations explicit
    - [ ] Instructions include DO and DON'T sections
    - [ ] Description includes 3+ example scenarios
    - [ ] YAML frontmatter valid and complete
    - [ ] Reviewer agents approved
    - [ ] No placeholder text or TODOs remain
  </validation>

  <examples>
    ```bash
    # Full interactive flow for code refactoring agent
    /agent:builder "Create an agent that helps improve code quality and structure"

    # Fast mode for security analysis agent
    /agent:builder --fast --type=workflow "Security vulnerability scanner"

    # Custom destination for documentation agent
    /agent:builder --dest=.claude/commands/docs "Technical documentation generator"
    ```

  </examples>

  <!-- ---------- 6. QUESTION TEMPLATES & ADAPTIVE LOGIC ---------- -->
  <question-templates>
    <initial-questions>
      <!-- Foundation questions - always ask these first -->
      1. "What specific problem or task will this agent solve?"
      2. "What triggers should cause Claude to use this agent?"
      3. "What are the key capabilities this agent needs?"
      4. "What should this agent explicitly NOT do?"
      5. "What's the expected input from users?"
    </initial-questions>

    <domain-specific-questions>
      <code-related-agent>
        - "What programming languages/frameworks should it handle?"
        - "Should it modify existing code or only analyze?"
        - "How should it handle different coding styles?"
        - "What level of changes can it make autonomously?"
      </code-related-agent>

      <analysis-agent>
        - "What types of analysis should it perform?"
        - "What data sources does it need to examine?"
        - "How detailed should the analysis be?"
        - "What format should findings be presented in?"
      </analysis-agent>

      <creative-agent>
        - "What constraints guide the creative process?"
        - "How should it balance creativity with requirements?"
        - "Should it provide multiple alternatives?"
        - "How does it incorporate feedback?"
      </creative-agent>

      <workflow-agent>
        - "What are the sequential steps involved?"
        - "Are there decision points between steps?"
        - "Can steps be parallelized?"
        - "How are step failures handled?"
      </workflow-agent>
    </domain-specific-questions>

    <tool-selection-questions>
      - "Does this agent need to read files? (Read tool)"
      - "Will it edit existing files? (Edit/MultiEdit tools)"
      - "Does it create new files? (Write tool)"
      - "Does it search codebases? (Grep/Glob tools)"
      - "Does it need filesystem navigation? (LS tool)"
      - "Will it execute commands? (Bash tool)"
      - "Does it need web access? (WebFetch/WebSearch tools)"
    </tool-selection-questions>

    <boundary-definition>
      - "What types of requests should it refuse?"
      - "Are there security/safety constraints?"
      - "What's outside this agent's expertise?"
      - "When should it defer to other agents?"
    </boundary-definition>

    <interaction-style>
      - "How technical should explanations be?"
      - "Should it ask for clarification or make assumptions?"
      - "How should it handle ambiguous requests?"
      - "What's the preferred communication tone?"
    </interaction-style>

    <quality-assurance>
      - "How can users verify the agent's work?"
      - "What constitutes success for this agent?"
      - "Should it provide confidence levels?"
      - "How does it handle partial success?"
    </quality-assurance>

  </question-templates>

  <!-- ---------- 7. COVERAGE TRACKING ---------- -->
  <coverage-tracking>
    Categories tracked:
    1. Core Purpose (weight: 2.5)
    2. Trigger Conditions (weight: 2.5)
    3. Capabilities (weight: 2.0)
    4. Boundaries (weight: 2.5)
    5. Tool Selection (weight: 2.0)
    6. Interaction Style (weight: 1.5)
    7. Domain Expertise (weight: 1.5)
    8. Decision Autonomy (weight: 2.0)
    9. Error Handling (weight: 2.0)
    10. Quality Metrics (weight: 1.5)
    11. User Guidance (weight: 1.5)
    12. Workflow Design (weight: 1.5)
    13. Output Format (weight: 1.0)
    14. Edge Cases (weight: 1.5)
    15. Integration (weight: 1.0)
    16. Performance (weight: 1.0)
    17. Safety (weight: 2.5)
    18. Examples (weight: 2.0)

    Progress display:
    - Show after every 3 questions: "[Progress: 55% | Questions: 11/20 | Critical: 5/7]"
    - Highlight uncovered critical areas
    - Allow /status to see detailed category coverage
    - Critical categories: Purpose, Triggers, Boundaries, Tools, Safety

  </coverage-tracking>

  <!-- ---------- 8. AGENT TEMPLATE STRUCTURE ---------- -->
  <agent-template>
    ```yaml
    ---
    name: {agent-name}
    description: {one-line-summary} Examples:\n\n{3-5 detailed example scenarios}
    tools: {comma-separated tool list}
    color: {blue|green|yellow|red|purple}
    ---

    <instructions>
      <context>
        You are a {role/expertise description}. Your mission is to {primary objective}.
      </context>

      <trigger-conditions>
        {When this agent should be activated - list specific keywords, phrases, or situations}
      </trigger-conditions>

      <workflow>
        <step name="{step-identifier}">
          <description>{What this step accomplishes}</description>
          <actions>
            - {Specific action to take}
            - {Another action}
            - {Continue as needed}
          </actions>
          <validation>
            - {How to verify this step succeeded}
            - {What to check}
          </validation>
        </step>

        <step name="{next-step}">
          <description>{Purpose of this step}</description>
          <implementation>
            - {Detailed implementation notes}
            - {Tool usage guidance}
          </implementation>
          <error-handling>
            - {How to handle common errors}
            - {Fallback strategies}
          </error-handling>
        </step>

        {Additional steps as needed}
      </workflow>

      <best-practices>
        - {Specific guideline for quality}
        - {Efficiency recommendation}
        - {User interaction guidance}
        - {Tool usage best practice}
        - {Error prevention strategy}
      </best-practices>

      <boundaries>
        - NEVER {explicit limitation}
        - NEVER {security constraint}
        - NEVER {scope restriction}
        - NEVER {ethical boundary}
        - NEVER {tool misuse case}
      </boundaries>

      <quality-metrics>
        - {How to measure success}
        - {Key performance indicators}
        - {User satisfaction criteria}
      </quality-metrics>

      <error-conditions>
        <stop-conditions>
          - {When to refuse or stop}
          - {Invalid input scenarios}
        </stop-conditions>
        <recovery-strategies>
          - {How to recover from errors}
          - {User communication for issues}
        </recovery-strategies>
      </error-conditions>

      {Additional sections like success-response, special-rules, etc. as needed}
    </instructions>
    ```

  </agent-template>
</instructions>
