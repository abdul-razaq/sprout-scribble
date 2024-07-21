'use server';

import { actionClient } from '@/lib/safe-action';
import { authSchema } from '@/types/auth/auth-schema';
import db from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { generateEmailVerificationToken } from './tokens';
import sendVerificationEmail from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

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
		return { success: 'success' };
	});

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
			await sendVerificationEmailToUser(user);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await db.insert(users).values({
			email,
			username,
			password: hashedPassword,
		});

		await sendVerificationEmailToUser(user?.email);
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
			await sendVerificationEmailToUser(user);
		}

		await signIn('credentials', {
			email,
			password,
			redirectTo: '/',
		});
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

async function sendVerificationEmailToUser(user: any) {
	const verificationToken = await generateEmailVerificationToken(user.email);
	await sendVerificationEmail(
		verificationToken![0].email,
		verificationToken![0].token,
	);
	return {
		success: 'Verification token successfully sent to email address',
	};
}
