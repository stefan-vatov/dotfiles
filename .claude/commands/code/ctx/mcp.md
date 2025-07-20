# MCP Context Primer Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Injects comprehensive MCP (Model Context Protocol) usage guidelines and RepoPrompt tool strategies into the current context.
    This command provides Claude with essential patterns for using RepoPrompt MCP tools effectively, prioritizing
    them over built-in capabilities and choosing appropriate approaches based on task complexity.
  </context>
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



        7. **Start with sequential-thinking** for complex problems to break them down systematically
        8. **Use context7** whenever you reference specific libraries or frameworks
        9. **Leverage memory** for ongoing projects to maintain context across sessions
        10. **Apply scientific-method** for debugging and validation tasks
        11. **Engage collaborative-reasoning** for architectural and design decisions
        12. **Utilize perplexity-ask** when you need current, real-world information
        13. **Apply decision-framework** when you have multiple viable options to choose from
        14. **Use analogical-reasoning** to explain or understand complex patterns
        15. **Employ metacognitive-monitoring** for critical code where reasoning quality matters

        Remember: These servers work best when you explicitly invoke their capabilities and clearly state what type of reasoning or assistance you need.
    </high-priority>

  </mcp-rules>
</instructions>
