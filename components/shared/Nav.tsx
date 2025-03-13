'use client'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'

import {
	HiBars3,
	HiCursorArrowRays,
	HiFingerPrint,
	HiSquaresPlus,
	HiXMark,
	HiChevronDown,
	HiPhone,
	HiDocumentCheck,
} from 'react-icons/hi2'

import Logo from '../shared/Logo'

const training = [
	// {
	// 	name: 'SourceLinker 101',
	// 	href: '/source-linker',
	// 	icon: MdPallet,
	// },
	{
		name: 'SourceLinker 101',
		href: '/source-linker',
		img: 'mascot.svg',
	},
]
const quizzes = [
	{
		name: 'Personality Quiz',
		href: '/personality',
		img: 'mascot.svg',
	},
	// {
	// 	name: 'Deep Personality Quiz',
	// 	href: '/deep-personality',
	// 	img: 'mascot.svg',
	// },
]

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ')
}

export default function Example() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	return (
		<>
			<header className="bg-sky-800 text-white z-30 sticky font-Young_Serif">
				<nav
					className="mx-auto flex max-w-7xl items-center justify-between lg:px-16"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<Link href="/" className="p-2 px-4 flex-shrink-0">
							<Logo width={50} height={50} />
						</Link>
					</div>
					<span className="font-Young_Serif text-2xl lg:text-4xl text-white text-center">
						Genie Greenie
					</span>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="inline-flex items-center justify-center rounded-md p-2.5 pr-4 text-white"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							<span className="sr-only">Open main menu</span>
							<HiBars3 className="h-10 w-10" aria-hidden="true" />
						</button>
					</div>

					{/*<Popover.Group className="hidden lg:flex lg:gap-x-12">
						 <Popover className="relative">
							<Popover.Button className="flex items-center gap-x-1 text-xl leading-6 text-white uppercase">
								Training
								<HiChevronDown
									className="h-5 w-5 flex-none text-white"
									aria-hidden="true"
								/>
							</Popover.Button>

							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-darkblue shadow-lg ring-1 ring-gray-900/5">
									<div className="p-4">
										{training.map((item) => (
											<div
												key={item.name}
												className="group relative flex items-center gap-x-6 rounded-lg p-4 text-xl leading-6"
											>
												<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-darkblue">
													{item.img ? (
														<Image
															height={100}
															width={100}
															alt={`${item.name} image`}
															src={item.img}
														/>
													) : (
														<item.icon
															className="h-6 w-6 text-white"
															aria-hidden="true"
														/>
													)}
												</div>
												<div className="flex-auto">
													<a href={item.href} className="block text-white">
														{item.name}
														<span className="absolute inset-0" />
													</a>
												</div>
											</div>
										))}
									</div>
								</Popover.Panel>
							</Transition>
						</Popover> 

						<Link href="/start" className="text-lg leading-6 text-white">
							Where do I start?
						</Link>
						<Link href="/learn" className="text-lg leading-6 text-white">
							Learn
						</Link>
						<Link href="/personality" className="text-lg leading-6 text-white">
							Quiz
						</Link>
						 <Link
							href="/deep-personality"
							className="text-lg leading-6 text-white"
						>
							Deep Personality Quiz
						</Link> 
					</Popover.Group>*/}
				</nav>

				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-40" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-sky-800 px-2 pb-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<Link href="/" className="p-2">
								<span className="sr-only font-Young_Serif">Genie Greenie</span>
								<Logo width={75} height={75} />
							</Link>

							<button
								type="button"
								className="-m-2.5 rounded-md p-6 text-white"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<HiXMark className="h-12 w-12" aria-hidden="true" />
							</button>
						</div>
						<div className="mt-8 flow-root">
							<div className="">
								<div className="">
									<div>
										<p className="text-2xl text-center text-white font-Young_Serif uppercase">
											Genie Greenie
										</p>
									</div>
									<Link
										href="/"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Home
									</Link>
									<Link
										href="/start"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Where do I start?
									</Link>
									<Link
										href="/learn"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Learn
									</Link>

									<Link
										href="/personality"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Quiz
									</Link>
									<Link
										href="/help"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Help Desk
									</Link>
									<Link
										href="/about"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										About Us
									</Link>

									{/* <Link
										href="/deep-personality"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Deep Personality Quiz
									</Link> */}
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</header>
		</>
	)
}
