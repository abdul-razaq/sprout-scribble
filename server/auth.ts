import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import db from '@/server';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { authSchema } from '@/types/auth/auth-schema';
import { eq } from 'drizzle-orm';
import { users } from './schema';
import bcrypt from 'bcrypt';

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: DrizzleAdapter(db) as any,
	secret: process.env.AUTH_SECRET,
	session: { strategy: 'jwt' },
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Github({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Credentials({
			authorize: async credentials => {
				const validatedFields = authSchema.safeParse(credentials);
				if (!validatedFields.success) {
					return {
						error: validatedFields.error,
					};
				}
				const { email, password } = validatedFields.data;
				const user = await db.query.users.findFirst({
					where: eq(users.email, email),
				});
				if (!user || !user.emailVerified) return null;
				const passwordMatch = await bcrypt.compare(password, user.password);
				if (!passwordMatch) return null;
				return user as any;
			},
		}),
	],
});
