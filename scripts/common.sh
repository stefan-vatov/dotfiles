#!/bin/bash

# ================================ LOGGING SYSTEM ================================ #

# Color constants
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[>]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[+]${NC} $1"
}

log_error() {
    echo -e "${RED}[!]${NC} $1"
}

log_remove() {
    echo -e "${YELLOW}[-]${NC} $1"
}

log_section() {
    echo ""
    echo -e "${BLUE}============== $1 ==============${NC}"
}

# Helper functions for common operations
safe_mkdir() {
    local dir="$1"
    if mkdir -p "$dir" 2>/dev/null; then
        log_success "Created directory: $dir"
    else
        log_error "Failed to create directory: $dir"
        return 1
    fi
}

safe_remove() {
    local file="$1"
    if [ -e "$file" ] || [ -L "$file" ]; then
        if rm -f "$file" 2>/dev/null; then
            log_remove "Removed existing: $file"
        else
            log_error "Failed to remove: $file"
            return 1
        fi
    else
        log_info "No existing file to remove: $file"
    fi
}

safe_link() {
    local source="$1"
    local target="$2"
    if ln -s "$source" "$target" 2>/dev/null; then
        log_success "Created symlink: $target -> $source"
    else
        log_error "Failed to create symlink: $target -> $source"
        return 1
    fi
}
