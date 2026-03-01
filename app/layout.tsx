import '../app/globals.css'
import { Inter, Young_Serif } from 'next/font/google'
import type { Metadata } from 'next'
import Footer from '@/components/shared/Footer'
import Nav from '@/components/shared/Nav'
import BackgroundSVG from '@/components/shared/BackgroundSVG'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
	weight: ['400'],
	subsets: ['latin'],
	variable: '--inter',
})
const youngSerif = Young_Serif({
	weight: ['400'],
	subsets: ['latin'],
	variable: '--young',
})

export const metadata: Metadata = {
	title: 'Genie Greenie',
	description: 'Genie Greenie',
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
		other: [
			{
				rel: 'icon',
				url: '/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={`${youngSerif.variable} ${inter.variable} font-inter bg-sky-100`}
			>
				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-YKG2VHXDPW"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-YKG2VHXDPW');
					`}
				</Script>
				<Analytics />

				<BackgroundSVG />
				<Nav />
				<main className="mx-4 md:mx-24 mb-24 mt-4 bg-white rounded-xl shadow-lg p-4 md:p-8 bg-opacity-85">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	)
}
