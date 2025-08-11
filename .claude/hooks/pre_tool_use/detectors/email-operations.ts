/**
 * Detect email sending operations.
 * Blocks mail, sendmail, postfix, and other email-related commands.
 */
export function isEmailOperation(command: string): boolean {
  const normalizedCommand = command.toLowerCase();

  // Email sending commands
  const emailPatterns = [
    /\bmail\s+[a-zA-Z0-9@.-]+/, // mail command with recipient
    /^mail\s/, // mail at start with space
    /\bmailx\b/, // enhanced mail
    /\bsendmail\b/, // sendmail
    /\bpostfix\b/, // postfix mail server
    /\bexim\b/, // exim mail server
    /\bmutt\b/, // mutt email client
    /\bmsmtp\b/, // SMTP client
    /\bssmtp\b/, // simple SMTP
    /\bswaks\b/, // Swiss Army Knife SMTP
    /\bsendemail\b/, // sendemail command
    /\bmailq\b/, // mail queue
    /\bpostqueue\b/, // postfix queue
    /\bpostsuper\b/, // postfix management
  ];

  // SMTP-related patterns
  const smtpPatterns = [
    /telnet\s+.*\s+(25|587|465)\b/, // telnet to SMTP ports
    /nc\s+.*\s+(25|587|465)\b/, // netcat to SMTP ports
    /openssl\s+s_client.*:(25|587|465)\b/, // OpenSSL to SMTP
    /python.*smtplib/, // Python SMTP
    /perl.*(Net::SMTP|net\/smtp)/i, // Perl SMTP
    /php.*mail\s*\(/, // PHP mail function
    /ruby.*(Net::SMTP|net\/smtp)/i, // Ruby SMTP
  ];

  // Check all patterns
  const allPatterns = [...emailPatterns, ...smtpPatterns];

  for (const pattern of allPatterns) {
    if (pattern.test(normalizedCommand)) {
      return true;
    }
  }

  return false;
}
