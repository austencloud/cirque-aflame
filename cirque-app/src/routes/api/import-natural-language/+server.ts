import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validate, naturalLanguageImportSchema } from '$lib/schemas/validation';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
	const now = Date.now();
	const existing = rateLimitMap.get(ip);

	// Clean up old entries
	if (existing && now > existing.resetTime) {
		rateLimitMap.delete(ip);
	}

	const record = rateLimitMap.get(ip);

	if (!record) {
		// First request
		rateLimitMap.set(ip, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW
		});
		return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
	}

	if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
		return { allowed: false, remaining: 0 };
	}

	// Increment count
	record.count++;
	return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		// Rate limiting
		const ip = getClientAddress();
		const rateLimit = checkRateLimit(ip);

		if (!rateLimit.allowed) {
			return json(
				{
					error: 'Too many requests',
					message: 'You have exceeded the rate limit. Please try again later.'
				},
				{
					status: 429,
					headers: {
						'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': rateLimitMap.get(ip)!.resetTime.toString(),
						'Retry-After': Math.ceil(
							(rateLimitMap.get(ip)!.resetTime - Date.now()) / 1000
						).toString()
					}
				}
			);
		}

		const body = await request.json();

		// Validate input with Zod
		const validation = validate(naturalLanguageImportSchema, body);
		if (!validation.success) {
			return json(
				{ error: 'Invalid input', details: (validation as { success: false; errors: string[] }).errors },
				{
					status: 400,
					headers: {
						'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
						'X-RateLimit-Remaining': rateLimit.remaining.toString()
					}
				}
			);
		}

		// Type narrowing: validation.success is true here
		let { text } = (validation as { success: true; data: { text: string } }).data;

		// Sanitize input to prevent prompt injection
		text = sanitizeAIPrompt(text);

		// Get OpenAI API key from environment
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			console.error('OpenAI API key not configured');
			return json({ error: 'Service temporarily unavailable' }, { status: 503 });
		}

		// System prompt for data extraction
		const systemPrompt = `You are a data extraction assistant for a circus/entertainment business management system. Extract structured data from natural language descriptions.

Return ONLY valid JSON with this exact structure:
{
  "clients": [{
    "type": "organization" | "individual",
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "address": "string" | null,
    "notes": "string"
  }],
  "performers": [{
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "skills": ["string"],
    "rate": number | null,
    "availability": "available" | "busy" | "unavailable",
    "notes": "string"
  }],
  "agents": [{
    "name": "string",
    "email": "string" | null,
    "phone": "string" | null,
    "commission": number,
    "notes": "string"
  }],
  "events": [{
    "title": "string",
    "type": "string",
    "date": "ISO 8601 date string",
    "location": "string",
    "fee": number,
    "clientName": "string (name of client)",
    "performerNames": ["string (names of performers)"],
    "status": "draft" | "confirmed" | "completed" | "cancelled",
    "notes": "string"
  }],
  "contracts": [{
    "clientName": "string",
    "performerNames": ["string"],
    "startDate": "ISO 8601 date string",
    "endDate": "ISO 8601 date string" | null,
    "fee": number,
    "terms": "string",
    "status": "draft" | "signed" | "completed" | "cancelled"
  }]
}

Rules:
- All arrays can be empty if that entity type isn't mentioned
- Use null for missing optional fields
- Convert all dates to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DD)
- Extract monetary amounts as numbers without currency symbols
- For events/contracts, use the actual names of clients/performers mentioned
- Infer reasonable defaults when needed
- If unclear whether something is a client or performer, use context (paid money = client, performed = performer)
- Return ONLY the JSON, no markdown, no explanations`;

		// Call OpenAI API
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: text }
				],
				temperature: 0.1,
				response_format: { type: 'json_object' },
				max_tokens: 2000 // Limit response size
			})
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('OpenAI API error:', error);
			return json({ error: 'Failed to parse text with AI' }, { status: 500 });
		}

		const data = await response.json();
		const parsed = JSON.parse(data.choices[0].message.content);

		return json(
			{ success: true, entities: parsed },
			{
				headers: {
					'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
					'X-RateLimit-Remaining': rateLimit.remaining.toString()
				}
			}
		);
	} catch (error) {
		console.error('Error in import-natural-language API:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * Sanitize AI prompt to prevent injection attacks
 */
function sanitizeAIPrompt(text: string): string {
	// Remove potential injection attempts
	const forbiddenPhrases = [
		'ignore previous instructions',
		'ignore all previous',
		'disregard previous',
		'disregard all previous',
		'new instructions',
		'system:',
		'assistant:',
		'[INST]',
		'</s>',
		'<|endoftext|>',
		'<|im_end|>',
		'###'
	];

	let sanitized = text;

	// Check for and remove forbidden phrases (case-insensitive)
	for (const phrase of forbiddenPhrases) {
		const regex = new RegExp(phrase, 'gi');
		if (regex.test(sanitized)) {
			console.warn(`⚠️  Potential prompt injection detected: "${phrase}"`);
			sanitized = sanitized.replace(regex, '');
		}
	}

	// Remove excessive newlines and whitespace
	sanitized = sanitized.replace(/\n{3,}/g, '\n\n').trim();

	// Enforce max length (already done by Zod, but extra safety)
	return sanitized.substring(0, 10000);
}
