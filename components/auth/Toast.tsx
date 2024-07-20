import React from 'react';

export default function Toast({
	message,
	type,
}: {
	message: string;
	type: 'success' | 'error';
}) {
	return (
		<div
			className={`p-4 rounded-full ${type === 'error' ? 'bg-destructive text-white' : 'bg-teal-500 text-black'}`}
		>
			{message}
		</div>
	);
}
