#!/usr/bin/env bash

# Claude Code Hooks Test Runner
# Runs all test files in the hooks directory

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}Claude Code Hooks Test Runner${NC}"
echo "================================"
echo ""

# Check if deno is available
if ! command -v deno &> /dev/null; then
    echo -e "${RED}Error: Deno is not installed or not in PATH${NC}"
    echo "Please install Deno: https://deno.land"
    exit 1
fi

echo -e "${YELLOW}Deno version:${NC} $(deno --version | head -n 1)"
echo ""

# Find all test files
test_files=()
while IFS= read -r -d '' file; do
    test_files+=("$file")
done < <(find . -name "*_test.ts" -type f -print0 | sort -z)

if [ ${#test_files[@]} -eq 0 ]; then
    echo -e "${YELLOW}No test files found${NC}"
    exit 0
fi

echo -e "${BLUE}Found ${#test_files[@]} test file(s):${NC}"
for file in "${test_files[@]}"; do
    echo "  - $file"
done
echo ""

# Track overall results
total_passed=0
total_failed=0
failed_files=()

# Run each test file
for test_file in "${test_files[@]}"; do
    echo -e "${BLUE}Running: $test_file${NC}"
    echo "----------------------------------------"

    # Run the test and let it output directly to terminal
    if deno test "$test_file" --allow-read; then
        echo ""
        echo -e "${GREEN}✓ All tests passed${NC}"
        ((total_passed++))
    else
        echo ""
        echo -e "${RED}✗ Some tests failed${NC}"
        failed_files+=("$test_file")
        ((total_failed++))
    fi

    echo ""
done

# Summary
echo "================================"
echo -e "${BLUE}Test Summary${NC}"
echo "================================"
echo -e "Total test files: ${#test_files[@]}"
echo -e "${GREEN}Passed: $total_passed${NC}"
echo -e "${RED}Failed: $total_failed${NC}"

if [ ${#failed_files[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Failed test files:${NC}"
    for file in "${failed_files[@]}"; do
        echo -e "  ${RED}✗${NC} $file"
    done
    exit 1
else
    echo ""
    echo -e "${GREEN}All tests passed! 🎉${NC}"
    exit 0
fi
