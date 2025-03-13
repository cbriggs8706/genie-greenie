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
				{ answer: 'Scanning and uploading it?', category: 'Digitizer' },
				{
					answer:
						'indentifying the people in it and writing information on the back.',
					category: 'Indexer',
				},
			],
		},
		{
			id: 'q2',
			text: "You've got some free time this afternoon, which project would you rather tackle?",
			options: [
				{
					answer: 'Scanning a shoebox of family photos and uploading them.',
					category: 'Digitizer',
				},
				{
					answer:
						'Find new blue record hints in FamilySearch and link records to your ancestors',
					category: 'Attacher',
				},
			],
		},
		{
			id: 'q3',
			text: 'You come across an old family letter that no one in your family has seen, what do you do first?',
			options: [
				{
					answer: 'Scan it and upload it to FamilySearch',
					category: 'Digitizer',
				},
				{
					answer: 'Call up a family member and read it to them',
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
			text: 'Which phase brings you more joy?',
			options: [
				{
					answer: 'Scanning and saving old photographs.',
					category: 'Digitizer',
				},
				{
					answer: 'Sorting and labeling them into well-organized albums.',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q6',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Preserve an audio clip of an deceased ancestor',
					category: 'Digitizer',
				},
				{
					answer: 'Record a new audio clip of a living family member',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q7',
			text: 'You feel a stronger connection to your ancestors by:',
			options: [
				{ answer: 'Scanning their records', category: 'Digitizer' },
				{ answer: 'Visiting the places they lived', category: 'Explorer' },
			],
		},
		{
			id: 'q8',
			text: 'When looking at historical records, do you prefer:',
			options: [
				{
					answer: 'Reading through the whole record for context',
					category: 'Indexer',
				},
				{
					answer: 'Linking them to the right people in the family tree',
					category: 'Attacher',
				},
			],
		},
		{
			id: 'q9',
			text: 'Do you get more satisfaction from:',
			options: [
				{ answer: 'Deciphering old handwriting', category: 'Indexer' },
				{
					answer: 'Crafting meaningful stories based on old documents',
					category: 'Storyteller',
				},
			],
		},
		{
			id: 'q10',
			text: 'Would you rather spend an afternoon',
			options: [
				{
					answer: "Indexing a thousand names so that they're searchable",
					category: 'Indexer',
				},
				{
					answer: 'Hunting through records to solve a specific family mystery',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q11',
			text: 'What would do you enjoy more:',
			options: [
				{
					answer: 'Quick Name Review (a form of indexing)',
					category: 'Indexer',
				},
				{
					answer:
						'Categorizing and alphabetizing a newly acquired collection of family documents',
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
			text: 'Would you prefer:',
			options: [
				{
					answer:
						'Making old records accessible online with some form of indexing from home',
					category: 'Indexer',
				},
				{
					answer: 'Traveling to historical sites to find the records in person',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q14',
			text: "What's more exciting to you?",
			options: [
				{
					answer: "A new record for an ancestor you've been researching",
					category: 'Attacher',
				},
				{
					answer: "A new story about an ancestor you've never heard before",
					category: 'Storyteller',
				},
			],
		},
		{
			id: 'q15',
			text: 'Would you rather:',
			options: [
				{
					answer: 'Focus on attaching blue record hints to known ancestors',
					category: 'Attacher',
				},
				{
					answer: 'Hunt for new ancestors in newly indexed documents',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q16',
			text: "What's more valuable to you?",
			options: [
				{
					answer:
						'Uploading a document to FamilySearch and attaching it to an ancestor',
					category: 'Attacher',
				},
				{
					answer: 'Keeping a physical copy, neatly organized',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q17',
			text: 'You have an afternoon with a helpful teenage grandchild.  Would you be more inclined to:',
			options: [
				{
					answer: 'Have them help you link historical documents to ancestors',
					category: 'Attacher',
				},
				{
					answer: 'Play a few rounds of family history games like Geneopardy',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q18',
			text: 'Given the right service mission opportunity (all expenses paid), would you rather:',
			options: [
				{ answer: 'Attach records from home', category: 'Attacher' },
				{
					answer:
						'Serve abroad digitizing and preserving records and memories from another country',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q19',
			text: 'In your opinion what has a greater inpact on the family unit?',
			options: [
				{
					answer: 'Passing stories along to the rising generations',
					category: 'Storyteller',
				},
				{
					answer: 'Finding and sourcing data about their ancestors',
					category: 'Researcher',
				},
			],
		},
		{
			id: 'q20',
			text: "What would your family say that you're better known for?",
			options: [
				{
					answer: 'Telling stories',
					category: 'Storyteller',
				},
				{
					answer: 'Being the record keeper',
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q21',
			text: 'Would you be better described as:',
			options: [
				{
					answer: 'Someone who writes biographies',
					category: 'Storyteller',
				},
				{
					answer: 'Someone who biographies are written about',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q22',
			text: 'When visiting a town (with your family) when an ancestor lived, are you more likely to',
			options: [
				{
					answer: 'Drive past their old house and tell stories',
					category: 'Storyteller',
				},
				{
					answer: 'Visit them at the cemetery',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q23',
			text: 'You have 5 minutes, which could you find faster?',
			options: [
				{
					answer: 'A land deed of a close ancestor in a digital collection',
					category: 'Researcher',
				},
				{
					answer:
						"A physical copy/original of your parent's wedding certificate",
					category: 'Organizer',
				},
			],
		},
		{
			id: 'q24',
			text: "No other plans for spring break and you've got nothing but time, what do you choose to do:",
			options: [
				{
					answer:
						"Spend time uncovering your family's past based on a new DNA match",
					category: 'Researcher',
				},
				{
					answer: 'Spend time with family making memories',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q25',
			text: 'Say you go on a trip to discover your family roots, would you rather:',
			options: [
				{
					answer: 'Spend hours in archives searching for records',
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
			text: "It's Christmas break and the grandkids are over.  What would be more fulfilling to you:",
			options: [
				{
					answer:
						'Sharing with a grandchild a scrapbook/album/book you made about them',
					category: 'Organizer',
				},
				{
					answer: 'Crafting/making new memories with a grandchild',
					category: 'Creator',
				},
			],
		},
		{
			id: 'q27',
			text: 'What would be more precious to you?',
			options: [
				{
					answer:
						'Preserving a cherished recipe of an ancestor for future generations.',
					category: 'Organizer',
				},
				{
					answer:
						'Being able to taste the recipe one more time, made by the hands your ancestor.',
					category: 'Explorer',
				},
			],
		},
		{
			id: 'q28',
			text: "It's Memorial Day. Which would be more enjoyable?",
			options: [
				{
					answer:
						"Visiting a family cemeteries with some family members who havent't been there before",
					category: 'Creator',
				},
				{
					answer:
						'Researching and exploring obscure abandoned cemeteries and placing flags and flowers on some long forgotten headstones.',
					category: 'Explorer',
				},
			],
		},
	],
}
