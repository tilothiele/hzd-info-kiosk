'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamischer Import für die Map-Komponente (verhindert SSR-Probleme)
const SimpleMap = dynamic(() => import('./simple-map'), {
	ssr: false,
	loading: () => (
		<div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-2xl">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
				<p className="mt-4 text-sm text-gray-600 font-medium">Karte wird geladen...</p>
			</div>
		</div>
	)
})

interface SearchFilters {
	name: string
	gender: string
	color: string
	stud: string
	healthTests: boolean
}

// Mock-Daten für Hunde
const dogs = [
		{
			id: 1,
			name: 'Bella vom Schwarzen Wald',
			gender: 'Weiblich',
			birthDate: '2020-03-15',
			color: 'Schwarzmarken',
			owner: 'Max Mustermann',
			location: 'München, Bayern',
			pedigreeNumber: 'HZD-2020-001',
			microchipId: 'DE123456789012345',
			isStudAvailable: false,
			healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
			coordinates: [48.1351, 11.5820] as [number, number],
		},
		{
			id: 2,
			name: 'Thor von der Eifel',
			gender: 'Männlich',
			birthDate: '2019-08-22',
			color: 'Schwarzmarken',
			owner: 'Anna Schmidt',
			location: 'Hamburg, Hamburg',
			pedigreeNumber: 'HZD-2019-045',
			microchipId: 'DE987654321098765',
			isStudAvailable: true,
			healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei'],
			coordinates: [53.5511, 9.9937] as [number, number],
		},
		{
			id: 3,
			name: 'Luna aus dem Harz',
			gender: 'Weiblich',
			birthDate: '2021-01-10',
			color: 'Blond',
			owner: 'Peter Weber',
			location: 'Köln, Nordrhein-Westfalen',
			pedigreeNumber: 'HZD-2021-012',
			microchipId: 'DE555666777888999',
			isStudAvailable: false,
			healthTests: ['HD-A1', 'ED-0'],
			coordinates: [50.9375, 6.9603] as [number, number],
		},
		{
			id: 4,
			name: 'Rex vom Bodensee',
			gender: 'Männlich',
			birthDate: '2018-11-05',
			color: 'Schwarzmarken',
			owner: 'Maria Fischer',
			location: 'Stuttgart, Baden-Württemberg',
			pedigreeNumber: 'HZD-2018-078',
			microchipId: 'DE111222333444555',
			isStudAvailable: true,
			healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
			coordinates: [48.7758, 9.1829] as [number, number],
		},
	]

export default function SearchPage() {
	const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({
		name: '',
		gender: '',
		color: '',
		stud: '',
		healthTests: false
	})
	const [filteredDogs, setFilteredDogs] = useState(dogs)

	const handleSearch = () => {
		let results = dogs.filter(dog => {
			// Name-Filter
			if (searchFilters.name && !dog.name.toLowerCase().includes(searchFilters.name.toLowerCase())) {
				return false
			}
			
			// Geschlecht-Filter
			if (searchFilters.gender && dog.gender !== searchFilters.gender) {
				return false
			}
			
			// Farbe-Filter
			if (searchFilters.color && dog.color !== searchFilters.color) {
				return false
			}
			
			// Deckrüde-Filter
			if (searchFilters.stud === 'ja' && !dog.isStudAvailable) {
				return false
			}
			if (searchFilters.stud === 'nein' && dog.isStudAvailable) {
				return false
			}
			
			// Gesundheitsdaten-Filter
			if (searchFilters.healthTests && dog.healthTests.length < 3) {
				return false
			}
			
			return true
		})
		
		setFilteredDogs(results)
		console.log('Suche abgeschlossen:', results.length, 'Hunde gefunden')
	}

	const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
		setSearchFilters(prev => ({ ...prev, [key]: value }))
	}

	const clearFilters = () => {
		setSearchFilters({
			name: '',
			gender: '',
			color: '',
			stud: '',
			healthTests: false
		})
		setFilteredDogs(dogs) // Alle Hunde wieder anzeigen
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Hovawart-Suche
					</h1>
					<p className="text-gray-600">
						Durchsuchen Sie die Hovawart-Datenbank nach Hunden, Züchtern und Gesundheitsdaten
					</p>
				</div>

				{/* Suchformular */}
				<div className="bg-white shadow rounded-lg p-6 mb-6">
					<div className="mb-4">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Suchfilter</h2>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
								Hundename
							</label>
							<input
								type="text"
								id="name"
								value={searchFilters.name}
								onChange={(e) => handleFilterChange('name', e.target.value)}
								placeholder="Name eingeben..."
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div>
							<label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
								Geschlecht
							</label>
							<select
								id="gender"
								value={searchFilters.gender}
								onChange={(e) => handleFilterChange('gender', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle</option>
								<option value="Männlich">Männlich</option>
								<option value="Weiblich">Weiblich</option>
							</select>
						</div>

						<div>
							<label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
								Farbe
							</label>
							<select
								id="color"
								value={searchFilters.color}
								onChange={(e) => handleFilterChange('color', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle</option>
								<option value="Schwarzmarken">Schwarzmarken</option>
								<option value="Blond">Blond</option>
								<option value="Schwarz">Schwarz</option>
							</select>
						</div>

						<div>
							<label htmlFor="stud" className="block text-sm font-medium text-gray-700 mb-2">
								Deckrüde
							</label>
							<select
								id="stud"
								value={searchFilters.stud}
								onChange={(e) => handleFilterChange('stud', e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle</option>
								<option value="ja">Verfügbar</option>
								<option value="nein">Nicht verfügbar</option>
							</select>
						</div>
					</div>

					<div className="mt-4 flex justify-between items-center">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="healthTests"
								checked={searchFilters.healthTests}
								onChange={(e) => handleFilterChange('healthTests', e.target.checked)}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label htmlFor="healthTests" className="ml-2 block text-sm text-gray-900">
								Nur Hunde mit vollständigen Gesundheitsdaten
							</label>
						</div>
						<div className="flex space-x-2">
							<button 
								onClick={clearFilters}
								className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
							>
								Zurücksetzen
							</button>
							<button 
								onClick={handleSearch}
								className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
							>
								Suchen
							</button>
						</div>
					</div>
				</div>

				{/* Suchergebnisse */}
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-gray-900">
							Suchergebnisse ({filteredDogs.length} Hunde gefunden)
						</h2>
						<div className="flex space-x-2">
							<button 
								onClick={() => setViewMode('table')}
								className={`px-3 py-1 text-sm border rounded-md transition-colors duration-200 ${
									viewMode === 'table' 
										? 'bg-blue-600 text-white border-blue-600' 
										: 'border-gray-300 hover:bg-gray-50'
								}`}
							>
								Tabelle
							</button>
							<button 
								onClick={() => setViewMode('map')}
								className={`px-3 py-1 text-sm border rounded-md transition-colors duration-200 ${
									viewMode === 'map' 
										? 'bg-blue-600 text-white border-blue-600' 
										: 'border-gray-300 hover:bg-gray-50'
								}`}
							>
								Karte anzeigen
							</button>
							<button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
								Exportieren
							</button>
						</div>
					</div>

					{/* Tabellenansicht */}
					{viewMode === 'table' && (
						<div className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Hundename
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Geburtsdatum
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Geschlecht
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Farbe
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Besitzer
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Standort
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Aktionen
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredDogs.map((dog) => (
											<tr key={dog.id} className="hover:bg-gray-50 transition-colors duration-200">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{dog.name}
														</div>
														<div className="text-sm text-gray-500">
															{dog.pedigreeNumber}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{dog.birthDate}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{dog.gender}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{dog.color}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{dog.owner}</div>
													<div className="text-sm text-gray-500 font-mono">{dog.microchipId}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{dog.location}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{dog.isStudAvailable ? (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
															Deckrüde verfügbar
														</span>
													) : (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
															Normal
														</span>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex space-x-2">
														<button className="text-blue-600 hover:text-blue-900">
															Details
														</button>
														<button className="text-gray-600 hover:text-gray-900">
															Abstammung
														</button>
														{dog.isStudAvailable && (
															<button className="text-green-600 hover:text-green-900">
																Kontakt
															</button>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Kartenansicht */}
					{viewMode === 'map' && (
						<div className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="p-4 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">Hovawart-Standorte</h3>
								<p className="text-sm text-gray-600">
									Interaktive Karte mit den Standorten der registrierten Hovawart-Hunde
								</p>
							</div>
							<SimpleMap dogs={filteredDogs} />
							<div className="p-4 bg-gray-50 border-t border-gray-200">
								<div className="flex items-center justify-between text-sm text-gray-600">
									<div className="flex items-center space-x-4">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
											<span>Deckrüde verfügbar</span>
										</div>
										<div className="flex items-center">
											<div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
											<span>Normal</span>
										</div>
									</div>
									<div>
										<span className="text-xs">
											Karten-Daten von <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a>
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Info-Box */}
				<div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
					<div style={{ display: 'flex', alignItems: 'flex-start' }}>
						<div style={{ flexShrink: 0, marginTop: '2px', marginRight: '12px' }}>
							<svg 
								style={{ width: '16px', height: '16px', color: '#fbbf24' }} 
								fill="currentColor" 
								viewBox="0 0 20 20"
							>
								<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
						</div>
						<div>
							<h3 className="text-sm font-medium text-yellow-800">
								Hinweis zu den Gesundheitsdaten
							</h3>
							<div className="mt-2 text-sm text-yellow-700">
								<p>
									Die hier angezeigten Gesundheitsdaten sind öffentlich verfügbare Informationen. 
									Für detaillierte Auswertungen und Zuchtempfehlungen wenden Sie sich bitte an 
									den jeweiligen Züchter oder den HZD.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}