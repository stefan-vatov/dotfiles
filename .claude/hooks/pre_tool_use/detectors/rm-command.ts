import { shellSplit } from "../utils/shell.ts";

const RM_ANY = /\brm\b/i;

/**
 * Comprehensive detection of dangerous rm commands.
 * Matches various forms of rm -rf and similar destructive patterns.
 */
export function isDangerousRmCommand(command: string): boolean {
  // Normalize command by removing extra spaces and converting to lowercase
  const normalized = command.toLowerCase().split(/\s+/).join(" ");

  // Pattern 1: Standard rm -rf variations
  const patterns = [
    /\brm\s+.*-[a-z]*r[a-z]*f/, // rm -rf, rm -fr, rm -Rf, etc.
    /\brm\s+.*-[a-z]*f[a-z]*r/, // rm -fr variations
    /\brm\s+--recursive\s+--force/, // rm --recursive --force
    /\brm\s+--force\s+--recursive/, // rm --force --recursive
    /\brm\s+-r\s+.*-f/, // rm -r ... -f
    /\brm\s+-f\s+.*-r/, // rm -f ... -r
  ];

  // Check for dangerous patterns
  for (const pattern of patterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  // Pattern 2: Check for rm with recursive flag targeting dangerous paths
  const dangerousPaths = [
    /\//, // Root directory
    /\/\*/, // Root with wildcard
    /~/, // Home directory
    /~\//, // Home directory path
    /\$HOME/, // Home environment variable
    /\.\./, // Parent directory references
    /\*/, // Wildcards in general rm -rf context
    /\./, // Current directory
    /\.\s*$/, // Current directory at end of command
  ];

  if (/\brm\s+.*-[a-z]*r/.test(normalized)) {
    // If rm has recursive flag
    for (const path of dangerousPaths) {
      if (path.test(normalized)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a script file contains any rm command.
 */
export async function scriptContainsRm(path: string): Promise<boolean> {
  try {
    const content = await Deno.readTextFile(path);
    return RM_ANY.test(content);
  } catch {
    return false;
  }
}

/**
 * Detect rm commands executed indirectly through bash -c, sh -c, or script files.
 */
export async function isIndirectRm(command: string): Promise<boolean> {
  const args = shellSplit(command);
  if (args.length === 0) return false;

  if (
    (args[0] === "bash" || args[0] === "sh") &&
    args.length >= 3 &&
    args[1] === "-c"
  ) {
    return RM_ANY.test(args.slice(2).join(" "));
  }

  try {
    const stat = await Deno.stat(args[0]);
    if (stat.isFile) {
      const ext = args[0].split(".").pop();
      if ((ext === "sh" || !ext) && stat.size <= 1048576) {
        return await scriptContainsRm(args[0]);
      }
    }
  } catch {
    // File doesn't exist or can't be read
  }

  return false;
}
