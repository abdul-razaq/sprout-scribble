'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';
import { LogIn, LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

export default function UserButton({ user }: { user?: User }) {
	console.log(user);

	return user ? (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger>
				<Avatar>
					{user.image ? (
						<Image src={user.image} alt={user.name!} fill={true} />
					) : (
						<AvatarFallback className="bg-primary flex items-center justify-center text-white font-sans font-medium leading-normal">
							{user.name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					)}
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-4 flex-col flex gap-1">
				<DropdownMenuLabel>
					<div className="text-center text-sm bg-primary/30 rounded-sm shadow-sm p-4">
						<h1>{user.name}</h1>
						<h2 className="text-xs font-normal">{user.email}</h2>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="group font-sans text-xs font-medium flex items-center gap-2 cursor-pointer">
					<TruckIcon
						size={16}
						className="group-hover:translate-x-1 transition-all duration-500"
					/>
					<span>My Orders</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="group font-sans text-xs font-medium flex items-center gap-2 cursor-pointer">
					<Settings
						size={16}
						className="group-hover:rotate-180 transition-all duration-500"
					/>
					<span>Settings</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="flex font-sans text-xs font-medium cursor-pointers">
					<Sun size={16} />
					<Moon size={16} />
					<p>Theme</p>
					<span>theme</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="group font-sans text-xs font-medium flex items-center gap-2 cursor-pointer focus:bg-destructive/30"
					onClick={() => signOut()}
				>
					<LogOut
						size={16}
						className="group-hover:scale-75 transition-all duration-500"
					/>
					<span>Sign out</span>
				</DropdownMenuItem>{' '}
			</DropdownMenuContent>
		</DropdownMenu>
	) : (
		<Button variant="default" asChild>
			<Link href="/auth" className="flex items-center gap-2">
				<LogIn size={16} />
				<span>Sign in</span>
			</Link>
		</Button>
	);
}
