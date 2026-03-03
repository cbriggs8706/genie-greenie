import FamilyTreePuzzle from '@/components/familyTreePuzzle'

export default function FamilyTreePuzzlePage() {
	return (
		<section className="space-y-3">
			<h1 className="font-Young_Serif text-3xl text-sky-900">Family Tree Puzzle</h1>
			<p className="font-inter text-sky-900">
				Drag characters into the correct family tree slots using clues.
			</p>
			<FamilyTreePuzzle />
		</section>
	)
}
