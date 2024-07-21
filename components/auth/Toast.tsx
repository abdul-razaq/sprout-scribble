import { CheckCircle2, MessageCircleWarning } from 'lucide-react';
import React from 'react';

export default function Toast({
	message,
	type,
}: {
	message: string;
	type: 'success' | 'error';
}) {
	if (!message) return null;
	return (
		<div
			className={`p-2 rounded-full text-xs font-medium my-4 flex items-center gap-2 ${type === 'error' ? 'bg-destructive text-white' : 'bg-teal-500/25 text-black'}`}
		>
			{type === 'success' ? (
				<CheckCircle2 size={16} />
			) : (
				<MessageCircleWarning />
			)}
			{message}
		</div>
	);
}
