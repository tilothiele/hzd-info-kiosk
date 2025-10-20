'use client'

import { useState, useEffect } from 'react'
import {
	UserIcon,
	MapPinIcon,
	CalendarIcon,
	HeartIcon,
	PhoneIcon,
	EnvelopeIcon,
	EyeIcon,
	ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import BreederMap from './breeder-map'

export default function BreedersPage() {
	const [breeders, setBreeders] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedBreeder, setSelectedBreeder] = useState<any>(null)
	const [showContactModal, setShowContactModal] = useState(false)
	const [showDetailsModal, setShowDetailsModal] = useState(false)
	const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

	// Daten von der API laden
	useEffect(() => {
		const fetchBreeders = async () => {
			try {
				const response = await fetch('http://localhost:3001/api/breeders')
				if (response.ok) {
					const data = await response.json()
					setBreeders(data)
				} else {
					setError('Fehler beim Laden der Züchter')
				}
			} catch (error) {
				setError('Fehler beim Laden der Züchter')
				console.error('Fehler beim Laden der Züchter:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchBreeders()
	}, [])

	// Handler-Funktionen
	const handleContact = (breeder: any) => {
		setSelectedBreeder(breeder)
		setShowContactModal(true)
	}

	const handleShowDetails = (breeder: any) => {
		setSelectedBreeder(breeder)
		setShowDetailsModal(true)
	}

	const handleShowDogs = (breeder: any) => {
		// Weiterleitung zur Suchseite mit Züchter-Filter
		window.location.href = `/search?breeder=${encodeURIComponent(breeder.name)}`
	}

	const closeModal = () => {
		setShowContactModal(false)
		setShowDetailsModal(false)
		setSelectedBreeder(null)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<p className="text-gray-600">Züchter werden geladen...</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="text-red-600 mb-4">
								<svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
							</div>
							<p className="text-gray-600">{error}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Hovawart-Züchter & Deckrüdenbesitzer</h1>
							<p className="text-gray-600">Entdecken Sie unsere qualifizierten Hovawart-Züchter und Deckrüdenbesitzer</p>
						</div>
						<div className="flex space-x-2">
							<button
								onClick={() => setViewMode('grid')}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
									viewMode === 'grid'
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								Grid
							</button>
							<button
								onClick={() => setViewMode('map')}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
									viewMode === 'map'
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								Karte
							</button>
						</div>
					</div>
				</div>

				{/* Züchter-Grid oder Karte */}
				{viewMode === 'grid' ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{breeders.map((breeder) => (
						<div key={breeder.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
							{/* Hauptbild */}
							<div className="h-48 w-full overflow-hidden">
								<img
									className="h-full w-full object-cover"
									src={breeder.mainImage}
									alt={`${breeder.name} - Hauptbild`}
								/>
							</div>

							{/* Züchter-Informationen */}
							<div className="p-6">
								<div className="mb-4">
									{/* Zwingername oben */}
									{breeder.kennelName && (
										<h2 className="text-lg font-semibold text-blue-600 mb-2">{breeder.kennelName}</h2>
									)}
									<h3 className="text-xl font-semibold text-gray-900 mb-2">{breeder.name}</h3>

									{/* Rollen-Badges */}
									<div className="flex flex-wrap gap-2 mb-3">
										{breeder.roles?.includes('BREEDER') && (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
												</svg>
												Züchter
											</span>
										)}
										{breeder.roles?.includes('STUD_OWNER') && (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
												<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
												</svg>
												Deckrüdenbesitzer
											</span>
										)}
									</div>

									<div className="flex items-center text-gray-600 mb-2">
										<MapPinIcon className="h-4 w-4 mr-2" />
										<span className="text-sm">{breeder.location}</span>
									</div>
									<div className="flex items-center text-gray-600">
										<CalendarIcon className="h-4 w-4 mr-2" />
										<span className="text-sm">{breeder.experience} Erfahrung</span>
									</div>
								</div>

								{/* Spezialisierung */}
								<div className="mb-4">
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{breeder.specialization}
									</span>
								</div>

								{/* Würfe mit Bildern */}
								{breeder.littersWithImages && breeder.littersWithImages.length > 0 && (
									<div className="mb-6">
										<h4 className="text-sm font-medium text-gray-900 mb-3">Aktuelle Würfe</h4>
										<div className="space-y-3">
											{breeder.littersWithImages.map((litter: any) => (
												<div key={litter.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
													<div className="flex-shrink-0">
														<img
															className="h-16 w-24 object-cover rounded-md"
															src={litter.image}
															alt={litter.title}
														/>
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">{litter.title}</p>
														<p className="text-xs text-gray-500 truncate">{litter.description}</p>
														<div className="flex items-center mt-1">
															<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																litter.status === 'BORN' ? 'bg-green-100 text-green-800' :
																litter.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' :
																litter.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
																'bg-gray-100 text-gray-800'
															}`}>
																{litter.status === 'BORN' ? 'Geboren' :
																 litter.status === 'PLANNED' ? 'Geplant' :
																 litter.status === 'RESERVED' ? 'Reserviert' :
																 litter.status}
															</span>
															<span className="ml-2 text-xs text-gray-500">
																{litter.puppies} Welpen
																{litter.available > 0 && `, ${litter.available} verfügbar`}
															</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Statistiken */}
								<div className="grid grid-cols-2 gap-4 mb-6">
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-900">{breeder.dogs}</div>
										<div className="text-sm text-gray-600">Hunde</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-900">{breeder.litters}</div>
										<div className="text-sm text-gray-600">Würfe</div>
									</div>
								</div>

								{/* Aktionsbuttons */}
								<div className="flex space-x-3">
									<button
										onClick={() => handleShowDetails(breeder)}
										className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
									>
										<EyeIcon className="h-4 w-4 mr-2" />
										Details
									</button>
									<button
										onClick={() => handleContact(breeder)}
										className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
									>
										<ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
										Kontakt
									</button>
								</div>
							</div>
						</div>
					))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<BreederMap breeders={breeders} />
					</div>
				)}

				{/* Züchter-Details Modal */}
				{showDetailsModal && selectedBreeder && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
							<div className="mt-3">
								<div className="flex items-center justify-between mb-6">
									<div>
										{/* Zwingername oben */}
										{selectedBreeder.kennelName && (
											<h2 className="text-xl font-semibold text-blue-600 mb-1">{selectedBreeder.kennelName}</h2>
										)}
										<h3 className="text-2xl font-bold text-gray-900">
											Züchter-Details: {selectedBreeder.name}
										</h3>
									</div>
									<button
										onClick={closeModal}
										className="text-gray-400 hover:text-gray-600"
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									{/* Hauptbild und Galerie */}
									<div>
										<div className="mb-4">
											<img
												className="w-full h-96 object-cover rounded-lg border border-gray-200"
												src={selectedBreeder.mainImage}
												alt={`${selectedBreeder.name} - Hauptbild`}
											/>
										</div>

										{/* Bildergalerie */}
										{selectedBreeder.gallery && selectedBreeder.gallery.length > 1 && (
											<div>
												<h4 className="text-lg font-semibold text-gray-900 mb-3">Weitere Bilder</h4>
												<div className="grid grid-cols-3 gap-2">
													{selectedBreeder.gallery.slice(1).map((image: string, index: number) => (
														<img
															key={index}
															className="w-full h-24 object-cover rounded-lg border border-gray-200"
															src={image}
															alt={`${selectedBreeder.name} - Bild ${index + 2}`}
														/>
													))}
												</div>
											</div>
										)}
									</div>

									{/* Züchter-Informationen */}
									<div className="space-y-6">
										{/* Grunddaten */}
										<div>
											<h4 className="text-lg font-semibold text-gray-900 mb-3">Grunddaten</h4>
											<div className="space-y-3">
												<div className="flex items-center">
													<UserIcon className="h-5 w-5 text-gray-400 mr-3" />
													<div>
														<div className="font-medium text-gray-900">{selectedBreeder.name}</div>
														<div className="flex flex-wrap gap-2 mt-1">
															{selectedBreeder.roles?.includes('BREEDER') && (
																<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
																	<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
																		<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
																	</svg>
																	Züchter
																</span>
															)}
															{selectedBreeder.roles?.includes('STUD_OWNER') && (
																<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
																	<svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
																		<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
																	</svg>
																	Deckrüdenbesitzer
																</span>
															)}
														</div>
													</div>
												</div>
												<div className="flex items-center">
													<MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
													<div>
														<div className="font-medium text-gray-900">{selectedBreeder.location}</div>
														<div className="text-sm text-gray-500">Standort</div>
													</div>
												</div>
												<div className="flex items-center">
													<CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
													<div>
														<div className="font-medium text-gray-900">{selectedBreeder.experience}</div>
														<div className="text-sm text-gray-500">Erfahrung</div>
													</div>
												</div>
												{selectedBreeder.website && (
													<div className="flex items-center">
														<svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
														</svg>
														<div>
															<a
																href={selectedBreeder.website}
																target="_blank"
																rel="noopener noreferrer"
																className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
															>
																Website besuchen
															</a>
															<div className="text-sm text-gray-500">Züchter-Website</div>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Spezialisierung */}
										<div>
											<h4 className="text-lg font-semibold text-gray-900 mb-3">Spezialisierung</h4>
											<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
												{selectedBreeder.specialization}
											</span>
										</div>

										{/* Statistiken */}
										<div>
											<h4 className="text-lg font-semibold text-gray-900 mb-3">Zuchtstatistiken</h4>
											<div className="grid grid-cols-2 gap-4">
												<div className="text-center p-4 bg-gray-50 rounded-lg">
													<div className="text-3xl font-bold text-blue-600">{selectedBreeder.dogs}</div>
													<div className="text-sm text-gray-600">Aktuelle Hunde</div>
												</div>
												<div className="text-center p-4 bg-gray-50 rounded-lg">
													<div className="text-3xl font-bold text-green-600">{selectedBreeder.litters}</div>
													<div className="text-sm text-gray-600">Würfe gezüchtet</div>
												</div>
											</div>
										</div>

										{/* Würfe mit Bildern */}
										{selectedBreeder.littersWithImages && selectedBreeder.littersWithImages.length > 0 && (
											<div>
												<h4 className="text-lg font-semibold text-gray-900 mb-3">Aktuelle Würfe</h4>
												<div className="space-y-4">
													{selectedBreeder.littersWithImages.map((litter: any) => (
														<div key={litter.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
															<div className="flex-shrink-0">
																<img
																	className="h-20 w-28 object-cover rounded-md"
																	src={litter.image}
																	alt={litter.title}
																/>
															</div>
															<div className="flex-1 min-w-0">
																<p className="text-sm font-medium text-gray-900 truncate">{litter.title}</p>
																<p className="text-xs text-gray-500 truncate">{litter.description}</p>
																<div className="flex items-center mt-2">
																	<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																		litter.status === 'BORN' ? 'bg-green-100 text-green-800' :
																		litter.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' :
																		litter.status === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
																		'bg-gray-100 text-gray-800'
																	}`}>
																		{litter.status === 'BORN' ? 'Geboren' :
																		 litter.status === 'PLANNED' ? 'Geplant' :
																		 litter.status === 'RESERVED' ? 'Reserviert' :
																		 litter.status}
																	</span>
																	<span className="ml-2 text-xs text-gray-500">
																		{litter.puppies} Welpen
																		{litter.available > 0 && `, ${litter.available} verfügbar`}
																	</span>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Kontaktdaten */}
										<div>
											<h4 className="text-lg font-semibold text-gray-900 mb-3">Kontaktdaten</h4>
											<div className="space-y-3">
												<div className="flex items-center">
													<EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
													<div>
														<div className="font-medium text-gray-900">{selectedBreeder.contact}</div>
														<div className="text-sm text-gray-500">E-Mail</div>
													</div>
												</div>
												<div className="flex items-center">
													<PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
													<div>
														<div className="font-medium text-gray-900">{selectedBreeder.phone}</div>
														<div className="text-sm text-gray-500">Telefon</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Aktionsbuttons */}
								<div className="mt-8 flex space-x-4">
									<button
										onClick={closeModal}
										className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition-colors duration-200"
									>
										Schließen
									</button>
									<button
										onClick={() => {
											closeModal()
											handleContact(selectedBreeder)
										}}
										className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
									>
										Kontakt aufnehmen
									</button>
									<button
										onClick={() => {
											closeModal()
											handleShowDogs(selectedBreeder)
										}}
										className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
									>
										Hunde anzeigen
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Kontakt Modal */}
				{showContactModal && selectedBreeder && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
						<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
							<div className="mt-3">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-medium text-gray-900">
										Kontakt: {selectedBreeder.name}
									</h3>
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
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Züchter
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700 font-medium">{selectedBreeder.name}</span>
											<div className="text-xs text-gray-500 mt-1">{selectedBreeder.location}</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											E-Mail
										</label>
										<div className="p-3 bg-gray-50 rounded-md flex items-center">
											<EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
											<span className="text-gray-700">{selectedBreeder.contact}</span>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Telefon
										</label>
										<div className="p-3 bg-gray-50 rounded-md flex items-center">
											<PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
											<span className="text-gray-700">{selectedBreeder.phone}</span>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Spezialisierung
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700">{selectedBreeder.specialization}</span>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Erfahrung
										</label>
										<div className="p-3 bg-gray-50 rounded-md">
											<span className="text-gray-700">{selectedBreeder.experience}</span>
										</div>
									</div>
								</div>

								<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
									<h4 className="text-sm font-medium text-blue-800 mb-2">Kontaktinformationen</h4>
									<p className="text-sm text-blue-700">
										Für weitere Informationen und Kontaktaufnahme wenden Sie sich bitte direkt an den Züchter
										oder nutzen Sie die offiziellen Kanäle des HZD.
									</p>
								</div>

								<div className="mt-6 flex space-x-3">
									<button
										onClick={closeModal}
										className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
									>
										Schließen
									</button>
									<button
										onClick={() => {
											closeModal()
											// Hier könnte eine echte Kontaktfunktion implementiert werden
											alert('Kontaktanfrage wurde gesendet!')
										}}
										className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
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
