# Ringmaster

The ultimate circus performance production company management application for tracking clients, performers, events, contracts, and agent relationships.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5 (using new runes API: $state, $derived, $effect, $props)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with @tailwindcss/forms
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Icons**: lucide-svelte
- **Date Handling**: date-fns, flatpickr
- **Testing**: Playwright

## Quick Start

```bash
npm install
npm run dev
```

Environment variables required in `.env`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Project Architecture

```text
Ringmaster (ringmaster)/
├── src/
│   ├── routes/                    # SvelteKit file-based routing
│   │   ├── +layout.svelte        # Root layout with navigation
│   │   ├── +page.svelte          # Dashboard page
│   │   ├── clients/              # Client management routes
│   │   ├── performers/           # Performer management routes
│   │   ├── events/               # Event/gig management routes
│   │   ├── agents/               # Agent relationship routes
│   │   ├── contracts/            # Contract management routes
│   │   └── login/                # Authentication page
│   ├── lib/
│   │   ├── components/           # Reusable Svelte 5 components
│   │   ├── config/               # App configuration
│   │   ├── firebase.ts           # Firebase initialization
│   │   ├── modules/              # Feature-specific modules
│   │   ├── services/             # Business logic & Firebase operations
│   │   ├── shared/               # Shared utilities across features
│   │   ├── state/                # Global state management (Svelte 5 runes)
│   │   ├── types.ts              # TypeScript type definitions
│   │   └── utils/                # Helper functions
│   └── static/                   # Static assets
└── contracts-pwa/                # Standalone contract generation PWA
    ├── index.html                # Contract form UI
    ├── main.js                   # Form logic and PDF generation
    ├── style.css                 # Styling
    └── vite.config.js            # PWA build configuration
```

### Contract Generation PWA

The `contracts-pwa/` directory contains a standalone Progressive Web App for generating Cirque Aflame contracts:
- **Purpose**: Offline-capable contract PDF generation
- **Tech**: Vanilla JS + html2pdf.js + Vite PWA plugin
- **Usage**: Can be deployed separately or accessed via the main app
- **Features**: Fill forms, generate PDFs, works offline

## Core Data Models

### Clients

Client contacts with event history, preferences, follow-up reminders

### Performers

Performer profiles with skills, availability, payment rates

### Events

Gig details including venue, schedule, performer assignments, client info

### Agents

Agent partnerships with commission structures

### Contracts

Contract generation and payment tracking (deposits, final payments)

## Key Implementation Notes

- **Svelte 5 Migration**: Fully migrated to Svelte 5 runes. Use `$state()` for reactive state, `$derived()` for computed values, `$effect()` for side effects, and `$props()` for component props.
- **State Management**: Uses Svelte 5's built-in reactivity (runes) stored in `src/lib/state/` - no external state library needed
- **Firebase Integration**: All CRUD operations go through services in `src/lib/services/`
- **Authentication**: Firebase Auth handles user authentication (currently supports email/password)
- **Styling Pattern**: Tailwind utility classes with custom config in `tailwind.config.js`
- **Type Safety**: Full TypeScript coverage with types defined in `src/lib/types.ts`

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm test` - Run Playwright tests
- `npm run test:ui` - Playwright UI mode
- `npm run seed` - Seed Firebase with test data

## Firebase Collections

- `clients` - Client records
- `performers` - Performer profiles
- `events` - Event/gig data
- `agents` - Agent relationships
- `contracts` - Contract documents
- `tasks` - Follow-up tasks
- `users` - User accounts
- `notifications` - System notifications
- `documents` - File metadata
