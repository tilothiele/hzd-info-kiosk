'use client'

import { useAuth } from '../contexts/AuthContext'
import UserDropdown from './UserDropdown'
import { useRouter } from 'next/navigation'

export default function Header() {
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center space-x-4">
						<img 
							src="https://www.hovawarte.com/images/layout/hzd-logo-neu1.png" 
							alt="HZD Logo" 
							className="h-12 w-auto"
						/>
						<h1 className="text-2xl font-bold text-gray-900">
							HZD Info Kiosk
						</h1>
					</div>
					<nav className="hidden md:flex space-x-8 items-center">
						<a
							href="/"
							className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							Startseite
						</a>
						<a
							href="/search"
							className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							Hunde
						</a>
						<a
							href="/litters"
							className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							Würfe
						</a>
						<a
							href="/breeders"
							className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							Züchter
						</a>
						<UserDropdownWrapper />
					</nav>
				</div>
			</div>
		</header>
	)
}

function UserDropdownWrapper() {
	const { user, login, logout } = useAuth()
	const router = useRouter()

	const handleLogin = () => {
		router.push('/login')
	}

	const handleLogout = () => {
		logout()
		router.push('/')
	}

	return (
		<UserDropdown
			user={user}
			onLogin={handleLogin}
			onLogout={handleLogout}
		/>
	)
}
