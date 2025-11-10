# Logging Migration Guide

This document outlines the migration from `console.*` statements to structured logging using Pino.

## Why Pino?

- **Performance**: 5-10x faster than Winston
- **Structured Logging**: JSON output perfect for log aggregation services
- **Child Loggers**: Automatic context propagation
- **Low Overhead**: Minimal CPU and memory footprint

## Quick Reference

### Before (console.*)

```typescript
console.log('User logged in');
console.error('Failed to save data:', error);
console.warn('Cache miss for key:', key);
```

### After (Pino)

```typescript
import { logger } from '$lib/server/logger';

logger.info('User logged in');
logger.error({ err: error }, 'Failed to save data');
logger.warn({ key }, 'Cache miss');
```

## Log Levels

| Level | When to Use |
|-------|-------------|
| `trace` | Extremely detailed debugging (e.g., function entry/exit) |
| `debug` | Detailed debugging information |
| `info` | General informational messages (default in production) |
| `warn` | Warning messages for potentially harmful situations |
| `error` | Error messages for failures |
| `fatal` | Critical errors causing application termination |

## Best Practices

### 1. Use Structured Data

**Bad:**
```typescript
logger.info(`User ${userId} logged in from ${ipAddress}`);
```

**Good:**
```typescript
logger.info({ userId, ipAddress }, 'User logged in');
```

### 2. Error Logging

**Bad:**
```typescript
logger.error(error.message);
```

**Good:**
```typescript
logger.error({ err: error }, 'Failed to process request');
```

### 3. Use Child Loggers for Context

```typescript
import { createLogger } from '$lib/server/logger';

// Create a child logger with module context
const log = createLogger({ module: 'auth', requestId: crypto.randomUUID() });

log.info('Starting authentication');
log.debug({ provider: 'google' }, 'OAuth provider selected');
```

### 4. Server-Only Usage

The logger should ONLY be used in:
- API routes (`src/routes/api/`)
- Server load functions (`+page.server.ts`, `+layout.server.ts`)
- Server-only modules (`src/lib/server/`)

**Never** import the logger in:
- Client-side components
- Shared utilities that run on both client and server

## Migration Strategy

### Phase 1: Add Logger (✅ Complete)
- ✅ Install Pino and pino-pretty
- ✅ Create logger module in `src/lib/server/logger.ts`
- ✅ Configure development and production settings

### Phase 2: Replace console.* in API Routes
Find and replace in `src/routes/api/`:

```bash
# Find all console.* usage in API routes
grep -r "console\." src/routes/api/
```

### Phase 3: Replace console.* in Services
Update `src/lib/services/` files that run server-side:
- `database.ts`
- `auth.svelte.ts`
- `audit.ts`

### Phase 4: Replace console.* in Server Functions
Update `+page.server.ts` and `+layout.server.ts` files

### Phase 5: Client-Side Logging (Optional)
For client-side logging, consider:
- Browser's built-in console (simplest)
- Sentry or similar error tracking service
- Custom client logger that sends to API endpoint

## Current Console.* Usage

Total occurrences: **138** across **33 files**

Top files to migrate:
1. `src/lib/state/clients.svelte.ts` - 16 occurrences
2. `src/lib/state/events.svelte.ts` - 12 occurrences
3. `src/lib/services/database.ts` - 31 occurrences
4. `src/lib/state/performers.svelte.ts` - 8 occurrences
5. `src/lib/state/tasks.svelte.ts` - 7 occurrences

## Environment Variables

Set log level via environment variable:

```bash
# .env
LOG_LEVEL=debug  # For development
```

```bash
# .env.production
LOG_LEVEL=info   # For production
```

## Production Logging

In production, consider streaming logs to:
- **AWS CloudWatch** - For AWS deployments
- **Google Cloud Logging** - For GCP deployments
- **Datadog** - For comprehensive monitoring
- **Logta il** - For centralized log management
- **Better Stack** - For modern log aggregation

Example production transport:
```typescript
// For cloud logging services
transport: {
  target: 'pino/file',
  options: { destination: '/var/log/app.log' }
}
```

## Testing

When writing tests, you may want to suppress logs:

```typescript
import { logger } from '$lib/server/logger';

// In test setup
logger.level = 'silent';
```

## References

- [Pino Documentation](https://getpino.io/)
- [Pino Best Practices](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
- [SvelteKit Logging with Pino](https://stolthq.com/blog/structured-logging-sveltekit)
