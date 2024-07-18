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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { loginSchema } from '@/types/auth/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export type AuthMode = 'register' | 'login' | 'forgot';

export default function AuthCard() {
	const [authMode, setAuthMode] = React.useState<AuthMode>('login');

	const form = useForm<z.infer<typeof loginSchema>>({
		mode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(loginSchema),
		reValidateMode: 'onBlur',
		shouldFocusError: true,
	});

	function onSubmit(values: z.infer<typeof loginSchema>) {
		console.log(values);
	}

	const title =
		authMode === 'register'
			? 'Create an account'
			: authMode === 'login'
				? 'Welcome back'
				: 'Forgot your password';

	const button =
		authMode === 'register' ? (
			<Button variant="default" type="submit" className="w-full">
				Register
			</Button>
		) : (
			<Button variant="default" type="submit" className="w-full">
				Login
			</Button>
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="abdulrazaq@gmail.com"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your email address
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => {
								return (
									<FormItem className="py-5">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="********"
												autoComplete="current-password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your strong password
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<div className="w-full py-5">{button}</div>
					</form>
				</Form>
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
