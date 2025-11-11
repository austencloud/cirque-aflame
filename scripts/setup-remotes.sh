#!/bin/bash

# Git Remote Setup Script
# Configures git remotes for each project's individual repository
#
# Run this ONCE after creating the individual repositories on GitHub

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up git remotes for individual repositories${NC}\n"

echo "This script will add the following remotes:"
echo "  ringmaster    -> https://github.com/austencloud/ringmaster.git"
echo "  cirque-website -> https://github.com/austencloud/cirque-aflame-web.git"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Add remotes
git remote add ringmaster https://github.com/austencloud/ringmaster.git 2>/dev/null || echo "Remote ringmaster already exists"
git remote add cirque-website https://github.com/austencloud/cirque-aflame-web.git 2>/dev/null || echo "Remote cirque-website already exists"

echo -e "\n${GREEN}Remotes configured!${NC}"
echo "Run 'git remote -v' to verify"
