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
import { authSchema } from '@/types/auth/auth-schema';
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
import { useAction } from 'next-safe-action/hooks';
import { emailAuth } from '@/server/actions/auth';
import { cn } from '@/lib/utils';
import Toast from './Toast';
import { useRouter } from 'next/navigation';

export type AuthMode = 'register' | 'login' | 'forgot';

export default function AuthCard() {
	const [authMode, setAuthMode] = React.useState<AuthMode>('login');
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	const form = useForm<z.infer<typeof authSchema>>({
		mode: 'onBlur',
		defaultValues: {
			username: '',
			email: '',
			password: '',
			code: '',
		},
		resolver: zodResolver(authSchema),
		reValidateMode: 'onBlur',
		shouldFocusError: true,
	});

	const { execute, result, isExecuting } = useAction(emailAuth, {
		onError(data) {
			if (data) {
				setError(
					data.error.serverError ||
						data.error.validationErrors ||
						data.error.fetchError,
				);
			}
		},
		onSuccess(data) {
			console.log(data);
		},
	});

	function onSubmit(values: z.infer<typeof authSchema>) {
		execute(values);
	}

	function switchAuthMode(mode: AuthMode) {
		setAuthMode(mode);
		form.reset();
	}

	const title = authMode === 'register' ? 'Create an account' : 'Welcome back';

	const footerLink =
		authMode === 'register' ? (
			<Button
				variant="link"
				className="text-sm"
				onClick={() => switchAuthMode('login')}
			>
				Already have an account?
			</Button>
		) : authMode === 'login' ? (
			<Button
				variant="link"
				className="text-sm"
				onClick={() => switchAuthMode('register')}
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

	const router = useRouter();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, errors =>
							console.log(errors),
						)}
						className="w-full"
					>
						{authMode === 'register' && (
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => {
									return (
										<FormItem className="pb-5">
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input
													placeholder="antigen"
													autoComplete="username"
													{...field}
												/>
											</FormControl>
											<FormDescription>This is your username</FormDescription>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						)}
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
						<div className="w-full py-5">
							<Button
								variant="default"
								type="submit"
								className={cn('w-full', isExecuting ? 'animate-pulse' : '')}
							>
								{authMode === 'register' ? 'Register' : 'Login'}
							</Button>
						</div>
					</form>
				</Form>
				{authMode !== 'forgot' && (
					<Button
						variant="link"
						className="text-sm"
						onClick={() => router.push('/auth/forgot-password')}
					>
						Forgot password?
					</Button>
				)}

				{success && <Toast type="success" message={success} />}
				{error && <Toast type="error" message={error} />}
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
