import { Html, Body, Text, Container } from '@react-email/components'

export default function NewsletterConfirmation({ email }: { email: string }) {
	return (
		<Html>
			<Body style={{ fontFamily: 'sans-serif' }}>
				<Container>
					<Text>Hi {email},</Text>
					<Text>Thanks for signing up for our newsletter!</Text>
					<Text>You’ll start receiving updates soon.</Text>
				</Container>
			</Body>
		</Html>
	)
}
