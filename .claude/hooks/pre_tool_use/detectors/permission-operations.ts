/**
 * Detect dangerous permission operations.
 * Blocks chmod -R 000/777 on critical paths, and dangerous chown/chgrp operations.
 */
export function isDangerousPermissionOperation(command: string): boolean {
  const normalizedCommand = command.toLowerCase();

  // Pattern 1: Dangerous chmod operations
  if (/\bchmod\b/.test(normalizedCommand)) {
    // Check for recursive chmod with dangerous permissions
    const dangerousChmodPatterns = [
      /chmod\s+.*-r.*\s*(000|777)\s+\/(?!tmp|var\/tmp|home)/, // chmod -R 000/777 on system paths
      /chmod\s+.*-r.*\s*(000|777)\s+\.\./, // chmod -R to parent dirs
      /chmod\s+.*-r.*\s*(000|777)\s+~/, // chmod -R on home
      /chmod\s+.*-r.*\s*(000|777)\s+\$/, // chmod -R with variables
      /chmod\s+.*\s*(000|777)\s+\/\s*$/, // chmod 000/777 on root
      /chmod\s+.*-r.*\s*666/, // chmod -R 666 anywhere
      /chmod\s+666\s+\*/, // chmod 666 *
      /chmod\s+.*777\s+\/(?!tmp|var\/tmp)/, // chmod 777 on system directories
    ];

    for (const pattern of dangerousChmodPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }
  }

  // Pattern 2: Dangerous chown operations
  if (/\bchown\b/.test(normalizedCommand)) {
    const dangerousChownPatterns = [
      /chown\s+.*-r.*\s+\/\s*$/, // chown -R on root directory
      /chown\s+.*-r.*\s+\/etc(?:\/|$)/, // chown -R on /etc
      /chown\s+.*-r.*\s+\/usr(?:\/|$)/, // chown -R on /usr
      /chown\s+.*-r.*\s+\/bin(?:\/|$)/, // chown -R on /bin
      /chown\s+.*-r.*\s+\/lib(?:\/|$)/, // chown -R on /lib
      /chown\s+.*-r.*\s+\/boot(?:\/|$)/, // chown -R on /boot
      /chown\s+.*-r.*\s+\/dev(?:\/|$)/, // chown -R on /dev
      /chown\s+.*-r.*\s+\/proc(?:\/|$)/, // chown -R on /proc
      /chown\s+.*-r.*\s+\/sys(?:\/|$)/, // chown -R on /sys
      /chown\s+.*-r.*\s+\/sbin(?:\/|$)/, // chown -R on /sbin
      /chown\s+.*-r.*\s+\/opt(?:\/|$)/, // chown -R on /opt
      /chown\s+.*-r.*\s+\/root(?:\/|$)/, // chown -R on /root
      /chown\s+.*-r.*\.\./, // chown -R on parent directories
      /chown\s+.*root:root.*\/home/, // changing home to root ownership
    ];

    for (const pattern of dangerousChownPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }
  }

  // Pattern 3: Dangerous chgrp operations
  if (/\bchgrp\b/.test(normalizedCommand)) {
    const dangerousChgrpPatterns = [
      /chgrp\s+.*-r/, // Any recursive chgrp
    ];

    for (const pattern of dangerousChgrpPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }
  }

  return false;
}
