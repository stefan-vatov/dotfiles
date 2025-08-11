#!/usr/bin/env -S deno run --allow-read --allow-write=./logs --allow-env

// Toggle logging to files - set to false to disable file logging
const ENABLE_LOGGING = false;

import { readAll } from "https://deno.land/std@0.224.0/io/read_all.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import type { ToolInput } from "./pre_tool_use/types.ts";
import {
  isDangerousRmCommand,
  isIndirectRm,
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

async function logBlockedOperation(
  inputData: ToolInput,
  reason: string,
  errorMessage: string,
) {
  if (ENABLE_LOGGING) {
    try {
      const logDir = "./logs";
      await ensureDir(logDir);
      const logPath = `${logDir}/pre_tool_use_blocked.json`;

      let blockedData: Array<
        ToolInput & { timestamp: string; reason: string }
      > = [];
      try {
        const existingData = await Deno.readTextFile(logPath);
        blockedData = JSON.parse(existingData);
      } catch {
        blockedData = [];
      }

      blockedData.push({
        ...inputData,
        timestamp: new Date().toISOString(),
        reason,
      });

      await Deno.writeTextFile(logPath, JSON.stringify(blockedData, null, 2));
    } catch {
      // Ignore logging errors
    }
  }

  console.error(errorMessage);
  Deno.exit(2); // Exit code 2 blocks tool call and shows error to Claude
}

async function main() {
  try {
    // Read JSON input from stdin
    const stdinBytes = await readAll(Deno.stdin);
    const stdinText = new TextDecoder().decode(stdinBytes);
    const inputData: ToolInput = JSON.parse(stdinText);

    const toolName = inputData.tool_name || "";
    const toolInput = inputData.tool_input || {};

    // Check for sensitive file access (applies to multiple tools)
    if (isSensitiveFileAccess(toolName, toolInput)) {
      await logBlockedOperation(
        inputData,
        "sensitive_file_access",
        "Safety check: Access to sensitive files containing credentials or personal data is restricted",
      );
    }

    // Check for .env file access
    if (isEnvFileAccess(toolName, toolInput)) {
      await logBlockedOperation(
        inputData,
        "env_file_access",
        "Safety check: Environment file operations are restricted to protect sensitive data",
      );
    }

    // Bash command checks
    if (toolName === "Bash") {
      const command = String(toolInput.command || "");

      // Check for fork bombs first (highest priority)
      if (isForkBomb(command)) {
        await logBlockedOperation(
          inputData,
          "fork_bomb",
          "Safety check: Fork bomb patterns detected - this could crash the system",
        );
      }

      // Check for dangerous rm -rf commands
      if (isDangerousRmCommand(command) || await isIndirectRm(command)) {
        await logBlockedOperation(
          inputData,
          "dangerous_rm_command",
          "Safety check: File deletion commands are restricted to prevent accidental data loss",
        );
      }

      // Check other file deletion methods
      if (isFileDeletionAttempt(command)) {
        await logBlockedOperation(
          inputData,
          "file_deletion_attempt",
          "Safety check: File deletion commands are restricted to prevent accidental data loss",
        );
      }

      // Check dangerous system operations
      if (isDangerousSystemOperation(command)) {
        await logBlockedOperation(
          inputData,
          "dangerous_system_operation",
          "Safety check: System operations that could damage disks or partitions are restricted",
        );
      }

      // Check network operations
      if (isNetworkOperation(command)) {
        await logBlockedOperation(
          inputData,
          "network_operation",
          "Safety check: Network operations and remote connections are restricted",
        );
      }

      // Check email operations
      if (isEmailOperation(command)) {
        await logBlockedOperation(
          inputData,
          "email_operation",
          "Safety check: Email sending operations are restricted",
        );
      }

      // Check permission operations
      if (isDangerousPermissionOperation(command)) {
        await logBlockedOperation(
          inputData,
          "permission_operation",
          "Safety check: Dangerous permission changes that could compromise system security are restricted",
        );
      }

      // Check user management operations
      if (isUserManagementOperation(command)) {
        await logBlockedOperation(
          inputData,
          "user_management",
          "Safety check: User and group management operations are restricted",
        );
      }

      // Check system control operations
      if (isSystemControlOperation(command)) {
        await logBlockedOperation(
          inputData,
          "system_control",
          "Safety check: System control operations including reboot, service management, and firewall changes are restricted",
        );
      }
    }

    // If we get here, the operation is allowed
    // Log the allowed operation
    if (ENABLE_LOGGING) {
      const logDir = "./logs";
      await ensureDir(logDir);
      const logPath = `${logDir}/pre_tool_use.json`;

      let logData: Array<ToolInput & { timestamp: string; blocked: boolean }> =
        [];
      try {
        const existingData = await Deno.readTextFile(logPath);
        logData = JSON.parse(existingData);
      } catch {
        logData = [];
      }

      const logEntry = {
        ...inputData,
        timestamp: new Date().toISOString(),
        blocked: false,
      };
      logData.push(logEntry);

      await Deno.writeTextFile(logPath, JSON.stringify(logData, null, 2));
    }

    Deno.exit(0);
  } catch (error) {
    // Log errors
    if (ENABLE_LOGGING) {
      try {
        const logDir = "./logs";
        await ensureDir(logDir);
        const errorLogPath = `${logDir}/pre_tool_use_errors.log`;
        await Deno.writeTextFile(
          errorLogPath,
          `${new Date().toISOString()}: ${error}\n`,
          { append: true },
        );
      } catch {
        // If we can't even log the error, just exit
      }
    }
    Deno.exit(0);
  }
}

if (import.meta.main) {
  await main();
}
