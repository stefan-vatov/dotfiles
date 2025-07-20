# Deno 2 Context Primer Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Injects comprehensive Deno 2 development rules and guidelines into the current context.
    This command provides Claude with essential Deno 2 best practices for imports,
    permissions, formatting, linting, and modern development patterns to ensure
    consistent, secure, and idiomatic code.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Accept no arguments or flags
    - Inject Deno 2 development rules as high-priority context
    - Display simple confirmation: "✓ Deno 2 context loaded"
    - Rules should be token-efficient (grouped by headers)
    - Claude should self-invoke this when detecting Deno development
    - Focus on imports, permissions, linting, formatting, and best practices
    - Rules should be scalable and future-proof
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <inject-context>
         - Add high-priority Deno 2 rules to current context
         - Mark as "IMPORTANT: Deno 2 Development Rules"
    </inject-context>

    2. <confirm>
         - Display: "✓ Deno 2 context loaded"
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
    # Load Deno 2 context
    /code:ctx:deno

    # Claude self-invokes when detecting Deno work
    # (automatic - no user action needed)
    ```
  </examples>

  <!-- ---------- 6. DENO 2 CONTEXT RULES ---------- -->
  <deno-rules>
    <high-priority>
      IMPORTANT: Deno 2 Development Rules

      ## Imports
      - Use pure ESM with explicit .ts/.js extensions or bare npm specifiers
      - Example: import { Hono } from "npm:hono@4"
      - Only use URL based imports
      - Always use fully qualified URLs for imports
      - Prefer https://deno.land/std@latest for standard library
      - Use specific versions in production (https://deno.land/std@0.XXX.0)
      - Prefer JSR registry (https://jsr.io) for third-party modules
      - Prefer JSR standard library (jsr:@std/*) before reaching for npm
      - Never use bare specifiers without import maps
      - Use import.meta.main to make modules executable and exportable
      - Opt-in to experimental import attributes (with { type: "json" }, "text", "bytes") only behind flags or in non-critical paths

      ## Permissions
      - Grant minimum permissions at runtime (deno run -A is almost never justified)
      - Always use minimal permission flags
      - Explicitly declare all required permissions
      - Common patterns:
        --allow-read=./src,./config
        --allow-write=./dist
        --allow-net=api.example.com
      - Never use --allow-all in production
      - Document permission requirements in code comments
      - Embed permissions in shebang for CLI scripts:
        #!/usr/bin/env -S deno run --allow-net=api.example.com

      ## Linting & Formatting
      - Run deno lint --fix to check files
      - Treat lint errors as build failures
      - Always run deno fmt (no custom style)
      - Use built-in formatter - it's fast and opinionated
      - Always follow deno lint defaults (~200 ESLint-grade rules)
      - Configure deno.json for project standards
      - Key lint rules:
        * Use const over let when possible
        * Prefer arrow functions for callbacks
        * Use explicit return types for public APIs
        * Avoid any type - use unknown or proper types

      ## Environment & Globals
      - Use globalThis instead of window (window was removed in v2 RC)
      - process is polyfilled when Node-compat mode is on
      - Gate secrets & environment config through platform env-vars
      - On Deno Deploy configure env-vars per-project, not in code

      ## Best Practices
      - Stay on latest stable v2.x unless you need --unstable
      - Subscribe to GitHub releases for patch notes
      - Use Deno.* APIs over Node compatibility when possible
      - Leverage built-in TypeScript support
      - Use deno.json for project configuration
      - Test with Deno.test() and built-in assertions
      - Handle async operations with proper error boundaries
    </high-priority>
  </deno-rules>
</instructions>
