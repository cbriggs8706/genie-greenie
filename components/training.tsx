import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { microSkills } from '@/data/microskills'

export default function TrainingComponent() {
	const router = useRouter()

	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('')

	const categories = Array.from(
		new Set(microSkills.map((category) => category.category))
	)
	const skillLevels = Array.from(
		new Set(
			microSkills.flatMap((category) =>
				category.skills.map((skill) => skill.skillLevel)
			)
		)
	)

	const filteredSkills = microSkills
		.map((category) => ({
			...category,
			skills: category.skills.filter(
				(skill) =>
					(selectedCategory === '' || category.category === selectedCategory) &&
					(selectedSkillLevel === '' || skill.skillLevel === selectedSkillLevel)
			),
		}))
		.filter((category) => category.skills.length > 0)

	return (
		<div className="p-4">
			<div className="flex flex-wrap gap-4 justify-center mb-6">
				<select
					className="px-4 py-2 border border-gray-300 rounded-md"
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
				>
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>

				<select
					className="px-4 py-2 border border-gray-300 rounded-md"
					value={selectedSkillLevel}
					onChange={(e) => setSelectedSkillLevel(e.target.value)}
				>
					<option value="">All Skill Levels</option>
					{skillLevels.map((level) => (
						<option key={level} value={level}>
							{level}
						</option>
					))}
				</select>
			</div>

			{filteredSkills.length > 0 ? (
				<div className="space-y-10">
					{filteredSkills.map((category, index) => (
						<div key={index}>
							<h2 className="text-xl font-semibold text-green-700 border-b-2 border-green-700 pb-2 mb-4">
								{category.category}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{category.skills.map((skill, i) => (
									<div
										key={i}
										className={`w-full bg-white p-4 rounded-lg shadow-lg border-green-700 border-2 text-center transition ${
											skill.url
												? 'hover:bg-green-700 hover:text-white cursor-pointer'
												: 'cursor-default'
										}`}
										onClick={() => skill.url && router.push(skill.url)}
									>
										<h3 className="font-semibold text-lg">{skill.name}</h3>
										<p className="text-sm">{skill.description}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500">No skills match your filters.</p>
			)}
		</div>
	)
}
