'use client';

import React from 'react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export type AuthMode = 'register' | 'login' | 'forgot';

export default function AuthCard() {
	const [authMode, setAuthMode] = React.useState<AuthMode>('login');

	const title =
		authMode === 'register'
			? 'Create an account'
			: authMode === 'login'
				? 'Welcome back'
				: 'Forgot your password';

	const button =
		authMode === 'register' ? (
			<Button variant="default">Register</Button>
		) : (
			<Button variant="default">Login</Button>
		);

	const footerLink =
		authMode === 'register' ? (
			<Button
				variant="link"
				className="text-sm"
				onClick={() => setAuthMode('login')}
			>
				Already have an account?
			</Button>
		) : authMode === 'login' ? (
			<Button
				variant="link"
				className="text-sm"
				onClick={() => setAuthMode('register')}
			>
				Create a new account
			</Button>
		) : (
			<Button
				variant="link"
				className="text-sm"
				onClick={() => setAuthMode('login')}
			>
				Back to login
			</Button>
		);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>

			<CardContent>
				<p>Input Form goes here</p>
				{authMode !== 'forgot' && (
					<Button
						variant="link"
						className="text-sm"
						onClick={() => setAuthMode('forgot')}
					>
						Forgot password?
					</Button>
				)}
			</CardContent>

			<CardFooter className="flex flex-col items-stretch gap-6">
				{button}
				{authMode !== 'forgot' && <Socials />}
				{footerLink}
			</CardFooter>
		</Card>
	);
}

function Socials() {
	return (
		<div className="flex flex-col items-stretch gap-4">
			<Button
				className="flex items-center gap-2"
				variant="outline"
				onClick={() =>
					signIn('google', {
						callbackUrl: '/',
						redirect: false,
					})
				}
			>
				<span>Sign in with Google</span>
				<FaGoogle size={16} />
			</Button>
			<Button
				className="flex items-center gap-2"
				variant="outline"
				onClick={() =>
					signIn('github', {
						callbackUrl: '/',
						redirect: false,
					})
				}
			>
				<span>Sign in with Github</span>
				<FaGithub size={16} />
			</Button>
		</div>
	);
}
