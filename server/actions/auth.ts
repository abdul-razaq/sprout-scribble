'use server';

import { actionClient } from '@/lib/safe-action';
import { authSchema } from '@/types/auth/auth-schema';
import db from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { generateEmailVerificationToken } from './tokens';

export const emailAuth = actionClient
	.schema(authSchema)
	.action(async ({ parsedInput: { email, password, code, username } }) => {
		console.log(email, password, 'code', username);

		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (username) {
			// We are in register mode
			if (existingUser && existingUser.emailVerified) {
				return { error: 'email already in use' };
			}
			if (existingUser && !existingUser.emailVerified) {
				const verificationToken = await generateEmailVerificationToken(email);
				// TODO: send email verification token to the user email.
				return {
					email: 'Verification token successfully sent to email address',
				};
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await db.insert(users).values({
				email,
				username,
				password: hashedPassword,
			});

			const verificationToken = await generateEmailVerificationToken(email);
			// TODO: send email verification token to the user email.
			return {
				email: 'Verification token successfully sent to email address',
			};
		} else {
			// we are in login mode
			if (!existingUser) {
				return { error: 'login credentials not correct' };
			}
		}
		return { success: 'success' };
	});
