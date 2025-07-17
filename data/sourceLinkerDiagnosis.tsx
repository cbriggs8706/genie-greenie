export interface QuizAnswer {
	id: string
	answer: string
	video?: string
	next?: QuizNode
}

export interface QuizNode {
	id: string
	question: string
	answers: QuizAnswer[]
}

export const sourceLinkerData = {
	id: 'root',
	question: 'Are you familiar with SourceLinker and how it works?',
	answers: [
		{
			id: 'yes',
			answer: 'Yes',
			// next: { id: '_', question: '', answers: [{ id: 'yes', answer: 'Yes', next: '' }, { id: 'no', answer: 'No', next: '' }],}
			next: {
				id: 'viewing_record',
				question: 'Are you viewing a record in SourceLinker?',
				answers: [
					{
						id: 'yes',
						answer: 'Yes',
						next: {
							id: 'individuals_displayed',
							question:
								'Are there individuals/families displayed in both columns?',
							answers: [
								{
									id: 'yes',
									answer: 'Yes',
									next: {
										id: 'individuals_attached',
										question: 'Are some/all of the individuals attached?',
										answers: [
											{
												id: 'yes',
												answer: 'Yes',
												next: {
													id: 'warning_signs',
													question: 'Are there any warning signs?',
													answers: [
														{
															id: 'yes',
															answer: 'Yes',
															video: 'https://youtu.be/glDWDLomfBU',
														},
														{
															id: 'no',
															answer: 'No',
															next: {
																id: 'incorrectly_attached',
																question:
																	'Do you believe that some/all are attached incorrectly?',
																answers: [
																	{
																		id: 'yes',
																		answer: 'Yes',
																		video: 'https://youtu.be/tiG70vt_Vs4',
																	},
																	{
																		id: 'no',
																		answer: 'No',
																		next: {
																			id: 'matching_sides',
																			question:
																				'Do you believe that the left and right sides are a match that should be attached?',
																			answers: [
																				{
																					id: 'yes_all',
																					answer: 'Yes, all',
																					video: 'https://youtu.be/zDZxAPazjss',
																				},
																				{
																					id: 'yes_some',
																					answer: 'Yes, some',
																					next: {
																						id: 'everyone_match',
																						question:
																							'Does everyone on the left have a match on the right?',
																						answers: [
																							{
																								id: 'yes',
																								answer: 'Yes',
																								video:
																									'https://youtu.be/zDZxAPazjss',
																							},
																							{
																								id: 'no',
																								answer: 'No',
																								next: {
																									id: 'nonmatching_related',
																									question:
																										'Are the non-matching people on the left related to the family on the right?',
																									answers: [
																										{
																											id: 'yes',
																											answer: 'Yes',
																											next: {
																												id: 'relationship_type',
																												question:
																													'What type of relationship?',
																												answers: [
																													{
																														id: 'child_parent',
																														answer:
																															'Child/Parent',
																														video:
																															'https://youtu.be/WL4tC47Qt0U',
																													},
																													{
																														id: 'grandparent',
																														answer:
																															'Grandparent',
																														video:
																															'https://youtu.be/vs19aOhp9VI',
																													},
																													{
																														id: 'grandchild',
																														answer:
																															'Grandchild',
																														video:
																															'https://youtu.be/ZStZaZi4ULw',
																													},
																													{
																														id: 'silbing',
																														answer: 'Sibling',
																														video:
																															'https://youtu.be/c0H0TGxcG28',
																													},
																													{
																														id: 'aunt_niece',
																														answer:
																															'Aunt, Uncle, Niece, Nephew',
																														video:
																															'Uncle, Aunt, Niece and Nephew',
																													},
																													{
																														id: 'adopted',
																														answer: 'Adopted',
																														video:
																															'How to specify non-biological relationships',
																													},
																													{
																														id: 'step',
																														answer: 'Step',
																														video:
																															'https://youtu.be/YjirKVYi1Sw',
																													},
																												],
																											},
																										},
																										{
																											id: 'no',
																											answer: 'No',
																											video:
																												'https://youtu.be/d1gZfUI1Jqg',
																										},
																									],
																								},
																							},
																						],
																					},
																				},
																				{
																					id: 'wrong',
																					answer: "Something's wrong",
																					next: {
																						id: 'appearing_incorrectly',
																						question:
																							"What's appearing incorrectly?",
																						answers: [
																							{
																								id: 'no_head',
																								answer: 'No head of household',
																								video: 'No head of household',
																							},
																							{
																								id: 'census_error',
																								answer: 'Census error',
																								video:
																									'Correcting census errors',
																							},
																							{
																								id: 'dates_off',
																								answer: 'Dates are off',
																								video:
																									'Determining a match when dates and/or places are off but it still looks like a good match',
																							},
																							{
																								id: 'index_error',
																								answer: 'Index error',
																								video:
																									'Correcting indexing errors',
																							},
																							{
																								id: 'names',
																								answer: 'Names',
																								video:
																									'Help determining spelling errors and distinguishing nicknames',
																							},
																							{
																								id: 'gender',
																								answer: 'Gender',
																								video:
																									'https://youtu.be/X9saC30csFI',
																							},
																							{
																								id: 'parenthesis',
																								answer: 'Parenthesis',
																								video:
																									'https://youtu.be/tmEbD-zcDPU',
																							},
																						],
																					},
																				},
																				{
																					id: 'no',
																					answer: 'No',
																					next: {
																						id: 'believe_duplicates',
																						question:
																							'Do you believe there are duplicate families?',
																						answers: [
																							{
																								id: 'yes',
																								answer: 'Yes',
																								video:
																									'When and how to handle duplicate family merges',
																							},
																							{
																								id: 'no',
																								answer: 'No',
																								video:
																									'https://youtu.be/baoBWRUO3YY',
																							},
																						],
																					},
																				},
																				{
																					id: 'unsure',
																					answer: 'Unsure',
																					next: {
																						id: 'how_many',
																						question:
																							'How many individuals in the family?',
																						answers: [
																							{
																								id: 'more_four',
																								answer: 'More than 4',
																								video:
																									'https://youtu.be/R4L_2KXhCzU',
																							},
																							{
																								id: 'less_four',
																								answer: 'Less than ',
																								video:
																									'https://youtu.be/lol15cwKQF0',
																							},
																						],
																					},
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
											//TODO replace this whole branch
											// { id: 'no' },
										],
									},
								},
								{
									id: 'no',
									answer: 'No',
									next: {
										id: 'existing_individual',
										question:
											'Do you know of an existing individual in the tree that this record belongs to?',
										answers: [
											{
												id: 'yes',
												answer: 'Yes',
												video: 'https://youtu.be/P9GM0vO7A6Q',
											},
											{
												id: 'no',
												answer: 'No',
												video: 'https://youtu.be/YO0NvFJAFqw',
											},
										],
									},
								},
							],
						},
					},
					{
						id: 'no',
						answer: 'No',
						next: {
							id: 'which_sources',
							question:
								"Do you know which source(s) you'd like to attach to an existing person in the tree?",
							answers: [
								{
									id: 'yes',
									answer: 'Yes',
									video: 'https://youtu.be/ftlFbDcm2ck',
								},
								{
									id: 'no',
									answer: 'No',
									next: {
										id: 'which_person',
										question:
											"Do you know which person you'd like to find sources for?",
										answers: [
											{
												id: 'yes',
												answer: 'Yes',
												next: {
													id: 'existing_hints',
													question:
														'Are there any blue record hints for this individual?',
													answers: [
														{
															id: 'yes',
															answer: 'Yes',
															video: 'https://youtu.be/Qb4wAXEi9Yk',
														},
														{
															id: 'no',
															answer: 'No',
															video: 'https://youtu.be/3murPgNcvZk',
														},
													],
												},
											},
											{
												id: 'no',
												answer: 'No',
												next: {
													id: 'project_type',
													question: 'What type of project are you working on?',
													answers: [
														{
															id: 'community',
															answer: 'Community',
															next: {
																id: 'list_type',
																question:
																	'What kind of list are you working with?',
																answers: [
																	{
																		id: 'spreadsheet',
																		answer: 'Spreadsheet',
																		video:
																			'How to work with a provided community project spreadsheet',
																	},
																	{
																		id: 'no',
																		answer: 'No list',
																		video:
																			'Why and how to add sources for non-related persons in the tree',
																	},
																	{
																		id: 'record_collection',
																		answer: 'FamilySearch record Collection',
																		video: 'https://youtu.be/iPVxQ2lx4rw',
																	},
																],
															},
														},
														{
															id: 'personal',
															answer: 'Personal',
															video:
																'Determining which of my ancestors need more sources',
														},
													],
												},
											},
										],
									},
								},
								{
									id: 'no',
									answer: 'No',
									video: 'https://youtu.be/BivyryEQafk',
								},
							],
						},
					},
					{
						id: 'specific',
						answer: 'I need specific help with a smartphone or tablet',
						video: 'https://youtu.be/_LvSLI0Uzp8',
					},
				],
			},
		},
		{
			id: 'no',
			answer: 'No',
			next: {
				id: 'familysearch_account',
				question: 'Do you have a FamilySearch account?',
				answers: [
					{
						id: 'yes',
						answer: 'Yes',
						next: {
							id: 'able_to_login',
							question: 'Are you able to successfully log in?',
							answers: [
								{
									id: 'yes',
									answer: 'Yes',
									next: {
										id: 'confident_computer_skills',
										question:
											'Are you confident in computer basics and navigating the internet?',
										answers: [
											{
												id: 'yes',
												answer: 'Yes',
												video: 'Getting to know SourceLinker video playlist',
											},
											{
												id: 'no',
												answer: 'No',
												video: 'Computer basics video playlist',
											},
										],
									},
								},
								{
									id: 'no',
									answer: 'No',
									video: 'FamilySearch Password and Login Help',
								},
							],
						},
					},
					{
						id: 'no',
						answer: 'No',
						video:
							'Why should I create an account? A step-by-step guide on how to get started',
					},
				],
			},
		},
	],
}
