'use client';

import Toast from '@/components/auth/Toast';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { verifyToken } from '@/server/actions/tokens';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function EmailVerificationPage() {
	const token = useSearchParams().get('token');
	const router = useRouter();

	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState('');

	React.useEffect(() => {
		if (!token) {
			router.push('/auth/login');
			return;
		}
		(async () => {
			const response = await verifyToken(token);
			if (response.error) setError(response.error);
			if (response.success) {
				setSuccess(response.success);
				router.push('/auth');
			}
		})();
	}, [token, router]);

	return (
		<div className="w-1/2 mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Verify Email Address</CardTitle>
				</CardHeader>
				<CardContent>
					{!error && !success && (
						<p className="text-center text-md font-medium tracking-wide">
							Verifying email address...
						</p>
					)}
					{error && <Toast type="error" message={error} />}
					{success && <Toast type="success" message={success} />}
				</CardContent>
				<CardFooter>
					{error && (
						<Button variant="link" className="text-purple-600 text-sm" asChild>
							<Link href="/auth">Back to login</Link>
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
