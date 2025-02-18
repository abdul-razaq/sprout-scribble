CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_auth_tokens" (
	"id" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "two_factor_auth_tokens_id_token_pk" PRIMARY KEY("id","token")
);
