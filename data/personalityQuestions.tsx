// quizData.ts

import { QuizData } from '@/data/types'

export const quizData: QuizData = {
	categories: [
		{
			name: 'Research & Documentation Experts',
			subcategories: [
				{
					name: 'The Ancestry Archivist',
					questions: [
						{
							id: 'q1',
							text: 'When you encounter conflicting information about a relative, what is your first step?',
							type: 'multiple-choice',
							options: [
								{ name: 'Option A', points: 5 },
								{ name: 'Option B', points: 3 },
								{ name: 'Option C', points: 1 },
							],
							categoryName: 'Research & Documentation Experts',
						},
						{
							id: 'q2',
							text: 'How do you prefer to organize your genealogical findings—physically, digitally, or a mix of both?',
							type: 'multiple-choice',
							options: [
								{ name: 'Physically', points: 5 },
								{ name: 'Digitially', points: 5 },
								{ name: 'Both', points: 5 },
								{ name: 'Not at all', points: 0 },
							],
							categoryName: 'Research & Documentation Experts',
						},
					],
				},
			],
		},
		{
			name: 'Testing',
			subcategories: [
				{
					name: 'Testing Sub',
					questions: [
						{
							id: 'q1',
							text: 'TQ1?',
							type: 'multiple-choice',
							options: [
								{ name: 'Physically', points: 5 },
								{ name: 'Digitially', points: 5 },
								{ name: 'Both', points: 5 },
								{ name: 'Not at all', points: 0 },
							],
							categoryName: 'Research & Documentation Experts',
						},
					],
				},
			],
		},
	],
}
