'use client'
import Image from 'next/image'
import Link from 'next/link'

import {
	MdHome,
	MdInventory2,
	MdGroups,
	MdHandshake,
	MdDirectionsWalk,
	MdCall,
} from 'react-icons/md'

import { Mail, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
	const footerIcons = [
		{
			name: 'Home',
			href: '/',
			icon: MdHome,
		},
		{
			name: 'Training',
			href: '/training',
			icon: MdInventory2,
		},
		{
			name: 'Quiz',
			href: '/personality',
			icon: MdGroups,
		},
	]

	return (
		<footer className="bg-darkblue lg:pt-20 lg:px-20">
			<div className="hidden lg:block">
				<div className="mx-auto border-white border-t-2" />
				<div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 text-white text-center pt-5">
					<Image
						src="mascot.svg"
						width={50}
						height={50}
						alt="Genie Greenie Logo"
						className="mx-auto w-20"
					/>

					<div className="flex flex-col lg:grid lg:grid-cols-3 py-5">
						<div className="col-span-3 mx-auto flex items-center gap-3">
							<Link
								href="https://www.facebook.com/highdesertmilk"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className=" rounded-xl border-4 border-white">
									<Facebook className="text-white" size={50} />
								</div>
							</Link>
							<Link
								href="https://www.instagram.com/highdesertmilk/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Instagram className="text-white" size={63} />
							</Link>
							<Link href="/contact">
								<Mail className=" text-white" size={65} />
							</Link>
							<p>
								&copy; {new Date().getFullYear()} Genie Greenie. All Rights
								Reserved
							</p>
						</div>
					</div>
					<div>
						<p className="text-xs">
							The products (services) offered by Genie Greenie are neither made,
							provided, approved nor endorsed by Intellectual Reserve, Inc.,
							FamilySearch International, or The Church of Jesus Christ of
							Latter-day Saints. Any content or opinions expressed, implied or
							included in or with the goods (services) offered by Genie Greenie
							are solely those of Genie Greenie and not those of Intellectual
							Reserve, Inc., FamilySearch International, or The Church of Jesus
							Christ of Latter-day Saints.
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 text-white font-thin text-xs text-center px-4 pb-5"></div>
			</div>
			<div className="fixed bottom-0 left-0 lg:hidden grid grid-cols-3 justify-around py-4 z-20 bg-darkblue w-full">
				{footerIcons.map((item) => (
					<a href={item.href} key={item.name}>
						<div className="">
							<div className="flex justify-center">
								{
									<item.icon
										className="h-7 w-7 text-white"
										aria-hidden="true"
									/>
								}
							</div>
							<div className="flex justify-center">
								<p className="block text-white text-xs sm:text-sm md:text-md">
									{item.name}
								</p>
							</div>
						</div>
					</a>
				))}
			</div>
		</footer>
	)
}
