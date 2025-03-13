import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
	publicRoutes: [
		'/',
		'/api/webhooks/stripe',
		'/full-test',
		'/personality',
		'/test',
		'/source-linker',
		'/deep-personality',
		'/start',
		'/learn',
		'/help/source-linker',
		'/learn/source-linker',
		'/help',
		'/about',
	],
})

export const config = {
	// Protects all routes, including api/trpc.
	// See https://clerk.com/docs/references/nextjs/auth-middleware
	// for more information about configuring your Middleware
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
