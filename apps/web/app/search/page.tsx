'use client'

import { useState, useEffect, useRef } from 'react'
import { allDogs } from './dog-data'
import { getGenderDisplay, formatDate } from '@hovawart-db/shared'
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	MapIcon,
	TableCellsIcon,
	ArrowDownTrayIcon,
	ArrowPathIcon,
	InformationCircleIcon,
	HeartIcon,
	UserIcon,
	CalendarIcon,
	MapPinIcon,
	ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import {
	HeartIcon as HeartSolidIcon,
	UserIcon as UserSolidIcon,
} from '@heroicons/react/24/solid'

// Map-Komponente direkt integriert
function SimpleMap({ dogs }: { dogs: any[] }) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const [isClient, setIsClient] = useState(false) // Added for hydration fix

	// PLZ-basierte Koordinaten-Lookup
	const getCoordinatesByPLZ = (plz: string) => {
		const plzCoordinates: { [key: string]: [number, number] } = {
			// München
			'80331': [48.1351, 11.5820],
			'80335': [48.1351, 11.5820],
			// Hamburg
			'20095': [53.5511, 9.9937],
			'20099': [53.5511, 9.9937],
			// Köln
			'50667': [50.9375, 6.9603],
			'50679': [50.9375, 6.9603],
			// Stuttgart
			'70173': [48.7758, 9.1829],
			'70174': [48.7758, 9.1829],
			// Berlin
			'10115': [52.5200, 13.4050],
			'10117': [52.5200, 13.4050],
			// Frankfurt
			'60311': [50.1109, 8.6821],
			'60313': [50.1109, 8.6821],
			// Düsseldorf
			'40213': [51.2277, 6.7735],
			'40215': [51.2277, 6.7735],
			// Leipzig
			'04109': [51.3397, 12.3731],
			'04103': [51.3397, 12.3731],
			// Dresden
			'01067': [51.0504, 13.7373],
			'01069': [51.0504, 13.7373],
			// Nürnberg
			'90402': [49.4521, 11.0767],
			'90403': [49.4521, 11.0767],
			// Bremen
			'28195': [53.0793, 8.8017],
			'28197': [53.0793, 8.8017],
			// Hannover
			'30159': [52.3759, 9.7320],
			'30161': [52.3759, 9.7320],
			// Kiel
			'24103': [54.3233, 10.1228],
			'24105': [54.3233, 10.1228],
			// Magdeburg
			'39104': [52.1205, 11.6276],
			'39106': [52.1205, 11.6276],
			// Schwerin
			'19053': [53.6355, 11.4012],
			'19055': [53.6355, 11.4012],
			// Mainz
			'55116': [49.9929, 8.2473],
			'55118': [49.9929, 8.2473],
			// Rostock
			'18055': [54.0924, 12.1286],
			'18057': [54.0924, 12.1286],
			// Freiburg
			'79098': [47.9990, 7.8421],
			'79100': [47.9990, 7.8421],
			// Augsburg
			'86150': [48.3665, 10.8948],
			'86152': [48.3665, 10.8948],
			// Münster
			'48143': [51.9616, 7.6284],
			'48145': [51.9616, 7.6284],
			// Bonn
			'53111': [50.7374, 7.0982],
			'53113': [50.7374, 7.0982],
			// Würzburg
			'97070': [49.7912, 9.9530],
			'97072': [49.7912, 9.9530],
			// Jena
			'07743': [50.9272, 11.5894],
			'07745': [50.9272, 11.5894],
		}
		return plzCoordinates[plz] || [51.1657, 10.4515] // Deutschland-Zentrum als Fallback
	}

	useEffect(() => {
		// Client-Side Rendering sicherstellen
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

		// Dynamisches Laden von Leaflet
		const loadLeaflet = async () => {
			// CSS laden
			const cssLink = document.createElement('link')
			cssLink.rel = 'stylesheet'
			cssLink.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
			document.head.appendChild(cssLink)

			// JavaScript laden
			const script = document.createElement('script')
			script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
			script.onload = () => {
				if (mapRef.current && (window as any).L) {
					const L = (window as any).L

					// Alte Karte entfernen falls vorhanden
					if (mapInstanceRef.current) {
						mapInstanceRef.current.remove()
						mapInstanceRef.current = null
					}

					// Container zurücksetzen
					if ((mapRef.current as any)._leaflet_id) {
						(mapRef.current as any)._leaflet_id = null
					}

					// Karte initialisieren
					const map = L.map(mapRef.current).setView([51.1657, 10.4515], 6)
					mapInstanceRef.current = map

					// Tile Layer hinzufügen
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					}).addTo(map)

					// Marker hinzufügen
					dogs.forEach((dog) => {
						const coordinates = getCoordinatesByPLZ(dog.plz)

						// Custom Icon für Marker erstellen (30x30px)
						const customIcon = L.divIcon({
							className: 'custom-marker',
							html: `<div style="
								width: 30px;
								height: 30px;
								background-color: ${dog.isStudAvailable ? '#10b981' : '#3b82f6'};
								border: 2px solid white;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								box-shadow: 0 2px 4px rgba(0,0,0,0.3);
								font-size: 12px;
								color: white;
								font-weight: bold;
							">🐕</div>`,
							iconSize: [30, 30],
							iconAnchor: [15, 15],
							popupAnchor: [0, -15]
						})

						const marker = L.marker(coordinates, { icon: customIcon }).addTo(map)

						marker.bindPopup(`
							<div style="padding: 8px; min-width: 200px;">
								<h3 style="margin: 0 0 8px 0; font-weight: bold;">${dog.name}</h3>
								<p style="margin: 2px 0;"><strong>Besitzer:</strong> ${dog.owner}</p>
								<p style="margin: 2px 0;"><strong>Standort:</strong> ${dog.location}</p>
								<p style="margin: 2px 0;"><strong>PLZ:</strong> ${dog.plz}</p>
								<p style="margin: 2px 0;"><strong>Geburtsdatum:</strong> ${formatDate(new Date(dog.birthDate))}</p>
								<p style="margin: 2px 0;"><strong>Geschlecht:</strong> ${getGenderDisplay(dog.gender)}</p>
								<p style="margin: 2px 0;"><strong>Farbe:</strong> ${dog.color}</p>
								<p style="margin: 2px 0;"><strong>Zuchtbuch:</strong> ${dog.pedigreeNumber}</p>
								${(() => {
									const dogType = getDogType(dog)
									if (!dogType) return ''
									return `<p style="margin: 2px 0; color: ${dogType.color === 'green' ? 'green' : 'purple'}; font-weight: bold;">${dogType.icon} ${dogType.label}</p>`
								})()}
								<div style="margin-top: 8px;">
									<button style="background: #2563eb; color: white; border: none; padding: 4px 8px; margin-right: 4px; border-radius: 4px; cursor: pointer;">Details</button>
									<button style="background: #6b7280; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Kontakt</button>
								</div>
							</div>
						`)
					})
				}
			}
			document.head.appendChild(script)

			return () => {
				// Karte entfernen
				if (mapInstanceRef.current) {
					mapInstanceRef.current.remove()
					mapInstanceRef.current = null
				}

				// Container zurücksetzen
				if (mapRef.current && (mapRef.current as any)._leaflet_id) {
					(mapRef.current as any)._leaflet_id = null
				}

				// Cleanup
				if (cssLink.parentNode) {
					cssLink.parentNode.removeChild(cssLink)
				}
				if (script.parentNode) {
					script.parentNode.removeChild(script)
				}
			}
		}

		loadLeaflet()
	}, [dogs, isClient]) // Added isClient to dependency array

	if (!isClient) { // Conditional rendering for hydration fix
		return (
			<div
				className="h-96 w-full bg-gray-100 flex items-center justify-center"
				style={{ minHeight: '384px' }}
			>
				<div className="text-center text-gray-500">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<p>Karte wird initialisiert...</p>
				</div>
			</div>
		)
	}

	return (
		<div
			ref={mapRef}
			className="h-96 w-full bg-gray-100 flex items-center justify-center"
			style={{ minHeight: '384px' }}
		>
			<div className="text-center text-gray-500">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
				<p>Karte wird geladen...</p>
			</div>
		</div>
	)
}

interface SearchFilters {
	name: string
	gender: string
	color: string
	stud: string
	owner: string
	healthTests: boolean
}

// Verwende die importierten Hundedaten
const dogs = allDogs

// Extrahiere alle eindeutigen Besitzer
const uniqueOwners = Array.from(new Set(dogs.map(dog => dog.owner))).sort()

// Funktion zur Bestimmung des Hundetyps
const getDogType = (dog: any) => {
	if (dog.isStudAvailable) {
		return { type: 'stud', label: 'Deckrüde', color: 'green', icon: '♂' }
	}
	// Für Zuchthündinnen: weibliche Hunde, die potenziell für die Zucht geeignet sind
	// (hier vereinfacht: alle Hündinnen über 2 Jahren)
	if (dog.gender === 'H') {
		const age = (new Date().getTime() - new Date(dog.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
		if (age >= 2) {
			return { type: 'breeding', label: 'Zuchthündin', color: 'purple', icon: '♀' }
		}
	}
	return null // Kein Status für normale Hunde
}

export default function SearchPage() {
	const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({
		name: '',
		gender: '',
		color: '',
		stud: '',
		owner: '',
		healthTests: false
	})
	const [filteredDogs, setFilteredDogs] = useState(dogs)
	const [showToast, setShowToast] = useState(false)
	const [toastMessage, setToastMessage] = useState('')

	// Modal State
	const [selectedDog, setSelectedDog] = useState<any>(null)
	const [showDogDetailsModal, setShowDogDetailsModal] = useState(false)
	const [showContactModal, setShowContactModal] = useState(false)

	// Paginierung State
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [totalItems, setTotalItems] = useState(110) // 110 Hunde

	const showToastMessage = (message: string) => {
		setToastMessage(message)
		setShowToast(true)
		setTimeout(() => setShowToast(false), 3000)
	}

	// Handler für Aktionsbuttons
	const handleDogDetails = (dog: any) => {
		setSelectedDog(dog)
		setShowDogDetailsModal(true)
	}

	const handleContact = (dog: any) => {
		setSelectedDog(dog)
		setShowContactModal(true)
	}

	const closeModals = () => {
		setShowDogDetailsModal(false)
		setShowContactModal(false)
		setSelectedDog(null)
	}

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
			if (searchFilters.stud === 'available' && !dog.isStudAvailable) {
				return false
			}
			if (searchFilters.stud === 'not-available' && dog.isStudAvailable) {
				return false
			}

			// Besitzer-Filter
			if (searchFilters.owner && dog.owner !== searchFilters.owner) {
				return false
			}

			// Gesundheitsdaten-Filter
			if (searchFilters.healthTests && dog.healthTests.length === 0) {
				return false
			}

			return true
		})

		setFilteredDogs(results)
		setTotalItems(results.length)
		setCurrentPage(1) // Zurück zur ersten Seite
		showToastMessage(`${results.length} Hunde gefunden`)
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (items: number) => {
		setItemsPerPage(items)
		setCurrentPage(1) // Zurück zur ersten Seite
	}

	// Berechne paginierte Hunde
	const totalPages = Math.ceil(totalItems / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentDogs = filteredDogs.slice(startIndex, endIndex)

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Hovawart-Suche</h1>
					<p className="text-gray-600">Finden Sie den perfekten Hovawart für Ihre Bedürfnisse</p>
				</div>

				{/* Suchfilter */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Name
							</label>
							<input
								type="text"
								value={searchFilters.name}
								onChange={(e) => setSearchFilters({...searchFilters, name: e.target.value})}
								placeholder="Hundename eingeben..."
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Geschlecht
							</label>
							<select
								value={searchFilters.gender}
								onChange={(e) => setSearchFilters({...searchFilters, gender: e.target.value})}
								className="input w-full"
							>
								<option value="">Alle</option>
								<option value="R">Rüde</option>
								<option value="H">Hündin</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Farbe
							</label>
							<select
								value={searchFilters.color}
								onChange={(e) => setSearchFilters({...searchFilters, color: e.target.value})}
								className="input w-full"
							>
								<option value="">Alle</option>
								<option value="Schwarzmarken">Schwarzmarken</option>
								<option value="Schwarz">Schwarz</option>
								<option value="Blond">Blond</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Deckrüde
							</label>
							<select
								value={searchFilters.stud}
								onChange={(e) => setSearchFilters({...searchFilters, stud: e.target.value})}
								className="input w-full"
							>
								<option value="">Alle</option>
								<option value="available">Verfügbar</option>
								<option value="not-available">Nicht verfügbar</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Besitzer
							</label>
							<select
								value={searchFilters.owner}
								onChange={(e) => setSearchFilters({...searchFilters, owner: e.target.value})}
								className="input w-full"
							>
								<option value="">Alle</option>
								{uniqueOwners.map(owner => (
									<option key={owner} value={owner}>{owner}</option>
								))}
							</select>
						</div>

						<div className="flex items-end">
							<button
								onClick={handleSearch}
								className="btn-primary w-full flex items-center justify-center"
							>
								<MagnifyingGlassIcon className="h-4 w-4 mr-2" />
								Suchen
							</button>
						</div>
					</div>
				</div>

				{/* Ansichtsmodus und Ergebnisse */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					{/* Header mit Ansichtsmodus */}
					<div className="px-6 py-4 border-b border-gray-200">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-4 sm:mb-0">
								<h2 className="text-lg font-semibold text-gray-900">
									Suchergebnisse
								</h2>
								<p className="text-sm text-gray-600">
									{totalItems} Hunde gefunden
								</p>
							</div>

							<div className="flex space-x-2">
								<button
									onClick={() => setViewMode('table')}
									className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
										viewMode === 'table'
											? 'bg-blue-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									<TableCellsIcon className="h-4 w-4 mr-2" />
									Tabelle
								</button>
								<button
									onClick={() => setViewMode('map')}
									className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
										viewMode === 'map'
											? 'bg-blue-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									<MapIcon className="h-4 w-4 mr-2" />
									Karte
								</button>
							</div>
						</div>
					</div>

					{/* Tabellenansicht */}
					{viewMode === 'table' && (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Bild
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Geschlecht
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Geburtsdatum
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
											Gesundheit
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Aktionen
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{currentDogs.map((dog) => (
										<tr key={dog.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex-shrink-0 h-16 w-16">
													<img
														className="h-16 w-16 rounded-lg object-cover border border-gray-200"
														src={dog.mainImage}
														alt={`${dog.name} - Hauptbild`}
													/>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{dog.name}</div>
												<div className="text-sm text-gray-500">{dog.pedigreeNumber}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{getGenderDisplay(dog.gender)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{formatDate(new Date(dog.birthDate))}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{dog.color}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{dog.owner}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												<div className="flex items-center">
													<MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
													{dog.location}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{(() => {
													const dogType = getDogType(dog)
													if (!dogType) return null

													const colorClasses = {
														green: 'bg-green-100 text-green-800',
														purple: 'bg-purple-100 text-purple-800'
													}
													return (
														<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[dogType.color as keyof typeof colorClasses]}`}>
															<span className="mr-1">{dogType.icon}</span>
															{dogType.label}
														</span>
													)
												})()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-wrap gap-1">
													{dog.healthTests.map((test: string, index: number) => (
														<span
															key={index}
															className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
														>
															{test}
														</span>
													))}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<button
														onClick={() => handleDogDetails(dog)}
														className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
														title="Details anzeigen"
													>
														<InformationCircleIcon className="h-4 w-4" />
													</button>
													{dog.isStudAvailable && (
														<button
															onClick={() => handleContact(dog)}
															className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
															title="Kontakt aufnehmen"
														>
															<HeartIcon className="h-4 w-4" />
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Map View */}
					{viewMode === 'map' && (
						<div className="bg-white shadow-lg rounded-xl overflow-hidden">
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-center">
									<MapIcon className="h-5 w-5 text-gray-500 mr-2" />
									<div>
										<h3 className="text-lg font-semibold text-gray-900">Hovawart-Standorte</h3>
										<p className="text-sm text-gray-600">
											{totalItems} Hunde auf der Karte
										</p>
									</div>
								</div>
							</div>
							<SimpleMap dogs={filteredDogs} />
							<div className="p-4 bg-gray-50 border-t border-gray-200">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
									<div className="flex items-center space-x-6">
										<div className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
											<span className="text-sm font-medium text-gray-700">♂ Deckrüde</span>
										</div>
										<div className="flex items-center">
											<div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
											<span className="text-sm font-medium text-gray-700">♀ Zuchthündin</span>
										</div>
									</div>
									<div>
										<span className="text-xs text-gray-500">
											Karten-Daten von{' '}
											<a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
												OpenStreetMap
											</a>
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Paginierung */}
				{viewMode === 'table' && totalPages > 1 && (
					<div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
							<div className="flex items-center space-x-4">
								<span className="text-sm text-gray-700">
									Zeige {startIndex + 1} bis {Math.min(endIndex, totalItems)} von {totalItems} Ergebnissen
								</span>
								<select
									value={itemsPerPage}
									onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
									className="text-sm border border-gray-300 rounded-md px-2 py-1"
								>
									<option value={10}>10 pro Seite</option>
									<option value={20}>20 pro Seite</option>
									<option value={50}>50 pro Seite</option>
									<option value={100}>100 pro Seite</option>
									<option value={totalItems}>Alle</option>
								</select>
							</div>

							<div className="flex items-center space-x-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Zurück
								</button>

								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNum
									if (totalPages <= 5) {
										pageNum = i + 1
									} else if (currentPage <= 3) {
										pageNum = i + 1
									} else if (currentPage >= totalPages - 2) {
										pageNum = totalPages - 4 + i
									} else {
										pageNum = currentPage - 2 + i
									}

									return (
										<button
											key={pageNum}
											onClick={() => handlePageChange(pageNum)}
											className={`px-3 py-1 text-sm border rounded-md ${
												currentPage === pageNum
													? 'bg-blue-600 text-white border-blue-600'
													: 'border-gray-300 hover:bg-gray-50'
											}`}
										>
											{pageNum}
										</button>
									);
								})}

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Weiter
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Info Alert */}
				<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
					<div className="flex">
						<div className="flex-shrink-0">
							<ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-blue-800">
								Hinweis zu den Gesundheitsdaten
							</h3>
							<div className="mt-2 text-sm text-blue-700">
								<p>
									Die hier angezeigten Gesundheitsdaten sind öffentlich verfügbare Informationen.
									Für detaillierte Auswertungen und Zuchtempfehlungen wenden Sie sich bitte an
									den jeweiligen Züchter oder den HZD.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Hund-Details Modal */}
				{showDogDetailsModal && selectedDog && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
							<div className="mt-3">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-medium text-gray-900">
										Hund-Details: {selectedDog.name}
									</h3>
									<button
										onClick={closeModals}
										className="text-gray-400 hover:text-gray-600"
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Hauptbild */}
									<div>
										<img
											className="w-full h-64 object-cover rounded-lg border border-gray-200"
											src={selectedDog.mainImage}
											alt={`${selectedDog.name} - Hauptbild`}
										/>
									</div>

									{/* Hundedaten */}
									<div className="space-y-4">
										<div>
											<h4 className="font-semibold text-gray-900">Grunddaten</h4>
											<div className="mt-2 space-y-2 text-sm">
												<div><strong>Name:</strong> {selectedDog.name}</div>
												<div><strong>Zuchtbuch:</strong> {selectedDog.pedigreeNumber}</div>
												<div><strong>Geburtsdatum:</strong> {formatDate(new Date(selectedDog.birthDate))}</div>
												<div><strong>Geschlecht:</strong> {getGenderDisplay(selectedDog.gender)}</div>
												<div><strong>Farbe:</strong> {selectedDog.color}</div>
												<div><strong>Mikrochip:</strong> {selectedDog.microchipId}</div>
											</div>
										</div>

										<div>
											<h4 className="font-semibold text-gray-900">Besitzer</h4>
											<div className="mt-2 space-y-2 text-sm">
												<div><strong>Name:</strong> {selectedDog.owner}</div>
												<div><strong>Standort:</strong> {selectedDog.location}</div>
												<div><strong>PLZ:</strong> {selectedDog.plz}</div>
											</div>
										</div>

										{(() => {
											const dogType = getDogType(selectedDog)
											if (!dogType) return null

											return (
												<div>
													<h4 className="font-semibold text-gray-900">Status</h4>
													<div className="mt-2">
														<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dogType.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
															<span className="mr-1">{dogType.icon}</span>
															{dogType.label}
														</span>
													</div>
												</div>
											)
										})()}
									</div>
								</div>

								{/* Gesundheitsdaten */}
								<div className="mt-6">
									<h4 className="font-semibold text-gray-900 mb-3">Gesundheitsdaten</h4>
									<div className="flex flex-wrap gap-2">
										{selectedDog.healthTests.map((test: string, index: number) => (
											<span
												key={index}
												className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
											>
												{test}
											</span>
										))}
									</div>
								</div>

								{/* Bildergalerie */}
								{selectedDog.gallery && selectedDog.gallery.length > 1 && (
									<div className="mt-6">
										<h4 className="font-semibold text-gray-900 mb-3">Weitere Bilder</h4>
										<div className="grid grid-cols-3 gap-2">
											{selectedDog.gallery.slice(1).map((image: string, index: number) => (
												<img
													key={index}
													className="w-full h-24 object-cover rounded-lg border border-gray-200"
													src={image}
													alt={`${selectedDog.name} - Bild ${index + 2}`}
												/>
											))}
										</div>
									</div>
								)}

								<div className="mt-6 flex space-x-3">
									<button
										onClick={closeModals}
										className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
									>
										Schließen
									</button>
									<button
										onClick={() => {
											closeModals()
											handleContact(selectedDog)
										}}
										className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
									>
										Kontakt aufnehmen
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Kontakt Modal */}
				{showContactModal && selectedDog && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
							<div className="mt-3">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-medium text-gray-900">
										Kontakt: {selectedDog.owner}
									</h3>
									<button
										onClick={closeModals}
										className="text-gray-400 hover:text-gray-600"
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Hund
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700 font-medium">{selectedDog.name}</span>
											<div className="text-xs text-gray-500 mt-1">{selectedDog.pedigreeNumber}</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Besitzer
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700">{selectedDog.owner}</span>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Standort
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700">{selectedDog.location}</span>
											<div className="text-xs text-gray-500 mt-1">PLZ: {selectedDog.plz}</div>
										</div>
									</div>

									{(() => {
										const dogType = getDogType(selectedDog)
										if (!dogType) return null

										return (
											<div className={`p-3 border rounded-md ${dogType.color === 'green' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'}`}>
												<div className="flex items-center">
													<span className="mr-2">{dogType.icon}</span>
													<span className={`text-sm font-medium ${dogType.color === 'green' ? 'text-green-800' : 'text-purple-800'}`}>
														{dogType.type === 'stud' ? 'Dieser Hund ist als Deckrüde verfügbar' : 'Diese Hündin ist für die Zucht geeignet'}
													</span>
												</div>
											</div>
										)
									})()}
								</div>

								<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
									<h4 className="text-sm font-medium text-blue-800 mb-2">Kontaktinformationen</h4>
									<p className="text-sm text-blue-700">
										Für weitere Informationen und Kontaktaufnahme wenden Sie sich bitte direkt an den HZD
										oder nutzen Sie die offiziellen Kanäle des Züchters.
									</p>
								</div>

								<div className="mt-6 flex space-x-3">
									<button
										onClick={closeModals}
										className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
									>
										Schließen
									</button>
									<button
										onClick={() => {
											closeModals()
											showToastMessage('Kontaktanfrage wurde gesendet!')
										}}
										className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
									>
										Kontakt anfragen
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
