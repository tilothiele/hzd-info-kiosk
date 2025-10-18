'use client'

import { useState, useEffect, useRef } from 'react'
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
	CalendarIcon as CalendarSolidIcon,
	MapPinIcon as MapPinSolidIcon,
} from '@heroicons/react/24/solid'

// Map-Komponente direkt integriert
function SimpleMap({ dogs }: { dogs: any[] }) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const [isClient, setIsClient] = useState(false)

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
			'70178': [48.7758, 9.1829],
			// Berlin
			'10115': [52.5200, 13.4050],
			'10117': [52.5200, 13.4050],
			// Frankfurt
			'60311': [50.1109, 8.6821],
			'60313': [50.1109, 8.6821],
			// Düsseldorf
			'40213': [51.2277, 6.7735],
			'40211': [51.2277, 6.7735],
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
			// Potsdam
			'14467': [52.3989, 13.0667],
			'14469': [52.3989, 13.0667],
			// Saarbrücken
			'66111': [49.2401, 6.9969],
			'66113': [49.2401, 6.9969],
			// Mainz
			'55116': [50.0755, 8.2375],
			'55118': [50.0755, 8.2375],
			// Wiesbaden
			'65183': [50.0826, 8.2493],
			'65185': [50.0826, 8.2493],
			// Erfurt
			'99084': [50.9848, 11.0299],
			'99086': [50.9848, 11.0299],
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
								<p style="margin: 2px 0;"><strong>Geburtsdatum:</strong> ${dog.birthDate}</p>
								<p style="margin: 2px 0;"><strong>Geschlecht:</strong> ${dog.gender}</p>
								<p style="margin: 2px 0;"><strong>Farbe:</strong> ${dog.color}</p>
								<p style="margin: 2px 0;"><strong>Zuchtbuch:</strong> ${dog.pedigreeNumber}</p>
								${dog.isStudAvailable ? '<p style="margin: 2px 0; color: green; font-weight: bold;">✓ Deckrüde verfügbar</p>' : ''}
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
	}, [dogs, isClient])

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

interface SearchFilters {
	name: string
	gender: string
	color: string
	stud: string
	healthTests: boolean
}

// Funktion zur Generierung von Mock-Daten für Hunde
const generateDogs = () => {
	const locations = [
		{ name: 'München, Bayern', plz: '80331', coords: [48.1351, 11.5820] as [number, number] },
		{ name: 'Hamburg, Hamburg', plz: '20095', coords: [53.5511, 9.9937] as [number, number] },
		{ name: 'Köln, Nordrhein-Westfalen', plz: '50667', coords: [50.9375, 6.9603] as [number, number] },
		{ name: 'Stuttgart, Baden-Württemberg', plz: '70173', coords: [48.7758, 9.1829] as [number, number] },
		{ name: 'Berlin, Berlin', plz: '10115', coords: [52.5200, 13.4050] as [number, number] },
		{ name: 'Frankfurt, Hessen', plz: '60311', coords: [50.1109, 8.6821] as [number, number] },
		{ name: 'Düsseldorf, Nordrhein-Westfalen', plz: '40213', coords: [51.2277, 6.7735] as [number, number] },
		{ name: 'Leipzig, Sachsen', plz: '04109', coords: [51.3397, 12.3731] as [number, number] },
		{ name: 'Dresden, Sachsen', plz: '01067', coords: [51.0504, 13.7373] as [number, number] },
		{ name: 'Nürnberg, Bayern', plz: '90402', coords: [49.4521, 11.0767] as [number, number] },
		{ name: 'Bremen, Bremen', plz: '28195', coords: [53.0793, 8.8017] as [number, number] },
		{ name: 'Hannover, Niedersachsen', plz: '30159', coords: [52.3759, 9.7320] as [number, number] },
		{ name: 'Kiel, Schleswig-Holstein', plz: '24103', coords: [54.3233, 10.1228] as [number, number] },
		{ name: 'Magdeburg, Sachsen-Anhalt', plz: '39104', coords: [52.1205, 11.6276] as [number, number] },
		{ name: 'Schwerin, Mecklenburg-Vorpommern', plz: '19053', coords: [53.6355, 11.4012] as [number, number] },
		{ name: 'Potsdam, Brandenburg', plz: '14467', coords: [52.3989, 13.0667] as [number, number] },
		{ name: 'Saarbrücken, Saarland', plz: '66111', coords: [49.2401, 6.9969] as [number, number] },
		{ name: 'Mainz, Rheinland-Pfalz', plz: '55116', coords: [50.0755, 8.2375] as [number, number] },
		{ name: 'Wiesbaden, Hessen', plz: '65183', coords: [50.0826, 8.2493] as [number, number] },
		{ name: 'Erfurt, Thüringen', plz: '99084', coords: [50.9848, 11.0299] as [number, number] },
		// Weitere PLZ-Bereiche für mehr Vielfalt
		{ name: 'München, Bayern', plz: '80335', coords: [48.1351, 11.5820] as [number, number] },
		{ name: 'Hamburg, Hamburg', plz: '20099', coords: [53.5511, 9.9937] as [number, number] },
		{ name: 'Köln, Nordrhein-Westfalen', plz: '50679', coords: [50.9375, 6.9603] as [number, number] },
		{ name: 'Stuttgart, Baden-Württemberg', plz: '70178', coords: [48.7758, 9.1829] as [number, number] },
		{ name: 'Berlin, Berlin', plz: '10117', coords: [52.5200, 13.4050] as [number, number] },
		{ name: 'Frankfurt, Hessen', plz: '60313', coords: [50.1109, 8.6821] as [number, number] },
		{ name: 'Düsseldorf, Nordrhein-Westfalen', plz: '40211', coords: [51.2277, 6.7735] as [number, number] },
		{ name: 'Leipzig, Sachsen', plz: '04103', coords: [51.3397, 12.3731] as [number, number] },
		{ name: 'Dresden, Sachsen', plz: '01069', coords: [51.0504, 13.7373] as [number, number] },
		{ name: 'Nürnberg, Bayern', plz: '90403', coords: [49.4521, 11.0767] as [number, number] },
		{ name: 'Bremen, Bremen', plz: '28197', coords: [53.0793, 8.8017] as [number, number] },
		{ name: 'Hannover, Niedersachsen', plz: '30161', coords: [52.3759, 9.7320] as [number, number] },
		{ name: 'Kiel, Schleswig-Holstein', plz: '24105', coords: [54.3233, 10.1228] as [number, number] },
		{ name: 'Magdeburg, Sachsen-Anhalt', plz: '39106', coords: [52.1205, 11.6276] as [number, number] },
		{ name: 'Schwerin, Mecklenburg-Vorpommern', plz: '19055', coords: [53.6355, 11.4012] as [number, number] },
		{ name: 'Potsdam, Brandenburg', plz: '14469', coords: [52.3989, 13.0667] as [number, number] },
		{ name: 'Saarbrücken, Saarland', plz: '66113', coords: [49.2401, 6.9969] as [number, number] },
		{ name: 'Mainz, Rheinland-Pfalz', plz: '55118', coords: [50.0755, 8.2375] as [number, number] },
		{ name: 'Wiesbaden, Hessen', plz: '65185', coords: [50.0826, 8.2493] as [number, number] },
		{ name: 'Erfurt, Thüringen', plz: '99086', coords: [50.9848, 11.0299] as [number, number] },
	]

	const breeders = [
		'Max Mustermann', 'Anna Schmidt', 'Peter Weber', 'Maria Fischer',
		'Thomas Müller', 'Sabine Wagner', 'Michael Becker', 'Julia Hoffmann',
		'Andreas Schulz', 'Nicole Richter', 'Stefan Wolf', 'Petra Klein',
		'Christian Lange', 'Birgit Neumann', 'Oliver Zimmermann', 'Susanne Braun',
		'Markus Krüger', 'Tanja Hofmann', 'Jens Lehmann', 'Monika Schäfer'
	]

	const namePrefixes = [
		'vom Schwarzen Wald', 'von der Eifel', 'aus dem Harz', 'vom Bodensee',
		'vom Rhein', 'aus dem Schwarzwald', 'von der Mosel', 'aus dem Allgäu',
		'vom Neckar', 'aus dem Spessart', 'von der Donau', 'aus dem Taunus',
		'vom Main', 'aus dem Odenwald', 'von der Weser', 'aus dem Sauerland',
		'vom Teutoburger Wald', 'aus dem Thüringer Wald', 'von der Elbe', 'aus dem Erzgebirge'
	]

	const dogNames = [
		'Bella', 'Thor', 'Luna', 'Rex', 'Max', 'Emma', 'Bruno', 'Lilly',
		'Rocky', 'Mia', 'Balu', 'Nala', 'Sam', 'Luna', 'Ben', 'Sofia',
		'Charlie', 'Mila', 'Buddy', 'Lara', 'Jack', 'Emma', 'Toby', 'Anna',
		'Oscar', 'Lisa', 'Felix', 'Marie', 'Leo', 'Julia', 'Finn', 'Sarah',
		'Luca', 'Laura', 'Noah', 'Hannah', 'Elias', 'Lea', 'Paul', 'Lena',
		'Henry', 'Maya', 'Liam', 'Ella', 'Luis', 'Clara', 'Anton', 'Lina',
		'Emil', 'Nora', 'Theo', 'Mira', 'Jonas', 'Lia', 'Ben', 'Zoe'
	]

	const colors = ['Schwarzmarken', 'Blond', 'Schwarz']
	const genders = ['Männlich', 'Weiblich']
	const healthTestOptions = [
		['HD-A1', 'ED-0'],
		['HD-A1', 'ED-0', 'PRA-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei']
	]

	const dogs = []
	
	for (let i = 1; i <= 100; i++) {
		const location = locations[Math.floor(Math.random() * locations.length)]
		const breeder = breeders[Math.floor(Math.random() * breeders.length)]
		const dogName = dogNames[Math.floor(Math.random() * dogNames.length)]
		const namePrefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)]
		const gender = genders[Math.floor(Math.random() * genders.length)]
		const color = colors[Math.floor(Math.random() * colors.length)]
		const healthTests = healthTestOptions[Math.floor(Math.random() * healthTestOptions.length)]
		
		// Geburtsdatum zwischen 2015 und 2023
		const year = 2015 + Math.floor(Math.random() * 9)
		const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
		const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
		const birthDate = `${year}-${month}-${day}`
		
		// Deckrüde nur bei männlichen Hunden
		const isStudAvailable = gender === 'Männlich' && Math.random() > 0.7
		
		// Zuchtbuchnummer
		const pedigreeNumber = `HZD-${year}-${String(i).padStart(3, '0')}`
		
		// Microchip ID
		const microchipId = `DE${String(Math.floor(Math.random() * 1000000000000000)).padStart(15, '0')}`
		
		dogs.push({
			id: i,
			name: `${dogName} ${namePrefix}`,
			gender,
			birthDate,
			color,
			owner: breeder,
			location: location.name,
			plz: location.plz,
			pedigreeNumber,
			microchipId,
			isStudAvailable,
			healthTests,
			coordinates: location.coords,
		})
	}
	
	return dogs
}

// Statische Mock-Daten für Hunde (verhindert Hydration-Fehler)
const dogs = [
	{
		id: 1,
		name: 'Sofia aus dem Harz',
		gender: 'Weiblich',
		birthDate: '2023-10-21',
		color: 'Schwarzmarken',
		owner: 'Michael Becker',
		location: 'Mainz, Rheinland-Pfalz',
		plz: '55118',
		pedigreeNumber: 'HZD-2023-001',
		microchipId: 'DE088442848605772',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [49.9929, 8.2473] as [number, number],
	},
	{
		id: 2,
		name: 'Balu vom Neckar',
		gender: 'Männlich',
		birthDate: '2022-05-08',
		color: 'Schwarzmarken',
		owner: 'Petra Klein',
		location: 'Bremen, Bremen',
		plz: '28197',
		pedigreeNumber: 'HZD-2022-002',
		microchipId: 'DE786309261544450',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		coordinates: [53.0793, 8.8017] as [number, number],
	},
	{
		id: 3,
		name: 'Finn aus dem Sauerland',
		gender: 'Männlich',
		birthDate: '2018-03-26',
		color: 'Schwarzmarken',
		owner: 'Peter Weber',
		location: 'Kiel, Schleswig-Holstein',
		plz: '24105',
		pedigreeNumber: 'HZD-2018-003',
		microchipId: 'DE430256210786568',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [54.3233, 10.1228] as [number, number],
	},
	{
		id: 4,
		name: 'Theo von der Donau',
		gender: 'Weiblich',
		birthDate: '2016-06-03',
		color: 'Schwarz',
		owner: 'Anna Schmidt',
		location: 'Berlin, Berlin',
		plz: '10115',
		pedigreeNumber: 'HZD-2016-004',
		microchipId: 'DE127561841213699',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [52.5200, 13.4050] as [number, number],
	},
	{
		id: 5,
		name: 'Bruno aus dem Thüringer Wald',
		gender: 'Männlich',
		birthDate: '2017-02-02',
		color: 'Schwarzmarken',
		owner: 'Jens Lehmann',
		location: 'Hamburg, Hamburg',
		plz: '20099',
		pedigreeNumber: 'HZD-2017-005',
		microchipId: 'DE593473592979259',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0'],
		coordinates: [53.5511, 9.9937] as [number, number],
	},
	{
		id: 6,
		name: 'Mira vom Schwarzen Wald',
		gender: 'Männlich',
		birthDate: '2019-10-19',
		color: 'Schwarz',
		owner: 'Petra Klein',
		location: 'Stuttgart, Baden-Württemberg',
		plz: '70173',
		pedigreeNumber: 'HZD-2019-006',
		microchipId: 'DE376741921291929',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [48.7758, 9.1829] as [number, number],
	},
	{
		id: 7,
		name: 'Anton vom Rhein',
		gender: 'Weiblich',
		birthDate: '2018-07-25',
		color: 'Blond',
		owner: 'Birgit Neumann',
		location: 'Nürnberg, Bayern',
		plz: '90403',
		pedigreeNumber: 'HZD-2018-007',
		microchipId: 'DE291760565620811',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei', 'IC-frei'],
		coordinates: [49.4521, 11.0767] as [number, number],
	},
	{
		id: 8,
		name: 'Hannah aus dem Taunus',
		gender: 'Männlich',
		birthDate: '2015-03-20',
		color: 'Schwarz',
		owner: 'Jens Lehmann',
		location: 'Nürnberg, Bayern',
		plz: '90402',
		pedigreeNumber: 'HZD-2015-008',
		microchipId: 'DE454297053851310',
		isStudAvailable: true,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei'],
		coordinates: [49.4521, 11.0767] as [number, number],
	},
	{
		id: 9,
		name: 'Rex aus dem Sauerland',
		gender: 'Männlich',
		birthDate: '2022-05-11',
		color: 'Blond',
		owner: 'Maria Fischer',
		location: 'Berlin, Berlin',
		plz: '10115',
		pedigreeNumber: 'HZD-2022-009',
		microchipId: 'DE312031275818791',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0'],
		coordinates: [52.5200, 13.4050] as [number, number],
	},
	{
		id: 10,
		name: 'Luna aus dem Sauerland',
		gender: 'Männlich',
		birthDate: '2022-08-25',
		color: 'Blond',
		owner: 'Susanne Braun',
		location: 'Kiel, Schleswig-Holstein',
		plz: '24103',
		pedigreeNumber: 'HZD-2022-010',
		microchipId: 'DE975415778305741',
		isStudAvailable: false,
		healthTests: ['HD-A1', 'ED-0', 'PRA-frei', 'DM-frei', 'VWD-frei'],
		coordinates: [54.3233, 10.1228] as [number, number],
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
	const [showToast, setShowToast] = useState(false)
	const [toastMessage, setToastMessage] = useState('')
	
	// Paginierung State
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [totalItems, setTotalItems] = useState(10) // Statische Anzahl für Hydration-Konsistenz

	const showToastMessage = (message: string) => {
		setToastMessage(message)
		setShowToast(true)
		setTimeout(() => setShowToast(false), 3000)
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
		setTotalItems(results.length)
		setCurrentPage(1) // Zurück zur ersten Seite bei neuer Suche
		showToastMessage(`${results.length} Hunde gefunden`)
	}

	const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
		setSearchFilters(prev => ({ ...prev, [key]: value }))
	}

	// Paginierung Handler
	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage)
		setCurrentPage(1) // Zurück zur ersten Seite
	}

	// Berechnung der Paginierung
	const totalPages = Math.ceil(totalItems / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentDogs = filteredDogs.slice(startIndex, endIndex)

	const clearFilters = () => {
		setSearchFilters({
			name: '',
			gender: '',
			color: '',
			stud: '',
			healthTests: false
		})
		setFilteredDogs(dogs)
		showToastMessage('Filter zurückgesetzt - Alle Hunde werden angezeigt')
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Toast Notification */}
			{showToast && (
				<div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
					<div className="flex items-center">
						<InformationCircleIcon className="h-5 w-5 mr-2" />
						{toastMessage}
					</div>
				</div>
			)}

			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex items-center space-x-4 mb-4">
						<div className="p-3 bg-blue-100 rounded-xl">
							<MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Hovawart-Datenbank
							</h1>
							<p className="text-lg text-gray-600">
								Durchsuchen Sie die Hovawart-Datenbank nach Hunden, Züchtern und Gesundheitsdaten
							</p>
						</div>
					</div>
				</div>

				{/* Search Filters Card */}
				<div className="bg-white shadow-lg rounded-xl p-6 mb-8">
					<div className="flex items-center mb-6">
						<FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
						<h2 className="text-xl font-semibold text-gray-900">Suchfilter</h2>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
								Hundename
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
								</div>
								<input
									type="text"
									id="name"
									placeholder="z.B. Bella vom..."
									value={searchFilters.name}
									onChange={(e) => handleFilterChange('name', e.target.value)}
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
								Geschlecht
							</label>
							<select
								id="gender"
								value={searchFilters.gender}
								onChange={(e) => handleFilterChange('gender', e.target.value)}
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle Geschlechter</option>
								<option value="Männlich">Männlich</option>
								<option value="Weiblich">Weiblich</option>
							</select>
						</div>

						<div>
							<label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
								Fellfarbe
							</label>
							<select
								id="color"
								value={searchFilters.color}
								onChange={(e) => handleFilterChange('color', e.target.value)}
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle Farben</option>
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
								className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Alle Hunde</option>
								<option value="ja">Deckrüde verfügbar</option>
								<option value="nein">Nicht verfügbar</option>
							</select>
						</div>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="healthTests"
									checked={searchFilters.healthTests}
									onChange={(e) => handleFilterChange('healthTests', e.target.checked)}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="healthTests" className="ml-2 block text-sm font-medium text-gray-900">
									Nur Hunde mit vollständigen Gesundheitsdaten
								</label>
							</div>

							<div className="flex space-x-3">
								<button
									onClick={clearFilters}
									className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<ArrowPathIcon className="h-4 w-4 mr-2" />
									Zurücksetzen
								</button>
								<button
									onClick={handleSearch}
									className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<MagnifyingGlassIcon className="h-4 w-4 mr-2" />
									Suchen
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Results Section */}
				<div className="space-y-6">
					{/* Results Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Suchergebnisse
							</h2>
							<p className="text-gray-600">
								{totalItems} Hunde gefunden
							</p>
						</div>

						<div className="flex items-center space-x-3">
							<div className="flex rounded-lg border border-gray-300 overflow-hidden">
								<button
									onClick={() => setViewMode('table')}
									className={`px-4 py-2 text-sm font-medium flex items-center ${
										viewMode === 'table'
											? 'bg-blue-600 text-white'
											: 'bg-white text-gray-700 hover:bg-gray-50'
									}`}
								>
									<TableCellsIcon className="h-4 w-4 mr-2" />
									Tabelle
								</button>
								<button
									onClick={() => setViewMode('map')}
									className={`px-4 py-2 text-sm font-medium flex items-center ${
										viewMode === 'map'
											? 'bg-blue-600 text-white'
											: 'bg-white text-gray-700 hover:bg-gray-50'
									}`}
								>
									<MapIcon className="h-4 w-4 mr-2" />
									Karte
								</button>
							</div>
							<button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
								<ArrowDownTrayIcon className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Table View */}
					{viewMode === 'table' && (
						<div className="bg-white shadow-lg rounded-xl overflow-hidden">
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
												Gesundheit
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Aktionen
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{currentDogs.map((dog) => (
											<tr key={dog.id} className="hover:bg-gray-50 transition-colors duration-200">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{dog.name}
														</div>
														<div className="text-sm text-gray-500 font-mono">
															{dog.pedigreeNumber}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center text-sm text-gray-900">
														<CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
														{dog.birthDate}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														dog.gender === 'Männlich' 
															? 'bg-blue-100 text-blue-800' 
															: 'bg-pink-100 text-pink-800'
													}`}>
														{dog.gender}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
														{dog.color}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="flex items-center text-sm text-gray-900">
															<UserIcon className="h-4 w-4 text-gray-400 mr-2" />
															{dog.owner}
														</div>
														<div className="text-xs text-gray-500 font-mono">
															{dog.microchipId}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="flex items-center text-sm text-gray-900">
															<MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
															{dog.location}
														</div>
														<div className="text-xs text-gray-500 font-mono">
															PLZ: {dog.plz}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{dog.isStudAvailable ? (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
															<HeartSolidIcon className="h-3 w-3 mr-1" />
															Deckrüde verfügbar
														</span>
													) : (
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
															Normal
														</span>
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex flex-wrap gap-1">
														{dog.healthTests.map((test, index) => (
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
														<button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
															<InformationCircleIcon className="h-4 w-4" />
														</button>
														{dog.isStudAvailable && (
															<button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
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
											<span className="text-sm font-medium text-gray-700">Deckrüde verfügbar</span>
										</div>
										<div className="flex items-center">
											<div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
											<span className="text-sm font-medium text-gray-700">Normal</span>
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
				{viewMode === 'table' && totalItems > 0 && (
					<div className="bg-white shadow-lg rounded-xl p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
							{/* Items per page selector */}
							<div className="flex items-center space-x-2">
								<span className="text-sm text-gray-700">Anzeigen:</span>
								<select
									value={itemsPerPage}
									onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
									className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
									<option value={totalItems}>Alle</option>
								</select>
								<span className="text-sm text-gray-700">von {totalItems} Hunden</span>
							</div>

							{/* Page info */}
							<div className="text-sm text-gray-700">
								Seite {currentPage} von {totalPages} 
								({startIndex + 1}-{Math.min(endIndex, totalItems)} von {totalItems})
							</div>

							{/* Pagination controls */}
							<div className="flex items-center space-x-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Zurück
								</button>
								
								{/* Page numbers */}
								<div className="flex space-x-1">
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNum;
										if (totalPages <= 5) {
											pageNum = i + 1;
										} else if (currentPage <= 3) {
											pageNum = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNum = totalPages - 4 + i;
										} else {
											pageNum = currentPage - 2 + i;
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
								</div>
								
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
			</div>
		</div>
	)
}