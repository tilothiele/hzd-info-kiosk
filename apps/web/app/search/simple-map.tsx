'use client'

import { useEffect, useRef } from 'react'

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

interface SimpleMapProps {
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

export default function SimpleMap({ dogs }: SimpleMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)

	useEffect(() => {
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
						const coordinates = getCoordinates(dog.location)
						
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
	}, [dogs])

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
