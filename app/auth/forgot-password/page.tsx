'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { passwordReset } from '@/server/actions/auth';
import { passwordResetSchema } from '@/types/auth/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function ForgotPasswordPage() {
	const form = useForm<z.infer<typeof passwordResetSchema>>({
		mode: 'onBlur',
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(passwordResetSchema),
		reValidateMode: 'onBlur',
	});

	const { execute, status, isExecuting } = useAction(passwordReset, {
		onError(error) {
			console.error('Error:', error);
		},
		onSuccess(data) {
			console.log('Success:', data);
		},
	});

	function onSubmit(values: z.infer<typeof passwordResetSchema>) {
		execute(values);
	}

	return (
		<div className="w-1/2 mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input
												placeholder="email address"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Email address to receive password reset token
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								disabled={isExecuting}
								variant="default"
								className={cn(isExecuting ? 'animate-pulse' : '')}
							>
								Send Reset Link
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
