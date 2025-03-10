import { QuizData } from '@/data/types'

export const quizData: QuizData = {
	questions: [
		{
			id: 'q1',
			text: 'When you encounter conflicting information about a relative, what is your first step?',
			options: [
				{ name: 'Correct the information', points: 1 },
				{ name: 'Look at the sources', points: 2 },
				{ name: 'Search for more documentation', points: 3 },
				{ name: 'Walk away', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Ancestry Archivist',
		},
		{
			id: 'q2',
			text: 'How do you prefer to organize your genealogical findings—physically, digitally, or a mix of both?',
			options: [
				{ name: 'Physically', points: 2 },
				{ name: 'Digitally', points: 2 },
				{ name: 'Both', points: 3 },
				{ name: "I don't really organize", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Ancestry Archivist',
		},
		{
			id: 'q3',
			text: 'How do you feel when you find a relative in a newly available online database?',
			options: [
				{ name: 'Excited', points: 3 },
				{ name: 'Good I guess', points: 1 },
				{ name: 'Frustrated', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Ancestry Archivist',
		},
		{
			id: 'q4',
			text: 'Do you enjoy validating research by cross-referencing multiple sources, or do you trust a single reliable source more?',
			options: [
				{ name: 'Cross-reference', points: 3 },
				{ name: 'Single reliable source', points: 1 },
				{ name: 'Enjoy is a strong word', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Ancestry Archivist',
		},
		{
			id: 'q5',
			text: 'When organizing family records, do you prefer a detailed, item-by-item system or a broad, overarching organization?',
			options: [
				{ name: 'Detailed', points: 3 },
				{ name: 'Broad', points: 1 },
				{ name: "I don't really organize", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Ancestry Archivist',
		},
		{
			id: 'q6',
			text: 'Do you find more satisfaction in uncovering obscure historical events or focusing on personal family stories?',
			options: [
				{ name: 'Obscure historical events', points: 2 },
				{ name: 'Personal family stories', points: 3 },
				{ name: 'Both equally', points: 3 },
				{ name: 'Neither', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Historical Researcher',
		},
		{
			id: 'q7',
			text: 'What resource do you most frequently turn to when researching a new ancestor?',
			options: [
				{ name: 'Census records and vital records', points: 2 },
				{ name: 'Family trees and compiled genealogies', points: 1 },
				{ name: 'Newspapers, letters, and personal documents', points: 3 },
				{ name: 'Online DNA matches', points: 2 },
				{ name: "I don't research ancestors", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Historical Researcher',
		},
		{
			id: 'q8',
			text: "How do you integrate historical events with your family's narrative—do you focus more on timelines or personal stories?",
			options: [
				{ name: 'Timelines', points: 2 },
				{ name: 'Personal stories', points: 3 },
				{ name: 'A mix of both', points: 3 },
				{ name: "I don't integrate historical events", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Historical Researcher',
		},
		{
			id: 'q9',
			text: "Do you enjoy uncovering a relative's participation in major historical events, or do you prefer to focus on the everyday life of ancestors?",
			options: [
				{ name: 'Major historical events', points: 2 },
				{ name: 'Everyday life', points: 3 },
				{ name: 'Both equally', points: 3 },
				{ name: "I don't look into either", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Historical Researcher',
		},
		{
			id: 'q10',
			text: 'When researching ancestors, do you lean more toward primary sources (letters, diaries) or secondary sources (books, analyses)?',
			options: [
				{ name: 'Primary sources', points: 3 },
				{ name: 'Secondary sources', points: 2 },
				{ name: 'I use whatever is easiest to find', points: 1 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Historical Researcher',
		},
		//
		{
			id: 'q11',
			text: 'How do you feel when discovering a new record that adds depth to your family history?',
			options: [
				{ name: "Thrilled—it's like solving a mystery!", points: 3 },
				{ name: "Happy, but I don't get too excited.", points: 2 },
				{ name: "Indifferent—it's just another record.", points: 1 },
				{ name: "Overwhelmed—I don't know how to process it.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Record Keeper',
		},
		{
			id: 'q12',
			text: 'Do you prefer to focus on documenting one family line at a time or explore multiple branches simultaneously?',
			options: [
				{ name: 'One family line at a time', points: 2 },
				{ name: 'Multiple branches simultaneously', points: 3 },
				{ name: 'I jump around without a clear focus', points: 1 },
				{ name: "I don't document family lines", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Record Keeper',
		},
		{
			id: 'q13',
			text: 'How do you feel when you discover a new way to categorize or organize genealogical data?',
			options: [
				{ name: 'Excited—I love optimizing my system!', points: 3 },
				{ name: "Interested—I might try it if it's useful.", points: 2 },
				{ name: "Neutral—it doesn't really matter to me.", points: 1 },
				{ name: 'Overwhelmed—I avoid changing my system.', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Record Keeper',
		},
		{
			id: 'q14',
			text: 'Do you prefer to document your findings in a detailed, step-by-step fashion, or with a focus on the big picture?',
			options: [
				{ name: 'Detailed, step-by-step', points: 3 },
				{ name: 'Big picture', points: 2 },
				{ name: 'A mix of both', points: 3 },
				{ name: "I don't document my findings", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Record Keeper',
		},
		{
			id: 'q15',
			text: 'When organizing your genealogy files, do you use a color-coding system, numerical ordering, or something else?',
			options: [
				{ name: 'Color-coding', points: 3 },
				{ name: 'Numerical ordering', points: 2 },
				{ name: 'A different custom system', points: 3 },
				{ name: 'No real system—I just keep track however I can', points: 1 },
				{ name: "I don't organize my genealogy files", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Record Keeper',
		},
		{
			id: 'q16',
			text: 'When you discover the origins of a surname, what detail do you find most exciting?',
			options: [
				{ name: 'Its linguistic or cultural meaning', points: 3 },
				{ name: 'The geographic region it comes from', points: 2 },
				{ name: 'Famous or notable people with the same surname', points: 1 },
				{ name: "I don't find surname origins exciting", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Surname Sleuth',
		},
		{
			id: 'q17',
			text: 'How often do you find yourself researching a surname just for the sake of curiosity?',
			options: [
				{ name: 'All the time—I love digging into surnames!', points: 3 },
				{ name: 'Occasionally, when a name catches my interest.', points: 2 },
				{ name: 'Rarely, unless I need to for family research.', points: 1 },
				{ name: 'Never—I only research names when necessary.', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Surname Sleuth',
		},
		{
			id: 'q18',
			text: 'How do you approach variations of the same surname in historical records?',
			options: [
				{
					name: 'I carefully track every variation and try to connect them.',
					points: 3,
				},
				{
					name: 'I note common variations but focus on my main spelling.',
					points: 2,
				},
				{
					name: 'I find them confusing and mostly stick to one version.',
					points: 1,
				},
				{
					name: "I don't pay much attention to surname variations.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Surname Sleuth',
		},
		{
			id: 'q19',
			text: 'Do you feel more connected to family history by exploring the meanings of surnames or uncovering the origins of specific family branches?',
			options: [
				{ name: 'Meanings of surnames—they tell a bigger story.', points: 2 },
				{
					name: 'Origins of specific family branches—they make it personal.',
					points: 3,
				},
				{ name: 'Both equally—I love making connections.', points: 3 },
				{ name: 'Neither really interests me.', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Surname Sleuth',
		},
		{
			id: 'q20',
			text: 'When tracing surname origins, do you enjoy the journey of discovery or the validation of your research?',
			options: [
				{
					name: "The journey of discovery—it's all about learning.",
					points: 3,
				},
				{ name: 'The validation—proving accuracy is satisfying.', points: 2 },
				{ name: 'Both—I enjoy learning and confirming.', points: 3 },
				{ name: "I don't trace surname origins.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Surname Sleuth',
		},
		{
			id: 'q21',
			text: 'Do you enjoy building family trees from scratch or piecing them together using specific documents like census records?',
			options: [
				{
					name: "Building from scratch—it's like solving a puzzle!",
					points: 3,
				},
				{
					name: 'Piecing them together using records—I prefer evidence-based research.',
					points: 3,
				},
				{ name: 'A mix of both approaches.', points: 3 },
				{ name: "I don't really enjoy building family trees.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Crafter',
		},
		{
			id: 'q22',
			text: 'How do you feel about interpreting data from a single census year versus following a family through multiple census records?',
			options: [
				{
					name: 'I prefer tracking a family across multiple census years—it gives a fuller picture.',
					points: 3,
				},
				{
					name: 'A single census record can be useful, but I like comparing a few key years.',
					points: 2,
				},
				{
					name: 'One census record is usually enough for my purposes.',
					points: 1,
				},
				{ name: "I don't use census records much.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Crafter',
		},
		{
			id: 'q23',
			text: 'How do you handle the challenge of interpreting ambiguous census data (e.g., misreported ages)?',
			options: [
				{
					name: 'I analyze patterns and cross-reference with other sources.',
					points: 3,
				},
				{
					name: "I note inconsistencies but don't spend too much time on them.",
					points: 2,
				},
				{ name: 'I find it frustrating and usually move on.', points: 1 },
				{ name: "I don't try to resolve ambiguous data.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Crafter',
		},
		{
			id: 'q24',
			text: "Do you enjoy comparing census data across decades to track your ancestors' life changes?",
			options: [
				{
					name: "Yes! It's fascinating to see how their lives evolved.",
					points: 3,
				},
				{ name: 'Sometimes, if I think it will help my research.', points: 2 },
				{
					name: 'Not really—I just use census records for basic facts.',
					points: 1,
				},
				{ name: "I don't compare census records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Crafter',
		},
		{
			id: 'q25',
			text: 'When using census records, do you focus on identifying individuals or analyzing family trends over time?',
			options: [
				{
					name: "Identifying individuals—I want to be sure of who's who.",
					points: 2,
				},
				{
					name: 'Analyzing family trends—I like understanding the bigger picture.',
					points: 3,
				},
				{
					name: 'Both—I find value in both individual and family analysis.',
					points: 3,
				},
				{ name: "I don't use census records much.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Crafter',
		},
		{
			id: 'q26',
			text: 'Do you feel more accomplished uncovering famous historical figures in your family tree or finding obscure ancestors?',
			options: [
				{
					name: "Famous historical figures—it's exciting to have notable connections!",
					points: 2,
				},
				{
					name: 'Obscure ancestors—I love bringing forgotten lives to light.',
					points: 3,
				},
				{ name: 'Both equally—they each tell an important story.', points: 3 },
				{ name: "I don't feel strongly about either.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Pedigree Pioneer',
		},
		{
			id: 'q27',
			text: 'How do you feel about connecting your family to historical royalty or famous individuals?',
			options: [
				{
					name: "It's thrilling—I enjoy the prestige of famous connections.",
					points: 2,
				},
				{
					name: "It's interesting, but I care more about everyday ancestors.",
					points: 3,
				},
				{
					name: "I'm skeptical—I prefer focusing on well-documented research.",
					points: 2,
				},
				{ name: "I don't find it exciting or relevant.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Pedigree Pioneer',
		},
		{
			id: 'q28',
			text: 'Do you feel more accomplished when you connect multiple family lines or trace the descent of a single line?',
			options: [
				{
					name: 'Connecting multiple family lines—it makes the tree feel whole.',
					points: 3,
				},
				{
					name: "Tracing a single line—it's satisfying to follow a direct path.",
					points: 2,
				},
				{ name: 'Both—I enjoy different aspects of each.', points: 3 },
				{ name: 'Neither really excites me.', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Pedigree Pioneer',
		},
		{
			id: 'q29',
			text: 'When researching royal or noble ancestors, do you find yourself more drawn to their personal stories or their historical impact?',
			options: [
				{
					name: 'Personal stories—I like seeing them as real people.',
					points: 3,
				},
				{
					name: 'Historical impact—I enjoy understanding their role in history.',
					points: 2,
				},
				{
					name: 'Both equally—I like a mix of context and personality.',
					points: 3,
				},
				{ name: "I don't research royal or noble ancestors.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Pedigree Pioneer',
		},
		{
			id: 'q30',
			text: 'How do you approach the challenge of integrating royal and non-royal ancestors into your family tree?',
			options: [
				{
					name: "I treat all ancestors equally—every person's story matters.",
					points: 3,
				},
				{
					name: 'I focus more on the everyday ancestors and less on royal lines.',
					points: 2,
				},
				{
					name: "I highlight royal connections because they're historically significant.",
					points: 2,
				},
				{ name: "I don't worry about integrating royal ancestry.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Pedigree Pioneer',
		},
		{
			id: 'q31',
			text: 'When constructing a family timeline, do you feel more satisfaction from including external historical events or individual family milestones?',
			options: [
				{
					name: 'External historical events—I like seeing how history shaped my ancestors.',
					points: 2,
				},
				{
					name: 'Individual family milestones—it makes the story more personal.',
					points: 3,
				},
				{
					name: 'Both—I enjoy blending history with personal stories.',
					points: 3,
				},
				{ name: "I don't create family timelines.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Timeline Architect',
		},
		{
			id: 'q32',
			text: 'How do you balance accuracy with readability when creating timelines for family history?',
			options: [
				{
					name: 'I prioritize accuracy—even if it makes things more complex.',
					points: 3,
				},
				{ name: 'I simplify things to make them more readable.', points: 2 },
				{
					name: 'I try to find a balance between clarity and detail.',
					points: 3,
				},
				{
					name: "I don't think about readability—I just list the facts.",
					points: 1,
				},
				{ name: "I don't create family timelines.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Timeline Architect',
		},
		{
			id: 'q33',
			text: "When looking at an ancestor's timeline, do you tend to focus on their chronological events or the patterns of their life?",
			options: [
				{
					name: 'Chronological events—I like seeing everything laid out clearly.',
					points: 2,
				},
				{
					name: 'Patterns of life—I look for recurring themes and trends.',
					points: 3,
				},
				{
					name: "Both—it's important to see events and the bigger picture.",
					points: 3,
				},
				{ name: "I don't analyze ancestor timelines.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Timeline Architect',
		},
		{
			id: 'q34',
			text: 'How do you prioritize which events to include in a family timeline?',
			options: [
				{
					name: 'Major life events (birth, marriage, death, moves, occupations).',
					points: 3,
				},
				{ name: 'Historical events that influenced their life.', points: 2 },
				{ name: 'Unique or personal stories that add depth.', points: 3 },
				{ name: "I don't prioritize—I include everything I find.", points: 1 },
				{ name: "I don't create family timelines.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Timeline Architect',
		},
		{
			id: 'q35',
			text: "Do you enjoy creating visual timelines for your ancestors' lives, or do you prefer written narratives?",
			options: [
				{
					name: 'Visual timelines—I like seeing everything mapped out.',
					points: 3,
				},
				{ name: 'Written narratives—I prefer storytelling.', points: 3 },
				{ name: 'Both—I like combining visuals with storytelling.', points: 3 },
				{ name: "I don't document ancestor timelines.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Timeline Architect',
		},
		{
			id: 'q36',
			text: 'When researching ancestors, how do you feel about focusing on legal documents like wills and estate papers?',
			options: [
				{
					name: 'I find them fascinating—they offer a lot of insight into family relationships.',
					points: 3,
				},
				{
					name: "They're useful, but I prefer other types of records.",
					points: 2,
				},
				{
					name: "I focus on them only if they're the most relevant source.",
					points: 2,
				},
				{ name: "I don't find legal documents interesting.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Probate Ponderer',
		},
		{
			id: 'q37',
			text: 'Do you enjoy tracing the inheritance patterns of a family over generations?',
			options: [
				{
					name: "Yes, it's intriguing to see how wealth and assets passed down.",
					points: 3,
				},
				{ name: "Sometimes, if it's relevant to the family story.", points: 2 },
				{
					name: 'Not really—I focus on other aspects of family history.',
					points: 1,
				},
				{ name: "I don't trace inheritance patterns.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Probate Ponderer',
		},
		{
			id: 'q38',
			text: 'How do you view the role of inheritance and wills in understanding family dynamics?',
			options: [
				{
					name: "They're critical—they reveal relationships and family hierarchies.",
					points: 3,
				},
				{
					name: "They offer insight but aren't central to understanding family dynamics.",
					points: 2,
				},
				{
					name: "They don't tell me much about family relationships.",
					points: 1,
				},
				{
					name: "I don't consider inheritance or wills in my research.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Probate Ponderer',
		},
		{
			id: 'q39',
			text: 'How do you integrate probate records into your broader family tree research?',
			options: [
				{
					name: 'I use them to uncover family connections and relationships.',
					points: 3,
				},
				{
					name: 'I focus on them if they provide clues for other records.',
					points: 2,
				},
				{
					name: 'I rarely use probate records, unless absolutely necessary.',
					points: 1,
				},
				{ name: "I don't use probate records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Probate Ponderer',
		},
		{
			id: 'q40',
			text: "Do you find it interesting to explore the context of an ancestor's estate, or do you focus on the details of who received what?",
			options: [
				{
					name: 'I enjoy exploring both the context and who received what.',
					points: 3,
				},
				{
					name: "I focus more on who received what—it tells me about the family's priorities.",
					points: 2,
				},
				{
					name: "I'm more interested in the broader context than the distribution details.",
					points: 3,
				},
				{ name: "I don't explore estates or inheritance much.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Probate Ponderer',
		},
		{
			id: 'q41',
			text: "How does it feel to uncover a relative's military service history compared to their everyday life events?",
			options: [
				{
					name: 'Military service history—it adds a layer of respect and pride.',
					points: 3,
				},
				{
					name: 'Everyday life events—it gives me a closer, personal connection.',
					points: 3,
				},
				{ name: 'Both are equally important and fulfilling.', points: 3 },
				{
					name: "I don't find military service history particularly interesting.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Military Historian',
		},
		{
			id: 'q42',
			text: "When researching military records, do you feel a sense of pride or curiosity about the history behind each soldier's story?",
			options: [
				{
					name: 'Pride—I feel connected to their service and sacrifice.',
					points: 3,
				},
				{
					name: 'Curiosity—I enjoy learning about their specific experiences.',
					points: 3,
				},
				{
					name: 'Both—I feel both a deep respect and a desire to understand the details.',
					points: 3,
				},
				{
					name: "I don't feel particularly proud or curious about military records.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Military Historian',
		},
		{
			id: 'q43',
			text: 'Do you enjoy exploring the personal stories of soldiers or focusing more on the military conflicts they participated in?',
			options: [
				{
					name: 'Personal stories—I enjoy understanding their experiences as people.',
					points: 3,
				},
				{
					name: 'Military conflicts—I focus on the historical significance of their involvement.',
					points: 2,
				},
				{
					name: 'Both—I like combining the personal and historical perspectives.',
					points: 3,
				},
				{ name: "I don't focus on military records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Military Historian',
		},
		{
			id: 'q44',
			text: "How do you approach analyzing military records—by examining unit histories or through individual soldiers' stories?",
			options: [
				{
					name: 'I prefer examining unit histories—they provide broader context.',
					points: 2,
				},
				{
					name: "I focus on individual soldiers' stories—they make it more personal.",
					points: 3,
				},
				{
					name: 'Both—I look at both to get a complete understanding.',
					points: 3,
				},
				{ name: "I don't analyze military records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Military Historian',
		},
		{
			id: 'q45',
			text: "When uncovering an ancestor's military service, do you feel more connected to the broader history or the personal experiences of that ancestor?",
			options: [
				{
					name: 'The personal experiences—I want to know what they went through.',
					points: 3,
				},
				{
					name: 'The broader history—I appreciate how their service fit into larger events.',
					points: 2,
				},
				{
					name: 'Both—I like connecting personal stories to historical contexts.',
					points: 3,
				},
				{
					name: "I don't feel connected to my ancestor's military service.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Military Historian',
		},
		{
			id: 'q46',
			text: 'When scanning family documents, how do you ensure the preservation of both the physical and digital versions?',
			options: [
				{
					name: 'I make sure to store the physical copies safely and back up digital versions in multiple places.',
					points: 3,
				},
				{
					name: 'I focus more on digital storage, but I keep the physical documents in good condition.',
					points: 2,
				},
				{
					name: "I prioritize digital storage and don't worry much about the physical copies.",
					points: 1,
				},
				{ name: "I don't scan or preserve family documents.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q47',
			text: 'How do you feel about using metadata and tagging to make digital archives easier to navigate?',
			options: [
				{
					name: 'I find it essential—it makes searching and organizing much easier.',
					points: 3,
				},
				{
					name: "It's helpful, but I don't always take the time to do it.",
					points: 2,
				},
				{ name: "I don't bother with metadata and tagging.", points: 0 },
				{ name: "I'm not sure what metadata and tagging are.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q48',
			text: 'When digitizing documents, do you focus more on the preservation aspect or the accessibility of information?',
			options: [
				{
					name: 'Preservation—I want to ensure they last for generations.',
					points: 3,
				},
				{
					name: 'Accessibility—I want the information to be easily retrievable.',
					points: 2,
				},
				{
					name: 'Both—I try to balance preservation and ease of use.',
					points: 3,
				},
				{
					name: 'Neither—I just digitize documents without much thought.',
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q49',
			text: 'Do you feel a sense of accomplishment when you digitize a collection of family records, or is it more about the process than the outcome?',
			options: [
				{
					name: "I feel accomplished—it's a tangible achievement to preserve the records.",
					points: 3,
				},
				{
					name: "It's more about the process and the enjoyment of organizing.",
					points: 2,
				},
				{
					name: "I don't feel much of anything about digitizing records.",
					points: 1,
				},
				{ name: "I don't digitize family records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q50',
			text: 'How do you decide what to digitize first—based on sentimental value or historical importance?',
			options: [
				{
					name: "I prioritize based on sentimental value—it's more personal to me.",
					points: 2,
				},
				{
					name: "I focus on historical importance—it's about preserving the most significant items.",
					points: 3,
				},
				{
					name: 'Both—I try to balance both sentimental and historical value.',
					points: 3,
				},
				{
					name: "I don't decide—I digitize whatever is easiest to access.",
					points: 1,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q51',
			text: 'When searching census records, do you prefer to follow an individual over time or analyze patterns across families?',
			options: [
				{
					name: 'Follow an individual over time—it gives a clear picture of their life.',
					points: 3,
				},
				{
					name: 'Analyze patterns across families—it helps to understand broader trends.',
					points: 2,
				},
				{
					name: 'Both—I like combining the individual and family patterns.',
					points: 3,
				},
				{ name: "I don't focus much on census records.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Whisperer',
		},
		{
			id: 'q52',
			text: 'How do you approach finding a relative in a tricky or incomplete census entry?',
			options: [
				{
					name: 'I use all available clues and cross-reference with other records.',
					points: 3,
				},
				{
					name: 'I focus on small details and try to narrow down possibilities.',
					points: 2,
				},
				{
					name: "I get frustrated and often move on if I can't find them.",
					points: 1,
				},
				{ name: "I don't deal with tricky census entries.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Whisperer',
		},
		{
			id: 'q53',
			text: 'Do you find it more rewarding to find individuals in census records who are hard to locate or those who have well-documented lives?',
			options: [
				{
					name: 'Hard-to-locate individuals—it feels like solving a puzzle.',
					points: 3,
				},
				{
					name: "Well-documented individuals—it's satisfying to confirm known information.",
					points: 2,
				},
				{ name: 'Both—they each have their own rewards.', points: 3 },
				{
					name: "I don't find satisfaction in finding individuals in census records.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Whisperer',
		},
		{
			id: 'q54',
			text: 'When looking for someone in census records, do you focus more on one family member or tracing the family as a whole?',
			options: [
				{
					name: 'One family member—I like to follow their individual story.',
					points: 2,
				},
				{
					name: "Tracing the family as a whole—I want to see the family unit's history.",
					points: 3,
				},
				{
					name: 'Both—I prefer to follow individual members within the family context.',
					points: 3,
				},
				{ name: "I don't use census records for this purpose.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Whisperer',
		},
		{
			id: 'q55',
			text: 'How do you handle gaps in census data—do you prefer exploring external sources to fill them in, or focus on the data you have?',
			options: [
				{
					name: 'Explore external sources—I want to fill in every detail possible.',
					points: 3,
				},
				{
					name: "Focus on the data I have—I don't like to rely too much on external sources.",
					points: 2,
				},
				{ name: 'I try to balance both methods.', points: 3 },
				{ name: "I don't worry much about gaps in census data.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Census Whisperer',
		},
		{
			id: 'q56',
			text: "How do you feel about piecing together a family member's story when the records are scarce or contradictory?",
			options: [
				{
					name: 'I enjoy the challenge—it feels rewarding to fill in the gaps.',
					points: 3,
				},
				{ name: 'I find it frustrating but worth the effort.', points: 2 },
				{
					name: 'I get overwhelmed and sometimes move on to other ancestors.',
					points: 1,
				},
				{
					name: "I don't enjoy working with scarce or contradictory records.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q57',
			text: "What excites you most about uncovering a distant relative's life story—new discoveries or connecting the dots?",
			options: [
				{
					name: 'New discoveries—I love finding pieces of the puzzle.',
					points: 3,
				},
				{
					name: 'Connecting the dots—I enjoy seeing how everything fits together.',
					points: 3,
				},
				{ name: 'Both—they excite me equally.', points: 3 },
				{
					name: "Neither—I'm not particularly motivated by uncovering distant relatives.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q58',
			text: 'How do you feel when you uncover a major breakthrough in your family tree that had eluded you for years?',
			options: [
				{ name: 'Elated—I feel a huge sense of accomplishment.', points: 3 },
				{ name: "Satisfied—it's nice to make progress.", points: 2 },
				{ name: 'Relieved—finally, the mystery is solved.', points: 3 },
				{
					name: "Indifferent—I don't get excited about breakthroughs.",
					points: 0,
				},
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q59',
			text: 'Do you enjoy solving genealogical puzzles, particularly where records are sparse or contradictory?',
			options: [
				{
					name: "Yes, I love solving tough puzzles—it's like a detective story.",
					points: 3,
				},
				{
					name: 'Sometimes, but I prefer working with more straightforward records.',
					points: 2,
				},
				{
					name: "I don't enjoy puzzles much—I prefer easier research.",
					points: 1,
				},
				{ name: "I don't solve genealogical puzzles.", points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q60',
			text: 'What drives you more when researching—solving a mystery or simply learning about your ancestors?',
			options: [
				{
					name: "Solving a mystery—it's the thrill of the unknown.",
					points: 3,
				},
				{
					name: 'Learning about my ancestors—I like uncovering their stories.',
					points: 3,
				},
				{
					name: 'Both—I enjoy the mystery and the learning process.',
					points: 3,
				},
				{ name: 'Neither—I research for other reasons.', points: 0 },
			],
			categoryName: 'Research & Documentation Experts',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q61',
			text: "How do you feel when you learn new details about an ancestor's life that deepen their story?",
			options: [
				{
					name: 'Excited—I love discovering new layers to their story.',
					points: 3,
				},
				{
					name: "Satisfied—it's great to add more depth to their life.",
					points: 2,
				},
				{
					name: "Indifferent—I don't focus on the details too much.",
					points: 1,
				},
				{
					name: "I don't really delve into the details of ancestors' lives.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Storyteller',
		},
		{
			id: 'q62',
			text: 'When sharing family history, do you focus more on the narrative or the facts behind it?',
			options: [
				{
					name: 'Narrative—I like to tell the story in a compelling way.',
					points: 3,
				},
				{
					name: 'Facts—I prefer to stick to the details and accuracy.',
					points: 2,
				},
				{
					name: 'Both—I try to balance storytelling with the facts.',
					points: 3,
				},
				{ name: "I don't share family history much.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Storyteller',
		},
		{
			id: 'q63',
			text: 'Do you prefer telling family stories in chronological order or weaving them through thematic elements?',
			options: [
				{
					name: 'Chronological order—it helps me keep track of events clearly.',
					points: 2,
				},
				{
					name: 'Thematic elements—I like weaving the story in a more dynamic way.',
					points: 3,
				},
				{
					name: 'Both—I mix chronology and themes to make it engaging.',
					points: 3,
				},
				{
					name: "I don't have a particular preference for telling family stories.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Storyteller',
		},
		{
			id: 'q64',
			text: "When sharing a family story, do you prefer to focus on one individual's journey or the broader family dynamics?",
			options: [
				{
					name: "One individual's journey—it brings the story to life.",
					points: 3,
				},
				{
					name: 'Broader family dynamics—I like showing the relationships and interactions.',
					points: 3,
				},
				{
					name: 'Both—I like to combine both personal and family perspectives.',
					points: 3,
				},
				{
					name: "I don't focus on one individual or family dynamics.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Storyteller',
		},
		{
			id: 'q65',
			text: "How do you feel when you're able to piece together an ancestor's life story from fragmented records?",
			options: [
				{
					name: 'Accomplished—I love the challenge of putting it all together.',
					points: 3,
				},
				{
					name: "Satisfied—it's nice to make sense of incomplete information.",
					points: 2,
				},
				{
					name: "Frustrated—it's hard to make conclusions from fragmented records.",
					points: 1,
				},
				{
					name: "I don't focus on piecing together fragmented records.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Storyteller',
		},
		{
			id: 'q66',
			text: 'How do you handle pieces of family history that are contradictory or incomplete?',
			options: [
				{
					name: 'I analyze all the available evidence and try to reconcile the contradictions.',
					points: 3,
				},
				{
					name: 'I focus on the most reliable sources and accept the gaps.',
					points: 2,
				},
				{
					name: 'I get frustrated and sometimes put the research aside.',
					points: 1,
				},
				{
					name: "I don't deal with contradictory or incomplete history.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q67',
			text: 'Do you enjoy uncovering hidden connections that bring new insights to family stories?',
			options: [
				{
					name: 'Yes, I love discovering new connections—it adds so much to the narrative.',
					points: 3,
				},
				{
					name: "Sometimes, if they're relevant to the overall story.",
					points: 2,
				},
				{
					name: "Not particularly—I'm more focused on facts than connections.",
					points: 1,
				},
				{ name: "I don't focus on uncovering hidden connections.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q68',
			text: 'When piecing together a family narrative, do you feel more satisfaction from discovering events or understanding the relationships?',
			options: [
				{
					name: "Understanding the relationships—it's the connections that make the story.",
					points: 3,
				},
				{
					name: "Discovering events—it's fascinating to learn about the historical moments.",
					points: 2,
				},
				{
					name: 'Both—I enjoy finding both the events and the relationships.',
					points: 3,
				},
				{ name: "Neither—I'm not focused on the narrative.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q69',
			text: 'How do you approach a genealogical mystery when records are scarce—do you focus more on family lore or searching through every available document?',
			options: [
				{
					name: "I search through every available document—it's about finding the facts.",
					points: 3,
				},
				{
					name: 'I focus on family lore—it often fills in the gaps.',
					points: 2,
				},
				{
					name: 'I balance both—family lore and documents complement each other.',
					points: 3,
				},
				{ name: "I don't deal with genealogical mysteries.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q70',
			text: "How do you feel about family stories that don't have a clear, tidy ending?",
			options: [
				{
					name: "I find them intriguing—sometimes life is messy, and that's part of the story.",
					points: 3,
				},
				{
					name: "I'm frustrated—I prefer stories with clear resolutions.",
					points: 1,
				},
				{
					name: "I'm indifferent—it doesn't matter if there's a tidy ending or not.",
					points: 2,
				},
				{ name: 'I avoid family stories without clear endings.', points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Detective',
		},
		{
			id: 'q71',
			text: 'Do you enjoy discovering new family connections, or do you find it more satisfying to deepen existing ones?',
			options: [
				{
					name: "Discovering new family connections—it's exciting to uncover fresh links.",
					points: 3,
				},
				{
					name: 'Deepening existing ones—it feels rewarding to learn more about what I already know.',
					points: 3,
				},
				{
					name: 'Both—I enjoy both expanding and enriching connections.',
					points: 3,
				},
				{
					name: "Neither—I don't focus much on family connections.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Clan Connector',
		},
		{
			id: 'q72',
			text: 'When building family trees, do you focus more on the structure or on weaving connections between generations?',
			options: [
				{
					name: 'Structure—I like organizing the family tree clearly.',
					points: 2,
				},
				{
					name: 'Weaving connections—I enjoy showing how generations are linked.',
					points: 3,
				},
				{
					name: 'Both—I focus on both the structure and the relationships.',
					points: 3,
				},
				{ name: "I don't build family trees.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Clan Connector',
		},
		{
			id: 'q73',
			text: 'Do you feel more excitement from discovering distant relatives or from connecting branches within your family tree?',
			options: [
				{
					name: "Distant relatives—it's fascinating to find long-lost connections.",
					points: 3,
				},
				{
					name: "Connecting branches within my tree—it's rewarding to make the tree fuller.",
					points: 3,
				},
				{ name: "Both—it's equally exciting to do both.", points: 3 },
				{ name: "Neither—I don't focus on either.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Clan Connector',
		},
		{
			id: 'q74',
			text: 'When connecting distant relatives, do you focus more on unearthing personal histories or tracing their relationships?',
			options: [
				{
					name: 'Unearthing personal histories—I love discovering their stories.',
					points: 3,
				},
				{
					name: 'Tracing their relationships—I enjoy understanding how they connect to my family.',
					points: 2,
				},
				{
					name: 'Both—I try to get a complete picture of both their personal history and relationships.',
					points: 3,
				},
				{ name: "I don't focus on distant relatives.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Clan Connector',
		},
		{
			id: 'q75',
			text: 'How do you feel about integrating distant branches into your family tree versus focusing on immediate relatives?',
			options: [
				{
					name: 'I enjoy integrating distant branches—it makes the family tree feel complete.',
					points: 3,
				},
				{
					name: 'I prefer focusing on immediate relatives—it feels more personal.',
					points: 2,
				},
				{
					name: 'Both—I like working on both distant branches and immediate relatives.',
					points: 3,
				},
				{ name: "I don't focus much on either.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Clan Connector',
		},
		{
			id: 'q76',
			text: 'How do you prefer to capture family memories—through written records, photos, or audio recordings?',
			options: [
				{
					name: 'Written records—I like documenting details in words.',
					points: 2,
				},
				{ name: 'Photos—I find visual memories to be powerful.', points: 2 },
				{
					name: 'Audio recordings—I enjoy hearing the voices and emotions of family members.',
					points: 3,
				},
				{
					name: "A mix of all three—it's important to capture memories in multiple ways.",
					points: 3,
				},
				{ name: "I don't actively capture family memories.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Oral Historian',
		},
		{
			id: 'q77',
			text: "How do you approach the challenge of preserving a story accurately while maintaining the speaker's voice?",
			options: [
				{
					name: 'I focus on staying true to their words while making the story clear.',
					points: 3,
				},
				{
					name: 'I prioritize accuracy, even if it changes the flow of their voice.',
					points: 2,
				},
				{
					name: 'I focus more on how it sounds rather than strict accuracy.',
					points: 1,
				},
				{ name: "I don't try to preserve the speaker's voice.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Oral Historian',
		},
		{
			id: 'q78',
			text: 'Do you find more value in personal anecdotes or in broader historical narratives when interviewing family members?',
			options: [
				{
					name: 'Personal anecdotes—they bring the family story to life.',
					points: 3,
				},
				{
					name: 'Broader historical narratives—they give context to the personal stories.',
					points: 2,
				},
				{ name: 'Both—they complement each other well.', points: 3 },
				{ name: "Neither—I don't do family interviews.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Oral Historian',
		},
		{
			id: 'q79',
			text: 'When interviewing family members, do you focus more on facts or emotional stories?',
			options: [
				{
					name: 'Emotional stories—I want to understand their feelings and experiences.',
					points: 3,
				},
				{ name: 'Facts—I focus on concrete details and accuracy.', points: 2 },
				{
					name: 'Both—I think facts and emotions together give a fuller story.',
					points: 3,
				},
				{ name: "Neither—I don't do family interviews.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Oral Historian',
		},
		{
			id: 'q80',
			text: 'How do you preserve and share oral history with future generations?',
			options: [
				{
					name: 'I record audio or video and store it in multiple formats for safekeeping.',
					points: 3,
				},
				{
					name: 'I transcribe the stories and create written records for future generations.',
					points: 2,
				},
				{
					name: 'I share the stories orally—telling the tales is part of the tradition.',
					points: 2,
				},
				{ name: "I don't actively preserve or share oral history.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Oral Historian',
		},
		{
			id: 'q81',
			text: "How do you go about integrating family history into the broader context of a local community's history?",
			options: [
				{
					name: "I focus on local historical records to connect my family's story with the community.",
					points: 3,
				},
				{
					name: 'I look for connections in major community events and their impact on my family.',
					points: 2,
				},
				{
					name: "I don't focus much on the community's history—just my family's story.",
					points: 1,
				},
				{
					name: "I don't integrate family history with community history.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Community Connector',
		},
		{
			id: 'q82',
			text: "Do you find yourself gravitating toward records of your family's neighbors or their extended networks?",
			options: [
				{
					name: 'Yes, I enjoy exploring neighbors and extended networks to understand the broader context.',
					points: 3,
				},
				{
					name: 'Sometimes, but I mostly focus on immediate family.',
					points: 2,
				},
				{ name: 'Rarely—I mostly focus on direct family members.', points: 1 },
				{ name: "I don't look at neighbors or extended networks.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Community Connector',
		},
		{
			id: 'q83',
			text: "When researching a family member's social network, do you focus more on neighbors or extended relatives?",
			options: [
				{
					name: 'Neighbors—I like understanding the community context.',
					points: 3,
				},
				{
					name: 'Extended relatives—they help build a deeper family connection.',
					points: 2,
				},
				{
					name: 'Both—both groups are important to understand the full picture.',
					points: 3,
				},
				{ name: "I don't research social networks.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Community Connector',
		},
		{
			id: 'q84',
			text: "Do you enjoy building a community narrative where the family's story intertwines with local history?",
			options: [
				{
					name: "Yes, I love seeing how the family's story fits into the bigger picture of the community.",
					points: 3,
				},
				{
					name: 'Sometimes, but I tend to focus more on individual family stories.',
					points: 2,
				},
				{ name: "I don't focus much on the community narrative.", points: 1 },
				{ name: "I don't build community narratives.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Community Connector',
		},
		{
			id: 'q85',
			text: "How do you integrate the story of your family's role in the broader community into their personal history?",
			options: [
				{
					name: 'I highlight key community events and their involvement in those events.',
					points: 3,
				},
				{
					name: 'I mention it occasionally but focus more on personal stories.',
					points: 2,
				},
				{
					name: "I don't actively integrate community involvement into personal histories.",
					points: 1,
				},
				{
					name: "I don't include the family's role in the community in my research.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Community Connector',
		},
		{
			id: 'q86',
			text: 'How do you feel when students grasp a complex genealogical concept for the first time?',
			options: [
				{
					name: "Excited—it's rewarding to see them understand something challenging.",
					points: 3,
				},
				{
					name: "Satisfied—it's a nice feeling when they finally get it.",
					points: 2,
				},
				{
					name: "Indifferent—it's part of the process, no big deal.",
					points: 1,
				},
				{ name: "I don't teach genealogical concepts.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Genealogy Educator',
		},
		{
			id: 'q87',
			text: 'Do you focus more on teaching genealogical research methods or sharing your own personal family discoveries?',
			options: [
				{
					name: 'Teaching research methods—I want them to develop strong skills.',
					points: 3,
				},
				{
					name: 'Sharing personal family discoveries—it makes the lessons more relatable.',
					points: 2,
				},
				{
					name: 'Both—I enjoy balancing both teaching methods and personal experiences.',
					points: 3,
				},
				{
					name: "I don't focus on either—I just share what I know.",
					points: 1,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Genealogy Educator',
		},
		{
			id: 'q88',
			text: 'How do you adjust your teaching approach when helping beginners versus advanced genealogists?',
			options: [
				{
					name: 'I simplify concepts and provide step-by-step guidance for beginners, while offering more complex strategies for advanced learners.',
					points: 3,
				},
				{
					name: 'I try to maintain a balance but focus more on beginners.',
					points: 2,
				},
				{
					name: 'I focus mainly on advanced learners—they need more in-depth resources.',
					points: 2,
				},
				{
					name: "I don't adjust my approach—I use the same methods for everyone.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Genealogy Educator',
		},
		{
			id: 'q89',
			text: 'When mentoring others, do you feel more satisfaction from their success or from watching their research skills improve?',
			options: [
				{
					name: "Watching their research skills improve—it shows they're learning and growing.",
					points: 3,
				},
				{
					name: 'Their success—it feels great to see them achieve their goals.',
					points: 3,
				},
				{ name: 'Both—I find satisfaction in both aspects.', points: 3 },
				{ name: "I don't mentor others.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Genealogy Educator',
		},
		{
			id: 'q90',
			text: 'How do you incorporate family history into your teachings—through research or storytelling?',
			options: [
				{
					name: 'Through research—I focus on the process and techniques of genealogy.',
					points: 3,
				},
				{
					name: 'Through storytelling—I like sharing personal family stories to make it engaging.',
					points: 2,
				},
				{
					name: 'Both—I combine research and storytelling to create a comprehensive learning experience.',
					points: 3,
				},
				{
					name: "I don't incorporate family history into my teachings.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Genealogy Educator',
		},
		{
			id: 'q91',
			text: 'How do you balance your enthusiasm for family history with the need to remain objective in your research?',
			options: [
				{
					name: 'I focus on the evidence and let the facts guide my conclusions, while still maintaining my enthusiasm for the discoveries.',
					points: 3,
				},
				{
					name: 'I sometimes get caught up in the excitement but try to check my biases.',
					points: 2,
				},
				{
					name: "I find it difficult to stay objective—I'm often swayed by my personal connection to the story.",
					points: 1,
				},
				{
					name: "I don't actively balance enthusiasm and objectivity in my research.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Historian',
		},
		{
			id: 'q92',
			text: 'Do you enjoy more the process of uncovering hidden family stories or the act of preserving them for future generations?',
			options: [
				{
					name: "Uncovering hidden family stories—it's thrilling to discover something new.",
					points: 3,
				},
				{
					name: "Preserving them for future generations—it's important to keep the family's legacy alive.",
					points: 2,
				},
				{
					name: 'Both—I love both the process of discovery and the preservation of stories.',
					points: 3,
				},
				{ name: "Neither—I don't focus much on either aspect.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Historian',
		},
		{
			id: 'q93',
			text: 'When preserving family stories, do you tend to focus more on the personal relationships or the broader historical context?',
			options: [
				{
					name: 'Personal relationships—I want to highlight the individual experiences and connections.',
					points: 3,
				},
				{
					name: 'Broader historical context—I like understanding the bigger picture of the time.',
					points: 2,
				},
				{
					name: 'Both—I try to balance both personal and historical elements.',
					points: 3,
				},
				{ name: "I don't focus on preserving family stories.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Historian',
		},
		{
			id: 'q94',
			text: 'How do you feel about revisiting old family history research with fresh eyes after gaining new knowledge or resources?',
			options: [
				{
					name: 'Excited—I often find new connections or correct past mistakes.',
					points: 3,
				},
				{
					name: "Curious—it's interesting to see how my perspective has changed over time.",
					points: 2,
				},
				{ name: "Indifferent—I don't often revisit old research.", points: 1 },
				{ name: "I don't revisit old research.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Historian',
		},
		{
			id: 'q95',
			text: "Do you prefer documenting a family's story chronologically or focusing on their cultural or social experiences?",
			options: [
				{
					name: 'Chronologically—I like seeing how events unfold over time.',
					points: 2,
				},
				{
					name: 'Cultural or social experiences—I want to understand the context in which they lived.',
					points: 3,
				},
				{
					name: 'Both—I enjoy combining both a chronological approach and cultural/social insights.',
					points: 3,
				},
				{
					name: "I don't focus on documenting family stories in either way.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Historian',
		},
		{
			id: 'q96',
			text: "How do you view your family's history in the context of local folklore—does it feel like a natural extension of their story?",
			options: [
				{
					name: 'Yes, it feels like a natural extension—family stories and local folklore often intertwine.',
					points: 3,
				},
				{
					name: 'Sometimes, but I mostly focus on documented facts.',
					points: 2,
				},
				{
					name: 'Not really—I prefer to keep family history separate from folklore.',
					points: 1,
				},
				{
					name: "I don't think about local folklore in relation to family history.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Local Lorekeeper',
		},
		{
			id: 'q97',
			text: "When researching, do you enjoy connecting your family's legacy to the stories and legends of the local area?",
			options: [
				{
					name: "Yes, it's fascinating to see how the family fits into the larger community narrative.",
					points: 3,
				},
				{
					name: "Occasionally, if the stories seem relevant to my family's history.",
					points: 2,
				},
				{
					name: "Not particularly—I focus more on my family's direct history.",
					points: 1,
				},
				{
					name: "I don't focus on local stories or legends when researching family history.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Local Lorekeeper',
		},
		{
			id: 'q98',
			text: 'How do you feel about integrating family folklore with hard historical facts?',
			options: [
				{
					name: "I find it exciting—it adds richness and depth to the family's story.",
					points: 3,
				},
				{
					name: "It's interesting, but I make sure to differentiate between folklore and fact.",
					points: 2,
				},
				{
					name: 'I prefer to stick to hard facts and avoid integrating folklore.',
					points: 1,
				},
				{
					name: "I don't integrate family folklore into my research.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Local Lorekeeper',
		},
		{
			id: 'q99',
			text: 'How do you approach incorporating local legends into your family history—do you treat them as fact or focus on their cultural meaning?',
			options: [
				{
					name: "I focus on their cultural meaning—it's about understanding the story, not just the facts.",
					points: 3,
				},
				{
					name: "I try to verify if they're factual, but I also appreciate the cultural significance.",
					points: 2,
				},
				{
					name: "I treat them as fact if there's supporting evidence, otherwise, I ignore them.",
					points: 1,
				},
				{
					name: "I don't incorporate local legends into my family history.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Local Lorekeeper',
		},
		{
			id: 'q100',
			text: 'Do you prioritize local or family history when connecting the dots between your ancestors and the community?',
			options: [
				{
					name: 'Family history—I focus on my ancestors first, then connect them to the community.',
					points: 3,
				},
				{
					name: "Local history—I like seeing how my family fits into the community's broader story.",
					points: 2,
				},
				{
					name: 'Both equally—I enjoy connecting both personal and community history.',
					points: 3,
				},
				{
					name: "I don't focus on either local or family history in this way.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Local Lorekeeper',
		},
		{
			id: 'q101',
			text: 'How do you prioritize preserving family history for future generations—through digital archives or physical heirlooms?',
			options: [
				{
					name: "Digital archives—I want to ensure that the family's history is accessible and protected.",
					points: 3,
				},
				{
					name: 'Physical heirlooms—I believe tangible items create a stronger connection to the past.',
					points: 2,
				},
				{
					name: 'Both—I try to balance both digital and physical preservation.',
					points: 3,
				},
				{ name: "I don't focus much on preserving family history.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Legacy Builder',
		},
		{
			id: 'q102',
			text: 'Do you enjoy organizing family memories in tangible forms, like scrapbooks or family books, or prefer digital formats?',
			options: [
				{
					name: 'Tangible forms—I enjoy the hands-on process and the emotional connection they offer.',
					points: 3,
				},
				{
					name: 'Digital formats—I appreciate the ease of storage and sharing.',
					points: 2,
				},
				{
					name: 'Both—I enjoy combining both methods to create a comprehensive collection.',
					points: 3,
				},
				{ name: "I don't organize family memories.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Legacy Builder',
		},
		{
			id: 'q103',
			text: 'When working on preserving family memories, do you focus on creating a legacy for future family members or honoring past generations?',
			options: [
				{
					name: 'Creating a legacy for future family members—I want to make sure the next generations understand their roots.',
					points: 3,
				},
				{
					name: 'Honoring past generations—I focus on keeping their stories alive for their sake.',
					points: 2,
				},
				{
					name: 'Both—I try to honor the past while creating something meaningful for the future.',
					points: 3,
				},
				{
					name: "I don't prioritize either—preservation is not my main focus.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Legacy Builder',
		},
		{
			id: 'q104',
			text: 'How do you balance emotional attachments to artifacts with their historical significance when preserving family heirlooms?',
			options: [
				{
					name: 'I value both emotional attachment and historical significance equally.',
					points: 3,
				},
				{
					name: "I prioritize emotional attachment—it's about preserving personal connections.",
					points: 2,
				},
				{
					name: "I prioritize historical significance—I want to ensure the item's preservation for the future.",
					points: 2,
				},
				{
					name: "I don't struggle with this balance—I focus on one or the other.",
					points: 1,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Legacy Builder',
		},
		{
			id: 'q105',
			text: 'Do you focus more on preserving family stories or ensuring the preservation of family records?',
			options: [
				{
					name: 'Family stories—I want to make sure the personal narratives are passed down.',
					points: 3,
				},
				{
					name: 'Family records—I focus on safeguarding factual documents for future reference.',
					points: 2,
				},
				{
					name: 'Both—I aim to preserve both stories and records for a well-rounded history.',
					points: 3,
				},
				{ name: "I don't focus much on preserving either.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Legacy Builder',
		},
		{
			id: 'q106',
			text: 'How do you ensure family records are stored and preserved while still keeping them accessible to future generations?',
			options: [
				{
					name: 'I use both digital and physical storage methods, ensuring proper backups and easy access.',
					points: 3,
				},
				{
					name: 'I store them digitally for easy access but also keep physical copies for preservation.',
					points: 2,
				},
				{
					name: 'I store them physically and ensure they are safely kept in protective conditions.',
					points: 2,
				},
				{
					name: "I don't worry much about preserving family records.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Archivist',
		},
		{
			id: 'q107',
			text: 'When you discover a family artifact, do you prefer to share it with others or preserve it privately?',
			options: [
				{
					name: "I prefer to share it with others—it's important to pass down the legacy.",
					points: 3,
				},
				{
					name: 'I preserve it privately until the right time to share it.',
					points: 2,
				},
				{ name: 'I prefer to keep it private and personal.', points: 1 },
				{
					name: "I don't focus on sharing or preserving family artifacts.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Archivist',
		},
		{
			id: 'q108',
			text: 'When collecting family artifacts, do you prioritize sentimental value or historical importance?',
			options: [
				{
					name: "I prioritize sentimental value—it's the personal connection that matters most.",
					points: 3,
				},
				{
					name: 'I prioritize historical importance—I want the artifact to have a significant role in family history.',
					points: 2,
				},
				{
					name: 'I try to balance both sentimental value and historical importance.',
					points: 3,
				},
				{ name: "I don't collect family artifacts.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Archivist',
		},
		{
			id: 'q109',
			text: 'How do you approach organizing and categorizing your family archives—chronologically, by event, or by person?',
			options: [
				{
					name: "Chronologically—it helps me see the family's history unfold over time.",
					points: 2,
				},
				{
					name: 'By event—I like to group records and artifacts by significant milestones.',
					points: 3,
				},
				{
					name: 'By person—I prefer to organize archives based on individual family members.',
					points: 3,
				},
				{ name: "I don't organize or categorize family archives.", points: 0 },
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Archivist',
		},
		{
			id: 'q110',
			text: 'How do you feel about organizing and preserving family photos compared to written records?',
			options: [
				{
					name: 'I value both equally—photos capture moments, and written records tell the stories behind them.',
					points: 3,
				},
				{
					name: 'I focus more on written records—they offer more detailed information.',
					points: 2,
				},
				{
					name: 'I focus more on photos—they provide a visual connection to the past.',
					points: 2,
				},
				{
					name: "I don't organize or preserve family photos or written records.",
					points: 0,
				},
			],
			categoryName: 'Storytellers & Community Connectors',
			subcategoryName: 'The Family Archivist',
		},
		{
			id: 'q111',
			text: 'When traveling to find genealogical information, do you feel a deeper connection to the past by physically visiting locations or by researching records?',
			options: [
				{
					name: 'Physically visiting locations—it makes the connection feel more real and tangible.',
					points: 3,
				},
				{
					name: 'Researching records—I prefer the depth and accuracy records provide.',
					points: 2,
				},
				{
					name: 'Both—I enjoy combining both experiences for a richer understanding.',
					points: 3,
				},
				{ name: "I don't travel for genealogical research.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Archivist Adventurer',
		},
		{
			id: 'q112',
			text: 'How do you decide which archives or locations to visit when gathering family history?',
			options: [
				{
					name: "I prioritize places with the most relevant records for my family's history.",
					points: 3,
				},
				{
					name: 'I choose locations based on personal significance or family stories.',
					points: 2,
				},
				{
					name: 'I focus on more accessible or convenient locations.',
					points: 1,
				},
				{
					name: "I don't prioritize visiting archives or locations.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Archivist Adventurer',
		},
		{
			id: 'q113',
			text: 'Do you feel more excited about the potential discoveries at a new location or the journey itself?',
			options: [
				{
					name: "The potential discoveries—it's thrilling to find new records and information.",
					points: 3,
				},
				{
					name: 'The journey itself—I enjoy the process of exploration and learning.',
					points: 2,
				},
				{
					name: "Both—I'm excited by both the discoveries and the adventure.",
					points: 3,
				},
				{
					name: "Neither—I don't get excited about traveling for genealogical research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Archivist Adventurer',
		},
		{
			id: 'q114',
			text: 'Do you prefer conducting genealogy research in local archives or traveling to distant locations to uncover family stories?',
			options: [
				{
					name: 'Local archives—I prefer focusing on nearby sources and documents.',
					points: 2,
				},
				{
					name: 'Distant locations—I enjoy the experience of discovering family stories in far-off places.',
					points: 3,
				},
				{
					name: 'Both—I like combining research in both local and distant locations.',
					points: 3,
				},
				{
					name: "I don't conduct research in archives or travel for genealogy.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Archivist Adventurer',
		},
		{
			id: 'q115',
			text: "When researching an ancestor's hometown, do you enjoy uncovering its broader historical context or focusing solely on your family's history?",
			options: [
				{
					name: 'Broader historical context—I like understanding the community and its impact on my family.',
					points: 3,
				},
				{
					name: 'Family history—I focus more on how my ancestors lived in that specific place.',
					points: 2,
				},
				{
					name: "Both—I enjoy integrating both the family's history and the town's history.",
					points: 3,
				},
				{
					name: "I don't focus on researching the hometown's history.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Archivist Adventurer',
		},
		{
			id: 'q116',
			text: 'When visiting a cemetery, do you focus more on the gravestones or the historical context of the cemetery itself?',
			options: [
				{
					name: 'Gravestones—I like focusing on the individual lives represented there.',
					points: 3,
				},
				{
					name: "Historical context—I enjoy learning about the cemetery's role in the local community and its history.",
					points: 2,
				},
				{
					name: 'Both—I find meaning in both the individual gravestones and the broader context.',
					points: 3,
				},
				{ name: "I don't focus much on visiting cemeteries.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Cemetery Sleuth',
		},
		{
			id: 'q117',
			text: "How do you balance personal interest in finding a relative's grave with the historical significance of the site?",
			options: [
				{
					name: "I focus on both—finding my relative's grave while appreciating the cemetery's broader significance.",
					points: 3,
				},
				{
					name: "I prioritize my relative's grave—personal connection matters most.",
					points: 2,
				},
				{
					name: 'I focus more on the historical context and overlook personal connections.',
					points: 1,
				},
				{
					name: "I don't visit cemeteries for genealogical research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Cemetery Sleuth',
		},
		{
			id: 'q118',
			text: 'Do you enjoy exploring the lives of lesser-known ancestors or focusing on well-documented family members?',
			options: [
				{
					name: 'Lesser-known ancestors—I enjoy uncovering stories that are not widely known.',
					points: 3,
				},
				{
					name: 'Well-documented family members—I like focusing on the established family tree.',
					points: 2,
				},
				{
					name: 'Both—I enjoy learning about both known and lesser-known ancestors.',
					points: 3,
				},
				{ name: "I don't focus on ancestors much.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Cemetery Sleuth',
		},
		{
			id: 'q119',
			text: 'How do you feel when you uncover an old grave that leads you to an unexpected family connection?',
			options: [
				{ name: "Excited—it's like solving a family mystery!", points: 3 },
				{
					name: "Satisfied—it's rewarding to make new connections in the family history.",
					points: 2,
				},
				{
					name: "Indifferent—I don't get excited about unexpected family connections.",
					points: 1,
				},
				{
					name: "I don't uncover family connections in cemeteries.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Cemetery Sleuth',
		},
		{
			id: 'q120',
			text: 'Do you enjoy searching cemeteries alone or with others, such as family or fellow researchers?',
			options: [
				{
					name: 'Alone—I like the quiet and personal experience of discovering graves.',
					points: 2,
				},
				{
					name: 'With others—I enjoy sharing the experience and learning together.',
					points: 3,
				},
				{
					name: 'Both—I like both solo exploration and group searches.',
					points: 3,
				},
				{
					name: "I don't search cemeteries for genealogical research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Cemetery Sleuth',
		},
		{
			id: 'q121',
			text: "When depicting an ancestor's life, do you prefer to create detailed illustrations or symbolic representations?",
			options: [
				{
					name: 'Detailed illustrations—I like capturing specific moments and visual details.',
					points: 3,
				},
				{
					name: 'Symbolic representations—I enjoy using symbols to convey deeper meanings.',
					points: 2,
				},
				{
					name: 'Both—I use both detailed illustrations and symbols to tell the story.',
					points: 3,
				},
				{
					name: "I don't create artistic representations of ancestors.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Ancestral Artist',
		},
		{
			id: 'q122',
			text: 'How do you incorporate personal stories into your artwork when documenting family history?',
			options: [
				{
					name: 'I focus on key moments from their life to visually tell their story.',
					points: 3,
				},
				{
					name: 'I use symbols and abstract elements to represent the emotions and themes in their life.',
					points: 2,
				},
				{
					name: 'I incorporate personal stories indirectly, allowing the viewer to interpret the artwork.',
					points: 2,
				},
				{
					name: "I don't incorporate personal stories into my artwork.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Ancestral Artist',
		},
		{
			id: 'q123',
			text: 'Do you view your art as a means to interpret family history, or as a way to preserve memories for future generations?',
			options: [
				{
					name: 'A means to interpret family history—I like to bring the past to life through artistic expression.',
					points: 3,
				},
				{
					name: 'A way to preserve memories—I want future generations to have a visual record of family stories.',
					points: 3,
				},
				{
					name: 'Both—I see it as both an interpretation and a preservation method.',
					points: 3,
				},
				{ name: "I don't use art to document family history.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Ancestral Artist',
		},
		{
			id: 'q124',
			text: "When visualizing an ancestor's life, do you prefer creating artistic representations or telling their story through traditional documentation?",
			options: [
				{
					name: 'Artistic representations—I enjoy using creativity to express their life story.',
					points: 3,
				},
				{
					name: 'Traditional documentation—I prefer the clarity and accuracy of written records.',
					points: 2,
				},
				{
					name: 'Both—I like to combine art with traditional documentation to give a fuller picture.',
					points: 3,
				},
				{
					name: "I don't visualize ancestors through either method.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Ancestral Artist',
		},
		{
			id: 'q125',
			text: 'Do you enjoy drawing or illustrating family stories, or do you prefer capturing them with words?',
			options: [
				{
					name: 'Drawing or illustrating—I like expressing family stories visually.',
					points: 3,
				},
				{
					name: 'Capturing with words—I prefer writing and storytelling to document family history.',
					points: 2,
				},
				{
					name: 'Both—I enjoy using both methods to tell the story.',
					points: 3,
				},
				{
					name: "I don't focus on illustrating or writing family stories.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Ancestral Artist',
		},
		{
			id: 'q126',
			text: 'When exploring new geographical areas for research, do you prefer focusing on a single ancestor or uncovering broader family connections?',
			options: [
				{
					name: 'Focusing on a single ancestor—I want to trace their path and connections in detail.',
					points: 3,
				},
				{
					name: 'Uncovering broader family connections—I like seeing how multiple branches of the family are linked.',
					points: 3,
				},
				{
					name: 'Both—I enjoy a combination of both detailed and broad connections.',
					points: 3,
				},
				{
					name: "I don't focus on geographical areas for research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Adventurer',
		},
		{
			id: 'q127',
			text: 'How do you feel about the unexpected discoveries that come from traveling to ancestral sites?',
			options: [
				{
					name: "Excited—it's thrilling to find new, unplanned connections and insights.",
					points: 3,
				},
				{
					name: "Satisfied—it's rewarding, even when the discoveries are not what I expected.",
					points: 2,
				},
				{
					name: 'Indifferent—I prefer to research with a clear plan rather than seeking surprises.',
					points: 1,
				},
				{ name: "I don't visit ancestral sites for research.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Adventurer',
		},
		{
			id: 'q128',
			text: 'Do you enjoy uncovering stories of family migrations or focusing on their connections to specific places?',
			options: [
				{
					name: 'Family migrations—I like tracing how the family moved and adapted over time.',
					points: 3,
				},
				{
					name: 'Connections to specific places—I enjoy uncovering the roots and significance of where they lived.',
					points: 2,
				},
				{
					name: 'Both—I find both migration stories and specific place connections equally fascinating.',
					points: 3,
				},
				{
					name: "I don't focus on migrations or specific places in my family history research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Adventurer',
		},
		{
			id: 'q129',
			text: 'How do you approach an ancestral site visit: with a detailed plan or with an open mind for spontaneous discoveries?',
			options: [
				{
					name: "Detailed plan—I like to know exactly what I'm looking for before I go.",
					points: 2,
				},
				{
					name: "Open mind—I'm open to unexpected discoveries and connections.",
					points: 3,
				},
				{
					name: 'Both—I like to balance preparation with flexibility for surprises.',
					points: 3,
				},
				{ name: "I don't visit ancestral sites.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Adventurer',
		},
		{
			id: 'q130',
			text: 'When traveling to uncover family history, do you prefer focusing on a specific ancestor or exploring broader regions and families?',
			options: [
				{
					name: 'Specific ancestor—I like focusing my research on one person to uncover a detailed story.',
					points: 3,
				},
				{
					name: 'Broader regions and families—I enjoy exploring multiple branches and connections within a larger area.',
					points: 3,
				},
				{
					name: 'Both—I like to combine both individual ancestor research with broader family exploration.',
					points: 3,
				},
				{ name: "I don't travel for family history research.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Adventurer',
		},
		{
			id: 'q131',
			text: 'How do you feel when discovering international family connections—more connected to your heritage or to the global story?',
			options: [
				{
					name: "More connected to my heritage—it's fulfilling to trace my family's roots across borders.",
					points: 3,
				},
				{
					name: "More connected to the global story—it's exciting to see how my family fits into a wider historical context.",
					points: 2,
				},
				{
					name: 'Both—I feel connected to both my personal heritage and the global narrative.',
					points: 3,
				},
				{
					name: "I don't focus on international family connections.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The International Explorer',
		},
		{
			id: 'q132',
			text: 'Do you approach international research methodically, or do you dive in with curiosity and spontaneity?',
			options: [
				{
					name: 'Methodically—I like to research systematically to gather reliable information.',
					points: 3,
				},
				{
					name: 'Curiosity and spontaneity—I enjoy uncovering surprises as I go along.',
					points: 2,
				},
				{
					name: 'Both—I try to balance a methodical approach with flexibility for discoveries.',
					points: 3,
				},
				{ name: "I don't focus on international research.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The International Explorer',
		},
		{
			id: 'q133',
			text: "When researching an ancestor's country of origin, do you focus more on their personal life or on the broader historical context?",
			options: [
				{
					name: "Their personal life—I like to understand the individual's experiences and decisions.",
					points: 3,
				},
				{
					name: 'Broader historical context—I want to know how the events of the time influenced my ancestor.',
					points: 2,
				},
				{
					name: 'Both—I enjoy looking at both personal stories and historical events.',
					points: 3,
				},
				{
					name: "I don't research an ancestor's country of origin.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The International Explorer',
		},
		{
			id: 'q134',
			text: 'How do you tackle researching family members from multiple countries—do you focus on one country at a time or explore them all together?',
			options: [
				{
					name: 'One country at a time—I like to focus on one place to understand it thoroughly before moving on.',
					points: 3,
				},
				{
					name: 'Explore them all together—I enjoy seeing connections between countries and their impact on my family.',
					points: 3,
				},
				{
					name: 'Both—I try to work through different countries while keeping their connections in mind.',
					points: 3,
				},
				{
					name: "I don't research family members from multiple countries.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The International Explorer',
		},
		{
			id: 'q135',
			text: 'Do you find researching in a foreign language exciting or daunting?',
			options: [
				{
					name: 'Exciting—I enjoy the challenge and the opportunity to discover new sources.',
					points: 3,
				},
				{
					name: 'Daunting—it can be difficult, but I try to work through it.',
					points: 2,
				},
				{
					name: "Both—sometimes it's exciting, and other times it feels challenging.",
					points: 3,
				},
				{ name: "I don't research in foreign languages.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The International Explorer',
		},
		{
			id: 'q136',
			text: 'How do you feel about the possibility of using technology to recreate family events or visualize family dynamics?',
			options: [
				{
					name: 'Excited—I love the idea of using technology to bring family history to life.',
					points: 3,
				},
				{
					name: "Curious—I'm interested in exploring it, but I haven't tried it yet.",
					points: 2,
				},
				{
					name: "Skeptical—I'm not sure how effective or meaningful it would be.",
					points: 1,
				},
				{ name: "I don't consider using technology in this way.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Tree Techie',
		},
		{
			id: 'q137',
			text: "Do you find more satisfaction in mapping your family's migration patterns or using digital tools to track your tree's growth?",
			options: [
				{
					name: "Mapping migration patterns—it's fascinating to see how family members moved through time.",
					points: 3,
				},
				{
					name: "Using digital tools to track my tree's growth—I enjoy seeing the tree expand and grow over time.",
					points: 3,
				},
				{
					name: 'Both—I like combining both mapping migration and tracking growth.',
					points: 3,
				},
				{ name: "I don't focus on either.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Tree Techie',
		},
		{
			id: 'q138',
			text: 'How do you decide which genealogy software or online tool is the best fit for your needs?',
			options: [
				{
					name: 'I consider ease of use, functionality, and support for my specific needs.',
					points: 3,
				},
				{
					name: 'I look at recommendations and reviews to guide my decision.',
					points: 2,
				},
				{ name: 'I choose based on cost or availability.', points: 1 },
				{ name: "I don't use genealogy software or online tools.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Tree Techie',
		},
		{
			id: 'q139',
			text: 'When organizing genealogical information digitally, do you prefer using specialized software or general-purpose tools like spreadsheets?',
			options: [
				{
					name: "Specialized software—it's designed for genealogy and better fits my needs.",
					points: 3,
				},
				{
					name: 'General-purpose tools—I like the flexibility and simplicity they offer.',
					points: 2,
				},
				{
					name: 'Both—I use specialized software for the family tree and spreadsheets for other purposes.',
					points: 3,
				},
				{
					name: "I don't organize genealogical information digitally.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Tree Techie',
		},
		{
			id: 'q140',
			text: 'How do you feel about integrating family history research with other forms of technology, like 3D modeling or interactive maps?',
			options: [
				{
					name: 'Excited—I see the potential for creating immersive and engaging family history experiences.',
					points: 3,
				},
				{
					name: "Curious—I'd like to try it but haven't yet explored these technologies.",
					points: 2,
				},
				{
					name: "Skeptical—I'm not sure it would add much to my research or experience.",
					points: 1,
				},
				{
					name: "I don't consider integrating other forms of technology into my research.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Tree Techie',
		},
		{
			id: 'q141',
			text: 'When investigating the journey of immigrant ancestors, do you find more value in the historical context or in the personal stories?',
			options: [
				{
					name: 'Historical context—understanding the events and conditions that shaped their decisions is crucial.',
					points: 3,
				},
				{
					name: "Personal stories—each individual's experience adds depth to the larger narrative.",
					points: 3,
				},
				{
					name: 'Both—I enjoy combining both the historical context and the personal journey.',
					points: 3,
				},
				{ name: "I don't focus much on immigrant ancestors.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Immigrant Investigator',
		},
		{
			id: 'q142',
			text: "Do you enjoy focusing on your ancestor's reasons for emigrating, or do you prefer tracing their experiences after they arrived in their new country?",
			options: [
				{
					name: 'Reasons for emigrating—I like understanding what motivated their decision to leave.',
					points: 3,
				},
				{
					name: 'Experiences after arrival—I want to know how they adapted and thrived in the new country.',
					points: 2,
				},
				{
					name: 'Both—I want to understand both their motivations and their new life.',
					points: 3,
				},
				{ name: "I don't focus on immigrant ancestors.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Immigrant Investigator',
		},
		{
			id: 'q143',
			text: "When faced with limited records of an ancestor's immigration, do you focus on the family's overall experience or individual stories?",
			options: [
				{
					name: "The family's overall experience—I want to see how the family unit as a whole navigated the immigration journey.",
					points: 3,
				},
				{
					name: "Individual stories—I focus on each person's personal experiences.",
					points: 2,
				},
				{
					name: 'Both—I like understanding both the collective family experience and individual journeys.',
					points: 3,
				},
				{ name: "I don't focus on immigration records.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Immigrant Investigator',
		},
		{
			id: 'q144',
			text: 'How do you prioritize uncovering the journey of ancestors who immigrated—do you start with their country of origin or their destination?',
			options: [
				{
					name: 'Country of origin—I want to understand where they came from before exploring their new life.',
					points: 3,
				},
				{
					name: 'Destination—I focus on where they settled and the life they built there.',
					points: 2,
				},
				{
					name: 'Both—I try to explore both the country of origin and the destination.',
					points: 3,
				},
				{
					name: "I don't prioritize uncovering immigrant journeys.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Immigrant Investigator',
		},
		{
			id: 'q145',
			text: 'When learning about an immigrant ancestor, do you prefer focusing on their personal story or the broader historical migration context?',
			options: [
				{
					name: "Personal story—I enjoy the intimate details and experiences of my ancestor's journey.",
					points: 3,
				},
				{
					name: 'Broader historical migration context—I like to understand the larger trends and forces that influenced their movement.',
					points: 2,
				},
				{
					name: 'Both—I enjoy both their personal story and the broader historical context.',
					points: 3,
				},
				{ name: "I don't focus on immigrant ancestors.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Immigrant Investigator',
		},
		{
			id: 'q146',
			text: 'How do you approach discovering cultural practices that were passed down in your family—through records or personal experiences?',
			options: [
				{
					name: 'Records—I prefer uncovering cultural practices through documents, photos, and written histories.',
					points: 3,
				},
				{
					name: 'Personal experiences—I enjoy hearing stories and learning practices from living family members.',
					points: 3,
				},
				{
					name: 'Both—I like combining records and personal stories to get a full picture.',
					points: 3,
				},
				{
					name: "I don't focus on discovering cultural practices in my family.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Heritage Hunter',
		},
		{
			id: 'q147',
			text: "Do you focus more on documenting a family's customs or exploring the meaning behind those traditions?",
			options: [
				{
					name: 'Documenting customs—I want to preserve the practices exactly as they were passed down.',
					points: 2,
				},
				{
					name: 'Exploring the meaning behind traditions—I enjoy understanding the purpose and significance of the customs.',
					points: 3,
				},
				{
					name: 'Both—I like to document the customs while also understanding their deeper meanings.',
					points: 3,
				},
				{ name: "I don't focus on family customs or traditions.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Heritage Hunter',
		},
		{
			id: 'q148',
			text: 'When researching cultural history, do you prefer looking at tangible artifacts or at the stories behind them?',
			options: [
				{
					name: "Tangible artifacts—I love seeing and handling objects that were part of my family's daily life.",
					points: 3,
				},
				{
					name: 'Stories behind them—I prefer learning about the history and significance of the objects.',
					points: 2,
				},
				{
					name: 'Both—I like to explore both the physical objects and the stories they tell.',
					points: 3,
				},
				{ name: "I don't focus on cultural artifacts.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Heritage Hunter',
		},
		{
			id: 'q149',
			text: 'How do you approach uncovering cultural customs and traditions that might have been passed down in your family?',
			options: [
				{
					name: 'I search through family records and historical documents.',
					points: 3,
				},
				{
					name: 'I ask relatives about their memories and experiences.',
					points: 3,
				},
				{
					name: 'I focus on both—using records and personal stories to understand the customs.',
					points: 3,
				},
				{ name: "I don't actively uncover cultural customs.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Heritage Hunter',
		},
		{
			id: 'q150',
			text: "When researching your family's cultural heritage, do you focus more on ancestral practices or integrating that history into present-day life?",
			options: [
				{
					name: 'Ancestral practices—I want to understand and preserve the traditions from the past.',
					points: 3,
				},
				{
					name: 'Integrating into present-day life—I enjoy bringing cultural practices into the modern context.',
					points: 2,
				},
				{
					name: 'Both—I like understanding the past while figuring out how to incorporate it today.',
					points: 3,
				},
				{
					name: "I don't focus on cultural heritage or its integration.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Heritage Hunter',
		},
		{
			id: 'q151',
			text: 'Do you enjoy solving mysteries that involve concrete records or those that require creative thinking and external clues?',
			options: [
				{
					name: 'Concrete records—I prefer solving mysteries with solid, verifiable information.',
					points: 3,
				},
				{
					name: 'Creative thinking and external clues—I enjoy thinking outside the box and using diverse sources.',
					points: 3,
				},
				{
					name: 'Both—I like a combination of both approaches, depending on the situation.',
					points: 3,
				},
				{ name: "I don't enjoy solving genealogical mysteries.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Sleuth',
		},
		{
			id: 'q152',
			text: "How do you approach solving a missing relative's story—do you start with available records or external sources like newspapers?",
			options: [
				{
					name: 'Available records—I prefer to start with documents that are more concrete and reliable.',
					points: 3,
				},
				{
					name: 'External sources like newspapers—I like to look for clues in the media of the time.',
					points: 2,
				},
				{
					name: 'Both—I begin with records but turn to newspapers and other sources if needed.',
					points: 3,
				},
				{
					name: "I don't focus on solving missing relative stories.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Sleuth',
		},
		{
			id: 'q153',
			text: 'Do you find genealogical mysteries easier to solve when they involve a single family branch or multiple branches?',
			options: [
				{
					name: 'A single family branch—I find it easier to focus on one side and follow it through.',
					points: 3,
				},
				{
					name: 'Multiple branches—I enjoy the challenge of weaving together different family lines.',
					points: 3,
				},
				{
					name: 'Both—I like solving mysteries involving both single and multiple branches.',
					points: 3,
				},
				{ name: "I don't focus on genealogical mysteries.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Sleuth',
		},
		{
			id: 'q154',
			text: "How do you approach an ancestor's story when there is little information to go on?",
			options: [
				{
					name: 'I start by gathering whatever is available and try to build from there.',
					points: 3,
				},
				{
					name: 'I focus on finding external clues that might fill in the gaps.',
					points: 2,
				},
				{
					name: 'I look for patterns and connections to help guide my search.',
					points: 3,
				},
				{
					name: "I don't research ancestors with little information.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Sleuth',
		},
		{
			id: 'q155',
			text: 'Do you prefer solving genealogical mysteries in your family tree or helping others solve theirs?',
			options: [
				{
					name: "Solving my own family tree—I enjoy unraveling my own family's mysteries.",
					points: 3,
				},
				{
					name: 'Helping others solve theirs—I like the process of assisting others in discovering their history.',
					points: 3,
				},
				{
					name: 'Both—I enjoy solving my own and helping others with their research.',
					points: 3,
				},
				{ name: "I don't enjoy solving genealogical mysteries.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Genealogy Sleuth',
		},
		{
			id: 'q156',
			text: 'When faced with limited historical documents, do you prefer filling in the blanks with family stories or historical research?',
			options: [
				{
					name: 'Family stories—I like filling in the gaps with personal narratives and memories.',
					points: 3,
				},
				{
					name: 'Historical research—I prefer to stick to verified facts and records.',
					points: 3,
				},
				{
					name: 'Both—I enjoy combining family stories with historical research to create a fuller picture.',
					points: 3,
				},
				{
					name: "I don't focus on filling in the blanks in family history.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Historian on a Mission',
		},
		{
			id: 'q157',
			text: "Do you prioritize uncovering one family member's story or tracing the broader context of their family's history?",
			options: [
				{
					name: "One family member's story—I like to dig deep into one person's life and experiences.",
					points: 3,
				},
				{
					name: 'Broader context—I focus on understanding the family as a whole and their collective history.',
					points: 3,
				},
				{
					name: 'Both—I enjoy balancing both individual stories and the broader family history.',
					points: 3,
				},
				{ name: "I don't prioritize either aspect.", points: 0 },
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Historian on a Mission',
		},
		{
			id: 'q158',
			text: 'How do you feel when your mission leads to uncovering unexpected or hidden family stories?',
			options: [
				{
					name: 'Excited—I love the thrill of discovering something new and unexpected.',
					points: 3,
				},
				{
					name: "Satisfied—it's rewarding to uncover these hidden pieces of history.",
					points: 2,
				},
				{
					name: "Indifferent—I'm more focused on the process than the surprises.",
					points: 1,
				},
				{
					name: "I don't focus on uncovering hidden family stories.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Historian on a Mission',
		},
		{
			id: 'q159',
			text: 'How do you prioritize which family members or branches to investigate first when starting a new project?',
			options: [
				{
					name: 'I start with the most direct line of ancestors—parents and grandparents.',
					points: 3,
				},
				{
					name: 'I prioritize branches that have the most documentation or potential leads.',
					points: 2,
				},
				{
					name: 'I focus on the branches that seem most interesting or have the most intriguing stories.',
					points: 3,
				},
				{
					name: "I don't have a particular method for prioritizing.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Historian on a Mission',
		},
		{
			id: 'q160',
			text: 'When uncovering an unknown part of your family history, do you focus more on the discovery or the method you used to find it?',
			options: [
				{
					name: 'The discovery—I find the information itself to be the most exciting part.',
					points: 3,
				},
				{
					name: 'The method—I enjoy figuring out the techniques and resources that led me to the discovery.',
					points: 2,
				},
				{
					name: 'Both—I appreciate both the discovery and the process used to uncover it.',
					points: 3,
				},
				{
					name: "I don't focus much on uncovering unknown parts of family history.",
					points: 0,
				},
			],
			categoryName: 'Explorers & Adventurers',
			subcategoryName: 'The Family Historian on a Mission',
		},
		{
			id: 'q161',
			text: 'Do you feel more satisfaction from uncovering a surprise DNA match or validating a family theory through testing?',
			options: [
				{
					name: "Uncovering a surprise DNA match—it's exciting to find unexpected connections.",
					points: 3,
				},
				{
					name: 'Validating a family theory through testing—I feel a sense of confirmation when my theory is proven right.',
					points: 3,
				},
				{
					name: 'Both—I find satisfaction in both the surprises and the confirmations.',
					points: 3,
				},
				{
					name: "I don't focus much on DNA testing in my genealogical research.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q162',
			text: 'How do you feel when you receive new genetic testing results—eager to dive into the details or curious about the surprises they might hold?',
			options: [
				{
					name: 'Eager to dive into the details—I enjoy analyzing the data and understanding its meaning.',
					points: 3,
				},
				{
					name: 'Curious about the surprises—I like seeing what new connections or unexpected matches I can discover.',
					points: 3,
				},
				{
					name: 'Both—I want to explore both the details and the surprises.',
					points: 3,
				},
				{ name: "I don't use genetic testing.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q163',
			text: 'When you uncover a surprising DNA match, do you focus more on reaching out to relatives or researching their background?',
			options: [
				{
					name: 'Reaching out to relatives—I want to make personal connections and learn about their family.',
					points: 3,
				},
				{
					name: 'Researching their background—I prefer to learn about them through records and genealogical sources.',
					points: 2,
				},
				{
					name: 'Both—I try to combine both reaching out and researching their background.',
					points: 3,
				},
				{ name: "I don't focus on DNA matches.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q164',
			text: 'How do you feel about connecting the dots between DNA test results and genealogical records?',
			options: [
				{
					name: 'Excited—I love seeing how the genetic data aligns with the paper trail.',
					points: 3,
				},
				{
					name: "Satisfied—it's a rewarding experience when the DNA results match up with the records.",
					points: 2,
				},
				{
					name: "Indifferent—I don't get excited about integrating DNA results with genealogical records.",
					points: 1,
				},
				{
					name: "I don't connect DNA test results to genealogical records.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q165',
			text: 'When faced with conflicting results from different DNA testing services, how do you reconcile them?',
			options: [
				{
					name: 'I analyze the results carefully, looking for patterns and considering all possible explanations.',
					points: 3,
				},
				{
					name: 'I focus on the results that seem most consistent and reliable.',
					points: 2,
				},
				{
					name: 'I get frustrated, but I keep searching for answers.',
					points: 1,
				},
				{ name: "I don't deal with conflicting DNA results.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q166',
			text: 'When guiding others in their genealogical journey, do you feel more excited by sharing tools or explaining methods?',
			options: [
				{
					name: "Sharing tools—I'm excited to provide them with the right resources for their research.",
					points: 3,
				},
				{
					name: 'Explaining methods—I enjoy teaching the step-by-step approach to solving genealogical puzzles.',
					points: 3,
				},
				{
					name: 'Both—I enjoy combining the practical tools with the methods behind them.',
					points: 3,
				},
				{
					name: "I don't guide others in their genealogical journey.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Guru',
		},
		{
			id: 'q167',
			text: 'How do you approach teaching others to use genealogy databases—do you focus on basic skills or more advanced strategies?',
			options: [
				{
					name: 'Basic skills—helping others understand how to navigate and use the databases is my priority.',
					points: 3,
				},
				{
					name: 'Advanced strategies—I like showing others how to use databases for deeper research and more nuanced searches.',
					points: 2,
				},
				{
					name: 'Both—I believe in building foundational skills before introducing advanced strategies.',
					points: 3,
				},
				{
					name: "I don't teach others how to use genealogy databases.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Guru',
		},
		{
			id: 'q168',
			text: 'Do you enjoy offering personalized advice or creating general tutorials for a wider audience?',
			options: [
				{
					name: 'Personalized advice—I prefer helping individuals with tailored guidance based on their needs.',
					points: 3,
				},
				{
					name: 'General tutorials—I enjoy creating resources that can help many people at once.',
					points: 2,
				},
				{
					name: 'Both—I like offering both personalized advice and general tutorials.',
					points: 3,
				},
				{
					name: "I don't offer advice or create tutorials for others.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Guru',
		},
		{
			id: 'q169',
			text: 'How do you approach helping others with their genealogical research—do you prefer hands-on guidance or providing resources and tools?',
			options: [
				{
					name: 'Hands-on guidance—I prefer to work alongside others, guiding them through their research.',
					points: 3,
				},
				{
					name: 'Providing resources and tools—I prefer to give people the tools they need to work independently.',
					points: 2,
				},
				{
					name: 'Both—I try to balance hands-on help with providing useful resources.',
					points: 3,
				},
				{
					name: "I don't help others with their genealogical research.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Guru',
		},
		{
			id: 'q170',
			text: 'When learning about new genealogy tools, do you focus more on the user experience or the accuracy of the results?',
			options: [
				{
					name: "User experience—if the tool is easy to use and intuitive, it's a top priority.",
					points: 2,
				},
				{
					name: 'Accuracy of the results—ensuring the tool provides reliable and correct information is my focus.',
					points: 3,
				},
				{
					name: 'Both—I look for tools that balance both a positive user experience and accurate results.',
					points: 3,
				},
				{ name: "I don't focus much on genealogy tools.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Guru',
		},
		{
			id: 'q171',
			text: 'How do you approach maintaining digital records over time—do you back up your research regularly or keep everything in a single format?',
			options: [
				{
					name: "I back up my research regularly in multiple formats to ensure it's protected.",
					points: 3,
				},
				{
					name: 'I keep everything in a single format but back it up occasionally.',
					points: 2,
				},
				{
					name: "I don't back up my research regularly—it's all stored in one place.",
					points: 1,
				},
				{ name: "I don't focus on maintaining digital records.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q172',
			text: 'When working with large amounts of data, do you feel more confident in organizing by content or by format?',
			options: [
				{
					name: 'By content—I prefer organizing my data based on the subject matter or the research topic.',
					points: 3,
				},
				{
					name: 'By format—I focus on organizing data based on file types and document structures.',
					points: 2,
				},
				{
					name: 'Both—I try to balance content and format organization.',
					points: 3,
				},
				{ name: "I don't work with large amounts of data.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q173',
			text: 'How do you feel about using metadata and tagging to make digital archives easier to navigate?',
			options: [
				{
					name: 'I find it essential—it makes searching and organizing much easier.',
					points: 3,
				},
				{
					name: "It's helpful, but I don't always take the time to do it.",
					points: 2,
				},
				{ name: "I don't use metadata or tagging.", points: 0 },
				{ name: "I'm not sure what metadata or tagging are.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q174',
			text: 'When scanning family documents, how do you ensure the preservation of both the physical and digital versions?',
			options: [
				{
					name: 'I store physical copies in protective conditions and back up digital versions in multiple locations.',
					points: 3,
				},
				{
					name: 'I focus on digital storage but keep the physical copies safe.',
					points: 2,
				},
				{
					name: "I focus primarily on digital storage and don't worry as much about the physical versions.",
					points: 1,
				},
				{ name: "I don't scan family documents.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q175',
			text: 'How do you manage large volumes of digital records and avoid getting overwhelmed?',
			options: [
				{
					name: 'I break them into smaller, organized categories and back them up regularly.',
					points: 3,
				},
				{
					name: 'I create a system with folders and naming conventions to keep track.',
					points: 3,
				},
				{
					name: "I tackle them in batches, prioritizing what's most important.",
					points: 2,
				},
				{ name: "I don't manage large volumes of digital records.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Digital Archivist',
		},
		{
			id: 'q176',
			text: 'When you visit genealogy websites, do you feel more engaged with the content or with the community discussions around it?',
			options: [
				{
					name: "The content—I'm most engaged with the records and resources available.",
					points: 3,
				},
				{
					name: 'The community discussions—I enjoy interacting with others and sharing experiences.',
					points: 2,
				},
				{
					name: 'Both—I like engaging with both the content and the community.',
					points: 3,
				},
				{ name: "I don't visit genealogy websites.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Gen-Web Wizard',
		},
		{
			id: 'q177',
			text: "How do you decide which genealogy databases to contribute to—based on their resources or their community's activity?",
			options: [
				{
					name: 'Resources—I contribute to databases with the most valuable or relevant research tools.',
					points: 3,
				},
				{
					name: 'Community activity—I choose databases where I feel a sense of connection and collaboration.',
					points: 2,
				},
				{
					name: 'Both—I like databases that offer both strong resources and an active community.',
					points: 3,
				},
				{ name: "I don't contribute to genealogy databases.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Gen-Web Wizard',
		},
		{
			id: 'q178',
			text: 'Do you find more satisfaction in uncovering new resources online or connecting with fellow genealogists virtually?',
			options: [
				{
					name: 'Uncovering new resources online—I enjoy finding records and tools that advance my research.',
					points: 3,
				},
				{
					name: 'Connecting with fellow genealogists virtually—I appreciate the sharing of ideas and advice.',
					points: 2,
				},
				{
					name: 'Both—I find satisfaction in both discovering resources and engaging with others.',
					points: 3,
				},
				{ name: "I don't engage with genealogists online.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Gen-Web Wizard',
		},
		{
			id: 'q179',
			text: 'Do you enjoy participating in online genealogy communities or do you prefer independent research?',
			options: [
				{
					name: 'Participating in online communities—I love collaborating, asking questions, and sharing knowledge.',
					points: 3,
				},
				{
					name: 'Independent research—I prefer working alone and focusing on my personal research.',
					points: 3,
				},
				{
					name: 'Both—I enjoy both collaborating and conducting my research independently.',
					points: 3,
				},
				{
					name: "I don't participate in online genealogy communities.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Gen-Web Wizard',
		},
		{
			id: 'q180',
			text: 'How do you feel about sharing your genealogical findings publicly versus keeping them private?',
			options: [
				{
					name: 'Sharing publicly—I want to contribute to the broader genealogy community.',
					points: 3,
				},
				{
					name: 'Keeping private—I prefer to keep my research and findings within my family.',
					points: 2,
				},
				{
					name: 'Both—I share what feels appropriate but keep sensitive or incomplete information private.',
					points: 3,
				},
				{ name: "I don't share genealogical findings.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Gen-Web Wizard',
		},
		{
			id: 'q181',
			text: 'How do you balance personal storytelling with informative content in your blog posts?',
			options: [
				{
					name: "Personal storytelling—I enjoy sharing my family's stories and experiences, with some informative content woven in.",
					points: 3,
				},
				{
					name: 'Informative content—I focus on providing useful research tips and facts, with storytelling as an occasional addition.',
					points: 2,
				},
				{
					name: 'Both—I strike a balance between storytelling and informative content to engage and educate.',
					points: 3,
				},
				{ name: "I don't write genealogy blog posts.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Blogger',
		},
		{
			id: 'q182',
			text: 'Do you feel more connected to your audience through your writing or by sharing your findings directly with others?',
			options: [
				{
					name: 'Writing—I feel connected through the personal touch of sharing stories and insights in written form.',
					points: 3,
				},
				{
					name: 'Sharing findings directly—I prefer the interaction and feedback that comes from engaging with others face-to-face or in real-time.',
					points: 2,
				},
				{
					name: 'Both—I enjoy both writing and directly sharing findings to connect with others.',
					points: 3,
				},
				{ name: "I don't share my findings with an audience.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Blogger',
		},
		{
			id: 'q183',
			text: 'When blogging, do you focus on documenting your family history or sharing your research process with others?',
			options: [
				{
					name: "Documenting my family history—I focus on telling my family's story and sharing discoveries.",
					points: 3,
				},
				{
					name: 'Sharing my research process—I enjoy walking others through how I conduct my genealogical research.',
					points: 2,
				},
				{
					name: 'Both—I like to do both—share my family history and the steps I took to find it.',
					points: 3,
				},
				{ name: "I don't blog about genealogy.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Blogger',
		},
		{
			id: 'q184',
			text: 'Do you enjoy sharing the stories behind your research or focusing on the technical aspects of genealogical methods in your blog?',
			options: [
				{
					name: 'Sharing the stories behind my research—I love telling the personal stories that make my family history unique.',
					points: 3,
				},
				{
					name: 'Focusing on technical aspects—I enjoy explaining the research methods, tools, and resources that helped me.',
					points: 2,
				},
				{
					name: 'Both—I try to mix storytelling with the technical aspects to give a complete picture.',
					points: 3,
				},
				{
					name: "I don't write about genealogy methods or stories.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Blogger',
		},
		{
			id: 'q185',
			text: 'When blogging about genealogy, do you prioritize personal experiences or research tips?',
			options: [
				{
					name: 'Personal experiences—I enjoy sharing the journey, the challenges, and the joys of my research.',
					points: 3,
				},
				{
					name: 'Research tips—I focus on providing actionable advice and strategies for others researching their family history.',
					points: 2,
				},
				{
					name: 'Both—I like to share both personal stories and practical tips for my audience.',
					points: 3,
				},
				{ name: "I don't blog about genealogy.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Genealogy Blogger',
		},
		{
			id: 'q186',
			text: "Do you feel more in control of your research when you can access records instantly online or when you're able to follow a traditional research method?",
			options: [
				{
					name: 'Accessing records instantly online—I feel more in control when I can quickly find and examine records.',
					points: 3,
				},
				{
					name: 'Following traditional research methods—I enjoy the process of searching physical records and using hands-on techniques.',
					points: 2,
				},
				{
					name: 'Both—I like combining the efficiency of online access with traditional research methods.',
					points: 3,
				},
				{ name: "I don't rely much on either method.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Virtual Genealogist',
		},
		{
			id: 'q187',
			text: 'When using online tools, do you enjoy exploring new platforms or sticking with the tools you know best?',
			options: [
				{
					name: 'Exploring new platforms—I enjoy discovering new tools that might offer fresh insights.',
					points: 3,
				},
				{
					name: "Sticking with tools I know best—I prefer sticking with what works and I'm comfortable with.",
					points: 2,
				},
				{
					name: 'Both—I like experimenting with new tools but also rely on the ones I know.',
					points: 3,
				},
				{ name: "I don't use online tools for research.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Virtual Genealogist',
		},
		{
			id: 'q188',
			text: 'How do you approach organizing your virtual research—by geographic region, time period, or by family branch?',
			options: [
				{
					name: 'Geographic region—I organize my research by the locations where my family lived and moved.',
					points: 3,
				},
				{
					name: 'Time period—I prefer organizing research chronologically, following family events over time.',
					points: 2,
				},
				{
					name: 'Family branch—I focus on organizing research by individual family lines or branches.',
					points: 3,
				},
				{ name: "I don't organize my virtual research.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Virtual Genealogist',
		},
		{
			id: 'q189',
			text: 'How do you balance the convenience of digital records with the potential lack of personal connection in online research?',
			options: [
				{
					name: 'I embrace the convenience of digital records and adjust by seeking personal connections through other means.',
					points: 3,
				},
				{
					name: 'I focus on the convenience of digital records, but I try to connect with others to fill the emotional gap.',
					points: 2,
				},
				{
					name: 'I prefer physical records because they feel more personal and connected.',
					points: 1,
				},
				{
					name: "I don't feel a lack of personal connection when using digital records.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Virtual Genealogist',
		},
		{
			id: 'q190',
			text: 'When working on a genealogy project from home, do you feel you miss the hands-on experience of physical archives?',
			options: [
				{
					name: "Yes, I miss the physical experience—there's something about being in the archives that I can't replicate at home.",
					points: 3,
				},
				{
					name: 'Sometimes—I enjoy the convenience of working from home but miss certain aspects of physical research.',
					points: 2,
				},
				{
					name: "No, I prefer the comfort of working from home—I don't miss the physical archives.",
					points: 1,
				},
				{ name: "I don't work on genealogy projects from home.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The Virtual Genealogist',
		},
		{
			id: 'q191',
			text: 'How do you feel about the process of tracing adoption records—more focused on legalities or emotional connections?',
			options: [
				{
					name: 'Legalities—I prefer to focus on the legal aspects and ensuring everything is documented correctly.',
					points: 3,
				},
				{
					name: 'Emotional connections—I find it more fulfilling to understand the personal stories and emotional aspects of adoption.',
					points: 3,
				},
				{
					name: 'Both—I enjoy balancing the legal aspects with the emotional connections in adoption research.',
					points: 3,
				},
				{ name: "I don't focus on tracing adoption records.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Adoption Genealogist',
		},
		{
			id: 'q192',
			text: "When researching adoption cases, do you focus on the story of the birth family or the adoptive family's experiences?",
			options: [
				{
					name: 'Birth family—I focus on uncovering the story and history of the biological relatives.',
					points: 3,
				},
				{
					name: 'Adoptive family—I focus on understanding the experiences of the adoptive family and how they integrated the child.',
					points: 2,
				},
				{
					name: "Both—I try to uncover both the birth family's story and the adoptive family's experience.",
					points: 3,
				},
				{ name: "I don't focus on adoption cases.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Adoption Genealogist',
		},
		{
			id: 'q193',
			text: 'How do you navigate ethical considerations when researching sensitive adoption cases?',
			options: [
				{
					name: 'I respect privacy and ensure I approach the research with sensitivity, especially regarding living individuals.',
					points: 3,
				},
				{
					name: "I prioritize finding all the information available, but I'm mindful of the sensitivity involved.",
					points: 2,
				},
				{
					name: 'I focus on gathering as much information as possible without much concern for privacy.',
					points: 1,
				},
				{ name: "I don't work with sensitive adoption cases.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Adoption Genealogist',
		},
		{
			id: 'q194',
			text: 'How do you approach tracing adoption records compared to other genealogical research?',
			options: [
				{
					name: 'I approach it with extra caution, as it often involves more sensitivity and complexity than other research.',
					points: 3,
				},
				{
					name: 'I follow the same approach as with other research, focusing on gathering as much data as possible.',
					points: 2,
				},
				{
					name: 'I take a more relaxed approach, not treating adoption research differently from other genealogical work.',
					points: 1,
				},
				{ name: "I don't trace adoption records.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Adoption Genealogist',
		},
		{
			id: 'q195',
			text: 'When researching adoption connections, do you focus more on the emotional journey or the legal aspects?',
			options: [
				{
					name: "Emotional journey—I'm more interested in understanding the personal, emotional aspects of adoption.",
					points: 3,
				},
				{
					name: 'Legal aspects—I focus on the legal procedures and documentation behind the adoption.',
					points: 3,
				},
				{
					name: 'Both—I enjoy exploring both the emotional journey and the legal aspects to get a full picture.',
					points: 3,
				},
				{ name: "I don't research adoption connections.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Adoption Genealogist',
		},
		{
			id: 'q196',
			text: 'How do you feel when you trace a surname back to its origins—more excited about the journey or the meaning behind it?',
			options: [
				{
					name: 'The journey—I love the process of uncovering how the surname has evolved and spread over time.',
					points: 3,
				},
				{
					name: 'The meaning behind it—I find it fascinating to discover the origin and significance of the surname.',
					points: 3,
				},
				{
					name: "Both—I enjoy both the exploration of the surname's journey and understanding its meaning.",
					points: 3,
				},
				{ name: "I don't focus on tracing surname origins.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Surname Scholar',
		},
		{
			id: 'q197',
			text: 'When exploring surname origins, do you feel more connected to the cultural history or the individual family stories?',
			options: [
				{
					name: 'Cultural history—I love understanding how the surname ties into a broader cultural or historical context.',
					points: 3,
				},
				{
					name: "Individual family stories—I'm more interested in how the surname connects to my specific family's history.",
					points: 3,
				},
				{
					name: 'Both—I find meaning in both the cultural context and the personal family connection.',
					points: 3,
				},
				{ name: "I don't focus on surname origins.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Surname Scholar',
		},
		{
			id: 'q198',
			text: 'How do you balance exploring surname meanings with tracing the actual genealogical lines?',
			options: [
				{
					name: 'I prioritize tracing the genealogical lines while occasionally exploring the meanings when relevant.',
					points: 3,
				},
				{
					name: "I balance both equally—understanding the surname's meaning adds context to tracing the lines.",
					points: 3,
				},
				{
					name: 'I prioritize exploring surname meanings and history over tracing the genealogical lines.',
					points: 2,
				},
				{
					name: "I don't focus on surname meanings or genealogical lines.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Surname Scholar',
		},
		{
			id: 'q199',
			text: "Do you find yourself tracing the origin of surnames to better understand your ancestors' professions or social status?",
			options: [
				{
					name: "Yes, I enjoy uncovering how the surname might reflect the family's profession or social status.",
					points: 3,
				},
				{
					name: "Sometimes, but I'm more focused on the genealogical connections than on professions or status.",
					points: 2,
				},
				{
					name: "No, I don't typically look at the profession or social status connected to surnames.",
					points: 1,
				},
				{ name: "I don't focus on surname origins.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Surname Scholar',
		},
		{
			id: 'q200',
			text: "How do you feel when discovering a surname's meaning or regional origin?",
			options: [
				{
					name: "Excited—it's like finding an important clue to the family's history.",
					points: 3,
				},
				{
					name: 'Satisfied—it adds another layer to the family history and provides context.',
					points: 2,
				},
				{
					name: "Indifferent—I don't place much importance on the meaning or origin of surnames.",
					points: 1,
				},
				{ name: "I don't focus on surname meanings or origins.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Surname Scholar',
		},
		{
			id: 'q201',
			text: 'How do you feel when you unravel a family mystery that had previously been unclear?',
			options: [
				{
					name: "Excited—it's thrilling to solve something that was once a puzzle.",
					points: 3,
				},
				{
					name: "Satisfied—there's a sense of accomplishment when the mystery is solved.",
					points: 2,
				},
				{
					name: "Indifferent—I don't get too excited about solving family mysteries.",
					points: 1,
				},
				{ name: "I don't work on family mysteries.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Forensic Genealogist',
		},
		{
			id: 'q202',
			text: 'Do you enjoy focusing on solving mysteries that involve legal documents or those that require detective-like research?',
			options: [
				{
					name: 'Legal documents—I enjoy using records to uncover the truth and solve mysteries.',
					points: 3,
				},
				{
					name: 'Detective-like research—I love piecing together clues from various sources to solve a mystery.',
					points: 3,
				},
				{
					name: 'Both—I like a combination of legal documents and detective-like research.',
					points: 3,
				},
				{ name: "I don't focus on solving genealogical mysteries.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Forensic Genealogist',
		},
		{
			id: 'q203',
			text: 'How do you navigate ethical dilemmas when investigating sensitive or unresolved genealogical cases?',
			options: [
				{
					name: 'I approach them with caution, respecting privacy and being mindful of the impact of my research on living relatives.',
					points: 3,
				},
				{
					name: 'I focus on finding the truth, but I try to respect privacy when possible.',
					points: 2,
				},
				{
					name: 'I prioritize uncovering the facts, regardless of the ethical considerations.',
					points: 1,
				},
				{
					name: "I don't work on sensitive or unresolved genealogical cases.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Forensic Genealogist',
		},
		{
			id: 'q204',
			text: 'How do you balance the excitement of solving a genealogical mystery with the rigor of evidence-based research?',
			options: [
				{
					name: 'I keep a clear focus on evidence and research methodology, even while enjoying the excitement of solving the mystery.',
					points: 3,
				},
				{
					name: 'I enjoy the excitement, but I make sure to double-check the facts before drawing conclusions.',
					points: 2,
				},
				{
					name: 'I focus more on the excitement and intuition than on rigorous evidence.',
					points: 1,
				},
				{ name: "I don't work on genealogical mysteries.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Forensic Genealogist',
		},
		{
			id: 'q205',
			text: 'Do you prefer working on cases with well-documented family trees or those that involve more detective work?',
			options: [
				{
					name: 'Well-documented family trees—I like working with reliable information and confirmed connections.',
					points: 2,
				},
				{
					name: 'Detective work—I enjoy the challenge of solving mysteries with incomplete or unclear records.',
					points: 3,
				},
				{
					name: 'Both—I enjoy a balance of working with well-documented trees and uncovering new connections.',
					points: 3,
				},
				{ name: "I don't work on genealogical cases.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Forensic Genealogist',
		},
		{
			id: 'q206',
			text: 'Do you enjoy searching newspapers for family history, focusing more on articles or obituaries?',
			options: [
				{
					name: "Articles—I enjoy finding stories and details about my ancestors' lives.",
					points: 3,
				},
				{
					name: 'Obituaries—I like uncovering the final moments and family connections.',
					points: 3,
				},
				{
					name: 'Both—I find value in both articles and obituaries for different aspects of my research.',
					points: 3,
				},
				{ name: "I don't search newspapers for family history.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Historical Newspaper Sleuth',
		},
		{
			id: 'q207',
			text: "When uncovering a family member's mention in the newspaper, do you feel more excited about the event they were involved in or the way they were portrayed?",
			options: [
				{
					name: "The event they were involved in—I'm interested in the context and significance of their involvement.",
					points: 3,
				},
				{
					name: 'The way they were portrayed—I focus on how the family member was presented to the public.',
					points: 2,
				},
				{
					name: 'Both—I enjoy understanding both the event and how they were portrayed in it.',
					points: 3,
				},
				{
					name: "I don't focus on family members' mentions in newspapers.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Historical Newspaper Sleuth',
		},
		{
			id: 'q208',
			text: 'How do you integrate newspaper articles into your family tree—do you focus on personal stories or historical events?',
			options: [
				{
					name: "Personal stories—I like to add personal anecdotes or significant events into my family's history.",
					points: 3,
				},
				{
					name: 'Historical events—I focus on how the article contributes to understanding broader historical contexts.',
					points: 2,
				},
				{
					name: 'Both—I balance both personal stories and historical events to enrich the family tree.',
					points: 3,
				},
				{
					name: "I don't integrate newspaper articles into my family tree.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Historical Newspaper Sleuth',
		},
		{
			id: 'q209',
			text: 'How do you incorporate historical newspaper articles into your family history—do you focus on personal stories or broader societal events?',
			options: [
				{
					name: 'Personal stories—I like seeing how individual family members fit into the broader narrative.',
					points: 3,
				},
				{
					name: "Broader societal events—I focus on how historical events may have influenced my family's life.",
					points: 2,
				},
				{
					name: 'Both—I try to incorporate both personal and societal elements for a well-rounded history.',
					points: 3,
				},
				{
					name: "I don't incorporate historical newspaper articles into my family history.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Historical Newspaper Sleuth',
		},
		{
			id: 'q210',
			text: 'When using newspapers for genealogy, do you prefer looking for obituaries or articles that detail specific events?',
			options: [
				{
					name: 'Obituaries—I focus on the personal details and connections provided in obituaries.',
					points: 3,
				},
				{
					name: "Articles detailing specific events—I like learning about key moments and stories in my ancestors' lives.",
					points: 3,
				},
				{
					name: 'Both—I enjoy both obituaries and articles for the different perspectives they provide.',
					points: 3,
				},
				{ name: "I don't use newspapers for genealogy.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Historical Newspaper Sleuth',
		},
		{
			id: 'q211',
			text: 'How do you approach preserving family artifacts—do you focus more on physical items or digital preservation?',
			options: [
				{
					name: 'Physical items—I prioritize keeping the original artifacts safe and in good condition.',
					points: 3,
				},
				{
					name: 'Digital preservation—I focus on digitizing artifacts for easy storage and sharing.',
					points: 2,
				},
				{
					name: 'Both—I work on preserving both the physical items and their digital copies.',
					points: 3,
				},
				{ name: "I don't focus on preserving family artifacts.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Preservation Pro',
		},
		{
			id: 'q212',
			text: 'Do you find value in preserving family records for future generations or for the historical significance they hold today?',
			options: [
				{
					name: 'Future generations—I want to ensure that future family members can access these records.',
					points: 3,
				},
				{
					name: 'Historical significance—I preserve them to understand the past and its impact on today.',
					points: 3,
				},
				{
					name: 'Both—I value both preserving for future generations and appreciating the history they represent.',
					points: 3,
				},
				{ name: "I don't focus on preserving family records.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Preservation Pro',
		},
		{
			id: 'q213',
			text: 'When preserving photos and documents, do you focus on the sentimental value or the historical context?',
			options: [
				{
					name: 'Sentimental value—I focus on the emotional connection and personal meaning behind the items.',
					points: 3,
				},
				{
					name: 'Historical context—I prioritize understanding the broader historical importance of the photos and documents.',
					points: 2,
				},
				{
					name: 'Both—I enjoy balancing sentimental value and historical context to preserve the full story.',
					points: 3,
				},
				{ name: "I don't preserve photos and documents.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Preservation Pro',
		},
		{
			id: 'q214',
			text: 'Do you prioritize preserving photographs or documents, or do you enjoy working with both equally?',
			options: [
				{
					name: 'Photographs—I find them visually powerful and enjoy preserving them.',
					points: 3,
				},
				{
					name: 'Documents—I appreciate the written records and historical context they provide.',
					points: 2,
				},
				{
					name: 'Both equally—I enjoy working with both photographs and documents as complementary pieces of history.',
					points: 3,
				},
				{ name: "I don't preserve photographs or documents.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Preservation Pro',
		},
		{
			id: 'q215',
			text: 'How do you approach preserving family artifacts in both physical and digital formats?',
			options: [
				{
					name: 'I keep physical copies in safe storage and digitize them for ease of access and backup.',
					points: 3,
				},
				{
					name: 'I focus mostly on physical preservation and digitize only when necessary.',
					points: 2,
				},
				{
					name: 'I focus on digital preservation, keeping the originals as backups or for sentimental value.',
					points: 2,
				},
				{ name: "I don't preserve family artifacts.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Preservation Pro',
		},
		{
			id: 'q216',
			text: 'When expanding your family tree, do you prefer to focus on one family branch or explore multiple branches at once?',
			options: [
				{
					name: 'One family branch—I prefer to work through each line methodically before moving on to others.',
					points: 3,
				},
				{
					name: 'Multiple branches at once—I enjoy exploring different lines and seeing how they connect.',
					points: 3,
				},
				{
					name: 'Both—I balance focusing on one branch with exploring other parts of the family tree.',
					points: 3,
				},
				{ name: "I don't focus on expanding my family tree.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Branch Builder',
		},
		{
			id: 'q217',
			text: 'How do you approach breaking down brick walls in your family research—do you tackle one ancestor at a time or look at patterns across many families?',
			options: [
				{
					name: 'One ancestor at a time—I prefer to focus on solving one mystery before moving on to another.',
					points: 3,
				},
				{
					name: 'Patterns across many families—I like looking for trends and connections that can help solve multiple mysteries.',
					points: 3,
				},
				{
					name: 'Both—I work on one ancestor but consider how patterns in the tree may help break down brick walls.',
					points: 3,
				},
				{
					name: "I don't focus on breaking down brick walls in family research.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Branch Builder',
		},
		{
			id: 'q218',
			text: 'Do you find it more rewarding to connect distant relatives or uncover deep family connections within your immediate branches?',
			options: [
				{
					name: 'Connecting distant relatives—I find it exciting to uncover long-lost family members and their stories.',
					points: 3,
				},
				{
					name: 'Uncovering deep family connections within immediate branches—I enjoy diving deeper into the branches closest to me.',
					points: 3,
				},
				{
					name: 'Both—I find value in both distant and immediate family connections.',
					points: 3,
				},
				{ name: "I don't focus on either.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Branch Builder',
		},
		{
			id: 'q219',
			text: 'How do you approach filling out an incomplete family tree—do you focus on one branch at a time or spread your efforts across the whole tree?',
			options: [
				{
					name: 'One branch at a time—I prefer to complete one branch thoroughly before moving to the next.',
					points: 3,
				},
				{
					name: 'Spread efforts across the whole tree—I like working on all branches at once to make progress throughout the tree.',
					points: 3,
				},
				{
					name: 'Both—I try to focus on one branch but also keep other parts of the tree in mind.',
					points: 3,
				},
				{ name: "I don't work on completing my family tree.", points: 0 },
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Branch Builder',
		},
		{
			id: 'q220',
			text: 'How do you ensure that every branch of your family tree is explored to its fullest potential?',
			options: [
				{
					name: 'I prioritize systematically researching each branch and revisiting them as needed.',
					points: 3,
				},
				{
					name: "I research one branch at a time, ensuring it's thoroughly explored before moving on to others.",
					points: 3,
				},
				{
					name: 'I work on branches randomly, hoping to make progress on each over time.',
					points: 2,
				},
				{
					name: "I don't focus on fully exploring all branches of my tree.",
					points: 0,
				},
			],
			categoryName: 'Specialized Researchers',
			subcategoryName: 'The Branch Builder',
		},
		{
			id: 'q221',
			text: "How do you feel when you discover a significant DNA match that offers new insights into your family's past?",
			options: [
				{
					name: "Excited—it's thrilling to find new connections and expand my family history.",
					points: 3,
				},
				{
					name: "Satisfied—it's rewarding, but I prefer to focus on the details of the match rather than the excitement.",
					points: 2,
				},
				{
					name: "Indifferent—I don't get particularly excited by DNA matches.",
					points: 1,
				},
				{ name: "I don't focus on DNA results.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q222',
			text: 'When analyzing genetic results, do you focus more on the ancestral composition or connecting matches to specific relatives?',
			options: [
				{
					name: 'Connecting matches to specific relatives—I enjoy learning how matches fit into my family tree.',
					points: 3,
				},
				{
					name: 'Ancestral composition—I prefer focusing on the broader picture of where my family comes from.',
					points: 2,
				},
				{
					name: 'Both—I like combining both aspects to build a fuller understanding of my family history.',
					points: 3,
				},
				{ name: "I don't analyze genetic results.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q223',
			text: 'Do you enjoy solving family mysteries by matching DNA or by corroborating with traditional genealogical records?',
			options: [
				{
					name: 'Matching DNA—I love the thrill of uncovering new connections through genetic testing.',
					points: 3,
				},
				{
					name: 'Corroborating with traditional genealogical records—I prefer to build a proven, documented family history.',
					points: 3,
				},
				{
					name: 'Both—I enjoy combining DNA matches with traditional research to verify and build a complete family story.',
					points: 3,
				},
				{
					name: "I don't focus on solving family mysteries with DNA or genealogical records.",
					points: 0,
				},
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q224',
			text: 'When dealing with multiple DNA tests from family members, how do you prioritize matching results to family history?',
			options: [
				{
					name: 'I prioritize matching results that fit with my existing family tree and known genealogical records.',
					points: 3,
				},
				{
					name: 'I focus on uncovering new connections regardless of how they fit into the family history.',
					points: 2,
				},
				{
					name: 'I look for both matches that support family history and new connections that challenge what I know.',
					points: 3,
				},
				{ name: "I don't work with multiple DNA tests.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
		{
			id: 'q225',
			text: 'Do you enjoy uncovering surprises in DNA results or confirming long-held family lore?',
			options: [
				{
					name: 'Uncovering surprises—I love finding unexpected connections that open new doors to family history.',
					points: 3,
				},
				{
					name: 'Confirming long-held family lore—I enjoy validating what has been passed down through generations.',
					points: 3,
				},
				{
					name: 'Both—I enjoy both the surprises and the confirmations in DNA results.',
					points: 3,
				},
				{ name: "I don't focus on DNA results.", points: 0 },
			],
			categoryName: 'Tech-Savvy & Digital Genealogists',
			subcategoryName: 'The DNA Detective',
		},
	],
}
