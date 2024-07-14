import React from 'react';

export default function AboutLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<nav className="bg-red-800 p-4 text-2xl text-white">
				<h1>About Sublayout</h1>
			</nav>
			<div>{children}</div>
		</>
	);
}
