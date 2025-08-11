/**
 * Detect various file deletion methods beyond just rm.
 * Includes unlink, find -delete, programming language deletions, and file truncation.
 * For find -delete, only blocks if operating outside current directory.
 */
export function isFileDeletionAttempt(command: string): boolean {
  // Special handling for find -delete
  if (/\bfind\b.*-delete/.test(command)) {
    // Check if find is operating outside current directory
    const findDangerousPatterns = [
      /find\s+\/(?!tmp|var\/tmp)/, // find starting from root (except /tmp)
      /find\s+\.\./, // find in parent directories
      /find\s+~/, // find in home directory
      /find\s+\$HOME/, // find in $HOME
      /find\s+\${HOME}/, // find in ${HOME}
      /find\s+[\/~].*-delete/, // find with absolute/home path and -delete
    ];

    // Check if it matches any dangerous pattern
    const isDangerous = findDangerousPatterns.some(pattern => pattern.test(command));

    // If it's a dangerous find -delete, block it
    if (isDangerous) {
      return true;
    }

    // If find -delete is only in current directory or subdirectories, allow it
    // Examples that would be allowed:
    // find . -name "*.tmp" -delete
    // find ./build -delete
    // find mydir -delete
    return false;
  }

  const patterns = [
    /\bunlink\b/, // unlink command
    /(?<!>)>\s*[^&|<>]+$/, // file truncation (not >>)
    /:\s*>\s*[^&|<>]+$/, // : > file truncation
    /perl.*unlink/, // perl unlink
    /python.*(?:unlink|remove)/, // python deletion
    /ruby.*(?:unlink|delete)/, // ruby deletion
    /truncate.*-s\s*0/, // truncate to 0 bytes
    /\bdd\b.*\bif=\/dev\/null\b/, // dd from /dev/null
    /\bcp\s+\/dev\/null\s+/, // cp /dev/null to file
    /sed\s+.*-i.*'d'/, // sed -i delete all lines
    /sed\s+.*-i.*"d"/, // sed -i delete all lines (double quotes)
  ];

  return patterns.some((pattern) => pattern.test(command));
}
