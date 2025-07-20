/**
 * Detect fork bomb patterns that could crash the system.
 */
export function isForkBomb(command: string): boolean {
  // Remove spaces for pattern matching
  const compactCommand = command.replace(/\s+/g, '');

  // Classic fork bomb patterns
  const forkBombPatterns = [
    // Classic bash fork bomb :(){ :|:& };:
    /:[\(\)\{\}\|:;&]+:/,
    /:\(\)\{:\|:&\};:/, // exact pattern

    // Variations with different spacing
    /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/,

    // Other shell fork bombs
    /\$0\s*&\s*\$0/, // $0 & $0
    /\.\s*\$0\s*\|/, // . $0 |

    // Perl fork bombs
    /fork\s*while\s*fork/, // fork while fork
    /fork\s*for\s*fork/, // fork for fork

    // Python fork bombs
    /while.*:.*fork\(\)/, // while True: fork()
    /os\.fork\(\).*while/, // os.fork() in while

    // Generic patterns
    /fork\(\).*fork\(\)/, // multiple fork() calls
    /fork.*bomb/i, // explicit fork bomb mention
  ];

  // Check compact version for obfuscated attempts
  const compactPatterns = [
    /:\(\)\{:\|:&\};:/, // compact classic fork bomb
    /\$0&\$0&/, // compact $0 & $0
  ];

  // Check normal patterns
  for (const pattern of forkBombPatterns) {
    if (pattern.test(command)) {
      return true;
    }
  }

  // Check compact patterns
  for (const pattern of compactPatterns) {
    if (pattern.test(compactCommand)) {
      return true;
    }
  }

  // Check for excessive subprocess creation
  const subprocessCount = (command.match(/&/g) || []).length;
  const forkCount = (command.match(/fork/gi) || []).length;

  // If there are many background processes or fork calls, it might be suspicious
  if (subprocessCount > 10 || forkCount > 3) {
    return true;
  }

  return false;
}
