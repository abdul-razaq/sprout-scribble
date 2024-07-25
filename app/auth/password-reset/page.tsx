'use client';
import { Card } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifyPasswordResetToken } from '@/server/actions/tokens';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updatePasswordSchema } from '@/types/auth/update-password-scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { updatePassword } from '@/server/actions/auth';

export default function ForgotPasswordPage() {
	const token = useSearchParams().get('token');

	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');
	const [user, setUser] = React.useState<any>();

	const form = useForm<z.infer<typeof updatePasswordSchema>>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		mode: 'onBlur',
		resolver: zodResolver(updatePasswordSchema),
		reValidateMode: 'onBlur',
	});

	React.useEffect(() => {
		(async () => {
			if (!token) {
				return setError('no token provided');
			}
			const result = await verifyPasswordResetToken(token);
			if (result.error) {
				return setError(result.error);
			}
			if (result.success) {
				setSuccess(result.success);
				setUser(result.data);
			}
		})();
	}, [token]);

	const updatePasswordBinded = updatePassword.bind(null, user);

	const { execute, isExecuting, status } = useAction(updatePasswordBinded, {
		onSuccess: data => {
			console.log('YAYYYY', data);
		},
		onError: error => {
			console.error('Error:', error);
		},
	});

	function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
		execute(values);
	}

	let content;

	if (error && !success) {
		content = <p className="font-sans text-md font-medium">{error}</p>;
	} else {
		content = (
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="py-4">
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input
										placeholder="New password"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<FormDescription>Enter new password</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="py-4">
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input
										placeholder="Confirm password"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<FormDescription>Confirm your new password</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className={`${isExecuting ? 'animate-pulse' : ''}`}
						type="submit"
						variant="default"
					>
						Submit
					</Button>
				</form>
			</Form>
		);
	}

	return (
		<div className="w-1/2 mx-auto">
			<Card className="p-10">{content}</Card>
		</div>
	);
}
