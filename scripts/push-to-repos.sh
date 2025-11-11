#!/bin/bash

# Git Subtree Push Script
# Pushes each project from the monorepo to its individual repository
#
# Usage:
#   ./scripts/push-to-repos.sh [project-name]
#
# Examples:
#   ./scripts/push-to-repos.sh              # Push all projects
#   ./scripts/push-to-repos.sh cirque-app   # Push only cirque-app
#   ./scripts/push-to-repos.sh cirque-website

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project configurations
# Format: "project-folder:remote-name:remote-url"
declare -A PROJECTS=(
    ["cirque-app"]="cirque-app:https://github.com/austencloud/ringmaster.git"
    ["cirque-website"]="cirque-website:https://github.com/austencloud/cirque-website.git"
)

# Function to push a single project
push_project() {
    local project_folder=$1
    local remote_info=${PROJECTS[$project_folder]}

    if [ -z "$remote_info" ]; then
        echo -e "${RED}Error: Unknown project '$project_folder'${NC}"
        return 1
    fi

    IFS=':' read -r remote_name remote_url <<< "$remote_info"

    echo -e "${YELLOW}Pushing $project_folder to $remote_url${NC}"

    # Check if remote exists, if not add it
    if ! git remote get-url "$remote_name" &> /dev/null; then
        echo "Adding remote $remote_name..."
        git remote add "$remote_name" "$remote_url"
    fi

    # Push using subtree
    echo "Pushing subtree..."
    git subtree push --prefix="$project_folder" "$remote_name" main

    echo -e "${GREEN}✓ Successfully pushed $project_folder${NC}\n"
}

# Main execution
main() {
    local target_project=$1

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
        echo -e "${RED}Error: Must be run from monorepo root${NC}"
        exit 1
    fi

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them first.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Starting git subtree push...${NC}\n"

    if [ -z "$target_project" ]; then
        # Push all projects
        for project in "${!PROJECTS[@]}"; do
            push_project "$project"
        done
    else
        # Push specific project
        push_project "$target_project"
    fi

    echo -e "${GREEN}All done!${NC}"
}

# Show usage if --help
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [project-name]"
    echo ""
    echo "Push projects to individual repos using git subtree"
    echo ""
    echo "Available projects:"
    for project in "${!PROJECTS[@]}"; do
        echo "  - $project"
    done
    exit 0
fi

main "$@"
