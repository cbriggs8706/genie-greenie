'use client'
import Image from 'next/image'
import Link from 'next/link'

import {
	FaChartPie,
	FaCircleQuestion,
	FaGraduationCap,
	FaHouseChimney,
	FaSquareFacebook,
	FaSquareInstagram,
	FaSquareEnvelope,
} from 'react-icons/fa6'

export default function Footer() {
	const footerIcons = [
		{
			name: 'Home',
			href: '/',
			icon: FaHouseChimney,
		},
		{
			name: 'Start',
			href: '/start',
			icon: FaCircleQuestion,
		},
		{
			name: 'Learn',
			href: '/learn',
			icon: FaGraduationCap,
		},
		{
			name: 'Quiz',
			href: '/personality',
			icon: FaChartPie,
		},
	]

	return (
		<footer className="">
			{/* <div className="hidden lg:block fixed bottom-0 h-16 bg-amber-300 w-full"></div> */}
			{/* <div className="hidden lg:block">
				<div className="mx-auto border-white border-t-2" />
				<div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 text-white text-center pt-5">
					<div className="flex flex-col lg:grid lg:grid-cols-3 py-5">
						<div className="col-span-3 mx-auto flex items-center gap-3">
							<Link
								href="https://www.facebook.com/geniegreenie"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className=" rounded-xl border-4 border-white">
									<FaSquareFacebook className="text-white" size={50} />
								</div>
							</Link>
							<Link
								href="https://www.instagram.com/geniegreenie/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaSquareInstagram className="text-white" size={63} />
							</Link>
							<Link href="/contact">
								<FaSquareEnvelope className=" text-white" size={65} />
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
			</div> */}
			{/* Mobile Menu */}
			<div className="fixed bottom-2 left-1/2 -translate-x-1/2 grid grid-cols-4 justify-around py-2 z-20 bg-green-700 w-5/6 rounded-full bg-opacity-95">
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
