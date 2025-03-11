export interface Answer {
	answer: string
	category: string
}
export interface Question {
	id: string
	text: string
	options: Answer[]
}
export interface PersonalityData {
	questions: Question[]
}

export const personalityData: PersonalityData = {
	questions: [
		{
			id: 'q1',
			text: 'When working with a photo, do you get more satisfaction:',
			options: [
				{ answer: 'scanning and uploading it?', category: 'Digitizer' },
				{
					answer: 'adding handy background information to make it searchable?',
					category: 'Indexer',
				},
			],
		},
		{
			id: 'q2',
			text: 'Do you prefer spending time: ',
			options: [
				{
					answer: 'digitizing records to preserving them',
					category: 'Digitizer',
				},
				{
					answer: 'linking records to the right ancestors',
					category: 'Attacher',
				},
			],
		},
		{
			id: 'q3',
			text: 'When you come across an old family letter, do you enjoy:',
			options: [
				{ answer: 'Scanning and preserving it', category: 'Digitizer' },
				{
					answer: 'Writing about its historical and emotional significance',
					category: 'Storyteller',
				},
			],
		},
		{
			id: 'q4',
			text: 'Would you rather spend your time:',
			options: [
				{ answer: 'Digitizing existing records', category: 'Digitizer' },
				{
					answer: "Tracking down new records that haven't been uncovered yet",
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q5',
			text: 'Do you prefer:',
			options: [
				{
					answer: 'Scanning and saving old photographs',
					category: 'Digitizer',
				},
				{
					answer: 'Sorting and labeling them into well-organized albums',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q6',
			text: 'Would you rather:',
			options: [
				{ answer: 'Preserve history by digitizing it', category: 'Digitizer' },
				{
					answer:
						'Create new ways to make family history engaging for future generations',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q7',
			text: 'Do you feel a stronger connection to your ancestors by:',
			options: [
				{ answer: 'Scanning their records', category: 'Digitizer' },
				{ answer: 'Visiting the places they lived', category: 'Explorer' },
			],
		},
		{
			id: 'q8',
			text: 'When looking at historical records, do you prefer:',
			options: [
				{ answer: 'Making them searchable for others', category: 'Indexer' },
				{
					answer:
						'Personally linking them to the right people in a family tree',
					category: 'Attacher',
				},
			],
		},
		{
			id: 'q9',
			text: 'Do you get more satisfaction from:',
			options: [
				{ answer: 'Making old documents easy to search', category: 'Indexer' },
				{
					answer: 'Crafting meaningful stories based on those documents',
					category: 'Storyteller',
				},
			],
		},
		{
			id: 'q10',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Index thousands of names into a searchable database',
					category: 'Indexer',
				},
				{
					answer: 'Hunt through records to solve a specific family mystery',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q11',
			text: 'Do you enjoy:',
			options: [
				{
					answer: 'Transcribing and making records searchable',
					category: 'Indexer',
				},
				{
					answer: 'Sorting and categorizing family history materials',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q12',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Make historical documents easier to find',
					category: 'Indexer',
				},
				{
					answer:
						'Design engaging ways for younger generations to interact with them',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q13',
			text: 'Do you prefer:',
			options: [
				{ answer: 'Making old records accessible online', category: 'Indexer' },
				{
					answer: 'Traveling to historical sites to find them in person',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q14',
			text: 'Do you enjoy more:',
			options: [
				{
					answer: 'Connecting documents and records to ancestors',
					category: 'Attacher',
				},
				{
					answer: 'Crafting detailed stories about their lives',
					category: 'Storyteller',
				},
			],
		},
		{
			id: 'q15',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Focus on attaching records to known ancestors',
					category: 'Attacher',
				},
				{
					answer: 'Hunt for new ancestors in hard-to-find documents',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q16',
			text: 'Do you prefer:',
			options: [
				{
					answer: 'Linking documents to individuals in an online tree',
					category: 'Attacher',
				},
				{
					answer: 'Organizing them into a system where they are easily found',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q17',
			text: 'Are you more interested in:',
			options: [
				{
					answer: 'Linking historical documents to ancestors',
					category: 'Attacher',
				},
				{
					answer:
						'Creating experiences that help family members engage with history',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q18',
			text: 'Would you rather:',
			options: [
				{ answer: 'Attach records from home', category: 'Attacher' },
				{
					answer:
						'Travel to places where your ancestors lived to discover new records firsthand',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q19',
			text: 'Do you find more joy in:',
			options: [
				{
					answer: 'Crafting engaging narratives about your ancestors',
					category: 'Storyteller',
				},
				{
					answer: 'Uncovering new records that prove their history',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q20',
			text: 'Do you prefer:',
			options: [
				{
					answer: 'Writing stories to preserve family history',
					category: 'Storyteller',
				},
				{
					answer:
						'Meticulously organizing materials so others can easily access them',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q21',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Document the past through stories',
					category: 'Storyteller',
				},
				{
					answer:
						'Create interactive ways for family members to connect with their history',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q22',
			text: 'Do you feel more inspired when:',
			options: [
				{
					answer: 'Telling stories based on research',
					category: 'Storyteller',
				},
				{
					answer:
						'Physically visiting the places where those stories took place',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q23',
			text: 'Are you more passionate about:',
			options: [
				{
					answer: 'Digging through historical records to make discoveries',
					category: 'Researcher',
				},
				{
					answer: 'Methodically organizing the records you already have',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q24',
			text: 'Do you enjoy more:',
			options: [
				{
					answer: "Spending time uncovering your family's past",
					category: 'Researcher',
				},
				{
					answer: 'Building meaningful experiences for future generations',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q25',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Spend hours online or in archives searching for records',
					category: 'Researcher',
				},
				{
					answer: "Go on a journey to walk in your ancestors' footsteps",
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q26',
			text: 'Do you prefer:',
			options: [
				{
					answer: 'Meticulously sorting and labeling family records',
					category: 'Organizer',
				},
				{
					answer:
						'Designing creative ways to engage family members with their history',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q27',
			text: 'Are you more drawn to:',
			options: [
				{
					answer: 'Organizing and preserving documents',
					category: 'Organizer',
				},
				{
					answer:
						"Traveling to historical sites to experience your family's past firsthand",
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q28',
			text: 'Would you rather:',
			options: [
				{
					answer:
						'Design activities that connect your family to their heritage',
					category: 'Creator',
				},
				{
					answer:
						'Travel to the places where history happened to experience it firsthand',
					category: 'Explorer',
				},
			],
		},
	],
}
