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

# Link commands and hooks directories
safe_remove "$CLAUDE_TARGET_DIR/commands"
safe_link "$(pwd)/$CLAUDE_DOTFILES_DIR/commands" "$CLAUDE_TARGET_DIR/commands"

safe_remove "$CLAUDE_TARGET_DIR/hooks"
safe_link "$(pwd)/$CLAUDE_DOTFILES_DIR/hooks" "$CLAUDE_TARGET_DIR/hooks"

# ---------------------------------- CURSOR ---------------------------------- #

log_section "CURSOR"
CURSOR_DOTFILES_DIR=".cursor"
CURSOR_TARGET_DIR="$HOME/.cursor"
CURSOR_SETTINGS_FILE="mcp.json"

safe_mkdir "$CURSOR_TARGET_DIR"
safe_remove "$CURSOR_TARGET_DIR/$CURSOR_SETTINGS_FILE"
safe_link "$(pwd)/$CURSOR_DOTFILES_DIR/$CURSOR_SETTINGS_FILE" "$CURSOR_TARGET_DIR/$CURSOR_SETTINGS_FILE"

# ---------------------------------- GEMINI ---------------------------------- #

log_section "GEMINI"
GEMINI_DOTFILES_DIR=".gemini"
GEMINI_TARGET_DIR="$HOME/.gemini"
GEMINI_SETTINGS_FILE="settings.json"

safe_mkdir "$GEMINI_TARGET_DIR"
safe_remove "$GEMINI_TARGET_DIR/$GEMINI_SETTINGS_FILE"
safe_link "$(pwd)/$GEMINI_DOTFILES_DIR/$GEMINI_SETTINGS_FILE" "$GEMINI_TARGET_DIR/$GEMINI_SETTINGS_FILE"

# ---------------------------------- CONFIG ---------------------------------- #

log_section "CONFIG"
CONFIG_DOTFILES_DIR=".config"
CONFIG_TARGET_DIR="$HOME/.config"

safe_mkdir "$CONFIG_TARGET_DIR"

# ---------------------------------- GHOSTTY ---------------------------------- #

log_section "GHOSTTY"
GHOSTTY_DOTFILES_DIR=".config"
GHOSTTY_TARGET_DIR="$HOME/.config"
GHOSTTY_SETTINGS_FILE="ghostty"

safe_remove "$GHOSTTY_TARGET_DIR/$GHOSTTY_SETTINGS_FILE"
safe_link "$(pwd)/$GHOSTTY_DOTFILES_DIR/$GHOSTTY_SETTINGS_FILE" "$GHOSTTY_TARGET_DIR/$GHOSTTY_SETTINGS_FILE"


# ---------------------------------- HELIX ---------------------------------- #

log_section "HELIX"
HELIX_DOTFILES_DIR=".config"
HELIX_TARGET_DIR="$HOME/.config"
HELIX_SETTINGS_FILE="helix"

safe_remove "$HELIX_TARGET_DIR/$HELIX_SETTINGS_FILE"
safe_link "$(pwd)/$HELIX_DOTFILES_DIR/$HELIX_SETTINGS_FILE" "$HELIX_TARGET_DIR/$HELIX_SETTINGS_FILE"
