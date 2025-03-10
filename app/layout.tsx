import '../app/globals.css'
import { Inter, Young_Serif } from 'next/font/google'
import Footer from '@/components/shared/Footer'
import Nav from '@/components/shared/Nav'

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
				<Nav />
				{children}
				<Footer />
			</body>
		</html>
	)
}
