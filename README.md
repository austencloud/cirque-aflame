# Cirque Aflame Monorepo

A modern monorepo for Cirque Aflame circus production company, managing multiple applications and tools for client relations, event management, and contract generation.

## 🏗️ Architecture

This is a **pnpm workspaces + Turborepo** monorepo setup, following 2025 best practices for SvelteKit applications.

## 📦 Projects

### [`cirque-app`](./cirque-app)
**CircusSync** - Main production management SaaS application

- **Tech Stack**: SvelteKit + Svelte 5, TypeScript, Firebase
- **Purpose**: Complete circus business management (clients, performers, events, contracts, agents)
- **Status**: ⭐ Production-ready with comprehensive test coverage

### [`cirque-website`](./cirque-website)
Public-facing marketing website for Cirque Aflame

- **Tech Stack**: SvelteKit + Svelte 5
- **Purpose**: Company portfolio and public information
- **Status**: 🚧 Under development

### [`sunday-contract`](./sunday-contract)
PDF contract generation utility

- **Tech Stack**: Node.js + Puppeteer
- **Purpose**: Automated contract PDF generation from HTML templates
- **Status**: ⚙️ Utility tool

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0 (install with `npm install -g pnpm@latest`)

### Installation

```bash
# Install all dependencies across the monorepo
pnpm install

# Run all apps in development mode
pnpm dev

# Build all projects
pnpm build

# Run tests across all projects
pnpm test

# Format all code
pnpm format
```

### Working with Individual Projects

```bash
# Run a specific project
pnpm --filter cirque-app dev
pnpm --filter cirque-website dev

# Build a specific project
pnpm --filter cirque-app build

# Test a specific project
pnpm --filter cirque-app test
```

## 🔧 Monorepo Tools

- **pnpm workspaces**: Efficient dependency management with symlinks
- **Turborepo**: Intelligent build system with caching and parallel execution
- **Prettier**: Code formatting across all packages

## 📁 Project Structure

```
cirque-aflame-monorepo/
├── cirque-app/          # Main SaaS application
├── cirque-website/      # Marketing website
├── sunday-contract/     # Contract generation tool
├── package.json         # Root package with monorepo scripts
├── pnpm-workspace.yaml  # Workspace configuration
├── turbo.json           # Turborepo pipeline configuration
└── README.md           # This file
```

## 🛠️ Development

### Adding Dependencies

```bash
# Add to root (devDependencies only)
pnpm add -D <package> -w

# Add to a specific project
pnpm --filter cirque-app add <package>
```

### Running Scripts

```bash
# Run script in all projects that have it
pnpm -r <script-name>

# Run script in specific project
pnpm --filter <project-name> <script-name>
```

## 📊 Turborepo Features

- **Smart Caching**: Turborepo caches build outputs, making subsequent builds blazing fast
- **Parallel Execution**: Runs tasks across projects in parallel when possible
- **Dependency-Aware**: Understands project dependencies and builds in the correct order

## 🔐 Environment Variables

Each project may require its own `.env` file. See individual project READMEs for details.

- `cirque-app` requires Firebase configuration
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
