import { cn } from '@/lib/utils/shadcn'

type Props = {
	children: string
	className?: string
}

export const H1 = ({ children, className }: Props) => {
	return (
		<h1
			className={cn(
				`font-Young_Serif text-4xl md:text-6xl text-center mb-8`,
				className
			)}
		>
			{children}
		</h1>
	)
}
export const H2 = ({ children, className }: Props) => {
	return (
		<h2
			className={cn(
				`font-Young_Serif text-4xl md:text-5xl lg:text-6xl text-center`,
				className
			)}
		>
			{children}
		</h2>
	)
}
export const H3 = ({ children, className }: Props) => {
	return (
		<h3
			className={cn(
				`text-2xl md:text-3xl lg:text-4xl font-Young_Serif font-bold my-8`,
				className
			)}
		>
			{children}
		</h3>
	)
}
export const H4 = ({ children, className }: Props) => {
	return (
		<h4
			className={cn(
				`text-lg md:text-xl font-Young_Serif lg:text-2xl font-bold`,
				className
			)}
		>
			{children}
		</h4>
	)
}
