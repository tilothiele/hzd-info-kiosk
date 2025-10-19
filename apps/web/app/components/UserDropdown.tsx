'use client'

import { useState, useRef, useEffect } from 'react'

interface User {
	id: string
	username: string
	email: string
	firstName: string
	lastName: string
	memberNumber?: string
	avatarUrl?: string
	memberSince?: Date
	phone?: string
	address?: string
	postalCode?: string
	city?: string
	country?: string
	website?: string
	isActive: boolean
	createdAt: Date
	updatedAt: Date
	roles: string[]
}

interface UserDropdownProps {
	user: User | null
	onLogin: () => void
	onLogout: () => void
}

export default function UserDropdown({ user, onLogin, onLogout }: UserDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleProfileClick = () => {
		setIsOpen(false)
		window.location.href = '/profile'
	}

	const handleLoginClick = () => {
		setIsOpen(false)
		onLogin()
	}

	const handleLogoutClick = () => {
		setIsOpen(false)
		onLogout()
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{user ? (
					<>
						<div className="flex items-center space-x-2">
							{user.avatarUrl ? (
								<img
									className="w-8 h-8 rounded-full object-cover"
									src={user.avatarUrl}
									alt={`${user.firstName} ${user.lastName}`}
								/>
							) : (
								<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
									<span className="text-white text-sm font-medium">
										{user.firstName?.charAt(0)?.toUpperCase() || 'U'}
									</span>
								</div>
							)}
							<span className="hidden lg:block">{user.firstName || 'Benutzer'}</span>
						</div>
					</>
				) : (
					<>
						<svg 
							className="w-6 h-6" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
							/>
						</svg>
						<span className="hidden lg:block">Benutzer</span>
					</>
				)}
				<svg 
					className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					fill="none" 
					stroke="currentColor" 
					viewBox="0 0 24 24"
				>
					<path 
						strokeLinecap="round" 
						strokeLinejoin="round" 
						strokeWidth={2} 
						d="M19 9l-7 7-7-7" 
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
					<div className="py-1">
						{user ? (
							<>
								<div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
									<div className="font-medium">{user.firstName} {user.lastName}</div>
									<div className="text-gray-500">@{user.username}</div>
									<div className="text-xs text-blue-600 mt-1">
										{user.roles.map(role => {
											const roleLabels: { [key: string]: string } = {
												'ADMIN': 'Administrator',
												'BREEDER': 'Züchter',
												'STUD_OWNER': 'Deckrüdenbesitzer',
												'MEMBER': 'Mitglied',
												'EDITOR': 'Editor'
											}
											return roleLabels[role] || role
										}).join(', ')}
									</div>
								</div>
								<button
									onClick={handleProfileClick}
									className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
								>
									<svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Profil
								</button>
								<button
									onClick={handleLogoutClick}
									className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
								>
									<svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
									</svg>
									Abmelden
								</button>
							</>
						) : (
							<button
								onClick={handleLoginClick}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
							>
								<svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
								</svg>
								Anmelden
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
