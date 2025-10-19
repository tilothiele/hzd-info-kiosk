'use client'

import { useState, useEffect } from 'react'
// Simple SVG icons as components
const MagnifyingGlassIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
	</svg>
)

const UsersIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
	</svg>
)

const DocumentTextIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
	</svg>
)

const HeartIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
	</svg>
)

const ShieldCheckIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
	</svg>
)

const CircleStackIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
	</svg>
)

const CalendarIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
	</svg>
)

const GlobeAltIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
	</svg>
)

const CheckCircleIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
)

const ArrowRightIcon = (props: any) => (
	<svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
	</svg>
)

// Solid versions
const HeartSolidIcon = (props: any) => (
	<svg {...props} fill="currentColor" viewBox="0 0 24 24">
		<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
	</svg>
)

const UsersSolidIcon = (props: any) => (
	<svg {...props} fill="currentColor" viewBox="0 0 24 24">
		<path d="M12 14l9-5-9-5-9 5 9 5z" />
		<path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
		<path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
	</svg>
)

const ShieldCheckSolidIcon = (props: any) => (
	<svg {...props} fill="currentColor" viewBox="0 0 24 24">
		<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
	</svg>
)

const CircleStackSolidIcon = (props: any) => (
	<svg {...props} fill="currentColor" viewBox="0 0 24 24">
		<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
	</svg>
)
import { fetchStatistics, fetchActivities, formatTimeAgo, type Statistics, type Activity } from '../lib/api'

export default function HomePage() {
	const [statistics, setStatistics] = useState<Statistics | null>(null)
	const [activities, setActivities] = useState<Activity[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			try {
				const [statsData, activitiesData] = await Promise.all([
					fetchStatistics(),
					fetchActivities()
				])
				setStatistics(statsData)
				setActivities(activitiesData)
			} catch (error) {
				console.error('Error loading data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

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
			icon: DocumentTextIcon,
			title: 'Würfe anzeigen',
			description: 'Informationen zu geplanten und verfügbaren Würfen',
			href: '/litters',
			color: 'purple',
			gradient: 'from-purple-500 to-purple-600',
		},
		{
			icon: UsersIcon,
			title: 'Züchter finden',
			description: 'Entdecken Sie registrierte Hovawart-Züchter in Ihrer Nähe',
			href: '/breeders',
			color: 'green',
			gradient: 'from-green-500 to-green-600',
		},
	]

	// Dynamic stats from API
	const stats = statistics ? [
		{ label: 'Registrierte Hunde', value: statistics.totalDogs.toLocaleString('de-DE'), icon: CircleStackSolidIcon },
		{ label: 'Aktive Züchter', value: statistics.activeBreeders.toLocaleString('de-DE'), icon: UsersSolidIcon },
		{ label: 'Verfügbare Deckrüden', value: statistics.availableStudDogs.toLocaleString('de-DE'), icon: HeartSolidIcon },
		{ label: 'Durchgeführte Tests', value: statistics.healthTests.toLocaleString('de-DE'), icon: ShieldCheckSolidIcon },
	] : [
		{ label: 'Registrierte Hunde', value: '2,847', icon: CircleStackSolidIcon },
		{ label: 'Aktive Züchter', value: '156', icon: UsersSolidIcon },
		{ label: 'Verfügbare Deckrüden', value: '23', icon: HeartSolidIcon },
		{ label: 'Durchgeführte Tests', value: '8,421', icon: ShieldCheckSolidIcon },
	]

	// Icon mapping for activities
	const iconMap: { [key: string]: any } = {
		CircleStackIcon: CircleStackSolidIcon,
		UsersIcon: UsersSolidIcon,
		HeartIcon: HeartSolidIcon,
		ShieldCheckIcon: ShieldCheckSolidIcon,
		CalendarIcon: CalendarIcon,
		GlobeAltIcon: GlobeAltIcon,
	}

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
						{loading ? (
							// Loading skeleton for stats
							<>
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="text-center">
										<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-xl shadow-md mb-4 animate-pulse"></div>
										<div className="h-8 bg-gray-200 rounded mb-1 animate-pulse"></div>
										<div className="h-4 bg-gray-200 rounded animate-pulse"></div>
									</div>
								))}
							</>
						) : (
							stats.map((stat, index) => (
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
							))
						)}
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
								{loading ? (
									<div className="space-y-4">
										{[1, 2, 3, 4].map((i) => (
											<div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
												<div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
												<div className="flex-1">
													<div className="h-4 bg-gray-300 rounded mb-2"></div>
													<div className="h-3 bg-gray-300 rounded w-20"></div>
												</div>
											</div>
										))}
									</div>
								) : (
									activities.slice(0, 4).map((activity) => {
										const IconComponent = iconMap[activity.icon] || CircleStackSolidIcon
										return (
											<div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
												<div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
													<IconComponent className="h-5 w-5 text-white" />
												</div>
												<div className="flex-1">
													<p className="text-sm font-medium text-gray-900">
														{activity.message}
													</p>
													<p className="text-xs text-gray-500">
														{formatTimeAgo(activity.timestamp)}
													</p>
												</div>
											</div>
										)
									})
								)}
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
							Hunde suchen
						</a>
						<a
							href="/litters"
							className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
						>
							<DocumentTextIcon className="h-5 w-5 mr-2" />
							Würfe anzeigen
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}