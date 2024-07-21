'use server';

import { actionClient } from '@/lib/safe-action';
import { authSchema } from '@/types/auth/auth-schema';
import db from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { generateEmailVerificationToken } from './tokens';
import sendVerificationEmail from './email';

export const emailAuth = actionClient
	.schema(authSchema)
	.action(async ({ parsedInput: { email, password, code, username } }) => {
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (username) {
			// We are in register mode
			if (existingUser && existingUser.emailVerified) {
				return { error: 'email address already in use' };
			}
			if (existingUser && !existingUser.emailVerified) {
				const verificationToken = await generateEmailVerificationToken(email);
				await sendVerificationEmail(
					verificationToken![0].email,
					verificationToken![0].token,
				);
				return {
					success: 'Verification token successfully sent to email address',
				};
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await db.insert(users).values({
				email,
				username,
				password: hashedPassword,
			});

			const verificationToken = await generateEmailVerificationToken(email);
			await sendVerificationEmail(
				verificationToken![0].email,
				verificationToken![0].token,
			);
			return {
				success: 'Verification token successfully sent to email address',
			};
		} else {
			// we are in login mode
			if (!existingUser) {
				return { error: 'login credentials not correct' };
			}
		}
		return { success: 'success' };
	});
