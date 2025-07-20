/**
 * Check if any tool is trying to access .env files containing sensitive data.
 */
export function isEnvFileAccess(
  toolName: string,
  toolInput: Record<string, unknown>,
): boolean {
  // Check Glob tool for .env patterns
  if (toolName === "Glob") {
    const pattern = String(toolInput.pattern || "");
    // Check if pattern is searching for .env files
    if (pattern.includes(".env") && !pattern.includes(".env.sample")) {
      return true;
    }
  }

  // Check Grep tool for .env file searches
  if (toolName === "Grep") {
    const pattern = String(toolInput.pattern || "");
    const glob = String(toolInput.glob || "");
    // Check if searching in .env files or for .env content
    if (
      (pattern.includes(".env") || glob.includes(".env")) &&
      !pattern.includes(".env.sample") &&
      !glob.includes(".env.sample")
    ) {
      return true;
    }
  }

  // Check LS tool for .env file listing
  if (toolName === "LS") {
    const path = String(toolInput.path || "");
    // Check if trying to list .env files
    if (path.includes(".env") && !path.includes(".env.sample")) {
      return true;
    }
  }

  // Check Task tool for env file searches
  if (toolName === "Task") {
    const prompt = String(toolInput.prompt || "").toLowerCase();
    const description = String(toolInput.description || "").toLowerCase();
    // Check if task is about searching for env files
    if (
      (prompt.includes("env") && (prompt.includes("file") || prompt.includes("variable"))) ||
      (description.includes("env") && description.includes("file")) ||
      prompt.includes(".env") ||
      description.includes(".env")
    ) {
      return true;
    }
  }

  if (
    ["Read", "Edit", "MultiEdit", "Write", "Bash"].includes(toolName)
  ) {
    // Check file paths for file-based tools
    if (["Read", "Edit", "MultiEdit", "Write"].includes(toolName)) {
      const filePath = String(toolInput.file_path || "");
      if (filePath.includes(".env") && !filePath.endsWith(".env.sample")) {
        return true;
      }
    } // Check bash commands for .env file access
    else if (toolName === "Bash") {
      const command = String(toolInput.command || "");
      // Pattern to detect .env file access (but allow .env.sample)
      const envPatterns = [
        /\b\.env\b(?!\.sample)/, // .env but not .env.sample
        /cat\s+.*\.env\b(?!\.sample)/, // cat .env
        /echo\s+.*>\s*\.env\b(?!\.sample)/, // echo > .env
        /touch\s+.*\.env\b(?!\.sample)/, // touch .env
        /cp\s+.*\.env\b(?!\.sample)/, // cp .env
        /mv\s+.*\.env\b(?!\.sample)/, // mv .env
        /find\s+.*\.env/, // find command searching for .env files
        /find\s+.*-name\s+["']?\.env/, // find -name ".env*"
        /ls\s+.*\.env/, // ls commands with .env
        /grep\s+.*\.env/, // grep for .env files
      ];

      for (const pattern of envPatterns) {
        if (pattern.test(command)) {
          return true;
        }
      }
    }
  }

  return false;
}
