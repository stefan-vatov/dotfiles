#!/bin/bash

# Source common logging functions
source "$(dirname "$0")/common.sh"

# ---------------------------------- CLAUDE ---------------------------------- #

log_section "CLAUDE"
CLAUDE_TARGET_DIR="$HOME/.claude"
CLAUDE_SETTINGS_FILE="settings.json"

safe_remove "$CLAUDE_TARGET_DIR/$CLAUDE_SETTINGS_FILE"

# ---------------------------------- CURSOR ---------------------------------- #

log_section "CURSOR"
CURSOR_TARGET_DIR="$HOME/.cursor"
CURSOR_SETTINGS_FILE="mcp.json"

safe_remove "$CURSOR_TARGET_DIR/$CURSOR_SETTINGS_FILE"

log_section "GEMINI"
GEMINI_TARGET_DIR="$HOME/.gemini"
GEMINI_SETTINGS_FILE="settings.json"

safe_remove "$GEMINI_TARGET_DIR/$GEMINI_SETTINGS_FILE"
