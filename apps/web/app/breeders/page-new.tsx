'use client'

import { useState } from 'react'
import { breeders } from './breeder-data'
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

export default function BreedersPage() {
	const [selectedBreeder, setSelectedBreeder] = useState<any>(null)
	const [showContactModal, setShowContactModal] = useState(false)

	// Handler-Funktionen
	const handleContact = (breeder: any) => {
		setSelectedBreeder(breeder)
		setShowContactModal(true)
	}

	const handleShowDogs = (breeder: any) => {
		// Weiterleitung zur Suchseite mit Züchter-Filter
		window.location.href = `/search?breeder=${encodeURIComponent(breeder.name)}`
	}

	const closeModal = () => {
		setShowContactModal(false)
		setSelectedBreeder(null)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Hovawart-Züchter</h1>
					<p className="text-gray-600">Entdecken Sie unsere qualifizierten Hovawart-Züchter</p>
				</div>

				{/* Züchter-Grid */}
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
									<h3 className="text-xl font-semibold text-gray-900 mb-2">{breeder.name}</h3>
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
										onClick={() => handleShowDogs(breeder)}
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
