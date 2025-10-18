'use client'

import { useState } from 'react'
import { breeders } from './breeder-data'

export default function BreedersPage() {
	const [selectedBreeder, setSelectedBreeder] = useState<any>(null)
	const [showContactModal, setShowContactModal] = useState(false)

	// Verwende die importierten Züchterdaten
	const breedersData = breeders
		{
			id: 1,
			name: 'Max Mustermann',
			location: 'München, Bayern',
			experience: '15 Jahre',
			specialization: 'Arbeitslinie',
			dogs: 8,
			litters: 12,
			contact: 'max.mustermann@email.de',
			phone: '+49 89 12345678',
			mainImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 2,
			name: 'Anna Schmidt',
			location: 'Hamburg, Hamburg',
			experience: '8 Jahre',
			specialization: 'Showlinie',
			dogs: 5,
			litters: 6,
			contact: 'anna.schmidt@email.de',
			phone: '+49 40 87654321',
			mainImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 3,
			name: 'Peter Weber',
			location: 'Köln, Nordrhein-Westfalen',
			experience: '20 Jahre',
			specialization: 'Beide Linien',
			dogs: 12,
			litters: 25,
			contact: 'peter.weber@email.de',
			phone: '+49 221 11223344',
			mainImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 4,
			name: 'Maria Fischer',
			location: 'Stuttgart, Baden-Württemberg',
			experience: '10 Jahre',
			specialization: 'Arbeitslinie',
			dogs: 6,
			litters: 8,
			contact: 'maria.fischer@email.de',
			phone: '+49 711 55667788',
			mainImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 5,
			name: 'Thomas Müller',
			location: 'Berlin, Berlin',
			experience: '12 Jahre',
			specialization: 'Showlinie',
			dogs: 7,
			litters: 15,
			contact: 'thomas.mueller@email.de',
			phone: '+49 30 99887766',
			mainImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 6,
			name: 'Sabine Wagner',
			location: 'Frankfurt, Hessen',
			experience: '18 Jahre',
			specialization: 'Beide Linien',
			dogs: 10,
			litters: 20,
			contact: 'sabine.wagner@email.de',
			phone: '+49 69 55443322',
			mainImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 7,
			name: 'Michael Becker',
			location: 'Düsseldorf, Nordrhein-Westfalen',
			experience: '6 Jahre',
			specialization: 'Arbeitslinie',
			dogs: 4,
			litters: 5,
			contact: 'michael.becker@email.de',
			phone: '+49 211 33445566',
			mainImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
			],
		},
		{
			id: 8,
			name: 'Julia Hoffmann',
			location: 'Leipzig, Sachsen',
			experience: '14 Jahre',
			specialization: 'Showlinie',
			dogs: 9,
			litters: 18,
			contact: 'julia.hoffmann@email.de',
			phone: '+49 341 77889900',
			mainImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
			gallery: [
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
				'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face'
			],
		},
	]

	// Handler-Funktionen
	const handleContact = (breeder: any) => {
		setSelectedBreeder(breeder)
		setShowContactModal(true)
	}

	const handleShowDogs = (breeder: any) => {
		// Weiterleitung zur Suchseite mit Züchter-Filter
		window.location.href = `/search?breeder=${encodeURIComponent(breeder.name)}`
	}

	const closeContactModal = () => {
		setShowContactModal(false)
		setSelectedBreeder(null)
	}

	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Hovawart-Züchter
				</h1>
				<p className="text-lg text-gray-600">
					Entdecken Sie registrierte Hovawart-Züchter in Deutschland
				</p>
			</div>

			{/* Filter und Suche */}
			<div className="bg-white shadow rounded-lg p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
							Suche
						</label>
						<input
							type="text"
							id="search"
							placeholder="Name oder Ort suchen..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
							Spezialisierung
						</label>
						<select
							id="specialization"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Alle</option>
							<option value="arbeitslinie">Arbeitslinie</option>
							<option value="showlinie">Showlinie</option>
							<option value="beide">Beide Linien</option>
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
				</div>
			</div>

			{/* Züchter-Liste */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{breeders.map((breeder) => (
					<div key={breeder.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
						{/* Hauptbild */}
						<div className="h-48 w-full overflow-hidden">
							<img
								className="h-full w-full object-cover"
								src={breeder.mainImage}
								alt={`${breeder.name} - Hauptbild`}
							/>
						</div>
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{breeder.name}
									</h3>
									<p className="text-gray-600 flex items-center">
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										{breeder.location}
									</p>
								</div>
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
									{breeder.experience} Erfahrung
								</span>
							</div>

							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">{breeder.dogs}</div>
									<div className="text-sm text-gray-600">Hunde</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-purple-600">{breeder.litters}</div>
									<div className="text-sm text-gray-600">Würfe</div>
								</div>
							</div>

							<div className="mb-4">
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{breeder.specialization}
								</span>
							</div>

							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center">
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									{breeder.contact}
								</div>
								<div className="flex items-center">
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									{breeder.phone}
								</div>
							</div>

							<div className="mt-6 flex space-x-3">
								<button 
									onClick={() => handleContact(breeder)}
									className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
								>
									Kontakt aufnehmen
								</button>
								<button 
									onClick={() => handleShowDogs(breeder)}
									className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
								>
									Hunde anzeigen
								</button>
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
							Hinweis für Interessenten
						</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>
								Alle hier gelisteten Züchter sind beim HZD (Hovawart-Zuchtverband Deutschland) 
								registriert und verpflichten sich zur Einhaltung der Zuchtrichtlinien. 
								Bitte nehmen Sie vor der Kontaktaufnahme die Zeit, sich über die 
								Verantwortung der Hundehaltung zu informieren.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Kontakt-Modal */}
			{showContactModal && selectedBreeder && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
						<div className="mt-3">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-medium text-gray-900">
									Kontakt: {selectedBreeder.name}
								</h3>
								<button
									onClick={closeContactModal}
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
										E-Mail
									</label>
									<div className="flex items-center p-3 bg-gray-50 rounded-md">
										<svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										<a 
											href={`mailto:${selectedBreeder.contact}`}
											className="text-blue-600 hover:text-blue-800"
										>
											{selectedBreeder.contact}
										</a>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Telefon
									</label>
									<div className="flex items-center p-3 bg-gray-50 rounded-md">
										<svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
										<a 
											href={`tel:${selectedBreeder.phone}`}
											className="text-blue-600 hover:text-blue-800"
										>
											{selectedBreeder.phone}
										</a>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Standort
									</label>
									<div className="flex items-center p-3 bg-gray-50 rounded-md">
										<svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										<span className="text-gray-700">{selectedBreeder.location}</span>
									</div>
								</div>
							</div>
							
							<div className="mt-6 flex space-x-3">
								<button
									onClick={closeContactModal}
									className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
								>
									Schließen
								</button>
								<button
									onClick={() => {
										window.location.href = `/search?breeder=${encodeURIComponent(selectedBreeder.name)}`
									}}
									className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
								>
									Hunde anzeigen
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
