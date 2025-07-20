/**
 * Parse shell command arguments safely, handling quotes and escapes.
 * This is a simplified version of Python's shlex.split for Deno/TypeScript.
 */
export function shellSplit(command: string): string[] {
  const args: string[] = [];
  let current = "";
  let inQuote: string | null = null;
  let escaped = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (inQuote) {
      if (char === inQuote) {
        inQuote = null;
      } else {
        current += char;
      }
    } else {
      if (char === '"' || char === "'") {
        inQuote = char;
      } else if (char === " " || char === "\t") {
        if (current.length > 0) {
          args.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }
  }

  if (current.length > 0) {
    args.push(current);
  }

  return args;
}
