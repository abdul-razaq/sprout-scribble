import React from 'react';

export default function Product({ params }: { params: { id: string } }) {
	return (
		<div>
			<h1>{params.id}</h1>
		</div>
	);
}
