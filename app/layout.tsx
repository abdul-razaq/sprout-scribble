import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { auth } from '@/server/auth';
import Nav from '@/components/navigation/nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
	profile: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body className={`${inter.className} min-w-full min-h-full`}>
				<Nav user={session?.user} />
				{children}
			</body>
		</html>
	);
}
