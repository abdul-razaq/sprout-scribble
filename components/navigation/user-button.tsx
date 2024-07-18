'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function UserButton({ user }: { user: User | undefined }) {
	return user ? (
		<Button
			variant="destructive"
			onClick={() => signOut()}
			className="flex items-center gap-2"
		>
			<LogOut size={16} />
			<span>Sign out</span>
		</Button>
	) : (
		<Button variant="default" asChild>
			<Link href="/auth/login" className="flex items-center gap-2">
				<LogIn size={16} />
				<span>Sign in</span>
			</Link>
		</Button>
	);
}
