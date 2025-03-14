export interface Skills {
	url: string
	name: string
	skillLevel: string
	description: string
	time?: string[]
}

export interface MicroSkillsList {
	category: string
	skills: Skills[]
}

export const microSkills = [
	{
		category: 'Genealogical Research & Analysis',
		skills: [
			{
				url: '',
				name: 'Source Reliability',
				skillLevel: 'Beginner',
				description: 'Identifying reliable vs. unreliable sources',
			},
			{
				url: '',
				name: 'Primary vs Secondary',
				skillLevel: 'Beginner',
				description: 'Evaluating primary vs. secondary sources',
			},
			{
				url: '',
				name: 'Record Types',
				skillLevel: 'Intermediate',
				description:
					'Understanding different record types (census, vital records, probate, land, military, etc.)',
			},
			{
				url: '',
				name: 'Handwriting Analysis',
				skillLevel: 'Advanced',
				description: 'Analyzing handwriting and old scripts',
			},
			{
				url: '',
				name: 'Archives Navigation',
				skillLevel: 'Intermediate',
				description: 'Navigating archives and repositories effectively',
			},
			{
				url: '',
				name: 'Kinship Charts',
				skillLevel: 'Beginner',
				description: 'Understanding consanguinity and kinship charts',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Maternal/Paternal Lines',
				skillLevel: 'Intermediate',
				description: 'Tracing maternal and paternal lines separately',
			},
			{
				url: '',
				name: 'Fragmented Data',
				skillLevel: 'Advanced',
				description: 'Reconstructing fragmented data from multiple sources',
			},
			{
				url: '',
				name: 'Hypothesis Testing',
				skillLevel: 'Advanced',
				description: 'Developing and testing research hypotheses',
			},
			{
				url: '',
				name: 'Search Techniques',
				skillLevel: 'Intermediate',
				description: 'Using wildcards and Boolean search techniques',
			},
			{
				url: '',
				name: 'Transcription Errors',
				skillLevel: 'Beginner',
				description:
					'Recognizing and correcting errors in transcribed records.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Migration Patterns',
				skillLevel: 'Intermediate',
				description:
					'Understanding migration trends and their impact on genealogical research.',
			},
			{
				url: '',
				name: 'Historical Maps',
				skillLevel: 'Intermediate',
				description:
					'Using historical maps to track family movements and locate ancestral homelands.',
			},
			{
				url: '',
				name: 'Source Cross-Referencing',
				skillLevel: 'Advanced',
				description:
					'Comparing multiple sources to ensure accuracy and consistency in research.',
			},
			{
				url: '',
				name: 'Family Structures',
				skillLevel: 'Intermediate',
				description:
					'Understanding non-traditional family structures and how they appear in records.',
			},
			{
				url: '',
				name: 'Surname Studies',
				skillLevel: 'Advanced',
				description:
					'Conducting surname research to identify patterns and origins in family history.',
			},
			{
				url: '',
				name: 'Record Gaps',
				skillLevel: 'Intermediate',
				description:
					'Recognizing gaps in record-keeping and finding alternative sources of information.',
			},
			{
				url: '',
				name: 'Name Differentiation',
				skillLevel: 'Advanced',
				description:
					'Distinguishing between individuals with the same name in historical records.',
			},
			{
				url: '',
				name: 'Oral History Verification',
				skillLevel: 'Intermediate',
				description:
					'Cross-checking oral traditions with documentary evidence for genealogical accuracy.',
			},
			{
				url: '',
				name: 'Calendar Systems',
				skillLevel: 'Beginner',
				description:
					'Understanding differences between Julian and Gregorian calendars in historical records.',
			},
		],
	},
	{
		category: 'Historical & Cultural Knowledge',
		skills: [
			{
				url: '',
				name: 'Historical Events',
				skillLevel: 'Beginner',
				description: 'Understanding how historical events affected ancestors',
			},
			{
				url: '',
				name: 'Religious Influence',
				skillLevel: 'Intermediate',
				description: 'Learning about religious influences on record-keeping',
			},
			{
				url: '',
				name: 'Social Norms',
				skillLevel: 'Beginner',
				description: 'Studying social norms of different time periods',
			},
			{
				url: '',
				name: 'Naming Conventions',
				skillLevel: 'Intermediate',
				description: 'Recognizing naming conventions across cultures',
			},
			{
				url: '',
				name: 'Marriage Customs',
				skillLevel: 'Beginner',
				description:
					'Understanding traditional marriage and inheritance customs',
			},
			{
				url: '',
				name: 'Occupations',
				skillLevel: 'Intermediate',
				description: 'Analyzing historical occupations and their records',
			},
			{
				url: '',
				name: 'Disease Trends',
				skillLevel: 'Advanced',
				description:
					'Recognizing historical causes of death and disease trends',
			},
			{
				url: '',
				name: 'Funeral Customs',
				skillLevel: 'Beginner',
				description: 'Learning about traditional funeral and burial customs',
			},
			{
				url: '',
				name: 'Economic Factors',
				skillLevel: 'Intermediate',
				description:
					'Understanding historical economic factors that influenced migration',
			},
			{
				url: '',
				name: 'Ethnic Groups',
				skillLevel: 'Advanced',
				description:
					"Studying ethnic and minority groups' genealogical challenges",
			},
			{
				url: '',
				name: 'Kinship Terms',
				skillLevel: 'Beginner',
				description:
					'Understanding how different cultures define and record family relationships.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: "Women's Names",
				skillLevel: 'Beginner',
				description:
					"Learning how different cultures recorded and preserved women's names over time.",
			},
			{
				url: '',
				name: 'Land Ownership',
				skillLevel: 'Intermediate',
				description:
					'Examining historical landholding structures and their influence on genealogical records.',
			},
			{
				url: '',
				name: 'War Records',
				skillLevel: 'Intermediate',
				description:
					'Recognizing how historical wars influenced the creation, loss, and availability of records.',
			},
			{
				url: '',
				name: 'Border Changes',
				skillLevel: 'Advanced',
				description:
					'Analyzing how geopolitical events affected record-keeping and boundary changes.',
			},
			{
				url: '',
				name: 'Colonization Records',
				skillLevel: 'Advanced',
				description:
					'Understanding how colonization influenced documentation practices and accessibility of records.',
			},
			{
				url: '',
				name: 'Adoption & Illegitimacy',
				skillLevel: 'Intermediate',
				description:
					'Recognizing societal attitudes toward adoption and illegitimacy in historical records.',
			},
			{
				url: '',
				name: 'Storytelling Traditions',
				skillLevel: 'Beginner',
				description:
					'Learning how oral histories and traditions contribute to genealogical research.',
			},
			{
				url: '',
				name: 'Guild Records',
				skillLevel: 'Intermediate',
				description:
					'Studying historical occupations and their associated records for genealogical insights.',
			},
			{
				url: '',
				name: 'Literacy & Accuracy',
				skillLevel: 'Advanced',
				description:
					'Understanding how literacy levels affected the accuracy and reliability of historical records.',
			},
		],
	},
	{
		category: 'Linguistic & Writing Skills',
		skills: [
			{
				url: '',
				name: 'Genealogical Terms',
				skillLevel: 'Beginner',
				description: 'Translating key genealogical terms in multiple languages',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Handwriting Interpretation',
				skillLevel: 'Advanced',
				description: 'Reading and interpreting archaic handwriting',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Phonetic Variations',
				skillLevel: 'Intermediate',
				description: 'Recognizing phonetic spelling variations',
			},
			{
				url: '',
				name: 'Abbreviation Systems',
				skillLevel: 'Intermediate',
				description:
					'Understanding abbreviation systems in historical documents',
			},
			{
				url: '',
				name: 'Latin Phrases',
				skillLevel: 'Advanced',
				description: 'Learning Latin phrases in records',
			},
			{
				url: '',
				name: 'Name Misspellings',
				skillLevel: 'Beginner',
				description: 'Identifying common misspellings in historical names',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Dialect Influence',
				skillLevel: 'Intermediate',
				description: 'Recognizing the influence of dialects on record spelling',
			},
			{
				url: '',
				name: 'Legal Name Changes',
				skillLevel: 'Intermediate',
				description:
					'Understanding name changes due to immigration or legal reasons',
			},
			{
				url: '',
				name: 'Deciphering Initials',
				skillLevel: 'Beginner',
				description: 'Learning how to decipher initials in records',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Paleography Tools',
				skillLevel: 'Advanced',
				description: 'Using paleography tools and resources',
			},
			{
				url: '',
				name: 'Historical Punctuation',
				skillLevel: 'Beginner',
				description:
					'Understanding old-style punctuation and formatting in historical documents.',
			},
			{
				url: '',
				name: 'Legal & Church Phrasing',
				skillLevel: 'Intermediate',
				description:
					'Recognizing standard phrasing in legal and church records for accurate interpretation.',
			},
			{
				url: '',
				name: 'Historical Letters',
				skillLevel: 'Intermediate',
				description:
					'Learning the structure and conventions of historical letters and correspondence.',
			},
			{
				url: '',
				name: 'Research Logs & Citations',
				skillLevel: 'Advanced',
				description:
					'Developing effective research logs and citations to track genealogical sources.',
			},
			{
				url: '',
				name: 'Document Summarization',
				skillLevel: 'Intermediate',
				description:
					'Summarizing documents concisely while preserving key genealogical details.',
			},
			{
				url: '',
				name: 'Family History Writing',
				skillLevel: 'Advanced',
				description:
					'Writing clear, accurate, and engaging family histories for preservation and sharing.',
			},
			{
				url: '',
				name: 'Citation Formats',
				skillLevel: 'Advanced',
				description:
					'Documenting genealogical sources in APA, Chicago, MLA, and other citation formats.',
			},
			{
				url: '',
				name: 'Engaging Communication',
				skillLevel: 'Intermediate',
				description:
					'Presenting genealogical findings in an engaging and accessible way.',
			},
			{
				url: '',
				name: 'Library Cataloging',
				skillLevel: 'Beginner',
				description:
					'Understanding library cataloging systems for genealogy books and research materials.',
			},
			{
				url: '',
				name: 'Research Queries',
				skillLevel: 'Intermediate',
				description:
					'Writing effective queries for archives and professional genealogists to retrieve records.',
			},
		],
	},
	{
		category: 'FamilySearch',
		skills: [
			{
				url: '',
				name: 'Tree Navigation',
				skillLevel: 'Beginner',
				description:
					'Understanding how to navigate the FamilySearch Family Tree',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '/learn/source-linker',
				name: 'Source Linking',
				skillLevel: 'Beginner',
				description: 'How to attach sources to individuals in the Family Tree',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Merging Duplicates',
				skillLevel: 'Intermediate',
				description: 'Identifying and merging duplicate profiles',
			},
			{
				url: '',
				name: 'Quick Name Review',
				skillLevel: 'Beginner',
				description:
					'Quickly check first and last names and make sure they were indexed correctly',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Full Name Review',
				skillLevel: 'Beginner',
				description:
					"Make sure the person's entire name was identified and indexed correctly",
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Family Review',
				skillLevel: 'Beginner',
				description:
					'Help find all members of a family so they can be added to Family Tree together',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Verify Places',
				skillLevel: 'Beginner',
				description:
					'Help improve the accuracy of the family tree by connecting standard places to unverified places',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Indexing',
				skillLevel: 'Beginner',
				description:
					'Transcribing information from a historical document so that other people can search for their ancestors',
				time: ['2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Correcting Relationships',
				skillLevel: 'Intermediate',
				description: 'Editing parent-child and spousal relationships',
			},
			{
				url: '',
				name: 'Adding Memories',
				skillLevel: 'Beginner',
				description: 'Uploading and tagging photos, documents, and stories',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Standardizing Dates and Places',
				skillLevel: 'Beginner',
				description:
					"Ensuring dates and locations align with FamilySearch's standards",
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Ordinances Ready',
				skillLevel: 'Beginner',
				description: 'Find and print off names for the temple',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Family History Activities',
				skillLevel: 'Beginner',
				description: 'Find a fun activity to do alone or with a group',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Compare a Face',
				skillLevel: 'Beginner',
				description:
					'Compare your face with your ancestors and see who you look like',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Using the Fan Chart',
				skillLevel: 'Beginner',
				description: 'Viewing and interpreting the fan chart',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Collaborating with Others',
				skillLevel: 'Advanced',
				description: 'Working with other users to maintain accurate records',
			},
			{
				url: '',
				name: 'Using the Research Wiki',
				skillLevel: 'Intermediate',
				description: 'Finding guidance on regional and topic-based research',
			},
		],
	},
	{
		category: 'Technology & Digital Tools',
		skills: [
			{
				url: '',
				name: 'Genealogy Software',
				skillLevel: 'Beginner',
				description:
					'Navigating genealogy platforms like FamilySearch, Ancestry, and MyHeritage.',
			},
			{
				url: '',
				name: 'FHTL Games',
				skillLevel: 'Beginner',
				description:
					'With the click of a button, play a prepopulated genealogy game about your ancestors',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'AI Text Recognition',
				skillLevel: 'Advanced',
				description:
					'Using AI tools to recognize and transcribe text from old documents.',
			},
			{
				url: '',
				name: 'Metadata Analysis',
				skillLevel: 'Intermediate',
				description:
					'Understanding metadata in digital images and documents for genealogy research.',
			},
			{
				url: '',
				name: 'Photo Editing',
				skillLevel: 'Intermediate',
				description:
					'Enhancing and restoring historical photos for clarity and preservation.',
			},
			{
				url: '',
				name: 'Spreadsheet Formulas',
				skillLevel: 'Intermediate',
				description:
					'Utilizing spreadsheet formulas to analyze genealogical data efficiently.',
			},
			{
				url: '',
				name: 'Interactive Family Trees',
				skillLevel: 'Advanced',
				description:
					'Creating interactive digital family trees for better visualization and organization.',
			},
			{
				url: '',
				name: 'Database Structures',
				skillLevel: 'Advanced',
				description:
					'Understanding how genealogy databases store and retrieve information.',
			},
			{
				url: '',
				name: 'Cloud Storage',
				skillLevel: 'Beginner',
				description:
					'Using cloud storage effectively for backing up and sharing genealogy files.',
			},
			{
				url: '',
				name: 'OCR Technology',
				skillLevel: 'Advanced',
				description:
					'Running Optical Character Recognition (OCR) on historical documents.',
			},
			{
				url: '',
				name: 'Advanced Search Filters',
				skillLevel: 'Intermediate',
				description:
					'Navigating and applying advanced search filters in genealogy databases.',
			},
			{
				url: '',
				name: 'GIS Mapping',
				skillLevel: 'Advanced',
				description:
					'Using Geographic Information Systems (GIS) for historical mapping in genealogy.',
			},
			{
				url: '',
				name: 'Digitization & Indexing',
				skillLevel: 'Intermediate',
				description:
					'Digitizing and indexing family records for improved accessibility.',
			},
			{
				url: '',
				name: 'Genealogy Collaboration',
				skillLevel: 'Beginner',
				description:
					'Using social media to collaborate and share genealogy research.',
			},
			{
				url: '',
				name: 'Genealogy Blogging',
				skillLevel: 'Intermediate',
				description:
					'Setting up and managing a personal genealogy blog or website.',
			},
			{
				url: '',
				name: 'Microfilm Conversion',
				skillLevel: 'Advanced',
				description:
					'Converting microfilm and microfiche records into digital formats.',
			},
			{
				url: '',
				name: 'DNA Matching',
				skillLevel: 'Advanced',
				description:
					'Using DNA matching software to analyze and interpret genetic relationships.',
			},
			{
				url: '',
				name: 'Automated Citations',
				skillLevel: 'Intermediate',
				description:
					'Using software to automate citation and bibliography creation for genealogy research.',
			},
			{
				url: '',
				name: 'Data Security',
				skillLevel: 'Advanced',
				description:
					'Understanding data privacy and security best practices in genealogy research.',
			},
			{
				url: '',
				name: 'Virtual Reality (VR)',
				skillLevel: 'Advanced',
				description:
					'Exploring virtual reality tools for historical reconstructions and family history storytelling.',
			},
			{
				url: '',
				name: 'Genealogy Visualizations',
				skillLevel: 'Intermediate',
				description:
					'Creating visualizations and infographics to present genealogical data effectively.',
			},
		],
	},
	{
		category: 'Interpersonal & Emotional Intelligence',
		skills: [
			{
				url: '',
				name: 'Active Listening',
				skillLevel: 'Beginner',
				description:
					'Practicing active listening techniques during family interviews.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Open-Ended Questions',
				skillLevel: 'Beginner',
				description:
					'Asking open-ended questions to encourage storytelling in genealogy.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Sensitive Topics',
				skillLevel: 'Intermediate',
				description:
					'Navigating emotionally sensitive family history topics with care.',
			},
			{
				url: '',
				name: 'Ethical Sharing',
				skillLevel: 'Advanced',
				description:
					'Understanding ethical considerations when sharing family data.',
			},
			{
				url: '',
				name: 'Empathy & Trauma',
				skillLevel: 'Intermediate',
				description:
					'Practicing empathy when discussing family trauma and difficult histories.',
			},
			{
				url: '',
				name: 'Generational Trauma',
				skillLevel: 'Advanced',
				description:
					'Recognizing the impact of generational trauma on family narratives.',
			},
			{
				url: '',
				name: 'Building Trust',
				skillLevel: 'Intermediate',
				description:
					'Gaining trust from family members reluctant to share their stories.',
			},
			{
				url: '',
				name: 'Emotional Balance',
				skillLevel: 'Advanced',
				description:
					'Managing personal emotions when uncovering difficult family histories.',
			},
			{
				url: '',
				name: 'Conflict Resolution',
				skillLevel: 'Advanced',
				description:
					'Resolving conflicts in collaborative genealogy projects effectively.',
			},
			{
				url: '',
				name: 'Privacy & DNA Laws',
				skillLevel: 'Advanced',
				description:
					'Understanding privacy laws and ethical concerns related to DNA testing.',
			},
			{
				url: '',
				name: 'Cultural Sensitivity',
				skillLevel: 'Intermediate',
				description:
					'Respecting cultural and religious perspectives in genealogical research.',
			},
			{
				url: '',
				name: 'International Communication',
				skillLevel: 'Advanced',
				description:
					'Effectively communicating with researchers from different countries.',
			},
			{
				url: '',
				name: 'Setting Boundaries',
				skillLevel: 'Intermediate',
				description:
					'Maintaining healthy emotional boundaries while researching difficult topics.',
			},
			{
				url: '',
				name: 'DNA Result Coping',
				skillLevel: 'Advanced',
				description:
					'Helping others process unexpected DNA results with sensitivity and care.',
			},
			{
				url: '',
				name: 'Recognizing Bias',
				skillLevel: 'Advanced',
				description:
					'Identifying biases in historical records and family narratives.',
			},
			{
				url: '',
				name: 'Intergenerational Dialogue',
				skillLevel: 'Beginner',
				description:
					'Encouraging discussions between generations about family history.',
				time: ['2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Oral Tradition Perspectives',
				skillLevel: 'Intermediate',
				description:
					'Appreciating different perspectives in oral traditions and storytelling.',
			},
			{
				url: '',
				name: 'Genealogy Education',
				skillLevel: 'Beginner',
				description:
					'Teaching family members about the importance of genealogy.',
			},
			{
				url: '',
				name: 'Inclusivity in Research',
				skillLevel: 'Intermediate',
				description:
					'Promoting inclusivity and diverse representation in genealogical studies.',
			},
			{
				url: '',
				name: 'Patience & Persistence',
				skillLevel: 'Advanced',
				description:
					'Developing patience and long-term persistence in complex genealogy research.',
			},
		],
	},
	{
		category: 'Attention to Detail & Organizational Skills',
		skills: [
			{
				url: '',
				name: 'Research Logs',
				skillLevel: 'Beginner',
				description:
					'Keeping detailed research logs to track findings and sources.',
			},
			{
				url: '',
				name: 'File Naming Conventions',
				skillLevel: 'Intermediate',
				description:
					'Creating standardized naming conventions for digital genealogy files.',
			},
			{
				url: '',
				name: 'Record Organization',
				skillLevel: 'Intermediate',
				description:
					'Organizing both digital and physical genealogy records efficiently.',
			},
			{
				url: '',
				name: 'Spreadsheet Tracking',
				skillLevel: 'Intermediate',
				description:
					'Using spreadsheets to monitor research progress and data organization.',
			},
			{
				url: '',
				name: 'Color-Coding Notes',
				skillLevel: 'Beginner',
				description:
					'Applying color-coding techniques to research notes for better organization.',
			},
			{
				url: '',
				name: 'Citation Methods',
				skillLevel: 'Advanced',
				description:
					'Developing a consistent and accurate citation method for sources.',
			},
			{
				url: '',
				name: 'Genealogy Checklists',
				skillLevel: 'Beginner',
				description:
					'Using checklists to track completed genealogy research tasks.',
			},
			{
				url: '',
				name: 'Research Prioritization',
				skillLevel: 'Intermediate',
				description:
					'Setting up and prioritizing genealogy research goals effectively.',
			},
			{
				url: '',
				name: 'Error Review',
				skillLevel: 'Advanced',
				description:
					'Reviewing and correcting mistakes in genealogical records for accuracy.',
			},
			{
				url: '',
				name: 'Family Archive Inventory',
				skillLevel: 'Intermediate',
				description: 'Creating an inventory of family archives and heirlooms.',
			},
			{
				url: '',
				name: 'Duplicate Record Resolution',
				skillLevel: 'Advanced',
				description:
					'Recognizing and resolving conflicts in duplicate genealogy records.',
			},
			{
				url: '',
				name: 'Data Accuracy',
				skillLevel: 'Advanced',
				description:
					'Ensuring precise entry of names, dates, and details in genealogy research.',
			},
			{
				url: '',
				name: 'Version Control',
				skillLevel: 'Intermediate',
				description:
					'Understanding version control for managing genealogy research documents.',
			},
			{
				url: '',
				name: 'Mind Mapping',
				skillLevel: 'Intermediate',
				description:
					'Using mind-mapping tools to visualize genealogical connections.',
			},
			{
				url: '',
				name: 'Data Backup',
				skillLevel: 'Beginner',
				description:
					'Regularly backing up genealogy data like photos and documents to prevent loss of research.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Follow-Up Reminders',
				skillLevel: 'Beginner',
				description:
					'Setting up reminders for follow-up genealogy research tasks.',
			},
			{
				url: '',
				name: 'Task Management',
				skillLevel: 'Beginner',
				description:
					'Using to-do lists to break down complex genealogy research goals.',
			},
			{
				url: '',
				name: 'Avoiding Bias',
				skillLevel: 'Advanced',
				description:
					'Recognizing and avoiding confirmation bias in genealogical research.',
			},
			{
				url: '',
				name: 'Research Workflows',
				skillLevel: 'Intermediate',
				description:
					'Developing workflows to handle and integrate new genealogy information.',
			},
			{
				url: '',
				name: 'DNA Match Organization',
				skillLevel: 'Advanced',
				description:
					'Systematically organizing and analyzing DNA matches for research.',
			},
		],
	},
	{
		category: 'Creative & Artistic Skills',
		skills: [
			{
				url: '',
				name: 'Photo Restoration',
				skillLevel: 'Intermediate',
				description:
					'Restoring old photographs using editing software to enhance clarity.',
			},
			{
				url: '',
				name: 'Artistic Family Trees',
				skillLevel: 'Intermediate',
				description:
					'Creating visually appealing family tree charts with artistic elements.',
			},
			{
				url: '',
				name: 'Genealogy Scrapbooking',
				skillLevel: 'Beginner',
				description:
					'Designing genealogy scrapbooks to creatively preserve family history.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Storyboarding Narratives',
				skillLevel: 'Intermediate',
				description:
					'Structuring and storyboarding family history narratives for engaging storytelling.',
			},
			{
				url: '',
				name: 'Oral History Editing',
				skillLevel: 'Advanced',
				description:
					'Recording and editing oral histories to preserve family memories.',
			},
			{
				url: '',
				name: 'Digital Family Art',
				skillLevel: 'Advanced',
				description:
					'Creating digital artwork inspired by family history themes.',
			},
			{
				url: '',
				name: 'Coat of Arms Illustration',
				skillLevel: 'Intermediate',
				description:
					'Illustrating family crests and coat of arms for historical preservation.',
			},
			{
				url: '',
				name: 'Creative Genealogy Writing',
				skillLevel: 'Intermediate',
				description:
					'Writing poetry or creative works inspired by ancestral stories.',
			},
			{
				url: '',
				name: 'Genealogy Calligraphy',
				skillLevel: 'Beginner',
				description:
					'Using calligraphy for creating elegant genealogy documents.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Visual Presentations',
				skillLevel: 'Intermediate',
				description: 'Designing visually engaging genealogy presentations.',
			},
			{
				url: '',
				name: 'Animated Family Stories',
				skillLevel: 'Advanced',
				description:
					'Animating family history stories through short videos and multimedia.',
			},
			{
				url: '',
				name: 'Family History Crafts',
				skillLevel: 'Beginner',
				description:
					'Making family history quilts or crafts as a creative tribute to ancestors.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: 'Music Composition',
				skillLevel: 'Advanced',
				description:
					'Composing music inspired by ancestral stories and family heritage.',
			},
			{
				url: '',
				name: 'Virtual Ancestral Tours',
				skillLevel: 'Advanced',
				description:
					'Creating virtual tours of ancestral homes and historically significant locations.',
			},
			{
				url: '',
				name: 'Hand-Drawn Maps',
				skillLevel: 'Intermediate',
				description:
					'Sketching historical maps by hand to visualize family migration patterns.',
			},
			{
				url: '',
				name: 'Genealogy Comics',
				skillLevel: 'Intermediate',
				description:
					'Designing a family history comic strip to illustrate ancestral stories.',
			},
			{
				url: '',
				name: 'Historical Family Cookbook',
				skillLevel: 'Intermediate',
				description:
					'Developing a family cookbook featuring historical recipes and traditions.',
			},
			{
				url: '',
				name: 'Ancestral Photography',
				skillLevel: 'Beginner',
				description:
					'Using photography to document ancestral locations and historical landmarks.',
				time: ['5min/day', '2hrs/week', '1hr/day', '12+hrs/week'],
			},
			{
				url: '',
				name: "Children's Genealogy Books",
				skillLevel: 'Advanced',
				description:
					"Writing and illustrating children's books about family history.",
			},
			{
				url: '',
				name: 'Family Timeline Murals',
				skillLevel: 'Intermediate',
				description:
					'Creating a large-scale mural showcasing family history timelines.',
			},
		],
	},
]
