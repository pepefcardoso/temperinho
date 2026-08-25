import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().optional().default('http://localhost:8000/api'),
    NEXT_PUBLIC_URL: z.string().url().optional().default('http://localhost:3000'),
});

try {
    envSchema.parse({
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    });
} catch (error) {
    console.error('❌ Invalid environment variables:', error);
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables');
    }
}
