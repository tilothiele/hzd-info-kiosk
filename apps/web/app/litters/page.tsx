'use client'

import { useState, useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { formatDate } from '../../../../packages/shared/src/utils'

// Status-Farben für Würfe
const getStatusColor = (status: string) => {
	switch (status) {
		case 'PLANNED':
			return 'bg-yellow-100 text-yellow-800'
		case 'BORN':
			return 'bg-green-100 text-green-800'
		case 'RESERVED':
			return 'bg-blue-100 text-blue-800'
		case 'AVAILABLE':
			return 'bg-green-100 text-green-800'
		case 'SOLD':
			return 'bg-gray-100 text-gray-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

// Map-Komponente für Würfe
function SimpleMap({ litters }: { litters: any[] }) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const markersLayerRef = useRef<any>(null)
	const [isClient, setIsClient] = useState(false)

    const extractPostalCode = (text?: string): string | null => {
        if (!text) return null
        const match = text.match(/\b\d{5}\b/)
        return match ? match[0] : null
    }

    const geocodeByPostalAndCity = async (postalCode?: string, city?: string): Promise<[number, number] | null> => {
        try {
            let query = 'country=Germany'
            if (postalCode) query += `&postalcode=${encodeURIComponent(postalCode)}`
            if (city) query += `&city=${encodeURIComponent(city)}`
            const url = `https://nominatim.openstreetmap.org/search?${query}&format=json&limit=1`
            const res = await fetch(url, { headers: { 'Accept-Language': 'de' } })
            const data = await res.json()
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
            }
            return null
        } catch (e) {
            console.error('Geocoding error (litters map):', e)
            return null
        }
    }

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient || !mapRef.current) return

		const setup = async () => {
			const L = (await import('leaflet')).default

			// Map nur einmal initialisieren
			if (!mapInstanceRef.current && mapRef.current) {
				// evtl. Marker vom Container entfernen
				if ((mapRef.current as any)?._leaflet_id) {
					(mapRef.current as any)._leaflet_id = null
				}
				mapInstanceRef.current = L.map(mapRef.current as unknown as HTMLElement).setView([51.1657, 10.4515], 6)
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '© OpenStreetMap contributors'
				}).addTo(mapInstanceRef.current)
				markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)
			}

			// Marker aktualisieren
			if (!litters.length || !markersLayerRef.current) return
			markersLayerRef.current.clearLayers()
			const b = L.latLngBounds([])
			for (const litter of litters) {
				const parts = (litter.location || '').split(',')
				const city = (litter.breederCity || parts[0]?.trim()) as string | undefined
				const postal = (litter.breederPostalCode || extractPostalCode(litter.location)) as string | undefined
				const coords = await geocodeByPostalAndCity(postal, city) || [51.1657, 10.4515]
				const hasAvailable = (litter.availablePuppies || 0) > 0
				const isPlanned = String(litter.status).toUpperCase() === 'PLANNED'
				const isBorn = String(litter.status).toUpperCase() === 'BORN' || String(litter.status).toUpperCase() === 'AVAILABLE'
				const color = isPlanned ? '#2563eb' : (isBorn && hasAvailable ? '#10b981' : '#9ca3af')
				const fill = isPlanned ? '#3b82f6' : (isBorn && hasAvailable ? '#34d399' : '#9ca3af')
				const marker = L.circleMarker(coords as any, { radius: 7, color, weight: 2, fillColor: fill, fillOpacity: 0.9 })
					.bindPopup(`
						<div class="p-2">
							<h3 class="font-semibold text-gray-900 mb-1">Wurf ${litter.litterNumber}</h3>
							<p class="text-sm text-gray-600 mb-1">${litter.litterSequence}</p>
							<p class="text-sm text-gray-600 mb-1">${litter.mother} × ${litter.father}</p>
							<p class="text-sm text-gray-600 mb-1">Züchter: ${litter.breeder}</p>
							${litter.breederKennelName ? `<p class="text-sm text-gray-500 italic">${litter.breederKennelName}</p>` : ''}
							<p class="text-sm text-gray-600">${litter.location}</p>
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(litter.status)}">${litter.status}</span>
						</div>
					`)
				marker.addTo(markersLayerRef.current)
				b.extend(coords as any)
			}
			if (b.isValid()) {
				mapInstanceRef.current.fitBounds(b.pad(0.1))
			} else {
				mapInstanceRef.current.setView([51.1657, 10.4515], 6)
			}
		}

		setup()
	}, [isClient, litters])

	if (!isClient) {
		return (
			<div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
				<div className="text-center text-gray-500">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<p>Karte wird geladen...</p>
				</div>
			</div>
		)
	}

	return <div ref={mapRef} className="h-96 rounded-lg border border-gray-200" />
}

export default function LittersPage() {
	const [litters, setLitters] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedLitter, setSelectedLitter] = useState<any>(null)
	const [showDetailsModal, setShowDetailsModal] = useState(false)
	const [showPedigreeModal, setShowPedigreeModal] = useState(false)
	const [showContactModal, setShowContactModal] = useState(false)
	const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
	
	// Filter State
	const [selectedBreeder, setSelectedBreeder] = useState('')
	const [selectedStatus, setSelectedStatus] = useState('')
	const [selectedPostalCode, setSelectedPostalCode] = useState('')
	const [selectedDate, setSelectedDate] = useState('')

	// Hilfsfunktion zum Extrahieren der PLZ
	const extractPostalCode = (text?: string): string | null => {
		if (!text) return null
		const match = text.match(/\b\d{5}\b/)
		return match ? match[0] : null
	}

	// Daten von der API laden
	useEffect(() => {
		const fetchLitters = async () => {
			try {
				const apiUrl = 'http://localhost:3001'
				const response = await fetch(`${apiUrl}/api/litters`)
				if (response.ok) {
					const data = await response.json()
					setLitters(data)
				} else {
					setError('Fehler beim Laden der Würfe')
				}
			} catch (error) {
				setError('Fehler beim Laden der Würfe')
				console.error('Fehler beim Laden der Würfe:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchLitters()
	}, [])

	// Alle verfügbaren Züchter aus den Daten extrahieren
	const availableBreeders = Array.from(new Set(litters.map(litter => litter.breeder))).sort()

	// Filterlogik
	const filteredLitters = litters.filter(litter => {
		// Züchter-Filter
		if (selectedBreeder && litter.breeder !== selectedBreeder) {
			return false
		}
		
		// Status-Filter
		if (selectedStatus) {
			const statusMap: Record<string, string> = {
				'geplant': 'PLANNED',
				'geboren': 'BORN',
				'geschlossen': 'CLOSED',
				'abgebrochen': 'CANCELLED'
			}
			const expectedStatus = statusMap[selectedStatus]
			if (expectedStatus && litter.status !== expectedStatus) {
				return false
			}
		}
		
		// PLZ-Filter
		if (selectedPostalCode) {
			const postalCode = extractPostalCode(litter.location)
			if (postalCode) {
				const postalCodeNum = parseInt(postalCode)
				const range = selectedPostalCode.split('..')
				const min = parseInt(range[0])
				const max = parseInt(range[1])
				if (postalCodeNum < min || postalCodeNum > max) {
					return false
				}
			} else {
				return false
			}
		}
		
		// Datum-Filter
		if (selectedDate) {
			const litterDate = litter.actualDate || litter.expectedDate
			if (litterDate && !litterDate.includes(selectedDate)) {
				return false
			}
		}
		
		return true
	})

	// Filter zurücksetzen
	const resetFilters = () => {
		setSelectedBreeder('')
		setSelectedStatus('')
		setSelectedPostalCode('')
		setSelectedDate('')
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Geboren':
			case 'BORN':
				return 'bg-green-100 text-green-800'
			case 'Geplant':
			case 'PLANNED':
				return 'bg-blue-100 text-blue-800'
			case 'Geschlossen':
			case 'CLOSED':
				return 'bg-gray-100 text-gray-800'
			case 'Abgebrochen':
			case 'CANCELLED':
				return 'bg-red-100 text-red-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const handleShowDetails = (litter: any) => {
		setSelectedLitter(litter)
		setShowDetailsModal(true)
	}

	const handleShowPedigree = (litter: any) => {
		setSelectedLitter(litter)
		setShowPedigreeModal(true)
	}

	const handleContact = (litter: any) => {
		setSelectedLitter(litter)
		setShowContactModal(true)
	}

	const closeModal = () => {
		setShowDetailsModal(false)
		setShowPedigreeModal(false)
		setShowContactModal(false)
		setSelectedLitter(null)
	}

	if (loading) {
		return (
			<div className="px-4 py-6 sm:px-0">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Hovawart-Würfe</h1>
					<p className="text-lg text-gray-600">Informationen zu geplanten, verfügbaren und vergangenen Würfen</p>
				</div>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Würfe werden geladen...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="px-4 py-6 sm:px-0">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Hovawart-Würfe</h1>
					<p className="text-lg text-gray-600">Informationen zu geplanten, verfügbaren und vergangenen Würfen</p>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-lg p-6">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">Fehler beim Laden der Daten</h3>
							<div className="mt-2 text-sm text-red-700">
								<p>{error}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">Hovawart-Würfe</h1>
				<p className="text-lg text-gray-600">Informationen zu geplanten, verfügbaren und vergangenen Würfen</p>
			</div>

			{/* Filter */}
			<div className="bg-white shadow rounded-lg p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
						<select 
							id="status" 
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="geplant">Geplant</option>
							<option value="geboren">Geboren</option>
							<option value="geschlossen">Geschlossen</option>
							<option value="abgebrochen">Abgebrochen</option>
						</select>
					</div>
					<div>
						<label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">Postleitzahl</label>
						<select 
							id="postalCode" 
							value={selectedPostalCode}
							onChange={(e) => setSelectedPostalCode(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="0..9999">0..9999</option>
							<option value="10000..19999">10000..19999</option>
							<option value="20000..29999">20000..29999</option>
							<option value="30000..39999">30000..39999</option>
							<option value="40000..49999">40000..49999</option>
							<option value="50000..59999">50000..59999</option>
							<option value="60000..69999">60000..69999</option>
							<option value="70000..79999">70000..79999</option>
							<option value="80000..89999">80000..89999</option>
							<option value="90000..99999">90000..99999</option>
						</select>
					</div>
					<div>
						<label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Zeitraum</label>
						<select 
							id="date" 
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="2024">2024</option>
							<option value="2023">2023</option>
							<option value="2022">2022</option>
						</select>
					</div>
					<div>
						<label htmlFor="breeder" className="block text-sm font-medium text-gray-700 mb-2">Züchter/Zwinger</label>
						<select
							id="breeder"
							value={selectedBreeder}
							onChange={(e) => setSelectedBreeder(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							{availableBreeders.map((breeder) => (
								<option key={breeder} value={breeder}>
									{breeder}
								</option>
							))}
						</select>
					</div>
				</div>
				
				{/* Filter-Buttons */}
				<div className="flex justify-between items-center">
					<div className="text-sm text-gray-600">
						{filteredLitters.length} von {litters.length} Würfen gefunden
					</div>
					<div className="flex space-x-3">
						<button
							onClick={resetFilters}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
						>
							Filter zurücksetzen
						</button>
						<button
							onClick={() => {}} // Filter werden automatisch angewendet
							className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
						>
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							Suche
						</button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-gray-900">Würfe ({filteredLitters.length} gefunden)</h2>
					<div className="flex space-x-2">
						<button
							onClick={() => setViewMode('list')}
							className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
								viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
							</svg>
							Liste
						</button>
						<button
							onClick={() => setViewMode('map')}
							className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
								viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
							</svg>
							Karte
						</button>
					</div>
				</div>

				{viewMode === 'list' && (
					<div className="space-y-6">
						{filteredLitters.map((litter) => (
					<div key={litter.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
										<div className="flex items-start space-x-4">
								<div>
												<div className="flex items-center space-x-2 mb-1">
													<h3 className="text-xl font-semibold text-gray-900">
										Wurf {litter.litterNumber}
														{litter.litterSequence && (
															<span className="ml-2 text-sm font-normal text-gray-600">
																({litter.litterSequence})
															</span>
														)}
									</h3>
													{/* Website-Link */}
													{litter.website && (
														<a
															href={litter.website}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-600 hover:text-blue-800 transition-colors"
															title="Zur Wurf-Website"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
															</svg>
														</a>
													)}
												</div>
									<div className="flex items-center space-x-4 text-sm text-gray-600">
										<span className="flex items-center">
											<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
														{formatDate(new Date(litter.actualDate || litter.expectedDate))}
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
								</div>
								<div className="flex flex-col items-end space-y-2">
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(litter.status)}`}>
										{litter.status}
									</span>
											<span className="text-lg font-semibold text-gray-900">€{litter.price}</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
										<div className="space-y-6">
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
												<h4 className="font-medium text-gray-900 mb-2">Züchter</h4>
												<div className="text-gray-600">
													<p>{litter.breeder}</p>
													{litter.breederKennelName && (
														<p className="text-sm text-gray-500 italic">{litter.breederKennelName}</p>
													)}
							</div>
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
										</div>
										<div>
											<h4 className="font-medium text-gray-900 mb-2">Welpen & Genetik</h4>

											{/* Welpen- und Genetik-Werte nur für BORN und CLOSED */}
											{['Geboren', 'Geschlossen', 'BORN', 'CLOSED'].includes(litter.status) ? (
												<>
													{/* Fellfarben der Welpen - Tabellarische Form */}
													<div className="mb-3">
														<div className="text-sm font-medium text-gray-700 mb-2">Welpen nach Fellfarben</div>
														<div className="overflow-hidden border border-gray-200 rounded-lg">
															<table className="min-w-full divide-y divide-gray-200">
																<thead className="bg-gray-50">
																	<tr>
																		<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fellfarbe</th>
																		<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Geworfen</th>
																		<th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Verfügbar</th>
																	</tr>
																</thead>
																<tbody className="bg-white divide-y divide-gray-200">
																	{/* Schwarzmarken */}
																	{(litter.blackmarkenBorn || litter.blackmarkenAvailable) && (
																		<tr>
																			<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
																				Schwarzmarken (SM)
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-blue-600">{litter.blackmarkenBorn || 0}</span>
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-green-600">{litter.blackmarkenAvailable || 0}</span>
																			</td>
																		</tr>
																	)}
																	
																	{/* Schwarz */}
																	{(litter.blackBorn || litter.blackAvailable) && (
																		<tr>
																			<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
																				Schwarz (S)
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-blue-600">{litter.blackBorn || 0}</span>
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-green-600">{litter.blackAvailable || 0}</span>
																			</td>
																		</tr>
																	)}
																	
																	{/* Blond */}
																	{(litter.blondBorn || litter.blondAvailable) && (
																		<tr>
																			<td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
																				Blond (B)
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-blue-600">{litter.blondBorn || 0}</span>
																			</td>
																			<td className="px-3 py-2 whitespace-nowrap text-center">
																				<span className="text-sm font-bold text-green-600">{litter.blondAvailable || 0}</span>
																			</td>
																		</tr>
																	)}
																	
																	{/* Zeile anzeigen wenn keine Fellfarben-Daten vorhanden */}
																	{!litter.blackmarkenBorn && !litter.blackmarkenAvailable && !litter.blackBorn && !litter.blackAvailable && !litter.blondBorn && !litter.blondAvailable && (
																		<tr>
																			<td colSpan={3} className="px-3 py-2 text-center text-sm text-gray-500">
																				Keine Fellfarben-Daten verfügbar
																			</td>
																		</tr>
																	)}
																</tbody>
															</table>
														</div>
													</div>

													{/* AV/IZ-Werte */}
													<div className="grid grid-cols-2 gap-4 text-center">
														<div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
															<div className="text-lg font-bold text-blue-700">{litter.av}%</div>
															<div className="text-xs text-blue-600">AV</div>
														</div>
														<div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
															<div className="text-lg font-bold text-purple-700">{litter.iz}%</div>
															<div className="text-xs text-purple-600">IZ</div>
														</div>
													</div>
												</>
											) : (
												<div className="text-center py-4 text-gray-500">
													<div className="text-sm">Welpen- und Genetik-Daten werden nach der Geburt verfügbar</div>
												</div>
											)}
								</div>
							</div>

							<div className="mb-6">
								<h4 className="font-medium text-gray-900 mb-2">Beschreibung</h4>
										<p className="text-gray-600 text-sm leading-relaxed">{litter.description}</p>
							</div>

							<div className="flex space-x-3">
										<button
											onClick={() => handleShowDetails(litter)}
											className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
										>
									Details anzeigen
								</button>
										<button
											onClick={() => handleShowPedigree(litter)}
											className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
										>
									Abstammung anzeigen
								</button>
								{litter.availablePuppies > 0 && (
											<button
												onClick={() => handleContact(litter)}
												className="flex-1 border border-green-300 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition-colors duration-200"
											>
										Kontakt aufnehmen
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
				)}

				{viewMode === 'map' && (
					<div className="space-y-4">
						<div className="text-center text-gray-600">
							{filteredLitters.length} Würfe auf der Karte
						</div>
						<SimpleMap litters={filteredLitters} />
						{/* Legende */}
						<div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
							<div className="flex items-center">
								<span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10b981' }}></span>
								<span>Welpen geboren & verfügbar</span>
							</div>
							<div className="flex items-center">
								<span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#2563eb' }}></span>
								<span>Wurf geplant</span>
							</div>
							<div className="flex items-center">
								<span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#9ca3af' }}></span>
								<span>Sonstige</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Details Modal */}
			{showDetailsModal && selectedLitter && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Details - Wurf {selectedLitter.litterNumber}
							</h2>
							<button
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Hauptbild */}
						{selectedLitter.imageUrl && (
							<div className="mb-6">
								<img
									src={selectedLitter.imageUrl}
									alt={`Wurf ${selectedLitter.litterNumber}`}
									className="w-full h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
								/>
							</div>
						)}

						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Wurfnummer</h3>
									<p className="text-gray-600">{selectedLitter.litterNumber}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Wurffolge</h3>
									<p className="text-gray-600">{selectedLitter.litterSequence}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Mutter</h3>
									<p className="text-gray-600">{selectedLitter.mother}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Vater</h3>
									<p className="text-gray-600">{selectedLitter.father}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Züchter</h3>
									<p className="text-gray-600">{selectedLitter.breeder}</p>
									{selectedLitter.breederKennelName && (
										<p className="text-sm text-gray-500 italic">{selectedLitter.breederKennelName}</p>
									)}
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Status</h3>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLitter.status)}`}>
										{selectedLitter.status}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Erwartetes Datum</h3>
									<p className="text-gray-600">{formatDate(new Date(selectedLitter.expectedDate))}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Tatsächliches Datum</h3>
									<p className="text-gray-600">{selectedLitter.actualDate ? formatDate(new Date(selectedLitter.actualDate)) : 'Noch nicht geboren'}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Erwartete Welpen</h3>
									<p className="text-gray-600">{selectedLitter.expectedPuppies}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Tatsächliche Welpen</h3>
									<p className="text-gray-600">{selectedLitter.actualPuppies || 'Noch nicht bekannt'}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Preis</h3>
									<p className="text-gray-600">€{selectedLitter.price}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Standort</h3>
									<p className="text-gray-600">{selectedLitter.location}</p>
								</div>
							</div>

							<div>
								<h3 className="font-medium text-gray-900">Website</h3>
								<a
									href={selectedLitter.website}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800"
								>
									{selectedLitter.website}
								</a>
							</div>

							<div>
								<h3 className="font-medium text-gray-900">Beschreibung</h3>
								<p className="text-gray-600">{selectedLitter.description}</p>
							</div>
						</div>

						<div className="mt-6 flex justify-end">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
							>
								Schließen
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Abstammung Modal */}
			{showPedigreeModal && selectedLitter && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Abstammung - Wurf {selectedLitter.litterNumber}
							</h2>
							<button
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="space-y-6">
							<div className="text-center">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Elterntiere</h3>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Mutter */}
								<div className="text-center">
									<div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
										<h4 className="font-medium text-pink-900 mb-3">Mutter</h4>

										{/* Hauptbild der Mutter */}
										<div className="relative mb-4">
											{selectedLitter.motherImageUrl ? (
												<img
													src={selectedLitter.motherImageUrl}
													alt={selectedLitter.mother}
													className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-pink-200 shadow-lg"
												/>
											) : (
												<div className="w-32 h-32 rounded-full bg-pink-100 border-4 border-pink-200 shadow-lg mx-auto flex items-center justify-center">
													<svg className="w-16 h-16 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
													</svg>
												</div>
											)}
											<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-400 rounded-full border-2 border-white flex items-center justify-center">
												<span className="text-white text-xs font-bold">♀</span>
											</div>
										</div>

										{/* Hundename als Link */}
										<a
											href={`/dogs/${selectedLitter.motherId}`}
											className="text-pink-700 hover:text-pink-800 hover:underline font-medium mb-3 block"
										>
											{selectedLitter.mother}
										</a>

										{/* Auszeichnungen der Mutter */}
										{selectedLitter.motherAwards && selectedLitter.motherAwards.length > 0 && (
											<div className="mb-4">
												<div className="flex flex-wrap gap-1 justify-center">
													{selectedLitter.motherAwards.map((award: any, index: number) => (
														<span
															key={index}
															className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-200"
														>
															{award.code}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Besitzerin der Mutter (Züchterin für den aktuellen Wurf) */}
										{selectedLitter.motherOwner && (
											<div className="mb-4">
												<div className="flex items-center justify-center space-x-2">
													{selectedLitter.motherOwner.imageUrl && (
														<img
															src={selectedLitter.motherOwner.imageUrl}
															alt={selectedLitter.motherOwner.name}
															className="w-8 h-8 object-cover rounded-full border border-pink-200"
														/>
													)}
													<span className="text-sm text-pink-600">Besitzerin:</span>
													<a
														href={`/owners/${selectedLitter.motherOwner.id}`}
														className="text-sm text-pink-700 hover:text-pink-800 hover:underline font-medium"
													>
														{selectedLitter.motherOwner.name}
													</a>
												</div>
											</div>
										)}

										{/* Ursprüngliche Züchterin der Mutter */}
										{selectedLitter.motherBreeder && (
											<div className="mt-4 pt-3 border-t border-pink-200">
												<div className="flex items-center justify-center space-x-2">
													{selectedLitter.motherBreeder.imageUrl && (
														<img
															src={selectedLitter.motherBreeder.imageUrl}
															alt={selectedLitter.motherBreeder.name}
															className="w-8 h-8 object-cover rounded-full border border-pink-200"
														/>
													)}
													<span className="text-sm text-pink-600">Züchterin:</span>
													<div className="flex flex-col">
														<a
															href={`/breeders/${selectedLitter.motherBreeder.id}`}
															className="text-sm text-pink-700 hover:text-pink-800 hover:underline font-medium"
														>
															{selectedLitter.motherBreeder.name}
														</a>
														{selectedLitter.motherBreeder.kennelName && (
															<span className="text-xs text-pink-500 italic">{selectedLitter.motherBreeder.kennelName}</span>
														)}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Vater */}
								<div className="text-center">
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
										<h4 className="font-medium text-blue-900 mb-3">Vater</h4>

										{/* Hauptbild des Vaters */}
										<div className="relative mb-4">
											{selectedLitter.fatherImageUrl ? (
												<img
													src={selectedLitter.fatherImageUrl}
													alt={selectedLitter.father}
													className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-200 shadow-lg"
												/>
											) : (
												<div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-200 shadow-lg mx-auto flex items-center justify-center">
													<svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
													</svg>
												</div>
											)}
											<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
												<span className="text-white text-xs font-bold">♂</span>
											</div>
										</div>

										{/* Hundename als Link */}
										<a
											href={`/dogs/${selectedLitter.fatherId}`}
											className="text-blue-700 hover:text-blue-800 hover:underline font-medium mb-3 block"
										>
											{selectedLitter.father}
										</a>

										{/* Auszeichnungen des Vaters */}
										{selectedLitter.fatherAwards && selectedLitter.fatherAwards.length > 0 && (
											<div className="mb-4">
												<div className="flex flex-wrap gap-1 justify-center">
													{selectedLitter.fatherAwards.map((award: any, index: number) => (
														<span
															key={index}
															className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
														>
															{award.code}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Besitzer des Vaters */}
										{selectedLitter.fatherOwner && (
											<div className="mb-4">
												<div className="flex items-center justify-center space-x-2">
													{selectedLitter.fatherOwner.imageUrl && (
														<img
															src={selectedLitter.fatherOwner.imageUrl}
															alt={selectedLitter.fatherOwner.name}
															className="w-8 h-8 object-cover rounded-full border border-blue-200"
														/>
													)}
													<span className="text-sm text-blue-600">Besitzer:</span>
													<a
														href={`/owners/${selectedLitter.fatherOwner.id}`}
														className="text-sm text-blue-700 hover:text-blue-800 hover:underline font-medium"
													>
														{selectedLitter.fatherOwner.name}
													</a>
												</div>
											</div>
										)}

										{/* Ursprünglicher Züchter des Vaters (mit Zwingername) */}
										{selectedLitter.fatherBreeder && (
											<div className="mt-4 pt-3 border-t border-blue-200">
												<div className="flex items-center justify-center space-x-2">
													{selectedLitter.fatherBreeder.imageUrl && (
														<img
															src={selectedLitter.fatherBreeder.imageUrl}
															alt={selectedLitter.fatherBreeder.name}
															className="w-8 h-8 object-cover rounded-full border border-blue-200"
														/>
													)}
													<span className="text-sm text-blue-600">Züchter:</span>
													<div className="flex flex-col">
														<a
															href={`/breeders/${selectedLitter.fatherBreeder.id}`}
															className="text-sm text-blue-700 hover:text-blue-800 hover:underline font-medium"
														>
															{selectedLitter.fatherBreeder.name}
														</a>
														{selectedLitter.fatherBreeder.kennelName && (
															<span className="text-xs text-blue-500 italic">{selectedLitter.fatherBreeder.kennelName}</span>
														)}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="mt-6 flex justify-end">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
							>
								Schließen
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Kontakt Modal */}
			{showContactModal && selectedLitter && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Kontakt aufnehmen
							</h2>
							<button
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-medium text-gray-900 mb-2">Wurf {selectedLitter.litterNumber}</h3>
								<p className="text-gray-600 text-sm">{selectedLitter.description}</p>
							</div>

							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<a
										href={`mailto:${selectedLitter.contact}`}
										className="text-blue-600 hover:text-blue-800"
									>
										{selectedLitter.contact}
									</a>
								</div>

								<div className="flex items-center space-x-3">
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									<a
										href={`tel:${selectedLitter.phone}`}
										className="text-blue-600 hover:text-blue-800"
									>
										{selectedLitter.phone}
									</a>
								</div>
							</div>
						</div>

						<div className="mt-6 flex justify-end">
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
							>
								Schließen
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Hinweise */}
			<div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Wichtige Hinweise für Welpeninteressenten</h3>
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