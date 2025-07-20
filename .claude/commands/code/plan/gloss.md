# Repository Glossary Generator

<instructions>
  <context>
    Automatically generates or updates a comprehensive glossary file at `.claude/glossary.md` containing technical terms, domain-specific terminology, and project conventions found throughout the codebase. Supports both single repositories and monorepos, helping developers and AI assistants understand project-specific language and conventions.
  </context>

  <requirements>
    - Generate or update `.claude/glossary.md` with categorized terms
    - Support `--update` flag to refresh existing glossary
    - Extract technical terms from code (function/class/variable names)
    - Identify domain-specific terminology from comments and docs
    - Detect project-specific conventions and patterns
    - Handle both single repository and monorepo structures
    - Use parallel sub-agents for efficient analysis
    - Preserve existing definitions when updating (merge intelligently)
    - Organize entries alphabetically within categories
  </requirements>

  <execution>
    1. <init>
         - Check if `.claude/glossary.md` exists
         - If exists and no --update flag, read and analyze current content
         - If --update flag set, prepare for merge operation
         - Detect repository type (single vs monorepo)
    2. <parallel-analysis>
         - Spawn sub-agents for concurrent term extraction:
             * Code Term Extractor (functions, classes, variables)
             * Comment/Doc Analyzer (domain terminology)
             * Convention Detector (naming patterns, abbreviations)
             * Frequency Analyzer (term occurrence counting)
             * Context Extractor (usage examples and definitions)
    3. <categorization>
         - Sort extracted terms into categories:
             * Technical Terms (code entities)
             * Domain Terminology (business/project concepts)
             * Project Conventions (patterns and standards)
         - Remove duplicates and filter noise
         - Apply smart filtering (min occurrences, relevance)
    4. <definition-generation>
         - For new terms: generate concise definitions
         - For existing terms: preserve definitions if --update
         - Extract context from usage for better definitions
         - Cross-reference related terms
    5. <merge-and-write>
         - If updating: intelligently merge new and existing terms
         - Format using Option A structure (categorized, alphabetical)
         - Write to `.claude/glossary.md`
    6. <report>
         - Echo success with statistics (terms added/updated/removed)
         - Note any significant changes or new categories
  </execution>

  <flags>
    --update    Update existing glossary.md file, preserving manual edits
  </flags>

  <sub-agents>
    Code Term Extractor:
      - Parse source files for identifiers
      - Extract function, class, method, variable names
      - Identify common prefixes/suffixes
      - Note parameter and return types

    Comment/Doc Analyzer:
      - Scan comments for domain terminology
      - Extract terms from documentation files
      - Identify business logic terminology
      - Parse JSDoc/docstring definitions

    Convention Detector:
      - Identify naming conventions (camelCase, snake_case, etc.)
      - Detect common abbreviations and their meanings
      - Find project-specific prefixes/suffixes
      - Note file naming patterns

    Frequency Analyzer:
      - Count term occurrences across codebase
      - Weight by context importance
      - Filter out common programming terms
      - Identify project-specific vs generic terms

    Context Extractor:
      - Gather usage examples for terms
      - Extract surrounding context for definitions
      - Identify relationships between terms
      - Note common combinations and phrases

  </sub-agents>

  <validation>
    - [ ] All source files scanned for terms
    - [ ] Terms properly categorized
    - [ ] Definitions clear and concise
    - [ ] No duplicate entries across categories
    - [ ] Existing definitions preserved when updating
    - [ ] Alphabetical ordering within categories
  </validation>

  <examples>
    ```bash
    # Generate initial glossary
    /code:plan:gen-glossary

    # Update existing glossary with new terms
    /code:plan:gen-glossary --update
    ```

  </examples>

  <output-format>
    The generated `.claude/glossary.md` follows this structure:

    ```markdown
    # Project Glossary

    ## Technical Terms

    **API** - Application Programming Interface used for...

    **AuthService** - Core authentication service handling user login...

    **CLI** - Command Line Interface for interacting with...

    ## Domain Terminology

    **Customer** - In this system, refers to...

    **Order** - Represents a purchase transaction...

    **Workflow** - Automated process that...

    ## Project Conventions

    **camelCase** - Used for variable and function names...

    **SCREAMING_SNAKE_CASE** - Used for constants...

    **use-** prefix - Indicates React hooks...
    ```
  </output-format>

  <merge-strategy>
    When updating existing glossary:
    1. Preserve all manually edited definitions
    2. Add new terms found in codebase
    3. Mark potentially outdated terms (no longer found)
    4. Update occurrence counts and examples
    5. Maintain category organization
    6. Keep manual notes and clarifications
  </merge-strategy>
</instructions>
