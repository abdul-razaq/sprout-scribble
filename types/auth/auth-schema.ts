import * as z from 'zod';

export const authSchema = z.object({
	username: z.optional(z.string().min(4, 'Please provide a username')),
	email: z.string().email({ message: 'email address is required' }),
	password: z
		.string()
		.min(8)
		.max(128, { message: 'password must be at least 8 characters' }),
	code: z.optional(z.string()),
});
