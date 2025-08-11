/**
 * Detect dangerous system operations that could damage the system.
 * Includes disk operations, filesystem formatting, and partition manipulation.
 */
export function isDangerousSystemOperation(command: string): boolean {
  // Normalize command for consistent matching
  const normalizedCommand = command.toLowerCase();

  // Pattern 1: File shredding commands
  const shredPatterns = [
    /\bshred\b/, // shred command for secure file deletion
    /\bwipe\b/, // wipe command for secure deletion
    /\bscrub\b/, // scrub command for disk wiping
    /\bblkdiscard\b/, // block device discard
  ];

  // Pattern 2: Disk/Device operations
  const diskOperationPatterns = [
    /\bdd\s+.*of=\/dev\//, // dd writing to devices
    /\bdd\s+.*of=\/dev$/,  // dd writing to /dev
    />\s*\/dev\/[sh]d[a-z]/, // redirecting to disk devices
    />>\s*\/dev\/[sh]d[a-z]/, // appending to disk devices
    /\bcat\s+.*>\s*\/dev\/[sh]d/, // cat to disk devices
    /\becho\s+.*>\s*\/dev\/[sh]d/, // echo to disk devices
    /\/dev\/[sh]d[a-z]\d*\s*</, // reading into disk devices
    /\bcp\s+.*\/dev\/[sh]d[a-z]/, // cp to disk devices
    /\bmv\s+.*\/dev\/[sh]d[a-z]/, // mv to disk devices
  ];

  // Pattern 3: Filesystem formatting
  const filesystemPatterns = [
    /\bmkfs\b/, // mkfs and all variants (mkfs.ext4, mkfs.xfs, etc.)
    /\bmke2fs\b/, // ext2/3/4 filesystem creation
    /\bmkfs\.[a-z0-9]+/, // mkfs.ext4, mkfs.xfs, mkfs.btrfs, etc.
    /\bmkswap\b/, // swap space creation
    /\bmkdosfs\b/, // DOS filesystem creation
    /\bmkvfat\b/, // VFAT filesystem creation
  ];

  // Pattern 4: Partition manipulation
  const partitionPatterns = [
    /\bfdisk\b/, // fdisk partition tool
    /\bparted\b/, // parted partition tool
    /\bgparted\b/, // gparted GUI partition tool
    /\bsfdisk\b/, // scriptable fdisk
    /\bgdisk\b/, // GPT fdisk
    /\bsgdisk\b/, // scriptable gdisk
    /\bcfdisk\b/, // curses fdisk
    /\bpartprobe\b/, // inform OS of partition changes
    /\bpartx\b/, // partition table manipulator
  ];

  // Pattern 5: Bootloader and system critical operations
  const bootloaderPatterns = [
    /\bgrub-install\b/, // GRUB bootloader installation
    /\bupdate-grub\b/, // GRUB configuration update
    /\befibootmgr\b/, // EFI boot manager
    /\bbootctl\b/, // systemd-boot control
  ];

  // Check all patterns
  const allPatterns = [
    ...shredPatterns,
    ...diskOperationPatterns,
    ...filesystemPatterns,
    ...partitionPatterns,
    ...bootloaderPatterns,
  ];

  for (const pattern of allPatterns) {
    if (pattern.test(normalizedCommand)) {
      return true;
    }
  }

  // Additional check for dd command specifically
  // Block dd if it has 'of=' parameter (output file) pointing to sensitive locations
  if (/\bdd\b/.test(normalizedCommand)) {
    const ddDangerousPatterns = [
      /of=\/(?!tmp|home|users|var\/tmp)/, // dd writing to root-level directories
      /of=\/boot/, // dd writing to boot
      /of=\/etc/, // dd writing to etc
      /of=\/bin/, // dd writing to bin
      /of=\/sbin/, // dd writing to sbin
      /of=\/lib/, // dd writing to lib
      /of=\/usr/, // dd writing to usr (except /usr/local)
      /of=\.\.\//, // dd writing to parent directories
    ];

    for (const pattern of ddDangerousPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }
  }

  return false;
}
