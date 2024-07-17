import { Button } from "@/components/ui/button";

export default async function Home() {
	return (
		<main className="flex items-center justify-center">
			<h1>Home Page</h1>
			<Button className="bg-purple-900 hover:bg-purple-400">Hello Shadcn</Button>
		</main>
	);
}
