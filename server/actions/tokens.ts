'use server';

import db from '..';
import { emailTokens, passwordResetTokens, users } from '../schema';
import { eq } from 'drizzle-orm';

export async function getVerificationTokenByEmail(email: string) {
	try {
		const verificationToken = await db.query.emailTokens.findFirst({
			where: eq(emailTokens.email, email),
		});
		return verificationToken;
	} catch (error) {
		return null;
	}
}

export async function generateEmailVerificationToken(email: string) {
	try {
		const existingToken = await getVerificationTokenByEmail(email);
		if (existingToken) {
			await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
		}

		const token = crypto.randomUUID();
		const expires = new Date(new Date().getTime() + 3600 * 1000);

		const verificationToken = await db
			.insert(emailTokens)
			.values({
				email,
				token,
				expires,
			})
			.returning();
		return verificationToken;
	} catch (error) {
		return null;
	}
}

export async function verifyToken(token: string) {
	const existingToken = await db.query.emailTokens.findFirst({
		where: eq(emailTokens.token, token),
	});
	if (!existingToken || new Date(existingToken.expires) < new Date()) {
		return { error: 'Invalid token or token expired!' };
	}
	const user = await db.query.users.findFirst({
		where: eq(users.email, existingToken.email),
	});
	if (!user) {
		return { error: 'User not found!' };
	}
	await db.update(users).set({
		emailVerified: new Date(),
		email: user.email,
	});
	await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
	return { success: 'Email verified successfully!' };
}

export async function generatePasswordResetToken(email: string) {
	try {
		const token = await db.query.passwordResetTokens.findFirst({
			where: eq(passwordResetTokens.email, email),
		});
		if (token) {
			await db
				.delete(passwordResetTokens)
				.where(eq(passwordResetTokens.id, token.id));
		}
		const newToken = crypto.randomUUID();
		const resetToken = await db
			.insert(passwordResetTokens)
			.values({
				email,
				token: newToken,
				expires: new Date(new Date().getTime() + 3600 * 1000),
			})
			.returning();
		return resetToken;
	} catch (error) {
		return null;
	}
}

export async function verifyPasswordResetToken(token: string) {
	const existingToken = await db.query.passwordResetTokens.findFirst({
		where: eq(passwordResetTokens.token, token),
	});
	if (!existingToken || new Date(existingToken.expires) < new Date()) {
		return { error: 'Invalid token or token expired!' };
	}
	const user = await db.query.users.findFirst({
		where: eq(users.email, existingToken.email),
	});
	if (!user) {
		return { error: 'User not found!' };
	}
	await db
		.delete(passwordResetTokens)
		.where(eq(passwordResetTokens.id, existingToken.id));
	return { success: 'Token verified successfully!', data: user };
}
