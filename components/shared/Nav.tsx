'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import { HiBars3, HiXMark } from 'react-icons/hi2'

import Image from 'next/image'
import { createClient, supabaseConfigured } from '@/lib/supabase/client'

export default function Example() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const currentPath =
		typeof window === 'undefined'
			? '/'
			: `${window.location.pathname}${window.location.search}`

	useEffect(() => {
		if (!supabaseConfigured()) return

		const supabase = createClient()

		void supabase.auth.getUser().then(({ data }) => {
			setIsLoggedIn(Boolean(data.user))
		})

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsLoggedIn(Boolean(session?.user))
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	useEffect(() => {
		const openMenu = () => setMobileMenuOpen(true)
		window.addEventListener('open-mobile-menu', openMenu)
		return () => {
			window.removeEventListener('open-mobile-menu', openMenu)
		}
	}, [])

	const authHref = isLoggedIn
		? '/dashboard'
		: `/login?next=${encodeURIComponent(currentPath)}`
	const authLabel = isLoggedIn ? 'Dashboard' : 'Login'

	return (
		<>
			<header className="bg-sky-800 text-white z-30 sticky font-Young_Serif">
				<nav
					className="mx-auto grid max-w-7xl grid-cols-3 items-center px-2 py-1 sm:px-4 lg:px-6"
					aria-label="Global"
				>
					<div className="flex justify-start">
						<Link href="/" className="p-2">
							<Image
								src="/genieGreenieLogo150px.png"
								width={50}
								height={50}
								alt="Genie Greenie Logo"
								className="mx-auto"
							/>
						</Link>
					</div>
					<span className="font-Young_Serif text-2xl lg:text-4xl text-white text-center">
						Genie Greenie
					</span>
					<div className="flex justify-end">
						<button
							type="button"
							className="rounded-full p-3 text-white transition hover:bg-sky-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open menu</span>
							<HiBars3 className="h-8 w-8" aria-hidden="true" />
						</button>
					</div>
				</nav>

				<Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
					<div className="fixed inset-0 z-40" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-sky-800 px-2 pb-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<Link href="/" className="p-2">
								<span className="sr-only font-Young_Serif">Genie Greenie</span>
								<Image
									src="/genieGreenieLogo150px.png"
									width={75}
									height={75}
									alt="Genie Greenie Logo"
									className="mx-auto"
								/>
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
										href="/quiz"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Quizzes
									</Link>
									<Link
										href="/play"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Play
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
										About Me
									</Link>
									<Link
										href={authHref}
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										{authLabel}
									</Link>
									<Link
										href="/quiz/nickname"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Nickname Quiz
									</Link>
									<Link
										href="/learn/nickname"
										className="-mx-3 block rounded-lg px-3 py-2 leading-8 text-white text-lg text-center font-Young_Serif"
										onClick={() => setMobileMenuOpen(false)}
									>
										Nickname Finder
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
