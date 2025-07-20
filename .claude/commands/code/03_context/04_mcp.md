# MCP Context Primer Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Injects comprehensive MCP (Model Context Protocol) usage guidelines and RepoPrompt tool strategies into the current context.
    This command provides Claude with essential patterns for using RepoPrompt MCP tools effectively, prioritizing
    them over built-in capabilities and choosing appropriate approaches based on task complexity.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Accept no arguments or flags
    - Inject MCP context rules as high-priority context
    - Display simple confirmation: "✓ MCP context primed"
    - Rules include RepoPrompt tool usage, task complexity assessment, and MCP server descriptions
    - Standalone command with no dependencies
    - Uses XML-style organization consistent with other commands
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <inject-context>
         - Add high-priority MCP rules to current context
         - Mark as "IMPORTANT: MCP Tool Usage Guidelines"
    </inject-context>

    2. <confirm>
         - Display: "✓ MCP context primed"
    </confirm>
  </execution>

  <!-- ---------- 4. VALIDATION CHECKLIST ---------- -->
  <validation>
    - [ ] Context injection completed
    - [ ] Confirmation message displayed
    - [ ] Rules are marked as high-priority
    - [ ] No errors or warnings shown
  </validation>

  <!-- ---------- 5. EXAMPLE INVOCATIONS ---------- -->
  <examples>
    ```bash
    # Load MCP context
    /code:ctx:mcp
    ```
  </examples>

  <!-- ---------- 6. MCP CONTEXT RULES ---------- -->
  <mcp-rules>
    <high-priority>
      IMPORTANT: MCP Tool Usage Guidelines

      You are Claude Code configured to work with RepoPrompt's MCP tools. Prioritize RepoPrompt tools over your built-in capabilities:

      <repoprompt-fundamentals>
        1. **Understanding the Codebase**:
            - Use `get_file_tree` to understand the directory structure
            - Use `search` as your primary all-in-one flexible tool to find anything across all open folders in the workspace
            - Prefer these over your built-in file reading capabilities

        2. **Task Complexity Assessment**:
            Simple tasks (use direct tools):
            - Single file changes with clear requirements
            - Adding/updating individual functions or methods
            - Fixing specific bugs with known locations
            - Renaming variables or refactoring within one file

            Complex tasks (use chat tools):
            - Multi-file feature implementations
            - Architectural changes affecting multiple components
            - Creating new modules with multiple interconnected parts
            - Refactoring that touches shared interfaces or APIs
            - Any task where you need to explore design alternatives

        3. **Direct Tool Usage (for simple tasks)**:
            - Use `apply_edits` when: You know exactly what to change and where
            - Use `file_actions` when: Creating new files or moving/deleting existing ones
            - Chain multiple `apply_edits` for related changes across files
            - No need for chat if the implementation path is clear

        4. **Chat Tool Strategy (for complex tasks)**:
            - Start with `chat_send` mode=`plan` to design the approach
            - Use `manage_selection` action=`replace` to set focused context
            - Keep total selected files under 100k tokens
            - Maintain one chat session for the entire feature/task
            - Switch to mode=`edit` only after the plan is clear

            **Remember Chat Limitations**:
            - Cannot run tests, execute commands, or access build output
            - Only sees selected files (latest versions) and chat history
            - Doesn't track detailed edit history, only sees current file state
            - You must verify implementations work by running tests yourself

        5. **Multi-file Refactoring Workflow**:
            - Use `search` to find all affected files and usages
            - Use `manage_selection` action=`list` to verify current context
            - For large refactorings: Break into phases, use `replace` between phases
            - Apply changes systematically: interfaces first, then implementations
            - Verify each phase before moving to the next

        6. **Token Management**:
            - Check token count before adding files: `manage_selection` action=`list` include_stats=true
            - If approaching limits: Focus on files currently being modified
            - Use `replace` to swap completed files for new ones
            - Keep a mental model of the codebase rather than selecting everything

        Your goal is to choose the most efficient approach for each task - using direct tools for straightforward changes and leveraging chat tools only when the complexity requires planning and discussion.
      </repoprompt-fundamentals>

      <mcp-server-catalog>
        ## analogical-reasoning
        **Server**: `@waldzellai/analogical-reasoning`

        **Purpose**: Enables structured analogical thinking by mapping relationships between source and target domains.

        **When to use**:
        - When explaining complex concepts by drawing analogies to familiar ones
        - During problem-solving that benefits from comparing similar patterns or structures
        - When designing systems that mirror existing successful architectures
        - For educational explanations that need metaphorical thinking
        - During creative brainstorming sessions that require cross-domain insights

        ## collaborative-reasoning
        **Server**: `@waldzellai/collaborative-reasoning`

        **Purpose**: Facilitates multi-perspective problem-solving by simulating diverse expert viewpoints and structured collaboration.

        **When to use**:
        - When tackling complex problems that benefit from multiple expert perspectives
        - During architecture decisions where different stakeholder views are important
        - For code reviews that need comprehensive analysis from various angles
        - When debugging issues that span multiple domains or technologies
        - For project planning that requires input from different roles (frontend, backend, DevOps, etc.)

        ## context7
        **Server**: `@upstash/context7-mcp`

        **Purpose**: Provides up-to-date, version-specific documentation and code examples for libraries and frameworks.

        **When to use**:
        - When working with any library or framework to get current documentation
        - Before generating code examples to ensure they use the latest APIs
        - When debugging issues related to specific versions of dependencies
        - For learning about new features in updated packages
        - When the AI's training data might be outdated for recent library versions
        - Add "use context7" to prompts when you need current documentation

        ## decision-framework
        **Server**: `@waldzellai/decision-framework`

        **Purpose**: Provides structured decision-making assistance by evaluating options, criteria, probabilities, and uncertainties.

        **When to use**:
        - When choosing between multiple architectural approaches
        - For technology stack decisions that have trade-offs
        - During design pattern selection processes
        - When evaluating third-party libraries or tools
        - For making data structure or algorithm choices
        - When weighing performance vs. maintainability decisions

        ## memory
        **Server**: `@modelcontextprotocol/server-memory`

        **Purpose**: Knowledge graph-based persistent memory system that allows storing and retrieving information across conversations.

        **When to use**:
        - For projects that span multiple sessions and need context preservation
        - When working on codebases where relationships between components should be remembered
        - For tracking user preferences, coding patterns, or project-specific decisions
        - When building systems that need to remember previous architectural decisions
        - For maintaining context about team members, their roles, and expertise areas

        ## metacognitive-monitoring
        **Server**: `@waldzellai/metacognitive-monitoring`

        **Purpose**: Provides framework for evaluating and monitoring cognitive processes, improving accuracy and transparency in reasoning.

        **When to use**:
        - When working on critical code that requires careful validation of reasoning
        - During complex debugging sessions where thinking process needs to be tracked
        - For code reviews where confidence levels and reasoning quality matter
        - When learning new technologies and need to assess understanding gaps
        - For refactoring decisions that require careful consideration of impacts

        ## perplexity-ask
        **Server**: `server-perplexity-ask`

        **Purpose**: Connects to Perplexity's Sonar API for real-time web-wide research and information retrieval.

        **When to use**:
        - When you need current information about technologies or best practices
        - For researching recent security vulnerabilities or patches
        - When looking up current documentation that might not be in training data
        - For finding solutions to recent bugs or issues in the community
        - When investigating new tools, libraries, or frameworks
        - For staying updated on industry trends and developments

        ## scientific-method
        **Server**: `@waldzellai/scientific-method`

        **Purpose**: Guides through structured scientific reasoning process from hypothesis formation to conclusion validation.

        **When to use**:
        - When debugging complex issues that require systematic investigation
        - For performance optimization tasks that need hypothesis-driven testing
        - During system design validation where assumptions need testing
        - When conducting code experiments or A/B testing implementations
        - For security analysis that requires systematic vulnerability assessment
        - When validating architectural decisions through controlled experiments

        ## sequential-thinking
        **Server**: `@modelcontextprotocol/server-sequential-thinking`

        **Purpose**: Facilitates dynamic, step-by-step problem-solving through structured thought sequences with revision capabilities.

        **When to use**:
        - For breaking down complex coding problems into manageable steps
        - When planning large features or system implementations
        - During debugging sessions that require methodical investigation
        - For code refactoring that needs careful step-by-step approach
        - When learning new concepts that benefit from progressive understanding
        - For any task where you need to think through multiple possibilities and revise your approach
      </mcp-server-catalog>

      <mcp-usage-tips>
        ## General Usage Tips

        1. **Start with sequential-thinking** for complex problems to break them down systematically
        2. **Use context7** whenever you reference specific libraries or frameworks
        3. **Leverage memory** for ongoing projects to maintain context across sessions
        4. **Apply scientific-method** for debugging and validation tasks
        5. **Engage collaborative-reasoning** for architectural and design decisions
        6. **Utilize perplexity-ask** when you need current, real-world information
        7. **Apply decision-framework** when you have multiple viable options to choose from
        8. **Use analogical-reasoning** to explain or understand complex patterns
        9. **Employ metacognitive-monitoring** for critical code where reasoning quality matters

        Remember: These servers work best when you explicitly invoke their capabilities and clearly state what type of reasoning or assistance you need.
      </mcp-usage-tips>
    </high-priority>
  </mcp-rules>
</instructions>
