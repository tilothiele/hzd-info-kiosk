'use client'

import { 
	MagnifyingGlassIcon,
	UsersIcon,
	DocumentTextIcon,
	MapIcon,
	HeartIcon,
	ShieldCheckIcon,
	CircleStackIcon,
	CalendarIcon,
	UserIcon,
	GlobeAltIcon,
	CheckCircleIcon,
	ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { 
	HeartIcon as HeartSolidIcon,
	UsersIcon as UsersSolidIcon,
	ShieldCheckIcon as ShieldCheckSolidIcon,
	CircleStackIcon as CircleStackSolidIcon,
} from '@heroicons/react/24/solid'

export default function HomePage() {
	const features = [
		{
			icon: MagnifyingGlassIcon,
			title: 'Hunde suchen',
			description: 'Durchsuchen Sie die Hovawart-Datenbank nach Hunden, Züchtern und Abstammungen',
			href: '/search',
			color: 'blue',
			gradient: 'from-blue-500 to-blue-600',
		},
		{
			icon: UsersIcon,
			title: 'Züchter finden',
			description: 'Entdecken Sie registrierte Hovawart-Züchter in Ihrer Nähe',
			href: '/breeders',
			color: 'green',
			gradient: 'from-green-500 to-green-600',
		},
		{
			icon: DocumentTextIcon,
			title: 'Würfe anzeigen',
			description: 'Informationen zu geplanten und verfügbaren Würfen',
			href: '/litters',
			color: 'purple',
			gradient: 'from-purple-500 to-purple-600',
		},
	]

	const stats = [
		{ label: 'Registrierte Hunde', value: '2,847', icon: CircleStackSolidIcon },
		{ label: 'Aktive Züchter', value: '156', icon: UsersSolidIcon },
		{ label: 'Verfügbare Deckrüden', value: '23', icon: HeartSolidIcon },
		{ label: 'Durchgeführte Tests', value: '8,421', icon: ShieldCheckSolidIcon },
	]

	const activities = [
		{ icon: CircleStackSolidIcon, text: '5 neue Hunde registriert', time: 'vor 2 Stunden' },
		{ icon: UsersSolidIcon, text: '2 neue Züchter beigetreten', time: 'vor 4 Stunden' },
		{ icon: HeartSolidIcon, text: '1 Deckrüde verfügbar', time: 'vor 6 Stunden' },
		{ icon: ShieldCheckSolidIcon, text: '12 Gesundheitsdaten aktualisiert', time: 'vor 8 Stunden' },
	]

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="flex justify-center mb-8">
						<div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl">
							<CircleStackIcon className="h-16 w-16 text-white" />
						</div>
					</div>
					
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
						Willkommen beim{' '}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							HZD Info Kiosk
						</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
						Ihre zentrale Anlaufstelle für Hovawart-Züchterinformationen, 
						Gesundheitsdaten und Abstammungsnachweise
					</p>

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-md mb-4">
									<stat.icon className="h-8 w-8 text-blue-600" />
								</div>
								<div className="text-3xl font-bold text-gray-900 mb-1">
									{stat.value}
								</div>
								<div className="text-sm text-gray-600">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features Grid */}
				<div className="mb-16">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Entdecken Sie unsere Funktionen
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Nutzen Sie unsere umfassende Datenbank für Ihre Hovawart-Zucht
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
							>
								<div className="text-center">
									<div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6`}>
										<feature.icon className="h-8 w-8 text-white" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-4">
										{feature.title}
									</h3>
									<p className="text-gray-600 mb-6">
										{feature.description}
									</p>
									<a
										href={feature.href}
										className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
									>
										Jetzt starten
										<ArrowRightIcon className="ml-2 h-4 w-4" />
									</a>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="border-t border-gray-200 pt-16">
					{/* About Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-6">
								Über den HZD Info Kiosk
							</h2>
							<p className="text-lg text-gray-600 mb-6">
								Der HZD Info Kiosk ist eine zentrale Plattform für alle
								Hovawart-Interessierten. Hier können Sie:
							</p>
							<div className="space-y-4">
								{[
									'Nach Hovawart-Hunden in der Datenbank suchen',
									'Informationen über registrierte Züchter abrufen',
									'Verfügbare Würfe und Deckrüden finden',
									'Gesundheitsdaten und Abstammungsinformationen einsehen',
								].map((item, index) => (
									<div key={index} className="flex items-center">
										<div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
											<CheckCircleIcon className="h-5 w-5 text-green-600" />
										</div>
										<span className="text-gray-700">{item}</span>
									</div>
								))}
							</div>
						</div>
						
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h3 className="text-xl font-semibold text-gray-900 mb-6">
								Neueste Aktivitäten
							</h3>
							<div className="space-y-4">
								{activities.map((activity, index) => (
									<div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
										<div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
											<activity.icon className="h-5 w-5 text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												{activity.text}
											</p>
											<p className="text-xs text-gray-500">
												{activity.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
					<h2 className="text-3xl font-bold mb-4">
						Bereit, Ihre Hovawart-Reise zu beginnen?
					</h2>
					<p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
						Entdecken Sie unsere umfassende Datenbank und finden Sie den perfekten Hovawart
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/search"
							className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
						>
							<MagnifyingGlassIcon className="h-5 w-5 mr-2" />
							Jetzt suchen
						</a>
						<a
							href="/breeders"
							className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
						>
							<UsersIcon className="h-5 w-5 mr-2" />
							Züchter finden
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}