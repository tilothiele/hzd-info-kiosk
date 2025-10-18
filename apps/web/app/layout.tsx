import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'HZD Info Kiosk',
	description: 'Hovawart-Züchterdatenbank mit öffentlicher Suchfunktion',
	icons: {
		icon: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
		shortcut: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
		apple: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
	},
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
							<div className="flex items-center space-x-4">
								<img 
									src="https://www.hovawarte.com/images/layout/hzd-logo-neu1.png" 
									alt="HZD Logo" 
									className="h-12 w-auto"
								/>
								<h1 className="text-2xl font-bold text-gray-900">
									HZD Info Kiosk
								</h1>
							</div>
							<nav className="hidden md:flex space-x-8">
								<a
									href="/"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
								>
									Startseite
								</a>
								<a
									href="/search"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
								>
									Suche
								</a>
								<a
									href="/breeders"
									className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
								>
									Züchter
								</a>
							</nav>
						</div>
					</div>
				</header>
				<main>
					{children}
				</main>
			</body>
		</html>
	)
}
