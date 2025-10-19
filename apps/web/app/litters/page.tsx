'use client'

import { useState, useRef, useEffect } from 'react'
import { formatDate } from '../../../../packages/shared/src/utils'

// Map-Komponente für Würfe
function SimpleMap({ litters }: { litters: any[] }) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const [isClient, setIsClient] = useState(false)

	// PLZ-basierte Koordinaten-Lookup
	const getCoordinatesByLocation = (location: string) => {
		const locationCoordinates: { [key: string]: [number, number] } = {
			// München
			'München': [48.1351, 11.5820],
			'München, Bayern': [48.1351, 11.5820],
			// Hamburg
			'Hamburg': [53.5511, 9.9937],
			'Hamburg, Hamburg': [53.5511, 9.9937],
			// Köln
			'Köln': [50.9375, 6.9603],
			'Köln, Nordrhein-Westfalen': [50.9375, 6.9603],
			// Stuttgart
			'Stuttgart': [48.7758, 9.1829],
			'Stuttgart, Baden-Württemberg': [48.7758, 9.1829],
			// Berlin
			'Berlin': [52.5200, 13.4050],
			'Berlin, Berlin': [52.5200, 13.4050],
			// Frankfurt
			'Frankfurt': [50.1109, 8.6821],
			'Frankfurt, Hessen': [50.1109, 8.6821],
			// Düsseldorf
			'Düsseldorf': [51.2277, 6.7735],
			'Düsseldorf, Nordrhein-Westfalen': [51.2277, 6.7735],
			// Leipzig
			'Leipzig': [51.3397, 12.3731],
			'Leipzig, Sachsen': [51.3397, 12.3731],
			// Dresden
			'Dresden': [51.0504, 13.7373],
			'Dresden, Sachsen': [51.0504, 13.7373],
			// Nürnberg
			'Nürnberg': [49.4521, 11.0767],
			'Nürnberg, Bayern': [49.4521, 11.0767],
			// Bremen
			'Bremen': [53.0793, 8.8017],
			'Bremen, Bremen': [53.0793, 8.8017],
			// Hannover
			'Hannover': [52.3759, 9.7320],
			'Hannover, Niedersachsen': [52.3759, 9.7320],
		}
		return locationCoordinates[location] || [51.1657, 10.4515] // Deutschland-Zentrum als Fallback
	}

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

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
					litters.forEach((litter) => {
						const coordinates = getCoordinatesByLocation(litter.location)

						// Custom Icon für Marker erstellen (30x30px)
						const customIcon = L.divIcon({
							className: 'custom-marker',
							html: `<div style="
								width: 30px;
								height: 30px;
								background-color: ${litter.status === 'Verfügbar' ? '#10b981' : litter.status === 'Geplant' ? '#3b82f6' : '#6b7280'};
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
								<h3 style="margin: 0 0 8px 0; font-weight: bold;">Wurf ${litter.litterNumber}</h3>
								<p style="margin: 2px 0;"><strong>Züchter:</strong> ${litter.breeder}${litter.breederKennelName ? '<br><em style="font-size: 0.9em; color: #666;">' + litter.breederKennelName + '</em>' : ''}</p>
								<p style="margin: 2px 0;"><strong>Standort:</strong> ${litter.location}</p>
								<p style="margin: 2px 0;"><strong>Status:</strong> ${litter.status}</p>
								<p style="margin: 2px 0;"><strong>Mutter:</strong> ${litter.mother}</p>
								<p style="margin: 2px 0;"><strong>Vater:</strong> ${litter.father}</p>
								<p style="margin: 2px 0;"><strong>Geburtsdatum:</strong> ${formatDate(new Date(litter.actualDate || litter.expectedDate))}</p>
								<p style="margin: 2px 0;"><strong>Preis:</strong> ${litter.price}</p>
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
	}, [litters, isClient])

	if (!isClient) {
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

export default function LittersPage() {
	const [selectedLitter, setSelectedLitter] = useState<any>(null)
	const [showDetailsModal, setShowDetailsModal] = useState(false)
	const [showPedigreeModal, setShowPedigreeModal] = useState(false)
	const [showContactModal, setShowContactModal] = useState(false)
	const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

	// Handler-Funktionen für Buttons
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

	// Mock-Daten für Würfe
	const litters = [
		{
			id: 1,
			litterNumber: 'W-2024-001',
			mother: 'Bella vom Schwarzen Wald',
			father: 'Thor von der Eifel',
			breeder: 'Max Mustermann',
			breederKennelName: 'vom Schwarzen Wald',
			location: 'München, Bayern',
			status: 'Verfügbar',
			expectedDate: '2024-06-15',
			actualDate: '2024-06-12',
			expectedPuppies: 6,
			actualPuppies: 5,
			availablePuppies: 3,
			puppyColors: { 
				'Schwarz': { born: 2, available: 1 }, 
				'Blond': { born: 2, available: 1 }, 
				'Schwarzmarken': { born: 1, available: 1 } 
			}, // Welpenfarben mit geboren/verfügbar
			av: 8.5, // Ahnenverlustkoeffizient in %
			iz: 3.2, // Inzuchtkoeffizient in %
			price: '€1.200',
			description: 'Wunderschöner Wurf aus bewährter Zuchtlinie. Beide Elterntiere sind HD/ED-frei und haben ausgezeichnete Wesensmerkmale.',
			contact: 'max.mustermann@email.de',
			phone: '+49 89 12345678',
			website: 'https://www.hovawart-muenchen.de/wurf-2024-001',
			imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			// Hund-IDs für Verlinkung
			motherId: 'dog-mother-1',
			fatherId: 'dog-father-1',
			// Besitzer-Informationen für Mutter und Vater
			motherOwner: {
				name: 'Lisa Müller',
				id: 'owner-mother-1',
				imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
			},
			fatherOwner: {
				name: 'Hans Schmidt',
				id: 'owner-father-1',
				imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
			},
			// Züchter-Informationen für Mutter und Vater
			motherBreeder: {
				name: 'Anna Schmidt',
				id: 'breeder-mother-1',
				imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
				kennelName: 'vom Schwarzen Wald'
			},
			fatherBreeder: {
				name: 'Peter Weber',
				id: 'breeder-father-1',
				imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
				kennelName: 'von der Eifel'
			},
			// Hauptbilder der Elterntiere
			motherImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face',
			fatherImageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=face',
			// Auszeichnungen der Elterntiere
			motherAwards: [
				{ code: 'V1', description: 'Vielseitigkeitsprüfung 1', date: '2023-05-15', issuer: 'HZD' },
				{ code: 'BH', description: 'Begleithundeprüfung', date: '2022-08-20', issuer: 'HZD' },
				{ code: 'IPO1', description: 'IPO 1', date: '2023-09-10', issuer: 'HZD' }
			],
			fatherAwards: [
				{ code: 'V2', description: 'Vielseitigkeitsprüfung 2', date: '2023-07-22', issuer: 'HZD' },
				{ code: 'IPO2', description: 'IPO 2', date: '2023-11-05', issuer: 'HZD' },
				{ code: 'FH', description: 'Fährtenhundeprüfung', date: '2022-12-03', issuer: 'HZD' }
			],
		},
		{
			id: 2,
			litterNumber: 'W-2024-002',
			mother: 'Luna aus dem Harz',
			father: 'Rex vom Bodensee',
			breeder: 'Anna Schmidt',
			breederKennelName: 'aus dem Harz',
			location: 'Hamburg, Hamburg',
			status: 'Geplant',
			expectedDate: '2024-08-20',
			actualDate: null,
			expectedPuppies: 7,
			actualPuppies: null,
			availablePuppies: 0,
			puppyColors: null, // Welpenfarben
			av: 12.3, // Ahnenverlustkoeffizient in %
			iz: 4.7, // Inzuchtkoeffizient in %
			price: '€1.100',
			description: 'Geplanter Wurf für Herbst 2024. Mutter ist eine sehr ruhige und ausgeglichene Hündin, Vater ist ein erfahrener Deckrüde.',
			contact: 'anna.schmidt@email.de',
			phone: '+49 40 87654321',
			website: 'https://www.hovawart-hamburg.de/geplanter-wurf-2024',
			imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
			// Hund-IDs für Verlinkung
			motherId: 'dog-mother-2',
			fatherId: 'dog-father-2',
			// Besitzer-Informationen für Mutter und Vater
			motherOwner: {
				name: 'Sabine Klein',
				id: 'owner-mother-2',
				imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
			},
			fatherOwner: {
				name: 'Michael Bauer',
				id: 'owner-father-2',
				imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
			},
			// Züchter-Informationen für Mutter und Vater
			motherBreeder: {
				name: 'Maria Fischer',
				id: 'breeder-mother-2',
				imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
				kennelName: 'aus dem Harz'
			},
			fatherBreeder: {
				name: 'Thomas Müller',
				id: 'breeder-father-2',
				imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
				kennelName: 'vom Bodensee'
			},
			// Hauptbilder der Elterntiere
			motherImageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=face',
			fatherImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face',
			// Auszeichnungen der Elterntiere
			motherAwards: [
				{ code: 'BH', description: 'Begleithundeprüfung', date: '2022-06-15', issuer: 'HZD' },
				{ code: 'IPO1', description: 'IPO 1', date: '2023-03-20', issuer: 'HZD' }
			],
			fatherAwards: [
				{ code: 'V1', description: 'Vielseitigkeitsprüfung 1', date: '2023-04-18', issuer: 'HZD' },
				{ code: 'IPO2', description: 'IPO 2', date: '2023-08-12', issuer: 'HZD' },
				{ code: 'FH', description: 'Fährtenhundeprüfung', date: '2022-10-25', issuer: 'HZD' }
			],
		},
		{
			id: 3,
			litterNumber: 'W-2024-003',
			mother: 'Nala von der Mosel',
			father: 'Zeus aus dem Schwarzwald',
			breeder: 'Peter Weber',
			breederKennelName: 'von der Mosel',
			location: 'Köln, Nordrhein-Westfalen',
			status: 'Reserviert',
			expectedDate: '2024-05-10',
			actualDate: '2024-05-08',
			expectedPuppies: 5,
			actualPuppies: 6,
			availablePuppies: 0,
			puppyColors: { 
				'Schwarzmarken': { born: 4, available: 0 }, 
				'Blond': { born: 2, available: 0 } 
			}, // Welpenfarben mit geboren/verfügbar
			av: 6.8, // Ahnenverlustkoeffizient in %
			iz: 2.1, // Inzuchtkoeffizient in %
			price: '€1.300',
			description: 'Alle Welpen sind bereits reserviert. Wurf ist geboren und entwickelt sich prächtig.',
			contact: 'peter.weber@email.de',
			phone: '+49 221 11223344',
			website: 'https://www.hovawart-koeln.de/wurf-2024-003',
			imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			// Hund-IDs für Verlinkung
			motherId: 'dog-mother-3',
			fatherId: 'dog-father-3',
			// Besitzer-Informationen für Mutter und Vater
			motherOwner: {
				name: 'Claudia Wagner',
				id: 'owner-mother-3',
				imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
			},
			fatherOwner: {
				name: 'Andreas Richter',
				id: 'owner-father-3',
				imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
			},
			// Züchter-Informationen für Mutter und Vater
			motherBreeder: {
				name: 'Sabine Klein',
				id: 'breeder-mother-3',
				imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
				kennelName: 'von der Mosel'
			},
			fatherBreeder: {
				name: 'Michael Bauer',
				id: 'breeder-father-3',
				imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
				kennelName: 'aus dem Schwarzwald'
			},
			// Hauptbilder der Elterntiere
			motherImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face',
			fatherImageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=face',
			// Auszeichnungen der Elterntiere
			motherAwards: [
				{ code: 'V1', description: 'Vielseitigkeitsprüfung 1', date: '2023-02-14', issuer: 'HZD' },
				{ code: 'BH', description: 'Begleithundeprüfung', date: '2022-05-10', issuer: 'HZD' },
				{ code: 'IPO1', description: 'IPO 1', date: '2023-06-08', issuer: 'HZD' }
			],
			fatherAwards: [
				{ code: 'V2', description: 'Vielseitigkeitsprüfung 2', date: '2023-09-15', issuer: 'HZD' },
				{ code: 'IPO3', description: 'IPO 3', date: '2023-12-02', issuer: 'HZD' },
				{ code: 'FH', description: 'Fährtenhundeprüfung', date: '2022-11-18', issuer: 'HZD' }
			],
		},
		{
			id: 4,
			litterNumber: 'W-2024-004',
			mother: 'Maya vom Neckar',
			father: 'Apollo aus dem Odenwald',
			breeder: 'Maria Fischer',
			breederKennelName: 'vom Neckar',
			location: 'Stuttgart, Baden-Württemberg',
			status: 'Verfügbar',
			expectedDate: '2024-07-30',
			actualDate: '2024-07-28',
			expectedPuppies: 6,
			actualPuppies: 4,
			availablePuppies: 2,
			puppyColors: { 
				'Schwarz': { born: 3, available: 1 }, 
				'Schwarzmarken': { born: 1, available: 1 } 
			}, // Welpenfarben mit geboren/verfügbar
			av: 9.7, // Ahnenverlustkoeffizient in %
			iz: 3.8, // Inzuchtkoeffizient in %
			price: '€1.150',
			description: 'Kleiner aber feiner Wurf. Beide Elterntiere stammen aus Arbeitslinien und haben ausgezeichnete Arbeitsleistungen.',
			contact: 'maria.fischer@email.de',
			phone: '+49 711 55667788',
			website: 'https://www.hovawart-stuttgart.de/wurf-2024-004',
			imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
			// Hund-IDs für Verlinkung
			motherId: 'dog-mother-4',
			fatherId: 'dog-father-4',
			// Besitzer-Informationen für Mutter und Vater
			motherOwner: {
				name: 'Petra Hoffmann',
				id: 'owner-mother-4',
				imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
			},
			fatherOwner: {
				name: 'Stefan Neumann',
				id: 'owner-father-4',
				imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
			},
			// Züchter-Informationen für Mutter und Vater
			motherBreeder: {
				name: 'Claudia Wagner',
				id: 'breeder-mother-4',
				imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
				kennelName: 'vom Neckar'
			},
			fatherBreeder: {
				name: 'Andreas Richter',
				id: 'breeder-father-4',
				imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
				kennelName: 'aus dem Odenwald'
			},
			// Hauptbilder der Elterntiere
			motherImageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop&crop=face',
			fatherImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face',
			// Auszeichnungen der Elterntiere
			motherAwards: [
				{ code: 'BH', description: 'Begleithundeprüfung', date: '2022-07-12', issuer: 'HZD' },
				{ code: 'IPO1', description: 'IPO 1', date: '2023-01-25', issuer: 'HZD' }
			],
			fatherAwards: [
				{ code: 'V1', description: 'Vielseitigkeitsprüfung 1', date: '2023-03-08', issuer: 'HZD' },
				{ code: 'IPO2', description: 'IPO 2', date: '2023-07-20', issuer: 'HZD' },
				{ code: 'FH', description: 'Fährtenhundeprüfung', date: '2022-09-14', issuer: 'HZD' }
			],
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
						<button 
							onClick={() => setViewMode('list')}
							className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
								viewMode === 'list'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
								viewMode === 'map'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
							</svg>
							Karte
						</button>
					</div>
				</div>

				{/* Listenansicht */}
				{viewMode === 'list' && litters.map((litter) => (
					<div key={litter.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-start space-x-4">
									{/* Wurf-Bild */}
									{litter.imageUrl && (
										<div className="flex-shrink-0">
											<img 
												src={litter.imageUrl} 
												alt={`Wurf ${litter.litterNumber}`}
												className="w-20 h-20 object-cover rounded-lg border border-gray-200"
											/>
										</div>
									)}
									<div>
										<div className="flex items-center space-x-2 mb-1">
											<h3 className="text-xl font-semibold text-gray-900">
												Wurf {litter.litterNumber}
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
									<span className="text-lg font-semibold text-gray-900">
										{litter.price}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
								<div className="space-y-6">
									{/* Elterntiere */}
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

									{/* Züchter */}
									<div>
										<h4 className="font-medium text-gray-900 mb-2">Züchter</h4>
										<div className="text-gray-600">
											<p>{litter.breeder}</p>
											{litter.breederKennelName && (
												<p className="text-sm text-gray-500 italic">
													{litter.breederKennelName}
												</p>
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

								{/* Welpen & Genetik */}
								<div>
									<h4 className="font-medium text-gray-900 mb-2">Welpen & Genetik</h4>
									
									{/* Welpen- und Genetik-Werte nur für BORN, RESERVED, AVAILABLE, SOLD */}
									{['Verfügbar', 'Reserviert', 'Verkauft', 'Geboren'].includes(litter.status) ? (
										<>
											{/* Welpenfarben - nur für BORN/RESERVED/SOLD */}
											{litter.puppyColors && ['Verfügbar', 'Reserviert', 'Verkauft'].includes(litter.status) ? (
												<div className="space-y-3 mb-3">
													{Object.entries(litter.puppyColors).map(([color, data]) => (
														<div key={color} className="p-3 bg-gray-50 rounded-lg border">
															<div className="text-sm font-medium text-gray-700 mb-2">{color}</div>
															<div className="grid grid-cols-2 gap-3">
																<div className="text-center">
																	<div className="text-lg font-bold text-blue-600">{data.born}</div>
																	<div className="text-xs text-gray-600">Geboren</div>
																</div>
																<div className="text-center">
																	<div className="text-lg font-bold text-green-600">{data.available}</div>
																	<div className="text-xs text-gray-600">Verfügbar</div>
																</div>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="grid grid-cols-2 gap-4 text-center mb-3">
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
												</div>
											)}
											
											{/* AV/IZ-Werte */}
											<div className="grid grid-cols-2 gap-4 text-center">
												<div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
													<div className="text-lg font-bold text-blue-700">
														{litter.av}%
													</div>
													<div className="text-xs text-blue-600">AV</div>
												</div>
												<div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
													<div className="text-lg font-bold text-purple-700">
														{litter.iz}%
													</div>
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
								<p className="text-gray-600 text-sm leading-relaxed">
									{litter.description}
								</p>
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

				{/* Kartenansicht */}
				{viewMode === 'map' && (
					<div className="bg-white shadow-lg rounded-xl overflow-hidden">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center">
								<svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">Wurf-Standorte</h3>
									<p className="text-sm text-gray-600">
										{litters.length} Würfe auf der Karte
									</p>
								</div>
							</div>
						</div>
						<SimpleMap litters={litters} />
						<div className="p-4 bg-gray-50 border-t border-gray-200">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
								<div className="flex items-center space-x-6">
									<div className="flex items-center">
										<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
										<span className="text-sm font-medium text-gray-700">Verfügbar</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
										<span className="text-sm font-medium text-gray-700">Geplant</span>
									</div>
									<div className="flex items-center">
										<div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
										<span className="text-sm font-medium text-gray-700">Andere</span>
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

			{/* Details Modal */}
			{showDetailsModal && selectedLitter && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-gray-900">
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
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Standort</h3>
									<p className="text-gray-600">{selectedLitter.location}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Status</h3>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLitter.status)}`}>
										{selectedLitter.status}
									</span>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Preis</h3>
									<p className="text-gray-600">{selectedLitter.price}</p>
								</div>
							</div>

							{selectedLitter.website && (
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
							)}

							<div>
								<h3 className="font-medium text-gray-900">Beschreibung</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{selectedLitter.description}
								</p>
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

			{/* Pedigree Modal */}
			{showPedigreeModal && selectedLitter && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-gray-900">
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
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<h3 className="font-medium text-blue-900">Wurf {selectedLitter.litterNumber}</h3>
									<p className="text-sm text-blue-700">Geboren: {formatDate(new Date(selectedLitter.actualDate || selectedLitter.expectedDate))}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-8">
								{/* Mutter */}
								<div className="text-center">
									<div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
										<h4 className="font-medium text-pink-900 mb-3">Mutter</h4>
										
										{/* Hauptbild der Mutter */}
										{selectedLitter.motherImageUrl && (
											<div className="mb-4">
												<img 
													src={selectedLitter.motherImageUrl} 
													alt={selectedLitter.mother}
													className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-pink-200 shadow-sm"
												/>
											</div>
										)}
										
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
															title={`${award.description} - ${formatDate(new Date(award.date))} - ${award.issuer}`}
														>
															{award.code}
														</span>
													))}
												</div>
											</div>
										)}
										
										{/* Besitzer der Mutter */}
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
													<span className="text-sm text-pink-600">Besitzer:</span>
													<a 
														href={`/owners/${selectedLitter.motherOwner.id}`}
														className="text-sm text-pink-700 hover:text-pink-800 hover:underline font-medium"
													>
														{selectedLitter.motherOwner.name}
													</a>
												</div>
											</div>
										)}
										
										{/* Züchter der Mutter */}
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
													<span className="text-sm text-pink-600">Züchter:</span>
													<div className="flex flex-col">
														<a 
															href={`/breeders/${selectedLitter.motherBreeder.id}`}
															className="text-sm text-pink-700 hover:text-pink-800 hover:underline font-medium"
														>
															{selectedLitter.motherBreeder.name}
														</a>
														{selectedLitter.motherBreeder.kennelName && (
															<span className="text-xs text-pink-600 italic">
																{selectedLitter.motherBreeder.kennelName}
															</span>
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
										{selectedLitter.fatherImageUrl && (
											<div className="mb-4">
												<img 
													src={selectedLitter.fatherImageUrl} 
													alt={selectedLitter.father}
													className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-blue-200 shadow-sm"
												/>
											</div>
										)}
										
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
															title={`${award.description} - ${formatDate(new Date(award.date))} - ${award.issuer}`}
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
										
										{/* Züchter des Vaters */}
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
															<span className="text-xs text-blue-600 italic">
																{selectedLitter.fatherBreeder.kennelName}
															</span>
														)}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="text-center text-sm text-gray-500">
								<p>Detaillierte Abstammungsinformationen werden in der vollständigen Version verfügbar sein.</p>
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

			{/* Contact Modal */}
			{showContactModal && selectedLitter && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-gray-900">
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
								<h3 className="font-medium text-gray-900">Wurf {selectedLitter.litterNumber}</h3>
								<div className="text-sm text-gray-600">
									<p>Züchter: {selectedLitter.breeder}</p>
									{selectedLitter.breederKennelName && (
										<p className="text-xs text-gray-500 italic ml-2">
											{selectedLitter.breederKennelName}
										</p>
									)}
								</div>
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

							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
								<p className="text-sm text-yellow-800">
									<strong>Hinweis:</strong> Bitte informieren Sie sich vor dem Kauf über die Verantwortung der Hundehaltung und besuchen Sie die Welpen persönlich.
								</p>
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
		</div>
	)
}
