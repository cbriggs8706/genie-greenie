import '../app/globals.css'
import { Inter, Roboto_Slab, Josefin_Slab, Young_Serif } from 'next/font/google'
import Footer from '@/components/shared/Footer'
import Nav from '@/components/shared/Nav'

const inter = Inter({
	weight: ['400'],
	subsets: ['latin'],
	variable: '--inter',
})
const roboto = Roboto_Slab({
	subsets: ['latin'],
	variable: '--roboto',
})
const youngSerif = Young_Serif({
	weight: ['400'],
	subsets: ['latin'],
	variable: '--young',
})
const jslab = Josefin_Slab({
	subsets: ['latin'],
	variable: '--jslab',
})

export const metadata = {
	title: 'High Desert Milk',
	description: 'High Desert Milk',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={`${jslab.variable} ${roboto.variable} ${youngSerif.variable} ${inter.variable} font-Young_Serif`}
			>
				<Nav />
				{children}
				<Footer />
			</body>
		</html>
	)
}
