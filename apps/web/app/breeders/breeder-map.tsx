'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import 'leaflet/dist/leaflet.css'

interface Breeder {
	id: string
	name: string
	kennelName?: string
	location: string
	postalCode?: string
	city?: string
	latitude?: number
	longitude?: number
	roles: string[]
	website?: string
	phone?: string
	contact: string
}

interface BreederMapProps {
	breeders: Breeder[]
}

// Nominatim API für Geocoding
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
        const response = await fetch(url, {
            headers: { 'Accept-Language': 'de' },
        })
        const data = await response.json()

        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        }
        return null
	} catch (error) {
		console.error('Geocoding error:', error)
		return null
	}
}

export default function BreederMap({ breeders }: BreederMapProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)
	const markersLayerRef = useRef<any>(null)
	const [isClient, setIsClient] = useState(false)
	const [breederCoordinates, setBreederCoordinates] = useState<Map<string, [number, number]>>(new Map())
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient || !breeders.length) return

		const fetchCoordinates = async () => {
			setLoading(true)
			const coordinates = new Map<string, [number, number]>()

			for (const breeder of breeders) {
				let coords: [number, number] | null = null
				// Bevorzugt: PLZ, Fallback: aus location extrahieren, plus Stadt
				const parts = (breeder.location || '').split(',')
				const city = parts[0]?.trim() || breeder.city || undefined
				const postal = breeder.postalCode || extractPostalCode(breeder.location || undefined) || undefined
				coords = await geocodeByPostalAndCity(postal, city)
				if (coords) coordinates.set(breeder.id, coords)
			}

			setBreederCoordinates(coordinates)
			setLoading(false)
		}

		fetchCoordinates()
	}, [isClient, breeders])

	useEffect(() => {
		if (!isClient || loading) return
		if (!mapContainerRef.current) return

		let cancelled = false
		const initMap = async () => {
			const L = (await import('leaflet')).default

			if (cancelled) return

			if (!mapInstanceRef.current) {
				mapInstanceRef.current = L.map(mapContainerRef.current).setView([51.1657, 10.4515], 6)
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					maxZoom: 19,
				}).addTo(mapInstanceRef.current)
				markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)
			}

			markersLayerRef.current.clearLayers()

			const bounds = L.latLngBounds([])
			Array.from(breederCoordinates.entries()).forEach(([id, [lat, lon]]) => {
				const breeder = breeders.find(b => b.id === id)
				if (!breeder) return
				const marker = L.circleMarker([lat, lon], { radius: 8, color: '#ef4444', weight: 2, fillColor: '#ef4444', fillOpacity: 0.8 })
					.bindPopup(`<b>${breeder.kennelName || breeder.name}</b><br/>${breeder.location}`)
				marker.addTo(markersLayerRef.current)
				bounds.extend([lat, lon])
			})

			if (bounds.isValid()) {
				mapInstanceRef.current.fitBounds(bounds.pad(0.2))
			} else {
				mapInstanceRef.current.setView([51.1657, 10.4515], 6)
			}
		}

		initMap()
		return () => {
			cancelled = true
		}
	}, [isClient, loading, breederCoordinates, breeders])

	if (!isClient) {
		return (
			<div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Karte wird geladen...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900">
					Züchter auf der Karte ({breederCoordinates.size} Standorte)
				</h3>
			</div>
			<div className="h-96 rounded-lg border border-gray-200 overflow-hidden">
				<div ref={mapContainerRef} className="w-full h-full" />
			</div>
		</div>
	)
}



