import { auth } from '@/server/auth';
import UserButton from './user-button';
import Image from 'next/image';

export default async function Nav() {
	const session = await auth();

	return (
		<header className="p-4">
			<nav>
				<ul className="flex justify-between items-center">
					<li>
						<Image src="./logo.svg" alt="Logo" height={150} width={150} />
					</li>
					<li>
						<UserButton user={session?.user} />
					</li>
				</ul>
			</nav>
		</header>
	);
}
