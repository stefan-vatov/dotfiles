/**
 * Detect system control operations including reboot, shutdown, service management,
 * firewall rules, filesystem mounting, and scheduled tasks.
 */
export function isSystemControlOperation(command: string): boolean {
  const normalizedCommand = command.toLowerCase();

  // Skip if it's just echo/cat/print commands WITHOUT dangerous redirections
  if (/^(echo|cat|print|printf)\s/.test(normalizedCommand) &&
      !/>.*\/(etc\/(cron|init|systemd|fstab)|boot|sys|proc)/.test(normalizedCommand)) {
    return false;
  }

  // Pattern 1: System shutdown/reboot
  const shutdownPatterns = [
    /^reboot$/, // just reboot
    /^reboot\s/, // reboot with arguments
    /\s+reboot$/, // reboot at end
    /\s+reboot\s/, // reboot in middle
    /^shutdown\s/, // shutdown with args
    /\s+shutdown\s/, // shutdown in middle
    /^halt$/, // just halt
    /^halt\s/, // halt with args
    /\s+halt$/, // halt at end
    /\s+halt\s/, // halt in middle
    /^poweroff$/, // just poweroff
    /^poweroff\s/, // poweroff with args
    /\s+poweroff$/, // poweroff at end
    /\s+poweroff\s/, // poweroff in middle
    /\binit\s+0\b/, // init 0 (halt)
    /\binit\s+6\b/, // init 6 (reboot)
    /\btelinit\s+[06]\b/, // telinit 0 or 6
    /systemctl\s+(reboot|poweroff|halt)/, // systemctl variants
    /\/sbin\/(reboot|shutdown|halt|poweroff)/, // direct sbin calls
  ];

  // Pattern 2: Service management
  const servicePatterns = [
    /\bsystemctl\s+(start|stop|restart|enable|disable|mask|unmask)/, // systemctl service control
    /\bservice\s+\w+\s+(start|stop|restart)/, // service command
    /\/etc\/init\.d\//, // init.d scripts
    /\bchkconfig\b/, // chkconfig service management
    /\bupdate-rc\.d\b/, // debian service management
    /\brc-update\b/, // openrc service management
    /\bsv\s+(up|down|restart)/, // runit service management
    /\bs6-/, // s6 service management
  ];

  // Pattern 3: Scheduled tasks
  const scheduledTaskPatterns = [
    /\bcrontab\s+(-e|-r|-u)/, // crontab edit/remove/user
    /\bcrontab\s+[^-]/, // crontab with file
    /^crontab$/, // just crontab
    /\bat\s+\d/, // at command with time
    /\bat\s+now/, // at now
    /\bat\s+noon/, // at noon
    /\bat\s+midnight/, // at midnight
    /\bat\s+teatime/, // at teatime
    /\batq\b/, // at queue
    /\batrm\b/, // at remove
    /\bbatch\b/, // batch command
    />.*\/etc\/cron/, // writing to cron directories
    /\/var\/spool\/cron/, // cron spool
    /systemctl.*(enable|disable|edit).*timer/, // systemd timer modifications
    /systemd-run.*--on/, // systemd scheduled runs
  ];

  // Pattern 4: Firewall management
  const firewallPatterns = [
    /\biptables\s+-[adifxpnADIFXPN]/, // iptables modifications (short form)
    /\biptables\s+--[a-z]/, // iptables modifications (long form)
    /\bip6tables\s+-[adifxpnADIFXPN]/, // IPv6 tables modifications (short form)
    /\bip6tables\s+--[a-z]/, // IPv6 tables modifications (long form)
    /\bufw\s+(enable|disable|allow|deny|reject|limit|delete|insert|route|prepend)/, // ufw modifications
    /\bfirewall-cmd\s+--add/, // firewalld add rules
    /\bfirewall-cmd\s+--remove/, // firewalld remove rules
    /\bfirewall-cmd\s+--permanent/, // firewalld permanent changes
    /\bnft\s+(add|delete|flush|insert)/, // nftables modifications
    /\bnftables\s+-f/, // nftables file load
    /\bpfctl\s+-[edfedfEDF]/, // PF control modifications
    /\bipfw\s+(add|delete|flush)/, // IP firewall modifications
  ];

  // Pattern 5: Filesystem mounting
  const mountPatterns = [
    /\bmount\s+(-t|-o|-a)/, // mount with options
    /\bmount\s+\/dev/, // mount devices
    /\bmount\s+[^\/]*\s+\//, // mount something to a path
    /\bumount\s+(-f|-l|-a)/, // umount with force/lazy/all
    /\bumount\s+\//, // umount a path
    />.*\/etc\/fstab/, // writing to fstab
    /\blosetup\s+(-d|-f|\/dev)/, // loop device setup
    /\bswapon\s/, // enable swap
    /\bswapoff\s/, // disable swap
    /\bmount\./, // mount.type commands
  ];

  // Pattern 6: Kernel and module management
  const kernelPatterns = [
    /\binsmod\b/, // insert module
    /\brmmod\b/, // remove module
    /\bmodprobe\b/, // module probe
    /\blsmod\b/, // list modules
    /\bmodinfo\b/, // module info
    /\bdepmod\b/, // module dependencies
    /\bkexec\b/, // kernel execution
    /\/proc\/sys/, // sysctl via proc
    /\bsysctl\s+-w/, // sysctl write
  ];

  // Check all patterns
  const allPatterns = [
    ...shutdownPatterns,
    ...servicePatterns,
    ...scheduledTaskPatterns,
    ...firewallPatterns,
    ...mountPatterns,
    ...kernelPatterns,
  ];

  for (const pattern of allPatterns) {
    if (pattern.test(normalizedCommand)) {
      return true;
    }
  }

  return false;
}
