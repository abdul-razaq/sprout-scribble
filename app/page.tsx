import Image from 'next/image';

export default function Home() {
	return (
		<main className="flex items-center justify-center">
			<h1>NEXT.JS</h1>
			<Image
				src={'/public/next.svg'}
				height={100}
				width={100}
				alt="next-image"
			/>
		</main>
	);
}
