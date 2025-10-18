export default function HomePage() {
	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-900 mb-6">
					Willkommen beim HZD Info Kiosk
				</h1>
				<p className="text-xl text-gray-600 mb-8">
					Ihre zentrale Anlaufstelle für Hovawart-Züchterinformationen
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
				<div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
					<div className="p-8 text-center">
						<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Hunde suchen
						</h3>
						<p className="text-gray-600 mb-6">
							Durchsuchen Sie die Hovawart-Datenbank nach Hunden, Züchtern und Abstammungen
						</p>
						<a
							href="/search"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
						>
							Zur Suche
							<svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				</div>

				<div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
					<div className="p-8 text-center">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Züchter finden
						</h3>
						<p className="text-gray-600 mb-6">
							Entdecken Sie registrierte Hovawart-Züchter in Ihrer Nähe
						</p>
						<a
							href="/breeders"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
						>
							Züchter anzeigen
							<svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				</div>

				<div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
					<div className="p-8 text-center">
						<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Würfe anzeigen
						</h3>
						<p className="text-gray-600 mb-6">
							Informationen zu geplanten und verfügbaren Würfen
						</p>
						<a
							href="/litters"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
						>
							Würfe anzeigen
							<svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div className="mt-12 bg-white shadow rounded-lg p-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Über den HZD Info Kiosk
				</h2>
				<p className="text-gray-600 mb-4">
					Der HZD Info Kiosk ist eine zentrale Plattform für alle
					Hovawart-Interessierten. Hier können Sie:
				</p>
				<ul className="list-disc list-inside text-gray-600 space-y-2">
					<li>Nach Hovawart-Hunden in der Datenbank suchen</li>
					<li>Informationen über registrierte Züchter abrufen</li>
					<li>Verfügbare Würfe und Deckrüden finden</li>
					<li>Gesundheitsdaten und Abstammungsinformationen einsehen</li>
				</ul>
			</div>
		</div>
	)
}
