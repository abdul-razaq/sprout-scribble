'use client';

import UserButton from './user-button';
import Image from 'next/image';
import { Session, User } from 'next-auth';
import Link from 'next/link';

export default function Nav({ user }: { user?: User }) {
	return (
		<header className="p-4">
			<nav>
				<ul className="flex justify-between items-center">
					<li>
						<Link href={'/'}>
							<Image src="./logo.svg" alt="Logo" height={150} width={150} />
						</Link>
					</li>
					<li>
						<UserButton user={user} />
					</li>
				</ul>
			</nav>
		</header>
	);
}
