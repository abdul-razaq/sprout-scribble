import Link from 'next/link';
import React from 'react';

export default function About() {
	return (
		<div>
			<h1>This is the about page</h1>
			<Link href="/">Go back home</Link>
		</div>
	);
}
