/**
 * Server-side logger using Pino
 * Following SvelteKit best practices - this file lives in lib/server to ensure
 * it's only imported on the server side, never in client code.
 *
 * @see https://github.com/pinojs/pino
 */

import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Create and configure the Pino logger instance
 */
export const logger: PinoLogger = pino({
	level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

	// Use pino-pretty in development for human-readable logs
	transport: isDevelopment
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname'
				}
		  }
		: undefined,

	// Base fields added to every log entry
	base: {
		env: process.env.NODE_ENV || 'development'
	},

	// Redact sensitive information
	redact: {
		paths: [
			'req.headers.authorization',
			'req.headers.cookie',
			'res.headers["set-cookie"]',
			'*.password',
			'*.apiKey',
			'*.token',
			'*.secret'
		],
		remove: true
	},

	// Timestamp format
	timestamp: pino.stdTimeFunctions.isoTime
});

/**
 * Create a child logger with additional context
 *
 * @example
 * const log = createLogger({ module: 'auth', userId: '123' });
 * log.info('User logged in');
 */
export function createLogger(bindings: Record<string, unknown>): PinoLogger {
	return logger.child(bindings);
}

/**
 * Log levels:
 * - trace (10): Very detailed debugging information
 * - debug (20): Detailed debugging information
 * - info (30): General informational messages
 * - warn (40): Warning messages for potentially harmful situations
 * - error (50): Error messages for failures
 * - fatal (60): Critical errors causing application termination
 */

/**
 * Example usage:
 *
 * import { logger } from '$lib/server/logger';
 *
 * // Simple logging
 * logger.info('User registered successfully');
 * logger.error({ err }, 'Failed to connect to database');
 *
 * // With structured data
 * logger.info({ userId, email }, 'User logged in');
 *
 * // Child logger with context
 * const log = createLogger({ module: 'database' });
 * log.debug('Executing query');
 */

export default logger;
