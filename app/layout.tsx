import '../app/globals.css'
import { Inter, Young_Serif } from 'next/font/google'
import Footer from '@/components/shared/Footer'
import Nav from '@/components/shared/Nav'
import BackgroundSVG from '@/components/shared/BackgroundSVG'

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

export const metadata = {
	title: 'Genie Greenie',
	description: 'Genie Greenie',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${youngSerif.variable} ${inter.variable} font-inter`}>
				<BackgroundSVG />
				<Nav />
				<main className="mx-4 md:mx-24 mb-24 mt-4 bg-white rounded-xl shadow-lg p-4 md:p-8 opacity-85">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	)
}
