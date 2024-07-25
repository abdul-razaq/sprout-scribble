import * as z from 'zod';

export const updatePasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: 'password must be minimum of 8 characters' })
			.max(128, { message: 'password must be maximum of 128 characters' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'password must be minimum of 8 characters' })
			.max(128, { message: 'password must be maximum of 128 characters' }),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword'],
			});
		}
	});
