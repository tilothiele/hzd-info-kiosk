'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
	const { user, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/login')
		}
	}, [user, isLoading, router])

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	const formatDate = (date: Date | string | undefined) => {
		if (!date) return 'Nicht verfügbar'
		const d = new Date(date)
		return d.toLocaleDateString('de-DE', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric'
		})
	}

	const getRoleLabel = (role: string) => {
		const roleLabels: { [key: string]: string } = {
			'ADMIN': 'Administrator',
			'BREEDER': 'Züchter',
			'STUD_OWNER': 'Deckrüdenbesitzer',
			'MEMBER': 'Mitglied',
			'EDITOR': 'Editor'
		}
		return roleLabels[role] || role
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="bg-white shadow rounded-lg mb-8">
					<div className="px-6 py-8">
						<div className="flex items-center space-x-6">
							{/* Avatar */}
							<div className="flex-shrink-0">
								{user.avatarUrl ? (
									<img
										className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
										src={user.avatarUrl}
										alt={`${user.firstName} ${user.lastName}`}
									/>
								) : (
									<div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
										<span className="text-white text-2xl font-bold">
											{user.firstName?.charAt(0)?.toUpperCase() || 'U'}
											{user.lastName?.charAt(0)?.toUpperCase() || 'U'}
										</span>
									</div>
								)}
							</div>

							{/* User Info */}
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-gray-900">
									{user.firstName || 'Unbekannt'} {user.lastName || 'Benutzer'}
								</h1>
								<p className="text-lg text-gray-600 mb-2">
									@{user.username}
								</p>
								<div className="flex flex-wrap gap-2">
									{user.roles.map((role) => (
										<span
											key={role}
											className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
										>
											{getRoleLabel(role)}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Profile Details */}
				<div className="bg-white shadow rounded-lg">
					<div className="px-6 py-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6">
							Profilinformationen
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Personal Information */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Vorname
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{user.firstName || 'Nicht verfügbar'}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Nachname
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{user.lastName || 'Nicht verfügbar'}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										E-Mail-Adresse
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{user.email}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Mitgliedsnummer
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{user.memberNumber || 'Nicht vergeben'}
									</div>
								</div>
							</div>

							{/* Membership Information */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Mitglied seit
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{formatDate(user.memberSince)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Benutzer seit
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{formatDate(user.createdAt)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
											user.isActive 
												? 'bg-green-100 text-green-800' 
												: 'bg-red-100 text-red-800'
										}`}>
											{user.isActive ? 'Aktiv' : 'Inaktiv'}
										</span>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Letzte Aktualisierung
									</label>
									<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
										{formatDate(user.updatedAt)}
									</div>
								</div>
							</div>
						</div>

						{/* Additional Information */}
						{(user.phone || user.address || user.city || user.postalCode || user.website) && (
							<div className="mt-8 pt-6 border-t border-gray-200">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Kontaktinformationen
								</h3>
								
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{user.phone && (
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Telefon
											</label>
											<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
												{user.phone}
											</div>
										</div>
									)}

									{user.website && (
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Website
											</label>
											<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
												<a 
													href={user.website} 
													target="_blank" 
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-800 underline"
												>
													{user.website}
												</a>
											</div>
										</div>
									)}

									{(user.address || user.city || user.postalCode) && (
										<div className="md:col-span-2">
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Adresse
											</label>
											<div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
												{[
													user.address,
													user.postalCode && user.city ? `${user.postalCode} ${user.city}` : user.city,
													user.country
												].filter(Boolean).join(', ') || 'Nicht angegeben'}
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
