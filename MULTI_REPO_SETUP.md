# Multi-Repo Setup Guide

This monorepo serves as the **source of truth** and pushes to individual repositories for deployment and distribution. This guide explains how to set up and maintain this architecture.

## Architecture Overview

```
┌─────────────────────────────────────┐
│   cirque-aflame-monorepo (main)     │  ← Source of Truth
│                                     │  ← All development happens here
└────────┬───────────────────┬────────┘
         │                   │
         │ git subtree push  │ git subtree push
         ↓                   ↓
┌────────────────┐   ┌──────────────────┐
│  cirque-app    │   │ cirque-website   │  ← Mirror repos
│  (individual)  │   │  (individual)    │  ← Read-only/deployment
└────────────────┘   └──────────────────┘
```

## Benefits of This Approach

✅ **Unified development**: Work in one repo with all projects
✅ **Atomic commits**: Changes across projects in single commits
✅ **Shared tooling**: Turborepo, Prettier, ESLint configs
✅ **Independent deployment**: Each project deploys separately
✅ **Smaller clones**: Others can clone just what they need
✅ **Better CI/CD**: Individual repos can have their own pipelines

## Initial Setup

### Step 1: Create Individual Repositories on GitHub

Create two new empty repositories:
1. `cirque-app` - For the main SaaS application
2. `cirque-website` - For the marketing website

**Important**:
- Initialize them as **empty repositories** (no README, no .gitignore)
- Use the same visibility (public/private) as your monorepo

### Step 2: Update Remote URLs

Edit [scripts/push-to-repos.sh](scripts/push-to-repos.sh) and [scripts/setup-remotes.sh](scripts/setup-remotes.sh):

```bash
# Replace YOUR-USERNAME with your actual GitHub username
declare -A PROJECTS=(
    ["cirque-app"]="cirque-app:git@github.com:YOUR-USERNAME/cirque-app.git"
    ["cirque-website"]="cirque-website:git@github.com:YOUR-USERNAME/cirque-website.git"
)
```

### Step 3: Run Initial Setup

```bash
# Add the remotes
./scripts/setup-remotes.sh

# Verify remotes were added
git remote -v
```

### Step 4: Initial Push

Push each project to its repository:

```bash
# Make sure all changes are committed first
git add .
git commit -m "Prepare for multi-repo setup"

# Push to individual repos
./scripts/push-to-repos.sh
```

This will push:
- `cirque-app/` folder → `cirque-app` repository
- `cirque-website/` folder → `cirque-website` repository

## Daily Workflow

### Making Changes

Work in the monorepo as usual:

```bash
cd cirque-aflame-monorepo

# Make changes to any project
code cirque-app/src/routes/+page.svelte

# Commit changes
git add .
git commit -m "Update homepage"

# Push to monorepo
git push origin main
```

### Syncing to Individual Repos

When ready to update individual repos:

```bash
# Push all projects
./scripts/push-to-repos.sh

# Or push just one project
./scripts/push-to-repos.sh cirque-app
./scripts/push-to-repos.sh cirque-website
```

## Git Subtree vs Submodules

We're using **git subtree** (not submodules) because:
- ✅ Simpler for contributors (no `git submodule update`)
- ✅ Projects are fully contained in the monorepo
- ✅ No extra commands needed for cloning
- ✅ Better for this "monorepo as source" pattern

## Deployment Configuration

### Cirque App (Main SaaS)

The individual `cirque-app` repository can be deployed to:
- Vercel
- Netlify
- Firebase Hosting
- Your own server

**Deployment setup**:
1. Connect the individual `cirque-app` repo to your deployment platform
2. It will automatically build from the repo root
3. No special configuration needed

### Cirque Website

Same process as cirque-app:
1. Connect `cirque-website` repo to deployment platform
2. Auto-deploys on push

## Troubleshooting

### "Failed to push some refs"

This usually means the individual repo has diverged. To fix:

```bash
# Force push (be careful!)
git subtree push --prefix=cirque-app cirque-app main --force
```

### "Working tree has modifications"

Commit or stash your changes first:

```bash
git add .
git commit -m "Save work in progress"
# or
git stash
```

### Remote not found

Re-run the setup script:

```bash
./scripts/setup-remotes.sh
```

## Advanced Usage

### Creating a New Project

1. Add the folder to monorepo:
```bash
mkdir new-project
cd new-project
npm init
```

2. Update [package.json](package.json) workspaces:
```json
{
  "workspaces": [
    "cirque-app",
    "cirque-website",
    "new-project"
  ]
}
```

3. Create the individual repo on GitHub

4. Add to push script in [scripts/push-to-repos.sh](scripts/push-to-repos.sh):
```bash
["new-project"]="new-project:git@github.com:YOUR-USERNAME/new-project.git"
```

5. Push:
```bash
./scripts/push-to-repos.sh new-project
```

### Pulling from Individual Repos (Rare)

If you need to pull changes made directly to individual repos:

```bash
git subtree pull --prefix=cirque-app cirque-app main
```

**Note**: This should be rare. The monorepo is meant to be the source of truth.

## FAQ

**Q: Can others contribute directly to individual repos?**
A: Yes, but you'll need to pull those changes back into the monorepo. It's better to have everyone contribute to the monorepo.

**Q: How do I handle version numbers?**
A: Each project has its own [package.json](package.json) with independent versions.

**Q: Do I need to push to individual repos every time?**
A: No, only when you want to trigger deployments or make the code available in individual repos.

**Q: What if I want to make individual repos the source?**
A: That's "Option B" (individual repos as source). It requires git submodules or subtree pull. Let me know if you want to switch.

## Related Files

- [scripts/push-to-repos.sh](scripts/push-to-repos.sh) - Main push script
- [scripts/setup-remotes.sh](scripts/setup-remotes.sh) - Remote configuration
- [package.json](package.json) - Monorepo workspace configuration
- [turbo.json](turbo.json) - Turborepo build pipeline

## Need Help?

If you run into issues:
1. Check that all changes are committed
2. Verify remotes with `git remote -v`
3. Try pushing one project at a time
4. Check GitHub that repos were created empty
