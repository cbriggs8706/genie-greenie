import { auth } from '@clerk/nextjs'

const adminIds = ['user_2eWXyHfagzVdUaC73elXPlQTeGJ']

export const isAdmin = () => {
	const { userId } = auth()

	if (!userId) {
		return false
	}

	return adminIds.indexOf(userId) !== -1
}
