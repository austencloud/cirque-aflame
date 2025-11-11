# Quick Reference - Multi-Repo Commands

## Initial Setup (One Time)

```bash
# 1. Create individual repos on GitHub (empty, no README)
#    - cirque-app
#    - cirque-website

# 2. Update URLs in scripts/push-to-repos.sh
#    Replace YOUR-USERNAME with your GitHub username

# 3. Setup remotes
./scripts/setup-remotes.sh

# 4. Initial push
git add .
git commit -m "Setup multi-repo architecture"
./scripts/push-to-repos.sh
```

## Daily Workflow

```bash
# Work normally in monorepo
cd cirque-aflame-monorepo
code .

# Make changes, commit
git add .
git commit -m "Your changes"
git push origin main

# When ready to deploy: push to individual repos
./scripts/push-to-repos.sh
```

## Common Commands

```bash
# Push all projects
./scripts/push-to-repos.sh

# Push single project
./scripts/push-to-repos.sh cirque-app
./scripts/push-to-repos.sh cirque-website

# Check remotes
git remote -v

# Run dev servers
npm run dev                           # All projects
npm run dev --workspace=cirque-app    # Just cirque-app

# Build
npm run build                         # All projects
npm run build --workspace=cirque-app  # Just cirque-app
```

## Troubleshooting

```bash
# Uncommitted changes error
git add . && git commit -m "Save work"

# Remote not found
./scripts/setup-remotes.sh

# Force push (careful!)
git subtree push --prefix=cirque-app cirque-app main --force
```

## File Locations

- Main setup guide: [MULTI_REPO_SETUP.md](MULTI_REPO_SETUP.md)
- Push script: [scripts/push-to-repos.sh](scripts/push-to-repos.sh)
- Remote setup: [scripts/setup-remotes.sh](scripts/setup-remotes.sh)
- Contract PWA: [cirque-app/contracts-pwa/](cirque-app/contracts-pwa/)
