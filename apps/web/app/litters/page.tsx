export default function LittersPage() {
	// Mock-Daten für Würfe
	const litters = [
		{
			id: 1,
			litterNumber: 'W-2024-001',
			mother: 'Bella vom Schwarzen Wald',
			father: 'Thor von der Eifel',
			breeder: 'Max Mustermann',
			location: 'München, Bayern',
			status: 'Verfügbar',
			expectedDate: '2024-06-15',
			actualDate: '2024-06-12',
			expectedPuppies: 6,
			actualPuppies: 5,
			availablePuppies: 3,
			price: '€1.200',
			description: 'Wunderschöner Wurf aus bewährter Zuchtlinie. Beide Elterntiere sind HD/ED-frei und haben ausgezeichnete Wesensmerkmale.',
			contact: 'max.mustermann@email.de',
			phone: '+49 89 12345678',
		},
		{
			id: 2,
			litterNumber: 'W-2024-002',
			mother: 'Luna aus dem Harz',
			father: 'Rex vom Bodensee',
			breeder: 'Anna Schmidt',
			location: 'Hamburg, Hamburg',
			status: 'Geplant',
			expectedDate: '2024-08-20',
			actualDate: null,
			expectedPuppies: 7,
			actualPuppies: null,
			availablePuppies: 0,
			price: '€1.100',
			description: 'Geplanter Wurf für Herbst 2024. Mutter ist eine sehr ruhige und ausgeglichene Hündin, Vater ist ein erfahrener Deckrüde.',
			contact: 'anna.schmidt@email.de',
			phone: '+49 40 87654321',
		},
		{
			id: 3,
			litterNumber: 'W-2024-003',
			mother: 'Nala von der Mosel',
			father: 'Zeus aus dem Schwarzwald',
			breeder: 'Peter Weber',
			location: 'Köln, Nordrhein-Westfalen',
			status: 'Reserviert',
			expectedDate: '2024-05-10',
			actualDate: '2024-05-08',
			expectedPuppies: 5,
			actualPuppies: 6,
			availablePuppies: 0,
			price: '€1.300',
			description: 'Alle Welpen sind bereits reserviert. Wurf ist geboren und entwickelt sich prächtig.',
			contact: 'peter.weber@email.de',
			phone: '+49 221 11223344',
		},
		{
			id: 4,
			litterNumber: 'W-2024-004',
			mother: 'Maya vom Neckar',
			father: 'Apollo aus dem Odenwald',
			breeder: 'Maria Fischer',
			location: 'Stuttgart, Baden-Württemberg',
			status: 'Verfügbar',
			expectedDate: '2024-07-30',
			actualDate: '2024-07-28',
			expectedPuppies: 6,
			actualPuppies: 4,
			availablePuppies: 2,
			price: '€1.150',
			description: 'Kleiner aber feiner Wurf. Beide Elterntiere stammen aus Arbeitslinien und haben ausgezeichnete Arbeitsleistungen.',
			contact: 'maria.fischer@email.de',
			phone: '+49 711 55667788',
		},
	]

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Verfügbar':
				return 'bg-green-100 text-green-800'
			case 'Geplant':
				return 'bg-blue-100 text-blue-800'
			case 'Reserviert':
				return 'bg-yellow-100 text-yellow-800'
			case 'Verkauft':
				return 'bg-gray-100 text-gray-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Hovawart-Würfe
				</h1>
				<p className="text-lg text-gray-600">
					Informationen zu geplanten, verfügbaren und vergangenen Würfen
				</p>
			</div>

			{/* Filter */}
			<div className="bg-white shadow rounded-lg p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							id="status"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="verfügbar">Verfügbar</option>
							<option value="geplant">Geplant</option>
							<option value="reserviert">Reserviert</option>
							<option value="verkauft">Verkauft</option>
						</select>
					</div>
					<div>
						<label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
							Bundesland
						</label>
						<select
							id="location"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="bayern">Bayern</option>
							<option value="hamburg">Hamburg</option>
							<option value="nrw">Nordrhein-Westfalen</option>
							<option value="bw">Baden-Württemberg</option>
						</select>
					</div>
					<div>
						<label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
							Zeitraum
						</label>
						<select
							id="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="2024">2024</option>
							<option value="2023">2023</option>
							<option value="2022">2022</option>
						</select>
					</div>
				</div>
			</div>

			{/* Würfe-Liste */}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-gray-900">
						Würfe ({litters.length} gefunden)
					</h2>
					<div className="flex space-x-2">
						<button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
							Karte anzeigen
						</button>
						<button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
							Exportieren
						</button>
					</div>
				</div>

				{litters.map((litter) => (
					<div key={litter.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										Wurf {litter.litterNumber}
									</h3>
									<div className="flex items-center space-x-4 text-sm text-gray-600">
										<span className="flex items-center">
											<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											{litter.actualDate || litter.expectedDate}
										</span>
										<span className="flex items-center">
											<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											{litter.location}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-end space-y-2">
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(litter.status)}`}>
										{litter.status}
									</span>
									<span className="text-lg font-semibold text-gray-900">
										{litter.price}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-2">Elterntiere</h4>
									<div className="space-y-1 text-sm">
										<div className="flex items-center">
											<span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
											<span className="font-medium">Mutter:</span>
											<span className="ml-2 text-gray-600">{litter.mother}</span>
										</div>
										<div className="flex items-center">
											<span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
											<span className="font-medium">Vater:</span>
											<span className="ml-2 text-gray-600">{litter.father}</span>
										</div>
									</div>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-2">Welpen</h4>
									<div className="grid grid-cols-3 gap-4 text-center">
										<div className="p-2 bg-gray-50 rounded-lg">
											<div className="text-lg font-bold text-blue-600">
												{litter.actualPuppies || litter.expectedPuppies}
											</div>
											<div className="text-xs text-gray-600">Geboren</div>
										</div>
										<div className="p-2 bg-gray-50 rounded-lg">
											<div className="text-lg font-bold text-green-600">
												{litter.availablePuppies}
											</div>
											<div className="text-xs text-gray-600">Verfügbar</div>
										</div>
										<div className="p-2 bg-gray-50 rounded-lg">
											<div className="text-lg font-bold text-purple-600">
												{(litter.actualPuppies || litter.expectedPuppies) - litter.availablePuppies}
											</div>
											<div className="text-xs text-gray-600">Reserviert</div>
										</div>
									</div>
								</div>
							</div>

							<div className="mb-4">
								<h4 className="font-medium text-gray-900 mb-2">Züchter</h4>
								<p className="text-gray-600">{litter.breeder}</p>
								<div className="mt-2 space-y-1 text-sm text-gray-600">
									<div className="flex items-center">
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										{litter.contact}
									</div>
									<div className="flex items-center">
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
										{litter.phone}
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h4 className="font-medium text-gray-900 mb-2">Beschreibung</h4>
								<p className="text-gray-600 text-sm leading-relaxed">
									{litter.description}
								</p>
							</div>

							<div className="flex space-x-3">
								<button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
									Details anzeigen
								</button>
								<button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
									Abstammung anzeigen
								</button>
								{litter.availablePuppies > 0 && (
									<button className="flex-1 border border-green-300 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition-colors duration-200">
										Kontakt aufnehmen
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Info-Box */}
			<div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">
							Wichtige Hinweise für Welpeninteressenten
						</h3>
						<div className="mt-2 text-sm text-blue-700">
							<ul className="list-disc list-inside space-y-1">
								<li>Alle hier gelisteten Züchter sind beim HZD registriert</li>
								<li>Welpen werden erst ab der 8. Woche abgegeben</li>
								<li>Ein Kaufvertrag und Gesundheitszeugnis sind Standard</li>
								<li>Besuchen Sie die Welpen vor dem Kauf persönlich</li>
								<li>Informieren Sie sich über die Verantwortung der Hundehaltung</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
