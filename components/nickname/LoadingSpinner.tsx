'use client'

const LoadingSpinner = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-6 text-center text-gray-700">
			<div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
			<p className="text-lg font-medium">Warming up the database...</p>
			<p className="text-sm text-gray-500">
				This may take a few seconds if the server is waking up. Thanks for your
				patience!
			</p>
		</div>
	)
}

export default LoadingSpinner
