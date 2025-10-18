'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { formatDate } from '@hovawart-db/shared'

// Fix für Leaflet Icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Dog {
	id: number
	name: string
	gender: string
	birthDate: string
	color: string
	owner: string
	location: string
	pedigreeNumber: string
	microchipId: string
	isStudAvailable: boolean
	healthTests: string[]
}

interface MapComponentProps {
	dogs: Dog[]
}

// Mock-Koordinaten für die Standorte
const getCoordinates = (location: string) => {
	const coordinates: { [key: string]: [number, number] } = {
		'München, Bayern': [48.1351, 11.5820],
		'Hamburg, Hamburg': [53.5511, 9.9937],
		'Köln, Nordrhein-Westfalen': [50.9375, 6.9603],
		'Stuttgart, Baden-Württemberg': [48.7758, 9.1829],
	}
	return coordinates[location] || [51.1657, 10.4515] // Deutschland-Zentrum als Fallback
}

export default function MapComponent({ dogs }: MapComponentProps) {
	// Dynamisches Laden der Leaflet CSS
	useEffect(() => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
		link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
		link.crossOrigin = ''
		document.head.appendChild(link)
		
		return () => {
			if (document.head.contains(link)) {
				document.head.removeChild(link)
			}
		}
	}, [])

	return (
		<div className="h-96 w-full">
			<MapContainer
				center={[51.1657, 10.4515]} // Deutschland-Zentrum
				zoom={6}
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{dogs.map((dog) => {
					const coordinates = getCoordinates(dog.location)
					return (
						<Marker key={dog.id} position={coordinates}>
							<Popup>
								<div className="p-2">
									<h3 className="font-semibold text-gray-900 mb-2">{dog.name}</h3>
									<div className="space-y-1 text-sm">
										<p><strong>Besitzer:</strong> {dog.owner}</p>
										<p><strong>Standort:</strong> {dog.location}</p>
										<p><strong>Geburtsdatum:</strong> {formatDate(new Date(dog.birthDate))}</p>
										<p><strong>Geschlecht:</strong> {dog.gender}</p>
										<p><strong>Farbe:</strong> {dog.color}</p>
										<p><strong>Zuchtbuch:</strong> {dog.pedigreeNumber}</p>
										{dog.isStudAvailable && (
											<p className="text-green-600 font-medium">✓ Deckrüde verfügbar</p>
										)}
									</div>
									<div className="mt-3 flex space-x-2">
										<button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
											Details
										</button>
										<button className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700">
											Kontakt
										</button>
									</div>
								</div>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
		</div>
	)
}
