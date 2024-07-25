'use server';

import { actionClient } from '@/lib/safe-action';
import { authSchema, passwordResetSchema } from '@/types/auth/auth-schema';
import db from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import {
	generateEmailVerificationToken,
	generatePasswordResetToken,
} from './tokens';
import { sendPasswordResetEmail, sendVerificationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import { updatePasswordSchema } from '@/types/auth/update-password-scheme';

export const emailAuth = actionClient
	.schema(authSchema)
	.action(async ({ parsedInput: { email, password, code, username } }) => {
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (username) {
			handleRegister(existingUser, email, username, password);
		} else {
			handleLogin(existingUser, email, password);
		}
	});

export const passwordReset = actionClient
	.schema(passwordResetSchema)
	.action(async ({ parsedInput: { email } }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
		if (!user) {
			return { error: 'user associated with email address does not exist' };
		}
		await sendPasswordResetTokenToUser(email);
	});

export const updatePassword = actionClient
	.schema(updatePasswordSchema)
	.bindArgsSchemas<[user: z.ZodAny]>([z.any()])
	.action(
		async ({
			parsedInput: { password, confirmPassword },
			bindArgsParsedInputs: [user],
		}) => {
			const hashedPassword = await bcrypt.hash(password, 10);
			await db
				.update(users)
				.set({
					password: hashedPassword,
				})
				.where(eq(users.email, user.email));
			return { success: 'password updated successfully!' };
		},
	);

async function sendPasswordResetTokenToUser(email: string) {
	const token = await generatePasswordResetToken(email);
	if (!token) {
		return { error: 'no password reset token' };
	}
	await sendPasswordResetEmail(token[0].email, token[0].token);
	return { success: 'password reset token successfully sent!' };
}

async function handleRegister(
	user: any,
	email: string,
	username: string,
	password: string,
) {
	try {
		if (user && user.emailVerified) {
			return { error: 'email address already in use' };
		}
		if (user && !user.emailVerified) {
			await sendVerificationEmailToUser(email);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await db.insert(users).values({
			email,
			username,
			password: hashedPassword,
		});

		await sendVerificationEmailToUser(email);

		return { success: 'success' };
	} catch (error) {
		throw error;
	}
}

async function handleLogin(user: any, email: string, password: string) {
	try {
		if (!user) {
			return { error: 'login credentials not correct' };
		}
		if (user && !user.emailVerified) {
			await sendVerificationEmailToUser(email);
		}

		await signIn('credentials', {
			email,
			password,
			redirectTo: '/',
		});

		return { success: 'success' };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'AccessDenied':
					return { error: error.message };
				case 'CredentialsSignin':
					return { error: 'Invalid login credentials' };
				case 'OAuthSignInError':
					return { error: error.message };
				default:
					return { error: 'An unexpected error occurred' };
			}
		}
		throw error;
	}
}

async function sendVerificationEmailToUser(email: string) {
	const verificationToken = await generateEmailVerificationToken(email);
	await sendVerificationEmail(
		verificationToken![0].email,
		verificationToken![0].token,
	);
	return {
		success: 'Verification token successfully sent to email address',
	};
}
