import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'HZD Info Kiosk',
	description: 'Hovawart-Züchterdatenbank mit öffentlicher Suchfunktion',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="de">
			<body className="min-h-screen bg-gray-50">
				<header className="bg-white shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center py-4">
							<div className="flex items-center">
								<h1 className="text-2xl font-bold text-gray-900">
									HZD Info Kiosk
								</h1>
							</div>
							<nav className="hidden md:flex space-x-8">
								<a
									href="/"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
								>
									Startseite
								</a>
								<a
									href="/search"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
								>
									Suche
								</a>
								<a
									href="/breeders"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
								>
									Züchter
								</a>
							</nav>
						</div>
					</div>
				</header>
				<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					{children}
				</main>
			</body>
		</html>
	)
}
