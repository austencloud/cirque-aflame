# Cirque Aflame Monorepo

A modern monorepo for Cirque Aflame circus production company, managing multiple applications and tools for client relations, event management, and contract generation.

## 🏗️ Architecture

This is a **npm workspaces + Turborepo** monorepo that serves as the **source of truth** for all projects. Individual projects are pushed to separate repositories for deployment using git subtree.

### Multi-Repo Strategy
- **Monorepo (this repo)**: Source of truth where all development happens
- **Individual repos**: Mirror repos for deployment and distribution
- See [MULTI_REPO_SETUP.md](MULTI_REPO_SETUP.md) for detailed setup instructions

## 📦 Projects

### [`ringmaster`](./ringmaster)
**Ringmaster** - Main production management SaaS application

- **Tech Stack**: SvelteKit + Svelte 5, TypeScript, Firebase
- **Purpose**: Complete circus business management (clients, performers, events, contracts, agents)
- **Includes**: Contract generation PWA at `ringmaster/contracts-pwa/`
- **Individual Repo**: `ringmaster` (pushed via git subtree)
- **Status**: ⭐ Production-ready with comprehensive test coverage

### [`cirque-website`](./cirque-website)
Public-facing marketing website for Cirque Aflame

- **Tech Stack**: SvelteKit + Svelte 5
- **Purpose**: Company portfolio and public information
- **Individual Repo**: `cirque-website` (pushed via git subtree)
- **Status**: 🚧 Under development

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0

### Installation

```bash
# Install all dependencies across the monorepo
npm install

# Run all apps in development mode
npm run dev

# Build all projects
npm run build

# Run tests across all projects
npm run test

# Format all code
npm run format
```

## 🔄 Multi-Repo Workflow

### Daily Development

Work in this monorepo as usual. All changes should be made here.

### Pushing to Individual Repos

When ready to deploy or sync to individual repos:

```bash
# Push all projects to their individual repositories
./scripts/push-to-repos.sh

# Or push a specific project
./scripts/push-to-repos.sh ringmaster
./scripts/push-to-repos.sh cirque-website
```

See [MULTI_REPO_SETUP.md](MULTI_REPO_SETUP.md) for complete setup instructions.

## 🔧 Monorepo Tools

- **npm workspaces**: Dependency management across projects
- **Turborepo**: Intelligent build system with caching and parallel execution
- **git subtree**: Push projects to individual repositories
- **Prettier**: Code formatting across all packages

## 📁 Project Structure

```
cirque-aflame-monorepo/
├── ringmaster/               # Main SaaS application
│   └── contracts-pwa/        # Contract generation PWA (moved from sunday-contract)
├── cirque-website/           # Marketing website
├── scripts/
│   ├── push-to-repos.sh      # Push projects to individual repos
│   └── setup-remotes.sh      # Configure git remotes
├── package.json              # Root package with monorepo scripts
├── turbo.json                # Turborepo pipeline configuration
├── MULTI_REPO_SETUP.md       # Multi-repo setup guide
└── README.md                 # This file
```

## 📊 Turborepo Features

- **Smart Caching**: Turborepo caches build outputs, making subsequent builds blazing fast
- **Parallel Execution**: Runs tasks across projects in parallel when possible
- **Dependency-Aware**: Understands project dependencies and builds in the correct order

## 🔐 Environment Variables

Each project may require its own `.env` file. See individual project READMEs for details.

- `ringmaster` requires Firebase configuration
- Other projects: See respective README files

## 📝 Contributing

1. Install dependencies: `pnpm install`
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Format code: `pnpm format`
6. Commit and push

## 📄 License

Private - Cirque Aflame © 2025
