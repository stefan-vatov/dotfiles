/**
 * Detect network operations including remote connections, transfers, and network protocols.
 * Blocks ssh, scp, sftp, rsync, telnet, ftp, socat, openssl s_client
 */
export function isNetworkOperation(command: string): boolean {
  const normalizedCommand = command.toLowerCase();

  // Pattern 1: SSH and related commands
  const sshPatterns = [
    /\bssh\b/, // ssh connections
    /\bscp\b/, // secure copy
    /\bsftp\b/, // secure FTP
    /\brsync\b/, // rsync transfers
    /\bssh-copy-id\b/, // SSH key copying
    /\bssh-keygen\b.*-f\s*\//, // SSH key generation to system paths
  ];

  // Pattern 2: Legacy/insecure protocols
  const insecureProtocolPatterns = [
    /\btelnet\b/, // telnet connections
    /\bftp\s/, // ftp with space (to avoid matching sftp)
    /\bftp$/, // ftp at end of line
    /^ftp\b/, // ftp at start
    /\brlogin\b/, // remote login
    /\brsh\b/, // remote shell
    /\brexec\b/, // remote execution
  ];

  // Pattern 3: Advanced networking tools
  const advancedNetworkPatterns = [
    /\bsocat\b/, // multipurpose relay
    /\bopenssl\s+s_client/, // OpenSSL client connections
    /\bnc\s/, // netcat with space
    /\bnc$/, // netcat at end
    /^nc\b/, // netcat at start
    /\bnetcat\b/, // netcat full name
    /\bncat\b/, // nmap's netcat
    /\bcryptcat\b/, // encrypted netcat
  ];

  // Pattern 4: Network scanning/exploitation
  const scanningPatterns = [
    /\bnmap\b/, // network mapper
    /\bmasscan\b/, // mass IP port scanner
    /\bzmap\b/, // fast internet scanner
    /\bhping\d*\b/, // packet crafting (hping, hping2, hping3)
    /\btcpdump\b/, // packet capture
    /\bwireshark\b/, // packet analysis
    /\btshark\b/, // terminal wireshark
  ];

  // Check all patterns
  const allPatterns = [
    ...sshPatterns,
    ...insecureProtocolPatterns,
    ...advancedNetworkPatterns,
    ...scanningPatterns,
  ];

  for (const pattern of allPatterns) {
    if (pattern.test(normalizedCommand)) {
      return true;
    }
  }

  // Special check for curl/wget to external IPs or suspicious domains
  if (/\b(curl|wget)\b/.test(normalizedCommand)) {
    const suspiciousPatterns = [
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, // IP addresses
      /\.(tk|ml|ga|cf)\b/, // suspicious TLDs
      /pastebin/, // pastebin sites
      /bit\.ly|tinyurl|goo\.gl/, // URL shorteners
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }
  }

  return false;
}
