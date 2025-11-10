# Cirque Aflame Website

Public-facing marketing website for Cirque Aflame circus production company.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Language**: JavaScript/TypeScript
- **Styling**: CSS (TBD: Consider Tailwind CSS)
- **Icons**: FontAwesome (svelte-fa)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The development server runs on `http://localhost:5174`

## Project Structure

```
cirque-website/
├── src/
│   ├── lib/         # Reusable components and utilities
│   ├── routes/      # SvelteKit file-based routing
│   └── app.html     # HTML template
├── static/          # Static assets
├── package.json
└── svelte.config.js
```

## Features (Planned)

- Company portfolio showcase
- Performance gallery
- Contact information
- Booking inquiries
- Testimonials
- Event calendar

## Development

This project is part of the Cirque Aflame monorepo. See the [root README](../README.md) for monorepo-specific commands.

## Deployment

Target deployment platform: TBD (Vercel, Netlify, or Cloudflare Pages)

## Environment Variables

No environment variables required for the website at this time.

## TODO

- [ ] Design homepage layout
- [ ] Add performance gallery
- [ ] Implement contact form
- [ ] Set up analytics
- [ ] SEO optimization
- [ ] Add Tailwind CSS for styling
- [ ] Create content pages
