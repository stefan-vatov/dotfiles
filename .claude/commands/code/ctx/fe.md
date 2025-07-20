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
      IMPORTANT: Frontend Development Rules

      <rules scope="/apps/reqwise_fe">

    <coding_philosophy>
      - **Functional and Immutable:** Write code in a functional style. Treat all data as immutable. Prefer pure functions and compose them to build complex logic.
      - **Pragmatic and Clean:** Strive for clean, readable, and maintainable code. Follow the Single Responsibility Principle for all components, hooks, and functions.
      - **Composition Over Inheritance:** Always favor composition to share logic and UI.
    </coding_philosophy>

    <typescript_guidelines>
      - **Strict Mode is Mandatory:** `strict: true` must be enabled in `tsconfig.json` with all strict checks.
      - **Type Safety First:** Never use `any`. Use `unknown` for type-unsafe values and implement proper type guards.
      - **Explicit Return Types:** Always declare return types for functions, especially for public APIs and hooks.
      - **Discriminated Unions:** Model complex states and API responses with discriminated unions to prevent impossible states.
      - **Generic Constraints:** Use generic type parameters with constraints rather than concrete types when building reusable components.
      - **Const Assertions:** Use `as const` for literal types and readonly data structures.
      - **Type Predicates:** Implement custom type guards with `is` predicates for runtime type checking.
      - **Exhaustive Checks:** Use `never` type for exhaustive switch/if checks on unions.
      - **Utility Types:** Leverage TypeScript utility types (Partial, Required, Pick, Omit, Record) instead of manual type manipulation.
      - **Branded Types:** Use branded/opaque types for domain primitives (e.g., UserId, Email) to prevent type confusion.
      - **Strict Null Checks:** Embrace `strictNullChecks` and handle null/undefined explicitly.
      - **No Type Assertions:** Avoid type assertions (`as`). If necessary, document why with a comment.
      - **Template Literal Types:** Use template literal types for string pattern validation at the type level.
      - **Mapped Types:** Create mapped types for transforming existing types rather than duplicating definitions.
      - **Conditional Types:** Use conditional types for type-level logic, but keep them simple and well-documented.
      - **Leverage the `satisfies` Operator:** Use `satisfies` to validate configurations or objects against a type without losing their inferred specificity.
      - **Interfaces for Public APIs, Types for Internal:** Use `interface` for component props and API data structures. Use `type` for union types, intersections, and internal implementation details.
      - **Use TSDoc for Exports:** Document all exported components, hooks, and functions using TSDoc (`@param`, `@returns`, `@example`).
    </typescript_guidelines>

    <react_and_component_design>
      - **Functional Components Only:** All components must be functional. Class components are forbidden.
      - **Named Exports:** Export components as named exports, never default. This improves refactoring and tree-shaking.
      - **One Component Per File:** Each file should export one primary component. Helper components can be co-located if only used internally.
      - **Single Responsibility:** A component should do one thing well. Separate data-fetching and state logic into custom hooks (Container/Presentational pattern).
      - **Props Interface:** Define props as a separate interface named `[ComponentName]Props` immediately before the component.
      - **Children Type:** Use `React.ReactNode` for children props, or be more specific when needed (e.g., `React.ReactElement`).
      - **Component Composition:** Build complex UIs by composing smaller, focused components. Use children and render props for flexibility.
      - **Prop Spreading:** Avoid prop spreading except for explicitly forwarded props. Destructure known props first.
      - **Event Handlers:** Name event handler props as `on[Event]` and handlers as `handle[Event]`.
      - **Boolean Props:** Avoid boolean props. Use discriminated unions or variant props (e.g., `variant="primary"` over `isPrimary`).
      - **Render Functions:** Extract complex JSX into render functions within the component for better readability.
      - **Fragment Usage:** Use `<>` short syntax for fragments unless key prop is needed.
      - **Conditional Rendering:** Prefer early returns and ternary operators over && for conditional rendering.
      - **Lists and Keys:** Always use stable, unique keys for lists. Never use array index as key for dynamic lists.
      - **Ref Forwarding:** Use `forwardRef` when components need to expose DOM refs. Type refs properly.
      - **Error Boundaries:** Implement error boundaries at route and feature levels. Log errors to monitoring service.
      - **Suspense Boundaries:** Use Suspense for code splitting and data fetching with proper fallbacks.
      - **Portal Usage:** Use portals for modals, tooltips, and dropdowns that need to escape parent styling.
      - **Component Categories:** Distinguish between presentational, container, and layout components.
    </react_and_component_design>

    <file_and_project_structure>
      - **Feature-Based Organization:** Structure code by feature/domain, not by file type.
      - **Feature Structure:**
        ```
        src/features/user-profile/
        ├── index.ts                 # Public exports
        ├── UserProfile.tsx          # Main component
        ├── UserProfile.test.tsx     # Component tests
        ├── UserProfile.types.ts     # TypeScript types
        ├── useUserProfile.ts        # Feature hook
        ├── UserAvatar.tsx           # Sub-component
        └── user-profile.utils.ts    # Feature utilities
        ```
      - **Shared Components:** Place in `src/components/ui/` for design system components.
      - **Route Components:** Follow TanStack Router conventions in `src/routes/`.
      - **Custom Hooks:** Feature-specific hooks with the feature, shared hooks in `src/hooks/`.
      - **Utilities:** Feature utilities with the feature, shared utilities in `src/lib/`.
      - **Type Definitions:** Co-locate types with usage, shared types in `src/types/`.
      - **Test Files:** Co-locate test files with the code they test using `.test.tsx` suffix.
      - **Storybook Stories:** Co-locate stories with components using `.stories.tsx` suffix.
      - **Index Exports:** Use index.ts to explicitly define public API of each module.
      - **Naming Conventions:**
        - Components: `PascalCase.tsx`
        - Hooks: `usePascalCase.ts`
        - Utilities: `kebab-case.ts`
        - Types: `PascalCase.types.ts`
        - Tests: `[name].test.tsx`
        - Stories: `[name].stories.tsx`
    </file_and_project_structure>

    <state_management>
      - **State Categories:** Clearly distinguish between server state (TanStack Query), global client state (Zustand), and local component state (useState).
      - **Server State is Default:** Use TanStack Query for all data that comes from or goes to the server. This is not optional.
      - **TanStack Query for Server State:** Use TanStack Query for all server data. This includes caching, refetching, and mutations.
      - **Minimal Global State:** Keep global client state minimal. Only truly global UI state belongs in Zustand (theme, user preferences, app-wide modals).
      - **Zustand for Global UI State:** Use Zustand only for global client-side state (e.g., theme, auth status, modal visibility).
      - **Local State First:** Start with useState for component state. Only lift state when multiple components need it.
      - **`useState` for Local Component State:** Use `useState` for state that is local to a single component.
      - **Derived State:** Calculate derived values instead of storing them. Use selectors in Zustand and Query.
      - **State Machines:** Use state machines for complex UI flows that have multiple states and transitions.
      - **Form State:** Use TanStack Form or react-hook-form for complex forms. Simple forms can use controlled components.
      - **URL State:** Store shareable UI state (filters, pagination) in URL search params using TanStack Router.
      - **Optimistic Updates:** Implement optimistic updates for better UX using TanStack Query's optimistic updates.
      - **State Persistence:** Use Zustand persist middleware for client state that should survive refreshes.
      - **State Reset:** Implement proper cleanup and reset mechanisms for state when components unmount or users navigate.
      - **State Synchronization:** Keep different state sources synchronized (e.g., URL params with filter state).
      - **Immer for Zustand:** All Zustand stores must use the `immer` middleware for safe immutable updates.
    </state_management>

    <styling_and_ui>
      - **Tailwind First:** Use Tailwind utility classes directly in JSX. Custom CSS is a last resort.
      - **Utility Organization:** Order utilities consistently: layout → spacing → typography → colors → effects → states.
      - **Class Merging:** Use the `cn()` utility function (clsx + tailwind-merge) for conditional classes.
      - **No Style Props:** Never use style props. All styling should be via classes for consistency.
      - **Component Variants:** Use class-variance-authority (cva) for component variants:
        ```typescript
        const buttonVariants = cva(
          "base classes here",
          {
            variants: {
              variant: {
                default: "variant classes",
                destructive: "variant classes",
              },
              size: {
                sm: "size classes",
                md: "size classes",
              },
            },
            defaultVariants: {
              variant: "default",
              size: "md",
            },
          }
        )
        ```
      - **Dark Mode:** Design with dark mode in mind. Use Tailwind's dark: modifier for all color utilities.
      - **Responsive Design:** Mobile-first approach. Use sm:, md:, lg:, xl:, 2xl: breakpoints in that order.
      - **Custom Properties:** Use CSS custom properties for design tokens that Tailwind doesn't cover.
      - **Animation:** Use Tailwind's animation utilities. For complex animations, use Framer Motion.
      - **No @apply:** Avoid @apply in CSS files. It breaks Tailwind's purging and makes code harder to search.
      - **Semantic Colors:** Use semantic color names (primary, secondary, destructive) not literal colors (red, blue).
      - **Focus States:** Always style focus states for keyboard navigation. Use focus-visible: modifier.
      - **State Layers:** Use hover:, active:, disabled: modifiers for interactive states.
      - **Group Modifiers:** Use group and group-hover: for parent-based styling.
      - **Arbitrary Values:** Use arbitrary values sparingly and only for one-off exceptions.
      - **Shadcn for UI Primitives:** Use Shadcn components as the base. Extend them via composition; never modify the source files.
      - **Accessibility is Mandatory:** Ensure all interactive elements are fully accessible via keyboard and have proper ARIA attributes.
    </styling_and_ui>

    <testing_strategy>
      - **Test Categories:** Write unit tests for utilities, integration tests for components, and E2E tests for critical user flows.
      - **Test-Driven Development:** Write tests first for complex logic and bug fixes.
      - **Testing Trophy:** Focus on integration tests (middle of trophy). Unit test complex logic, E2E test critical paths.
      - **Test Behavior, Not Implementation:** Use `React Testing Library` to write tests that reflect how a user interacts with the component.
      - **Vitest for Unit/Component Tests:** Use Vitest as the test runner and assertion library.
      - **Playwright for E2E Tests:** Cover critical user flows with Playwright E2E tests.
      - **Mock APIs with MSW:** Use Mock Service Worker (MSW) to mock APIs at the network level for realistic and reliable tests.
      - **Coverage Goals:** Aim for 80% coverage on business logic, 100% on critical paths. Coverage is a guide, not a goal.
      - **Test Organization:** Co-locate test files with source code using `.test.tsx` suffix.
      - **Test Naming:** Use descriptive test names that explain what is being tested and expected behavior.
      - **Arrange-Act-Assert:** Structure tests with clear setup, action, and verification phases.
      - **Test Isolation:** Each test should be independent. Use beforeEach for setup, afterEach for cleanup.
      - **Mock Sparingly:** Only mock what you don't own (external services, browser APIs).
      - **Snapshot Testing:** Use sparingly, only for stable UI that rarely changes.
      - **Visual Regression:** Consider visual regression testing for design system components.
      - **Performance Testing:** Test performance-critical components with React Profiler.
      - **Accessibility Testing:** Include accessibility checks in component tests.
      - **Error Testing:** Test error states and edge cases thoroughly.
    </testing_strategy>

    <performance>
      - **Measure First:** Never optimize without profiling. Use React DevTools Profiler to identify actual bottlenecks.
      - **Profile First, Optimize Second:** Do not use `useMemo`, `useCallback`, or `React.memo` without first identifying a performance bottleneck with the React DevTools profiler.
      - **Core Web Vitals:** Optimize for LCP < 2.5s, FID < 100ms, CLS < 0.1.
      - **Bundle Size Budget:** Set and monitor bundle size budgets. Main bundle should be < 200KB gzipped.
      - **Code Splitting:** Implement route-based code splitting by default using React.lazy.
      - **Lazy Load Routes:** The primary performance strategy is route-based code splitting using `React.lazy` and `Suspense`.
      - **Tree Shaking:** Ensure all imports are tree-shakeable. Use named imports, not namespace imports.
      - **Render Optimization:** Minimize unnecessary re-renders through proper component design.
      - **Network Optimization:** Implement resource hints (preconnect, prefetch, preload) for critical resources.
      - **Image Optimization:** Use modern formats (WebP, AVIF) with proper sizing and lazy loading.
      - **Optimize Assets:** Use modern image formats like WebP and ensure all assets are appropriately sized.
      - **Font Optimization:** Use font-display: swap and subset fonts to required characters.
      - **Third-Party Scripts:** Load third-party scripts asynchronously and defer non-critical scripts.
      - **Service Worker:** Implement service worker for offline support and caching strategies.
      - **Memory Management:** Monitor and prevent memory leaks, especially in long-running applications.
      - **Animation Performance:** Use CSS transforms and will-change for smooth animations.
      - **Virtualization:** Implement virtual scrolling for long lists using @tanstack/react-virtual.
      - **Progressive Enhancement:** Ensure core functionality works without JavaScript.
      - **Analyze the Bundle:** Regularly analyze the production bundle size with `vite-bundle-visualizer` to prevent bloat.
    </performance>


    <coding_style_and_conventions>
      - **File Naming:** Use `PascalCase.tsx` for components, `camelCase.ts` for utilities, `kebab-case.ts` for configuration files.
      - **Component Files:** One component per file. Export component as named export, never default.
      - **Type Definitions:** Co-locate types with their usage. Use `.types.ts` suffix for shared type files.
      - **Import Organization:** Order imports as: React, third-party libs, internal absolute (@/), relative, types, styles.
      - **Import Type-Only:** Use `import type` for type-only imports to optimize bundle size.
      - **Path Aliases:** Always use `@/` alias for src imports instead of relative paths beyond current directory.
      - **Const Declarations:** Use `const` by default, `let` only when reassignment is needed, never use `var`.
      - **Arrow Functions:** Prefer arrow functions for callbacks and functional components.
      - **Object Shorthand:** Use property shorthand and method shorthand in object literals.
      - **Destructuring:** Use object and array destructuring for cleaner code.
      - **Template Literals:** Use template literals for string interpolation instead of concatenation.
      - **Optional Chaining:** Use `?.` and `??` operators for safe property access and nullish coalescing.
      - **Early Returns:** Use early returns to reduce nesting and improve readability.
      - **No Magic Numbers:** Extract magic numbers/strings as named constants with clear names.
      - **Async/Await:** Use async/await over promise chains for better readability.
      - **Error Messages:** Include context in error messages. Use template literals for dynamic values.
      - **Line Length:** Maximum 100 characters per line, enforced by Prettier.
      - **Semicolons:** Omit semicolons (Prettier will handle edge cases).
      - **Trailing Commas:** Use trailing commas in multi-line structures for cleaner diffs.
      - **Quotes:** Use single quotes for strings, except in JSX attributes.
    </coding_style_and_conventions>

    <type_declaration_patterns>
      - **Interface for Objects:** Use `interface` for object shapes that can be extended or implemented.
      - **Type for Unions:** Use `type` for union types, intersections, and computed types.
      - **Props Naming:** Name component props as `[ComponentName]Props` (e.g., `ButtonProps`).
      - **Enum Alternative:** Prefer const objects with `as const` over enums for better tree-shaking.
      - **Generic Components:** Name generic parameters meaningfully (not just T, U, V).
      - **Separate Concerns:** Keep domain types separate from API types and UI types.
      - **Validation Types:** Pair TypeScript types with Zod schemas for runtime validation.
      - **Discriminated Unions Example:**
        ```typescript
        type LoadingState<T> =
          | { status: 'idle' }
          | { status: 'loading' }
          | { status: 'success'; data: T }
          | { status: 'error'; error: Error }
        ```
      - **Branded Types Example:**
        ```typescript
        type UserId = string & { __brand: 'UserId' }
        type Email = string & { __brand: 'Email' }
        ```
      - **Builder Pattern Types:** Use builder patterns with method chaining for complex object construction.
    </type_declaration_patterns>

    <documentation_standards>
      - **Component Documentation:** Document all exported components with TSDoc:
        ```typescript
        /**
        * Button component for user interactions
        *
        * @example
        * ```tsx
        * <Button variant="primary" onClick={handleClick}>
        *   Click me
        * </Button>
        * ```
        */
        export function Button({ ... }: ButtonProps) { ... }
        ```
      - **Props Documentation:** Document all props with descriptions and examples:
        ```typescript
        interface ButtonProps {
          /** Visual style variant of the button */
          variant?: 'default' | 'destructive' | 'outline'
          /** Size of the button */
          size?: 'sm' | 'md' | 'lg'
          /** Click handler */
          onClick?: () => void
          /** Whether the button is disabled */
          disabled?: boolean
          /** Content to be rendered inside the button */
          children: React.ReactNode
        }
        ```
      - **Hook Documentation:** Document custom hooks with usage examples:
        ```typescript
        /**
        * Hook for managing user authentication state
        *
        * @returns Current user and auth methods
        *
        * @example
        * ```tsx
        * const { user, login, logout } = useAuth()
        * ```
        */
        ```
      - **TSDoc Comments:** Use TSDoc for all exported functions, components, hooks, and types.
      - **Parameter Documentation:** Use `@param` tags with descriptions for function parameters.
      - **Return Documentation:** Use `@returns` tag to describe return values and their types.
      - **Example Documentation:** Include `@example` tags with runnable code snippets.
      - **Deprecation:** Use `@deprecated` tag with migration instructions for deprecated APIs.
      - **Type Documentation:** Document complex types with examples of valid values.
      - **Internal Comments:** Use `//` for implementation details, avoid obvious comments.
      - **TODO Comments:** Use `// TODO(name):` format with assignee name and description.
      - **Complex Logic:** Add explanatory comments for complex algorithms or business rules.
      - **Regex Patterns:** Always document regex patterns with examples of matches.
      - **README Files:** Each feature should have a README explaining its purpose and usage.
      - **Storybook Stories:** Document components visually with Storybook stories.
      - **API Documentation:** Document all API integrations with request/response examples.
      - **Architecture Decisions:** Document architectural decisions in ADRs.
      - **Code Comments:** Add comments for complex logic, not obvious code.
      - **Migration Guides:** Document breaking changes with migration paths.
    </documentation_standards>

    <module_organization>
      - **Export Discipline:** Only export what's needed. Keep implementation details private.
      - **Index Exports:** Use `index.ts` to define public API of a module/feature.
      - **Barrel Exports:** Avoid deep barrel exports that increase bundle size.
      - **Circular Dependencies:** Prevent circular dependencies through careful module design.
      - **Side Effects:** Mark side-effect imports explicitly and keep them separate.
      - **Dynamic Imports:** Use dynamic imports for code splitting at route boundaries.
      - **Re-exports:** Use re-exports sparingly and only for public APIs.
      - **Module Boundaries:** Enforce module boundaries with ESLint rules.
      - **Feature Isolation:** Each feature should be independently importable.
      - **Shared Modules:** Place shared utilities in dedicated directories with clear purposes.
    </module_organization>


    <custom_hooks_patterns>
      - **Naming Convention:** All hooks must start with `use` followed by PascalCase name describing what it does.
      - **Single Responsibility:** Each hook should have one clear purpose. Compose multiple hooks for complex logic.
      - **Return Value:** Return an object for multiple values, array for tuple-like values. Be consistent.
      - **Dependencies:** Explicitly declare all dependencies. Use ESLint exhaustive-deps rule.
      - **State Initialization:** Accept initial state as parameter when needed. Support both value and function.
      - **Error Handling:** Hooks that can fail should return error state alongside data.
      - **Loading States:** Include loading/pending states for async operations.
      - **Cleanup:** Always cleanup side effects in useEffect return function.
      - **Memoization:** Only use useMemo/useCallback when React Profiler shows performance issues.
      - **Custom Hook Example:**
        ```typescript
        function useUser(userId: string) {
          const [state, setState] = useState<{
            data: User | null
            error: Error | null
            isLoading: boolean
          }>({ data: null, error: null, isLoading: true })

          // Implementation...

          return state
        }
        ```
      - **Hook Composition:** Build complex hooks by composing simpler ones.
      - **Testing Hooks:** Test hooks in isolation using @testing-library/react renderHook.
      - **Documentation:** Document hook parameters, return values, and usage examples.
    </custom_hooks_patterns>


    <component_patterns>
      - **Container/Presenter Pattern:** Separate data fetching (container) from presentation logic.
      - **Compound Components:** Use compound component pattern for related components (e.g., `<Tabs>`, `<Tabs.List>`, `<Tabs.Panel>`).
      - **Render Props:** Use render props for cross-cutting behavior that needs to share state.
      - **Higher-Order Components:** Avoid HOCs in favor of hooks and composition.
      - **Controlled/Uncontrolled:** Be explicit about controlled vs uncontrolled components. Default to controlled.
      - **Provider Pattern:** Use Context Provider pattern for cross-cutting concerns like theme, auth.
      - **Component Props Interface Example:**
        ```typescript
        interface CardProps {
          title: string
          description?: string
          variant: 'default' | 'highlighted' | 'muted'
          size: 'sm' | 'md' | 'lg'
          children: React.ReactNode
          className?: string
          onClick?: () => void
        }
        ```
      - **Slot Pattern:** Use the slot pattern with `asChild` prop for maximum flexibility.
      - **Polymorphic Components:** Support `as` prop for components that can render different elements.
      - **State Machines:** Use state machines (XState or manual) for complex component state.
    </component_patterns>

    <routing_patterns>
      - **File-Based Routing:** Follow TanStack Router file naming conventions strictly.
      - **Route Components:** Export route components with descriptive names matching the route.
      - **Route Loaders:** Implement data fetching in route loaders for better UX.
      - **Route Guards:** Implement authentication/authorization at the route level.
      - **Nested Layouts:** Use nested layouts for shared UI elements across routes.
      - **Route Params:** Type route parameters using TanStack Router's type safety.
      - **Search Params:** Use search params for filter/sort state that should be shareable.
      - **Navigation:** Use TanStack Router's Link component and navigate function.
      - **Active Links:** Implement active link styling using router's active state.
      - **Route Transitions:** Implement route transitions with React 19's transitions API.
      - **Error Routes:** Implement error boundary routes for better error handling.
      - **Pending UI:** Show pending UI during route transitions using useTransition.
    </routing_patterns>

    <context_usage>
      - **Minimize Context:** Use Context sparingly. Prefer props and composition.
      - **Split Contexts:** Create separate contexts for different concerns to prevent unnecessary re-renders.
      - **Context Naming:** Name contexts clearly: `[Feature]Context` and `[Feature]Provider`.
      - **Custom Hook Access:** Always access context via custom hook, not useContext directly.
      - **Default Values:** Provide sensible default values or throw if context is required.
      - **Provider Placement:** Place providers as low in the tree as possible.
      - **Static vs Dynamic:** Separate static configuration from dynamic state in different contexts.
      - **Context Example:**
        ```typescript
        const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

        export function ThemeProvider({ children }: { children: React.ReactNode }) {
          // Implementation
        }

        export function useTheme() {
          const context = useContext(ThemeContext)
          if (!context) {
            throw new Error('useTheme must be used within ThemeProvider')
          }
          return context
        }
        ```
    </context_usage>

    <performance_patterns>
      - **Memo Sparingly:** Only use React.memo after identifying performance issues with Profiler.
      - **Key Stability:** Ensure keys are stable across re-renders to prevent unnecessary unmounting.
      - **Lazy Loading:** Use React.lazy for route-level code splitting by default.
      - **Virtualization:** Use virtual scrolling for long lists (react-window or @tanstack/react-virtual).
      - **Image Loading:** Implement progressive image loading with blur placeholders.
      - **Bundle Splitting:** Split vendor bundles from application code.
      - **Concurrent Features:** Leverage React 19's concurrent features (useTransition, useDeferredValue).
      - **Selective Hydration:** Use selective hydration for better initial load performance.
      - **State Colocation:** Keep state as close to where it's used as possible.
      - **Effect Optimization:** Minimize effects and prefer derived state where possible.
    </performance_patterns>


    <tanstack_query_patterns>
      - **Query Keys:** Use hierarchical, consistent query key factories:
        ```typescript
        export const userKeys = {
          all: ['users'] as const,
          lists: () => [...userKeys.all, 'list'] as const,
          list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
          details: () => [...userKeys.all, 'detail'] as const,
          detail: (id: string) => [...userKeys.details(), id] as const,
        }
        ```
      - **Query Functions:** Keep query functions pure and focused. Extract API calls to separate service layer.
      - **Custom Hooks:** Wrap queries in custom hooks for better reusability:
        ```typescript
        export function useUser(userId: string) {
          return useQuery({
            queryKey: userKeys.detail(userId),
            queryFn: () => userService.getById(userId),
            staleTime: 5 * 60 * 1000, // 5 minutes
          })
        }
        ```
      - **Mutations:** Always use mutations for data modifications. Never use queries for side effects.
      - **Optimistic Updates:** Implement optimistic updates for instant feedback:
        ```typescript
        useMutation({
          mutationFn: updateUser,
          onMutate: async (newUser) => {
            await queryClient.cancelQueries({ queryKey: userKeys.detail(newUser.id) })
            const previousUser = queryClient.getQueryData(userKeys.detail(newUser.id))
            queryClient.setQueryData(userKeys.detail(newUser.id), newUser)
            return { previousUser }
          },
          onError: (err, newUser, context) => {
            queryClient.setQueryData(userKeys.detail(newUser.id), context.previousUser)
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(newUser.id) })
          },
        })
        ```
      - **Error Handling:** Implement global error handling with QueryClient's default options.
      - **Loading States:** Use query combination patterns for dependent queries.
      - **Pagination:** Use useInfiniteQuery for infinite scroll, regular queries for paginated tables.
      - **Prefetching:** Prefetch data on hover/focus for instant navigation.
      - **Cache Management:** Set appropriate staleTime and gcTime based on data volatility.
      - **Background Refetching:** Configure refetchOnWindowFocus based on data freshness needs.
      - **Suspense Mode:** Use suspense mode for route-level data fetching with TanStack Router.
    </tanstack_query_patterns>

    <zustand_patterns>
      - **Store Organization:** Create separate stores for different domains. Don't create one mega-store.
      - **Store Structure:**
        ```typescript
        interface ThemeStore {
          theme: 'light' | 'dark' | 'system'
          setTheme: (theme: Theme) => void
          toggleTheme: () => void
        }

        export const useThemeStore = create<ThemeStore>()(
          persist(
            immer((set) => ({
              theme: 'system',
              setTheme: (theme) => set((state) => {
                state.theme = theme
              }),
              toggleTheme: () => set((state) => {
                state.theme = state.theme === 'light' ? 'dark' : 'light'
              }),
            })),
            {
              name: 'theme-storage',
            }
          )
        )
        ```
      - **Immer Usage:** Always use immer middleware for complex state updates. It prevents accidental mutations.
      - **Selectors:** Create and memoize selectors for derived state:
        ```typescript
        export const useIsLightTheme = () => useThemeStore((state) => state.theme === 'light')
        ```
      - **Actions Pattern:** Keep actions inside the store. Don't mutate store from components.
      - **TypeScript:** Properly type stores with interfaces. Use the curried version for better type inference.
      - **DevTools:** Use Zustand DevTools in development for debugging.
      - **Subscriptions:** Use subscriptions for side effects, not useEffect:
        ```typescript
        useThemeStore.subscribe(
          (state) => state.theme,
          (theme) => {
            document.documentElement.setAttribute('data-theme', theme)
          }
        )
        ```
      - **Middleware:** Combine middleware carefully. Order matters (immer -> devtools -> persist).
      - **Testing:** Create test stores with initial state for component testing.
      - **Performance:** Use shallow comparison for selectors to prevent unnecessary re-renders.
    </zustand_patterns>

    <form_state_management>
      - **Form Libraries:** Use TanStack Form for complex forms with validation. Use controlled components for simple forms.
      - **Validation Strategy:** Validate on blur for better UX. Show errors only after user interaction.
      - **Form State Structure:**
        ```typescript
        interface FormState<T> {
          values: T
          errors: Partial<Record<keyof T, string>>
          touched: Partial<Record<keyof T, boolean>>
          isSubmitting: boolean
          isValid: boolean
        }
        ```
      - **Field Registration:** Use a consistent pattern for registering form fields.
      - **Error Display:** Show field-level errors near the input. Show form-level errors at the top.
      - **Async Validation:** Debounce async validations (e.g., checking username availability).
      - **Form Reset:** Reset form state after successful submission or on cancel.
      - **Dirty Checking:** Warn users about unsaved changes when navigating away.
      - **Multi-Step Forms:** Use state machines for complex multi-step form flows.
      - **File Uploads:** Handle file uploads with progress tracking and error recovery.
      - **Optimistic UI:** Show success state optimistically, revert on error.
    </form_state_management>

    <data_synchronization>
      - **Cache Invalidation:** Invalidate related queries after mutations:
        ```typescript
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: userKeys.lists() })
          queryClient.invalidateQueries({ queryKey: userKeys.details() })
        }
        ```
      - **Real-Time Updates:** Use WebSockets or SSE for real-time data. Update TanStack Query cache on events.
      - **Offline Support:** Implement offline support with TanStack Query's persistQueryClient.
      - **Conflict Resolution:** Handle conflicts in optimistic updates gracefully.
      - **Background Sync:** Sync local changes when coming back online.
      - **State Hydration:** Hydrate client state from server-rendered HTML properly.
      - **Cross-Tab Sync:** Use broadcast channel or storage events for cross-tab synchronization.
      - **Polling:** Use refetchInterval for data that needs regular updates.
      - **Manual Refetch:** Provide manual refetch options for user-triggered updates.
      - **Stale-While-Revalidate:** Use this pattern for better perceived performance.
    </data_synchronization>

    <error_and_loading_states>
      - **Loading States:** Distinguish between initial load, refetching, and background refetching.
      - **Error Boundaries:** Implement error boundaries at feature level with retry capabilities.
      - **Error Types:** Differentiate between network errors, validation errors, and server errors.
      - **Retry Logic:** Implement exponential backoff for failed requests.
      - **Fallback UI:** Always provide meaningful fallback UI for loading and error states.
      - **Skeleton Screens:** Use skeleton screens instead of spinners for better perceived performance.
      - **Error Recovery:** Provide clear actions for users to recover from errors.
      - **Partial Errors:** Handle partial failures in batch operations gracefully.
      - **Toast Notifications:** Use toast notifications for background operation feedback.
      - **Loading Indicators:** Show subtle loading indicators for background updates.
    </error_and_loading_states>

    <performance_optimization>
      - **Query Deduplication:** TanStack Query automatically deduplicates identical queries.
      - **Selective Rerendering:** Use Zustand selectors to prevent unnecessary rerenders.
      - **Lazy Queries:** Use enabled option to conditionally fetch data.
      - **Parallel Queries:** Use useQueries for fetching multiple resources in parallel.
      - **Dependent Queries:** Chain queries properly using the enabled option.
      - **Placeholder Data:** Use placeholderData for instant UI updates.
      - **Initial Data:** Provide initialData from other queries when available.
      - **Query Cancellation:** Implement proper cleanup and cancellation for queries.
      - **Memory Management:** Configure gcTime appropriately to prevent memory leaks.
      - **Batch Updates:** Batch multiple state updates to reduce renders.
    </performance_optimization>


    <shadcn_ui_patterns>
      - **Component Extension:** Extend Shadcn components via composition, never modify the source:
        ```typescript
        import { Button } from '@/components/ui/button'

        export function SubmitButton({ children, ...props }: SubmitButtonProps) {
          return (
            <Button variant="default" type="submit" {...props}>
              {children}
            </Button>
          )
        }
        ```
      - **Component Customization:** Use the provided variant system. Add new variants via cva if needed.
      - **Slot Pattern:** Use the asChild prop pattern for maximum flexibility:
        ```typescript
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        ```
      - **Component Anatomy:** Understand component structure. Most have Root, Trigger, Content pattern.
      - **Compound Components:** Use compound component patterns from Radix UI primitives.
      - **Styling Override:** Use className prop to add additional styles, cn() will merge properly.
      - **Theme Customization:** Modify CSS variables in globals.css for theme changes.
      - **Icon Integration:** Use lucide-react icons consistently throughout the application.
      - **Form Components:** Integrate Shadcn form components with react-hook-form or TanStack Form.
      - **Data Display:** Use Shadcn table components with TanStack Table for advanced features.
      - **Accessibility:** Shadcn components include ARIA attributes. Don't remove them.
      - **Component Composition Example:**
        ```typescript
        export function Card({ className, ...props }: CardProps) {
          return (
            <div
              className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
              {...props}
            />
          )
        }
        ```
    </shadcn_ui_patterns>

    <accessibility_requirements>
      - **Semantic HTML:** Use proper HTML elements (button, nav, main, section, article).
      - **ARIA Labels:** Add aria-label when text content doesn't describe the action.
      - **ARIA Live Regions:** Use for dynamic content updates that should be announced.
      - **Keyboard Navigation:** All interactive elements must be keyboard accessible (Tab, Enter, Space, Escape).
      - **Focus Management:** Manage focus properly in modals, drawers, and dynamic content.
      - **Skip Links:** Implement skip to main content link for keyboard users.
      - **Alt Text:** All images must have meaningful alt text or empty alt="" for decorative images.
      - **Color Contrast:** Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text).
      - **Touch Targets:** Minimum 44x44px touch targets on mobile.
      - **Error Messages:** Associate error messages with inputs using aria-describedby.
      - **Loading States:** Announce loading states to screen readers with aria-live.
      - **Headings Hierarchy:** Use proper heading hierarchy (h1 → h2 → h3) for screen readers.
      - **Form Labels:** Every form input must have an associated label.
      - **Focus Indicators:** Never remove focus indicators. Style them instead.
      - **Screen Reader Testing:** Test with screen readers (NVDA, JAWS, VoiceOver).
      - **Reduced Motion:** Respect prefers-reduced-motion for animations.
        ```typescript
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ```
    </accessibility_requirements>

    <responsive_design>
      - **Mobile First:** Write base styles for mobile, add complexity at larger breakpoints.
      - **Breakpoint Usage:**
        ```typescript
        // Tailwind v4 breakpoints
        // sm: 640px
        // md: 768px
        // lg: 1024px
        // xl: 1280px
        // 2xl: 1536px
        ```
      - **Container Usage:** Use container class with responsive padding.
      - **Grid Layouts:** Use CSS Grid for 2D layouts, Flexbox for 1D layouts.
      - **Responsive Typography:** Use fluid typography with clamp() or responsive font utilities.
      - **Image Optimization:** Use responsive images with srcset and sizes attributes.
      - **Viewport Meta:** Ensure viewport meta tag is set correctly.
      - **Touch Interactions:** Design for touch with larger tap targets on mobile.
      - **Responsive Tables:** Make tables scrollable or use alternative layouts on mobile.
      - **Navigation Patterns:** Implement hamburger menu or bottom navigation for mobile.
      - **Form Layouts:** Stack form fields vertically on mobile, inline on desktop.
      - **Card Layouts:** Use grid with responsive columns for card layouts.
      - **Hidden Elements:** Use hidden and block utilities with breakpoint modifiers.
    </responsive_design>

    <component_styling_patterns>
      - **Base-Variant Pattern:** Define base styles, then add variant-specific styles:
        ```typescript
        const baseStyles = "rounded-md font-medium transition-colors"
        const variants = {
          primary: "bg-primary text-primary-foreground",
          secondary: "bg-secondary text-secondary-foreground",
        }
        ```
      - **Size System:** Create consistent size variants:
        ```typescript
        const sizes = {
          sm: "h-8 px-3 text-sm",
          md: "h-10 px-4 text-base",
          lg: "h-12 px-6 text-lg",
        }
        ```
      - **State Styling:** Handle all interactive states:
        ```typescript
        "hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        ```
      - **Compound Variants:** Use cva's compound variants for complex variant combinations.
      - **Default Props:** Always provide sensible defaults for variant props.
      - **Prop Spreading:** Spread props last to allow overrides:
        ```typescript
        <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
        ```
      - **Data Attributes:** Use data attributes for state-based styling:
        ```typescript
        data-[state=open]:bg-accent data-[disabled]:opacity-50
        ```
      - **CSS Variables:** Use CSS variables for dynamic values:
        ```typescript
        style={{ '--custom-size': size }} className="w-[var(--custom-size)]"
        ```
    </component_styling_patterns>

    <theme_configuration>
      - **CSS Variables:** Define theme tokens as CSS variables in :root and .dark:
        ```css
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          /* ... more tokens */
        }
        ```
      - **Color Palette:** Use HSL values for better color manipulation.
      - **Semantic Naming:** Use semantic names (primary, secondary) not color names.
      - **Theme Toggle:** Implement theme toggle with system preference support.
      - **Theme Persistence:** Store theme preference in localStorage.
      - **Custom Themes:** Support custom themes by overriding CSS variables.
      - **Typography Scale:** Define consistent typography scale as CSS variables.
      - **Spacing Scale:** Use Tailwind's spacing scale consistently.
      - **Border Radius:** Define consistent radius values as CSS variables.
      - **Shadow Scale:** Create consistent shadow scale for elevation.
      - **Transition Timing:** Define standard transition durations and easings.
    </theme_configuration>

    <icon_usage>
      - **Icon Library:** Use lucide-react exclusively for consistency.
      - **Icon Sizing:** Use Tailwind's size utilities (size-4, size-5, size-6).
      - **Icon Color:** Icons inherit text color by default. Use text utilities for colors.
      - **Icon Props:** Pass className and other props to icon components:
        ```typescript
        <Search className="size-4 text-muted-foreground" />
        ```
      - **Icon Buttons:** Always include aria-label for icon-only buttons.
      - **Loading Icons:** Use Loader2 with animate-spin for loading states.
      - **Custom Icons:** Create custom icons as React components if needed.
      - **Icon Alignment:** Use flex items-center for proper text-icon alignment.
    </icon_usage>


    <vitest_configuration>
      - **Test Environment:** Use jsdom environment for component tests, node for utility tests.
      - **Setup Files:** Configure global test setup for common utilities and mocks:
        ```typescript
        // vitest.setup.ts
        import '@testing-library/jest-dom'
        import { cleanup } from '@testing-library/react'
        import { afterEach } from 'vitest'

        afterEach(() => {
          cleanup()
        })
        ```
      - **Test Utilities:** Create custom render function with providers:
        ```typescript
        export function renderWithProviders(
          ui: React.ReactElement,
          options?: RenderOptions
        ) {
          function Wrapper({ children }: { children: React.ReactNode }) {
            return (
              <QueryClient>
                <Router>
                  {children}
                </Router>
              </QueryClient>
            )
          }
          return render(ui, { wrapper: Wrapper, ...options })
        }
        ```
      - **Coverage Configuration:** Configure coverage to exclude test files and generated code.
      - **Watch Mode:** Use watch mode during development for instant feedback.
      - **Test Filters:** Use .only and .skip sparingly, remove before committing.
      - **Parallel Execution:** Run tests in parallel for faster execution.
      - **Reporter Options:** Use detailed reporter in CI, minimal in development.
      - **Global Types:** Extend Vitest globals with custom matchers if needed.
    </vitest_configuration>

    <react_testing_library_patterns>
      - **Query Priorities:** Follow query priority: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId.
      - **User Events:** Use @testing-library/user-event for realistic user interactions:
        ```typescript
        const user = userEvent.setup()
        await user.click(button)
        await user.type(input, 'text')
        ```
      - **Async Utilities:** Use waitFor and findBy queries for async operations:
        ```typescript
        await waitFor(() => {
          expect(screen.getByText('Loaded')).toBeInTheDocument()
        })
        ```
      - **Component Testing Example:**
        ```typescript
        describe('Button', () => {
          it('should call onClick when clicked', async () => {
            const handleClick = vi.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click me</Button>)

            await user.click(screen.getByRole('button', { name: /click me/i }))

            expect(handleClick).toHaveBeenCalledOnce()
          })
        })
        ```
      - **Accessibility Queries:** Use accessible queries that mirror how users interact.
      - **Custom Queries:** Create custom queries for domain-specific patterns.
      - **Debug Tools:** Use screen.debug() and prettyDOM for debugging.
      - **Testing Forms:** Test form submission flow, validation, and error states.
      - **Testing Hooks:** Use renderHook for testing custom hooks in isolation.
      - **Container Queries:** Avoid container/querySelector. Use Testing Library queries.
    </react_testing_library_patterns>

    <api_mocking_with_msw>
      - **Mock Service Worker Setup:** Configure MSW for intercepting API calls:
        ```typescript
        // mocks/handlers.ts
        export const handlers = [
          http.get('/api/users/:id', ({ params }) => {
            return HttpResponse.json({
              id: params.id,
              name: 'John Doe',
            })
          }),
        ]
        ```
      - **Test Server Setup:** Use MSW server in tests:
        ```typescript
        const server = setupServer(...handlers)

        beforeAll(() => server.listen())
        afterEach(() => server.resetHandlers())
        afterAll(() => server.close())
        ```
      - **Override Handlers:** Override handlers for specific test scenarios:
        ```typescript
        server.use(
          http.get('/api/users/:id', () => {
            return HttpResponse.json(null, { status: 404 })
          })
        )
        ```
      - **Network Error Testing:** Test network failures and error states.
      - **Loading State Testing:** Test loading states with delayed responses.
      - **Request Assertions:** Verify request payloads and headers.
      - **Response Variations:** Test different response scenarios (success, error, empty).
      - **GraphQL Support:** Use MSW's GraphQL handlers for GraphQL APIs.
      - **Development Mocking:** Use same mocks in development for consistency.
      - **Type Safety:** Share types between handlers and application code.
    </api_mocking_with_msw>

    <component_testing_patterns>
      - **Integration Focus:** Test components as users would use them:
        ```typescript
        it('should submit form with valid data', async () => {
          const user = userEvent.setup()
          const onSubmit = vi.fn()

          render(<ContactForm onSubmit={onSubmit} />)

          await user.type(screen.getByLabelText(/name/i), 'John Doe')
          await user.type(screen.getByLabelText(/email/i), 'john@example.com')
          await user.click(screen.getByRole('button', { name: /submit/i }))

          expect(onSubmit).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
          })
        })
        ```
      - **Props Testing:** Test component behavior with different prop combinations.
      - **State Testing:** Test state changes through user interactions.
      - **Conditional Rendering:** Test all conditional rendering paths.
      - **Error Boundaries:** Test error boundary behavior with error scenarios.
      - **Async Components:** Test Suspense boundaries and loading states.
      - **Context Testing:** Test components that consume context.
      - **Portal Testing:** Test components that use portals (modals, tooltips).
      - **Animation Testing:** Test animation triggers, skip animation details.
      - **Responsive Testing:** Test responsive behavior if it affects functionality.
    </component_testing_patterns>


    <e2e_testing>
      - **Playwright Setup:** Use Playwright for E2E tests of critical user journeys.
      - **Test Scenarios:** Focus on complete user flows, not individual features.
      - **Page Object Model:** Use page objects for maintainable E2E tests:
        ```typescript
        class LoginPage {
          constructor(private page: Page) {}

          async login(email: string, password: string) {
            await this.page.fill('[aria-label="Email"]', email)
            await this.page.fill('[aria-label="Password"]', password)
            await this.page.click('button[type="submit"]')
          }
        }
        ```
      - **Test Data:** Use dedicated test accounts and data.
      - **Viewport Testing:** Test responsive behavior across viewports.
      - **Cross-Browser:** Test in Chrome, Firefox, and Safari.
      - **Visual Testing:** Include visual regression tests for key pages.
      - **Performance Testing:** Measure Core Web Vitals in E2E tests.
      - **CI Integration:** Run E2E tests in CI with proper artifacts.
      - **Test Stability:** Implement retry logic and wait strategies.
    </e2e_testing>

    <test_data_management>
      - **Factories:** Create factory functions for test data:
        ```typescript
        export const createUser = (overrides?: Partial<User>): User => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          ...overrides,
        })
        ```
      - **Fixtures:** Store static test data as fixtures.
      - **Builders:** Use builder pattern for complex test objects.
      - **Faker Integration:** Use @faker-js/faker for realistic test data.
      - **Deterministic Data:** Use seeds for reproducible test data.
      - **Test Database:** Use separate database for integration tests.
      - **Cleanup:** Clean up test data after each test.
      - **Shared State:** Avoid shared state between tests.
    </test_data_management>


    <vite_optimization>
      - **Build Configuration:** Optimize Vite build settings:
        ```typescript
        export default defineConfig({
          build: {
            target: 'es2022',
            minify: 'terser',
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
            },
            reportCompressedSize: false,
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
              output: {
                manualChunks: {
                  'react-vendor': ['react', 'react-dom'],
                  'router': ['@tanstack/react-router'],
                  'ui': ['@radix-ui/react-slot', 'class-variance-authority'],
                },
              },
            },
          },
        })
        ```
      - **Dependencies Optimization:** Pre-bundle heavy dependencies:
        ```typescript
        optimizeDeps: {
          include: ['react', 'react-dom', '@tanstack/react-query'],
        }
        ```
      - **CSS Optimization:** Use CSS modules or Tailwind for optimal CSS delivery.
      - **Asset Optimization:** Configure asset handling for images and fonts:
        ```typescript
        assetsInclude: ['**/*.woff2', '**/*.webp'],
        ```
      - **Compression:** Enable gzip and brotli compression in production.
      - **Source Maps:** Generate source maps only for error tracking in production.
      - **Legacy Support:** Use @vitejs/plugin-legacy only if needed for older browsers.
      - **Analyze Bundle:** Use rollup-plugin-visualizer to analyze bundle composition.
      - **Chunk Strategy:** Implement vendor-splitting strategy for better caching.
      - **Worker Optimization:** Use Web Workers for CPU-intensive tasks.
    </vite_optimization>

    <react_performance_patterns>
      - **Component Memoization:** Use React.memo only after profiling shows re-render issues:
        ```typescript
        export const ExpensiveComponent = React.memo(({ data }: Props) => {
          return <div>{/* Complex rendering */}</div>
        }, (prevProps, nextProps) => {
          // Custom comparison
          return prevProps.data.id === nextProps.data.id
        })
        ```
      - **Hook Memoization:** Use useMemo and useCallback sparingly:
        ```typescript
        // Only if `expensiveComputation` is actually expensive
        const memoizedValue = useMemo(
          () => expensiveComputation(a, b),
          [a, b]
        )

        // Only if function identity matters for child re-renders
        const memoizedCallback = useCallback(
          () => doSomething(a, b),
          [a, b]
        )
        ```
      - **State Optimization:** Keep state as local as possible. Lift only when necessary.
      - **Context Optimization:** Split contexts to minimize re-render scope:
        ```typescript
        // Instead of one large context
        const AppContext = { user, theme, settings }

        // Use multiple focused contexts
        const UserContext = { user }
        const ThemeContext = { theme }
        const SettingsContext = { settings }
        ```
      - **List Rendering:** Use proper keys and consider virtualization for long lists.
      - **Lazy Loading:** Implement component-level lazy loading for heavy components:
        ```typescript
        const HeavyComponent = lazy(() => import('./HeavyComponent'))
        ```
      - **Suspense Strategies:** Use Suspense with proper boundaries and fallbacks.
      - **Transition API:** Use React 19's useTransition for non-urgent updates:
        ```typescript
        const [isPending, startTransition] = useTransition()

        const handleSearch = (query: string) => {
          startTransition(() => {
            setSearchResults(performSearch(query))
          })
        }
        ```
      - **Server Components:** Consider React Server Components for static content.
      - **Hydration Optimization:** Use selective hydration for better initial load.
    </react_performance_patterns>

    <bundle_optimization>
      - **Dynamic Imports:** Use dynamic imports for code splitting:
        ```typescript
        const AdminPanel = lazy(() =>
          import(/* webpackChunkName: "admin" */ './AdminPanel')
        )
        ```
      - **Route-Based Splitting:** Split code at route boundaries automatically with TanStack Router.
      - **Component-Based Splitting:** Split heavy components that are conditionally rendered.
      - **Vendor Splitting:** Separate vendor chunks for better caching:
        ```typescript
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack')) return 'tanstack'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
        }
        ```
      - **CSS Splitting:** Split CSS by route or feature for optimal loading.
      - **Prefetching:** Implement route prefetching on hover/focus:
        ```typescript
        <Link
          to="/dashboard"
          onMouseEnter={() => prefetchRoute('/dashboard')}
        >
          Dashboard
        </Link>
        ```
      - **Bundle Analysis:** Regularly analyze bundle size with vite-bundle-visualizer.
      - **Tree Shaking:** Ensure proper ES modules usage for tree shaking.
      - **Side Effects:** Mark packages as side-effect-free in package.json.
      - **Polyfill Strategy:** Load polyfills only for browsers that need them.
    </bundle_optimization>

    <asset_optimization>
      - **Image Formats:** Use modern formats with fallbacks:
        ```typescript
        <picture>
          <source srcSet="image.avif" type="image/avif" />
          <source srcSet="image.webp" type="image/webp" />
          <img src="image.jpg" alt="Description" loading="lazy" />
        </picture>
        ```
      - **Image Sizing:** Provide multiple sizes with srcset:
        ```typescript
        <img
          srcSet="image-300.jpg 300w, image-600.jpg 600w, image-1200.jpg 1200w"
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src="image-600.jpg"
          alt="Description"
        />
        ```
      - **Lazy Loading:** Use native lazy loading for images below the fold.
      - **Image CDN:** Use image CDN for on-the-fly optimization.
      - **SVG Optimization:** Optimize SVGs with SVGO, use as React components.
      - **Font Loading:** Use font-display: swap and preload critical fonts:
        ```html
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
        ```
      - **Icon Sprites:** Use SVG sprites or icon fonts for icon systems.
      - **Video Optimization:** Use adaptive streaming for videos.
      - **Compression:** Enable Brotli compression for text assets.
      - **CDN Strategy:** Serve static assets from CDN with proper cache headers.
    </asset_optimization>

    <runtime_optimization>
      - **Web Workers:** Offload heavy computations to Web Workers:
        ```typescript
        const worker = new Worker(
          new URL('./heavy-computation.worker.ts', import.meta.url),
          { type: 'module' }
        )
        ```
      - **Request Deduplication:** Ensure API requests are deduplicated (TanStack Query handles this).
      - **Debouncing:** Debounce user inputs that trigger expensive operations:
        ```typescript
        const debouncedSearch = useMemo(
          () => debounce((query: string) => search(query), 300),
          []
        )
        ```
      - **Throttling:** Throttle scroll and resize handlers:
        ```typescript
        const throttledScroll = useMemo(
          () => throttle(handleScroll, 100),
          []
        )
        ```
      - **Virtual Scrolling:** Implement virtual scrolling for long lists:
        ```typescript
        const rowVirtualizer = useVirtualizer({
          count: items.length,
          getScrollElement: () => parentRef.current,
          estimateSize: () => 50,
        })
        ```
      - **Intersection Observer:** Use Intersection Observer for lazy loading and infinite scroll.
      - **Request Prioritization:** Prioritize critical requests over non-critical ones.
      - **Background Sync:** Defer non-critical operations to idle time.
      - **Memory Leaks:** Clean up event listeners, timers, and subscriptions.
      - **Error Boundaries:** Implement error boundaries to prevent app crashes.
    </runtime_optimization>

    <monitoring_and_metrics>
      - **Performance Monitoring:** Implement RUM (Real User Monitoring):
        ```typescript
        export function reportWebVitals(metric: Metric) {
          // Send to analytics
          analytics.track('web-vitals', {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
          })
        }
        ```
      - **Error Tracking:** Implement error tracking with Sentry or similar.
      - **Custom Metrics:** Track custom performance metrics:
        ```typescript
        performance.mark('myFeature:start')
        // ... feature code
        performance.mark('myFeature:end')
        performance.measure('myFeature', 'myFeature:start', 'myFeature:end')
        ```
      - **Bundle Size Tracking:** Monitor bundle size in CI/CD pipeline.
      - **Lighthouse CI:** Run Lighthouse in CI for performance regression detection.
      - **User Timing API:** Use User Timing API for detailed performance tracking.
      - **Performance Budgets:** Set and enforce performance budgets in build process.
      - **A/B Testing:** Test performance optimizations with real users.
      - **Synthetic Monitoring:** Set up synthetic monitoring for critical user paths.
      - **Performance Dashboards:** Create dashboards for performance metrics.
    </monitoring_and_metrics>

    <caching_strategies>
      - **HTTP Caching:** Implement proper cache headers:
        ```typescript
        // Immutable assets (hashed filenames)
        'Cache-Control': 'public, max-age=31536000, immutable'

        // HTML files
        'Cache-Control': 'no-cache, no-store, must-revalidate'
        ```
      - **Service Worker Caching:** Implement offline-first caching:
        ```typescript
        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request).then((response) => {
              return response || fetch(event.request)
            })
          )
        })
        ```
      - **Browser Storage:** Use appropriate storage for different data types:
        - localStorage: User preferences
        - sessionStorage: Temporary form data
        - IndexedDB: Large datasets
      - **Memory Caching:** Cache expensive computations in memory.
      - **CDN Caching:** Configure CDN for optimal caching.
      - **API Caching:** Implement proper caching strategies in TanStack Query.
      - **Invalidation Strategy:** Implement cache invalidation properly.
      - **Offline Support:** Provide offline functionality with service workers.
    </caching_strategies>

    <key_principles>
      - **Type Safety**: Leverage TypeScript's type system to catch errors at compile time
      - **Readability**: Code should be self-documenting with clear naming and structure
      - **Maintainability**: Consistent patterns and conventions across the codebase
      - **Performance**: Use type-only imports and proper code splitting
      - **Developer Experience**: Clear error messages and comprehensive documentation
      - **Composition Over Inheritance**: Build complex UIs from simple, composable pieces
      - **Explicit Over Implicit**: Be clear about props, state, and behavior
      - **Colocation**: Keep related code together for better maintainability
      - **Type Safety**: Leverage TypeScript for prop validation and state management
      - **Performance**: Optimize only when necessary, measure first
      - **Server State Supremacy**: TanStack Query owns all server state
      - **Minimal Global State**: Only truly global UI state in Zustand
      - **Local By Default**: Start with local state, lift only when needed
      - **Optimistic UI**: Provide instant feedback with proper error handling
      - **Type Safety**: Leverage TypeScript for all state management
      - **Utility-First**: Embrace Tailwind's utility classes for all styling
      - **Accessibility**: Every user should be able to use the interface
      - **Consistency**: Use design tokens and variants for consistent UI
      - **Performance**: Optimize for small CSS bundles and smooth animations
      - **Maintainability**: Clear patterns and composition over customization
      - **Test Behavior**: Focus on what users can see and do
      - **Maintainability**: Write tests that are easy to understand and update
      - **Reliability**: Tests should be deterministic and fast
      - **Documentation**: Code should be self-documenting with helpful comments
      - **Coverage**: Measure coverage but prioritize meaningful tests
      - **Measure Before Optimizing**: Use profiling tools to identify real bottlenecks
      - **User-Centric Metrics**: Focus on Core Web Vitals and user experience
      - **Progressive Enhancement**: Ensure functionality works for all users
      - **Continuous Monitoring**: Track performance metrics in production
      - **Holistic Approach**: Consider network, parsing, and runtime performance
    </key_principles>

    <rules_for_coding_agent>
      <understand_and_implement_requirements>
        - Fully understand the problem before starting to code.
        - Implement all requirements exactly as specified.
        - Seek clarification if any part of the requirements is ambiguous.
      </understand_and_implement_requirements>

      <write_high_quality_code>
        - Ensure code is clean, readable, and maintainable.
        - Use best practices for the technologies in use (e.g., const declarations, explicit typing, immutability, named exports).
      </write_high_quality_code>

      <ensure_correctness_and_robustness>
        - Thoroughly test and debug all code.
        - Verify that imports are correct and align with the project's structure.
        - Avoid using placeholder comments (e.g., // TODO or // FIXME).
        - Implement appropriate error handling for critical components.
      </ensure_correctness_and_robustness>

      <optimize_and_document>
        - Optimize code for performance where necessary.
        - Document complex logic and non-obvious design decisions for clarity.
      </optimize_and_document>

      <ensure_accessibility>
        - Make sure interactive elements are accessible and support keyboard navigation.
      </ensure_accessibility>
    </rules_for_coding_agent>

  </rules>
    </high-priority>
  </frontend-rules>
</instructions>
