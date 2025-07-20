# Frontend Context Primer Command

<instructions>
  <!-- ---------- 1. STATIC CONTEXT / SYSTEM PROMPT ---------- -->
  <context>
    Injects comprehensive frontend development rules and guidelines into the current context.
    This command provides Claude with extensive best practices for React, TypeScript, state management,
    testing, performance, and modern frontend development patterns.
  </context>

  <!-- ---------- 2. OPERATIONAL REQUIREMENTS ---------- -->
  <requirements>
    - Accept no arguments or flags
    - Inject frontend development rules as high-priority context
    - Display simple confirmation: "✓ Frontend context loaded"
    - Preserve exact XML structure of rules
    - Claude should self-invoke when detecting React/TypeScript files, frontend work, or *.tsx/*.jsx files
    - Works independently as context priming
  </requirements>

  <!-- ---------- 3. EXECUTION FLOW ---------- -->
  <execution>
    1. <inject-context>
         - Add high-priority frontend rules to current context
         - Mark as "IMPORTANT: Frontend Development Rules"
    </inject-context>

    2. <confirm>
         - Display: "✓ Frontend context loaded"
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
    # Load frontend context
    /code:ctx:fe

    # Claude self-invokes when detecting frontend work
    # (automatic - no user action needed)
    ```

  </examples>

  <!-- ---------- 6. FRONTEND CONTEXT RULES ---------- -->
<frontend-rules>
  <high-priority>
    IMPORTANT: Frontend Dev Rules (React + TypeScript)

    ## Philosophy
    functional + immutable • SRP • composition › inheritance

    ## TypeScript
    strict=true • no `any` • explicit returns • unions for state • `unknown` + guards • `as const` • branded types • exhaustive switch • TSDoc on exports

    ## React
    functional comps, named exports, 1 comp/file, props iface, variant prop over booleans, stable keys, forwardRef, Suspense + error boundaries, portals, container / presenter split

    ## Structure
    feature-based dirs; co-locate tests/types/hooks; `index.ts` defines public API; naming — PascalCase.tsx, usePascalCase.ts, kebab-case.ts

    ## State
    server = TanStack Query; global UI = Zustand (immer + persist); local = useState; optimistic updates; state machines for complex flows

    ## Styling
    Tailwind first; ordered utils; `cn()` + cva variants; dark mode; responsive; Framer Motion; a11y mandatory

    ## Testing
    Vitest + RTL unit/integration; Playwright E2E; MSW mocks; focus behaviour; ≥ 80 % logic coverage

    ## Performance
    measure→optimize; route-level code-split; bundle < 200 kB gz; lazy/memo after profiler; virtualize long lists; CWV: LCP < 2.5 s, FID < 100 ms, CLS < 0.1

    ## Accessibility
    semantic HTML, ARIA, keyboard nav, focus mgmt, contrast AA, respect prefers-reduced-motion

    ## Tool Patterns
    – Query: hierarchical keys, custom hooks, optimistic mutate
    – Zustand: small stores, selectors, immer, devtools
    – Hooks: start `use`, single purpose, return object, test with renderHook

    ## Misc
    Tailwind tokens via CSS vars • lucide-react icons • Vite optimise • SW offline • web-vitals + Sentry

    -- Validate locally; AI cannot run code.

  </high-priority>
</frontend-rules>
</instructions>
