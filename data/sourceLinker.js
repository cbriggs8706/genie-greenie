export const sourceLinkerData = {
	id: 'root',
	question: 'Are you familiar with SourceLinker and how it works?',
	answers: [
		{
			id: 'yes',
			answer: 'Yes',
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
													question: 'Are there any warining signs?',
													// next: { id: '_', question: '', answers: [{ id: 'yes', answer: 'Yes', next: '' }, { id: 'no', answer: 'No', next: '' }],}
													answers: [
														{
															id: 'yes',
															answer: 'Yes',
															video: 'What do I do with warning signs?',
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
																		video: 'How to detach properly',
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
																					video:
																						'How to successfully attach a record using SourceLinker',
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
																								video: '????',
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
																															'Adding missing people to the tree',
																													},
																													{
																														id: 'grandparent',
																														answer:
																															'Grandparent',
																														video:
																															'Grandparents',
																													},
																													{
																														id: 'grandchild',
																														answer:
																															'Grandchild',
																														video:
																															'Grandchildren',
																													},
																													{
																														id: 'silbing',
																														answer: 'Sibling',
																														video: 'Siblings',
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
																															'Second spouse, stepchildren',
																													},
																												],
																											},
																										},
																										{
																											id: 'no',
																											answer: 'No',
																											video:
																												'How to find and attach unrelated household members such as servants, housekeepers, lodgers etc.',
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
																					next: '',
																				},
																				{ id: 'no', answer: 'No', next: '' },
																				{
																					id: 'unsure',
																					answer: 'Unsure',
																					next: '',
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
											{ id: 'no' },
										],
									},
								},
								{
									id: 'no',
									answer: 'No',
									next: 'Do you know of an existing individual in the tree that this record belongs to?',
								},
							],
						},
					},
					{
						id: 'no',
						answer: 'No',
						next: "Do you know which source(s) you'd like to attach to an existing person in the tree?",
					},
					{
						id: 'specific',
						answer: 'I need specific help with a smartphone or tablet',
						video: 'I need specific help with a smartphone or tablet',
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
									next: 'Are you confident in computer basics and navigating the internet?',
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
