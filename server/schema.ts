import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	boolean,
	pgEnum,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('name').notNull(),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	password: text('password').notNull(),
	twoFactorEnabled: boolean('twoFactorEnabled').default(false),
	role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	account => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const emailTokens = pgTable(
	'email_tokens',
	{
		id: text('id')
			.notNull()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	verificationToken => ({
		compositePk: primaryKey({
			columns: [verificationToken.id, verificationToken.token],
		}),
	}),
);

export const passwordResetTokens = pgTable(
	'password_reset_tokens',
	{
		id: text('id')
			.notNull()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	verificationToken => ({
		compositePk: primaryKey({
			columns: [verificationToken.id, verificationToken.token],
		}),
	}),
);

export const twoFactorAuthTokens = pgTable(
	'two_factor_auth_tokens',
	{
		id: text('id')
			.notNull()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	verificationToken => ({
		compositePk: primaryKey({
			columns: [verificationToken.id, verificationToken.token],
		}),
	}),
);
