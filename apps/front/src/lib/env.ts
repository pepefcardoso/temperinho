import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().optional().default('http://localhost:8000/api'),
    NEXT_PUBLIC_URL: z.string().url().optional().default('http://localhost:3000'),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});

try {
    envSchema.parse({
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    });
} catch (error) {
    console.error('❌ Invalid environment variables:', error);
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables');
    }
}
