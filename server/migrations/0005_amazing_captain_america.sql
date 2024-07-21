ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "email_tokens" ADD COLUMN "email" text NOT NULL;