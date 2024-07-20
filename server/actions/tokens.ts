'use server';

import db from '..';
import { emailTokens } from '../schema';
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

		const verificationToken = await db.insert(emailTokens).values({
			email,
			token,
			expires,
		});
		return verificationToken;
	} catch (error) {
		return null;
	}
}
