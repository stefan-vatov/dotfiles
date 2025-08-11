# Claude Code Hooks System

This directory contains the hook system for Claude Code, enabling custom logic to be executed at various points in Claude's operation lifecycle.

## Overview

Hooks provide a way to extend Claude Code's behavior by intercepting and potentially modifying or blocking operations. They are designed to be modular, testable, and maintainable.

## Core Principles

### 1. **Modularity**
Each hook should be self-contained with its logic organized into focused modules. This allows for:
- Easy testing of individual components
- Clear separation of concerns
- Reusable utilities and patterns

### 2. **Safety First**
Hooks often implement security or safety checks. When in doubt:
- Prefer false positives over false negatives
- Fail closed (block) rather than fail open (allow)
- Provide clear error messages to help users understand why an operation was blocked

### 3. **Performance**
Hooks execute in the critical path of Claude's operations:
- Keep execution time minimal
- Use efficient algorithms and data structures
- Cache expensive computations when possible

### 4. **Transparency**
Operations should be observable:
- Log important decisions (while respecting privacy)
- Provide debugging capabilities
- Make it easy to understand why a hook made a particular decision

## Hook Types

Claude supports several hook types, each serving different purposes:

- **PreToolUse**: Executed before a tool is invoked
- **PostToolUse**: Executed after a tool completes
- **UserPromptSubmit**: Executed when user submits a prompt
- **Notification**: Handle various system notifications
- **Stop**: Handle stop events
- **SubagentStop**: Handle subagent stop events

## Architecture Patterns

### Standard Hook Structure

```
hook_name/
├── hook_name.ts         # Main entry point
├── hook_name_test.ts    # Test suite
└── hook_name/           # Module directory
    ├── types.ts         # TypeScript interfaces
    ├── config.ts        # Configuration (if needed)
    ├── utils/           # Shared utilities
    └── modules/         # Feature modules
```

### Hook Entry Point Pattern

```typescript
#!/usr/bin/env -S deno run --allow-read --allow-env [additional permissions]

import { readAll } from "https://deno.land/std@0.224.0/io/read_all.ts";

async function main() {
  try {
    // Read input
    const input = await readInput();

    // Process input through modules
    const result = await processHook(input);

    // Exit with appropriate code
    Deno.exit(result.shouldBlock ? 2 : 0);
  } catch (error) {
    // Handle errors gracefully
    await logError(error);
    Deno.exit(0); // Don't break Claude's flow
  }
}

if (import.meta.main) {
  await main();
}
```

### Module Pattern

```typescript
// types.ts
export interface ModuleInput {
  // Define input structure
}

export interface ModuleResult {
  shouldBlock: boolean;
  reason?: string;
}

// module.ts
export function checkSomething(input: ModuleInput): ModuleResult {
  // Implementation
  return { shouldBlock: false };
}
```

## Testing

### Test Structure

- Each hook should have a corresponding test file
- Tests should cover both positive and negative cases
- Use Deno's built-in test runner
- Import assertions from Deno standard library

### Running Tests

```bash
# Run all tests in a hook directory
deno test hook_name_test.ts --allow-read

# Run with filter
deno test hook_name_test.ts --allow-read --filter "specific test"

# Run all hook tests
deno test *_test.ts --allow-read
```

### Test Best Practices

1. **Descriptive Names**: Test names should clearly indicate what's being tested
2. **Isolation**: Tests should not depend on external state
3. **Coverage**: Aim for comprehensive coverage of edge cases
4. **Performance**: Keep tests fast to encourage frequent running

## Development Workflow

### 1. Creating a New Hook

1. Create directory structure following the pattern
2. Implement core logic in focused modules
3. Write comprehensive tests
4. Document the hook's purpose and behavior
5. Test with real Claude sessions

### 2. Modifying Existing Hooks

1. Understand existing tests and ensure they still pass
2. Add tests for new functionality
3. Follow existing patterns and conventions
4. Update documentation as needed

### 3. Testing Hooks

```bash
# Test individual module functions
echo 'import { myFunction } from "./hook_name/modules/my-module.ts";
console.log(myFunction("test input"));' | deno run -

# Test complete hook with mock input
echo '{"tool_name": "Bash", "tool_input": {"command": "test"}}' | \
  deno run --allow-read hook_name.ts
```

## Configuration

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "HookType": [
      {
        "matcher": "",  // Optional regex to match specific cases
        "hooks": [
          {
            "type": "command",
            "command": "deno run --permissions /path/to/hook.ts"
          }
        ]
      }
    ]
  }
}
```

## Exit Codes

- `0`: Success - operation should proceed
- `2`: Blocked - operation should be prevented with error shown to user
- Other codes: Reserved for future use

## Logging

Hooks can implement logging for debugging and audit purposes:

```typescript
// Create structured logs
const logEntry = {
  timestamp: new Date().toISOString(),
  hookName: "hook_name",
  action: "blocked",
  reason: "specific reason",
  metadata: { /* additional context */ }
};

// Write to appropriate log file
await writeLog("./logs/hook_name.json", logEntry);
```

## Performance Considerations

1. **Startup Time**: Minimize imports and initialization
2. **Processing Time**: Use early returns and efficient algorithms
3. **Memory Usage**: Clean up resources and avoid memory leaks
4. **I/O Operations**: Batch operations and use async where appropriate

## Security Considerations

1. **Input Validation**: Never trust input, always validate
2. **Path Traversal**: Sanitize file paths
3. **Command Injection**: Be careful with string interpolation
4. **Sensitive Data**: Never log passwords, tokens, or secrets
5. **Fail Secure**: When uncertain, block the operation

## Common Patterns

### Pattern Matching
```typescript
// Use compiled regex for efficiency
const PATTERNS = [
  /pattern1/i,
  /pattern2/i,
].map(p => new RegExp(p));

// Check patterns
const matches = PATTERNS.some(p => p.test(input));
```

### Modular Checks
```typescript
// Compose multiple checks
const checks = [
  checkCondition1,
  checkCondition2,
  checkCondition3,
];

const results = await Promise.all(
  checks.map(check => check(input))
);

const shouldBlock = results.some(r => r.shouldBlock);
```

### Error Handling
```typescript
try {
  // Risky operation
} catch (error) {
  // Log but don't break Claude's flow
  await logError(error);
  // Decide whether to block or allow
  return { shouldBlock: true, reason: "Internal error" };
}
```

## Future Considerations

- Hook composition and chaining
- Dynamic hook loading
- Performance metrics and monitoring
- Hook marketplace/sharing
- Configuration management
- A/B testing capabilities

## Contributing

When contributing to the hook system:

1. Follow existing patterns and conventions
2. Write comprehensive tests
3. Document your changes
4. Consider backwards compatibility
5. Think about edge cases and security
6. Keep performance in mind
