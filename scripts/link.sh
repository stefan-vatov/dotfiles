#!/bin/bash

# Source common logging functions
source "$(dirname "$0")/common.sh"

# ---------------------------------- CLAUDE ---------------------------------- #

log_section "CLAUDE"
CLAUDE_DOTFILES_DIR=".claude"
CLAUDE_TARGET_DIR="$HOME/.claude"
CLAUDE_SETTINGS_FILE="settings.json"

safe_mkdir "$CLAUDE_TARGET_DIR"
safe_remove "$CLAUDE_TARGET_DIR/$CLAUDE_SETTINGS_FILE"
safe_link "$(pwd)/$CLAUDE_DOTFILES_DIR/$CLAUDE_SETTINGS_FILE" "$CLAUDE_TARGET_DIR/$CLAUDE_SETTINGS_FILE"

# ---------------------------------- CURSOR ---------------------------------- #

log_section "CURSOR"
CURSOR_DOTFILES_DIR=".cursor"
CURSOR_TARGET_DIR="$HOME/.cursor"
CURSOR_SETTINGS_FILE="mcp.json"

safe_mkdir "$CURSOR_TARGET_DIR"
safe_remove "$CURSOR_TARGET_DIR/$CURSOR_SETTINGS_FILE"
safe_link "$(pwd)/$CURSOR_DOTFILES_DIR/$CURSOR_SETTINGS_FILE" "$CURSOR_TARGET_DIR/$CURSOR_SETTINGS_FILE"

log_section "GEMINI"
GEMINI_DOTFILES_DIR=".gemini"
GEMINI_TARGET_DIR="$HOME/.gemini"
GEMINI_SETTINGS_FILE="settings.json"

safe_mkdir "$GEMINI_TARGET_DIR"
safe_remove "$GEMINI_TARGET_DIR/$GEMINI_SETTINGS_FILE"
safe_link "$(pwd)/$GEMINI_DOTFILES_DIR/$GEMINI_SETTINGS_FILE" "$GEMINI_TARGET_DIR/$GEMINI_SETTINGS_FILE"
