'use server';

import getBaseUrl from '@/lib/base-url';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export async function sendVerificationEmail(email: string, token: string) {
	const confirmationLink = `${domain}/auth/email-verification?token=${token}`;
	const { data, error } = await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: 'Sprout and Scribble - Confirmation Email',
		html: `<p>Click to <a href='${confirmationLink}'>confirm your email</a></p>`,
	});
	if (error) return console.log(error);
	if (data) return data;
}

export async function sendPasswordResetEmail(email: string, token: string) {
	const confirmationLink = `${domain}/auth/password-reset?token=${token}`;
	const { data, error } = await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to: email,
		subject: 'Sprout and Scribble - Password Reset Email',
		html: `<p>Click <a href='${confirmationLink}'>here</a> to reset your password.</p>`,
	});
	if (error) return console.log(error);
	if (data) return data;
}
