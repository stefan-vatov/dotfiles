/**
 * Detect user management operations.
 * Blocks passwd, usermod, useradd, userdel, groupdel, adduser, etc.
 */
export function isUserManagementOperation(command: string): boolean {
  const normalizedCommand = command.toLowerCase();

  // Skip if it's just echo/cat/print commands WITHOUT file redirection
  if (/^(echo|cat|print|printf)\s/.test(normalizedCommand) &&
      !/>.*\/(etc|usr)\/(passwd|shadow|group)/.test(normalizedCommand)) {
    return false;
  }

  // User management commands
  const userManagementPatterns = [
    /^passwd\b/, // password changes at start
    /\s+passwd\s/, // passwd as a command with space after
    /\s+passwd$/, // passwd at end of command
    /\busermod\b/, // modify user
    /\buseradd\b/, // add user
    /\buserdel\b/, // delete user
    /\badduser\b/, // add user (debian)
    /\bdeluser\b/, // delete user (debian)
    /\bgroupadd\b/, // add group
    /\bgroupdel\b/, // delete group
    /\bgroupmod\b/, // modify group
    /\baddgroup\b/, // add group (debian)
    /\bdelgroup\b/, // delete group (debian)
    /\bgpasswd\b/, // group password
    /\bchage\b/, // change age/expiry
    /\bvipw\b/, // edit passwd file
    /\bvigr\b/, // edit group file
    /\bpwck\b/, // verify passwd file
    /\bgrpck\b/, // verify group file
    /\buserdbctl\b/, // systemd user database
    /\bnewusers\b/, // batch user creation
    /\bchpasswd\b/, // batch password update
  ];

  // Shadow/password file manipulation
  const shadowManipulationPatterns = [
    /\bpwconv\b/, // convert to shadow passwords
    /\bpwunconv\b/, // unconvert from shadow
    /\bgrpconv\b/, // convert to shadow groups
    /\bgrpunconv\b/, // unconvert from shadow groups
    /echo.*>.*\/etc\/passwd/, // writing to passwd
    /echo.*>.*\/etc\/shadow/, // writing to shadow
    /echo.*>.*\/etc\/group/, // writing to group
    /sed.*-i.*\/etc\/passwd/, // editing passwd
    /sed.*-i.*\/etc\/shadow/, // editing shadow
    /sed.*-i.*\/etc\/group/, // editing group
  ];

  // PAM and authentication modifications
  const authPatterns = [
    /\/etc\/pam\.d/, // PAM configuration
    /\bauthconfig\b/, // authentication config
    /\bsystem-auth\b/, // system authentication
    /\bpam_tally\b/, // PAM tally module
    /\bfaillock\b/, // fail lock manipulation
  ];

  // Check all patterns
  const allPatterns = [
    ...userManagementPatterns,
    ...shadowManipulationPatterns,
    ...authPatterns,
  ];

  for (const pattern of allPatterns) {
    if (pattern.test(normalizedCommand)) {
      return true;
    }
  }

  return false;
}
