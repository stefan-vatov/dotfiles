/**
 * Detect access to sensitive files including credentials, keys, browser data, and history.
 */
export function isSensitiveFileAccess(
  toolName: string,
  toolInput: Record<string, unknown>,
): boolean {
  // Define sensitive file patterns
  const sensitivePatterns = [
    // System credential files
    /\/etc\/shadow/,
    /\/etc\/gshadow/,
    /\/etc\/passwd(?!\.sample|\.example)/,
    /\/etc\/master\.passwd/, // BSD

    // SSH keys
    /\.ssh\/id_[a-z]+($|\.pub|_sk)/,
    /\.ssh\/id_[a-z]+/, // simplified pattern
    /\.ssh\/.*\.pem/,
    /\.ssh\/.*\.key/,
    /\.ssh\/.*_key/,
    /\.ssh\/authorized_keys/,
    /\.ssh\/known_hosts/,
    /\.ssh\/config/,

    // GPG/PGP
    /\.gnupg\//,
    /\.pgp\//,
    /secring/,
    /pubring/,
    /trustdb/,

    // Cloud credentials
    /\.aws\/credentials/,
    /\.aws\/config/,
    /\.boto/,
    /\.s3cfg/,
    /\.gcp\/.*\.json/,
    /\.azure\//,
    /\.kube\/config/,
    /\.kubectl\/config/,
    /\.docker\/config\.json/,
    /\.dockercfg/,

    // Development credentials
    /\.npm\/.*rc/,
    /\.npmrc/,
    /\.yarnrc/,
    /\.bundle\/config/,
    /\.gem\/credentials/,
    /\.pypirc/,
    /\.cargo\/credentials/,
    /\.netrc/,
    /\.git-credentials/,
    /\.gitconfig/,
    /\.netrc/,

    // Certificate files
    /\.pem$/,
    /\.key$/,
    /\.pfx$/,
    /\.p12$/,
    /\.cer$/,
    /\.crt$/,
    /\.der$/,
    /private.*\.key/,
    /ssl\/.*\.key/,
    /tls\/.*\.key/,
    /certs\/.*\.key/,

    // Browser data
    /\.mozilla\/.*\/key[34]\.db/,
    /\.mozilla\/.*\/logins\.json/,
    /\.mozilla\/.*\/cookies\.sqlite/,
    /\.mozilla\/.*\/cert[89]\.db/,
    /Library\/Application Support\/Google\/Chrome.*\/Cookies/,
    /Library\/Application Support\/Google\/Chrome.*\/Login Data/,
    /Library\/Application Support\/Google\/Chrome.*\/Web Data/,
    /\.config\/google-chrome.*\/Cookies/,
    /\.config\/google-chrome.*\/Login Data/,
    /\.config\/google-chrome.*\/Web Data/,
    /AppData.*\\Google\\Chrome.*\\Cookies/,
    /AppData.*\\Google\\Chrome.*\\Login Data/,
    /AppData.*\\Google\\Chrome.*\\Web Data/,
    /brave.*\/Cookies/,
    /brave.*\/Login Data/,
    /brave.*\/Web Data/,
    /BraveSoftware.*\/Cookies/,
    /BraveSoftware.*\/Login Data/,
    /BraveSoftware.*\/Web Data/,

    // Password managers
    /\.password-store\//,
    /keepass/i,
    /1password/i,
    /bitwarden/i,
    /lastpass/i,

    // Shell history (might contain passwords)
    /history$/, // matches .bash_history, .zsh_history, etc
    /\.bash_history/,
    /\.zsh_history/,
    /\.sh_history/,
    /\.histfile/,
    /\.mysql_history/,
    /\.psql_history/,
    /\.sqlite_history/,
    /\.python_history/,
    /\.node_repl_history/,
    /\.irb_history/,

    // Other sensitive files
    /\.lesshst/, // less history
    /\.viminfo/, // vim info
    /\.wget-hsts/, // wget history
    /\.rnd/, // random seed
    /\.Xauthority/, // X11 auth
    /\.rhosts/, // remote hosts
    /\.shosts/, // secure hosts
    /wallet\.dat/, // cryptocurrency wallets
    /\.electrum\/wallets/,
  ];

  // Handle Bash commands for sensitive file access
  if (toolName === "Bash") {
    const command = String(toolInput.command || "").toLowerCase();

    // Check for commands that read files
    const readCommands = [
      /\bcat\b/,
      /\bless\b/,
      /\bmore\b/,
      /\bhead\b/,
      /\btail\b/,
      /\bgrep\b/,
      /\bsed\b.*-n.*p/, // sed print
      /\bawk\b/,
      /\bcut\b/,
      /\bstrings\b/,
      /\bxxd\b/,
      /\bhexdump\b/,
      /\bod\s/, // od with space to avoid matching words
      /^od\b/, // od at start
      /\bfile\s/, // file with space
      /^file\b/, // file at start
      /\bfind\b.*-exec.*cat/,
      /\bxargs\b.*cat/,
      /\bopenssl\b.*\s(rsa|x509|pkcs12|pkey|ec|dsa)/, // openssl key operations
      /\bsqlite3?\b/, // sqlite database access
    ];

    // Check for history command specifically
    if (/\bhistory\b/.test(command)) {
      return true;
    }

    // Check if any read command is accessing sensitive files
    for (const readCmd of readCommands) {
      if (readCmd.test(command)) {
        for (const pattern of sensitivePatterns) {
          if (pattern.test(command)) {
            return true;
          }
        }
      }
    }

    // Check for cp/mv commands with sensitive files
    if (/\b(cp|mv)\b/.test(command)) {
      for (const pattern of sensitivePatterns) {
        if (pattern.test(command)) {
          return true;
        }
      }
    }
  }

  // Handle file-based tools
  if (["Read", "Edit", "MultiEdit", "Write"].includes(toolName)) {
    const filePath = String(toolInput.file_path || "");

    for (const pattern of sensitivePatterns) {
      if (pattern.test(filePath)) {
        return true;
      }
    }
  }

  // Handle Glob tool
  if (toolName === "Glob") {
    const pattern = String(toolInput.pattern || "");

    // Check if searching for sensitive files
    const sensitiveGlobPatterns = [
      /\*\.pem/,
      /\*\.key/,
      /\*\.pfx/,
      /\*_key/,
      /\*password\*/,
      /\*credential\*/,
      /id_[a-z]+/,
      /authorized_keys/,
      /\.ssh\//,
      /\.gnupg\//,
      /\.aws\//,
      /\.kube\//,
      /history$/,
    ];

    for (const globPattern of sensitiveGlobPatterns) {
      if (globPattern.test(pattern)) {
        return true;
      }
    }
  }

  // Handle Grep tool
  if (toolName === "Grep") {
    const pattern = String(toolInput.pattern || "");
    const path = String(toolInput.path || "");
    const glob = String(toolInput.glob || "");

    // Check if searching in sensitive locations (only check basic ones for grep path)
    const grepSensitivePathPatterns = [
      /\.ssh$/,
      /\.ssh\//,
      /\.gnupg$/,
      /\.gnupg\//,
      /\.aws$/,
      /\.aws\//,
    ];

    for (const sensitivePattern of grepSensitivePathPatterns) {
      if (sensitivePattern.test(path) || sensitivePattern.test(glob)) {
        return true;
      }
    }

    // Check if searching for sensitive content
    const sensitiveSearchPatterns = [
      /password/i,
      /secret/i,
      /private.*key/i,
      /api.*key/i,
      /access.*token/i,
      /auth.*token/i,
      /bearer/i,
      /credential/i,
    ];

    for (const searchPattern of sensitiveSearchPatterns) {
      if (searchPattern.test(pattern)) {
        // If searching for sensitive content in home or system directories
        if (!path.includes("/tmp") && !path.includes("/var/tmp")) {
          return true;
        }
      }
    }
  }

  // Handle LS tool
  if (toolName === "LS") {
    const path = String(toolInput.path || "");

    // Check for listing sensitive directories
    const sensitiveDirs = [
      /\.ssh$/,
      /\.gnupg$/,
      /\.aws$/,
      /\.kube$/,
      /\.docker$/,
      /\/etc$/,
      /\.password-store$/,
    ];

    for (const dir of sensitiveDirs) {
      if (dir.test(path)) {
        return true;
      }
    }
  }

  // Handle Task tool
  if (toolName === "Task") {
    const prompt = String(toolInput.prompt || "").toLowerCase();
    const description = String(toolInput.description || "").toLowerCase();

    // Check if task involves sensitive files
    const taskSensitivePatterns = [
      /ssh.*key/,
      /private.*key/,
      /credential/,
      /password/,
      /\.aws/,
      /\.kube/,
      /history/,
      /shadow/,
      /passwd.*file/,
      /certificate/,
      /\.pem/,
      /\.key/,
      /browser.*password/,
      /browser.*data/,
      /browser.*profile/,
    ];

    for (const pattern of taskSensitivePatterns) {
      if (pattern.test(prompt) || pattern.test(description)) {
        return true;
      }
    }
  }

  return false;
}
