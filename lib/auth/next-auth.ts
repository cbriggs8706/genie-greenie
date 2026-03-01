import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { sanitizeNextPath } from '@/lib/auth/redirect'

export const authOptions: NextAuthOptions = {
	session: { strategy: 'jwt' },
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account?.provider === 'google' && account.id_token) {
				;(token as Record<string, unknown>).googleIdToken = account.id_token
			}
			return token
		},
		async redirect({ url, baseUrl }) {
			if (url.startsWith('/')) return `${baseUrl}${url}`
			if (url.startsWith(baseUrl)) return url
			return `${baseUrl}${sanitizeNextPath(undefined)}`
		},
	},
}
