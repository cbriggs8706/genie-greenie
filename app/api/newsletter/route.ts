import NewsletterConfirmation from '@/components/emails/NewsletterConfirmation'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
	const { email } = await req.json()

	if (!email || typeof email !== 'string') {
		return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
	}

	try {
		await resend.emails.send({
			from: 'cameronbriggs8706@gmail.com',
			to: email,
			subject: 'Thanks for subscribing to the Burley FamilySearch Newsletter!',
			react: NewsletterConfirmation({ email }),
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Email failed' }, { status: 500 })
	}
}
