'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

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

interface AuthContextType {
	user: User | null
	login: (username: string, password: string) => Promise<boolean>
	logout: () => void
	isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	// Check for existing token on mount
	useEffect(() => {
		const token = localStorage.getItem('auth_token')
		if (token) {
			// Verify token with API
			fetch('/api/auth/verify', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.valid && data.user) {
					setUser(data.user)
				} else {
					localStorage.removeItem('auth_token')
				}
			})
			.catch(() => {
				localStorage.removeItem('auth_token')
			})
			.finally(() => {
				setIsLoading(false)
			})
		} else {
			setIsLoading(false)
		}
	}, [])

	const login = async (username: string, password: string): Promise<boolean> => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			})

			if (response.ok) {
				const data = await response.json()
				localStorage.setItem('auth_token', data.token)
				setUser(data.user)
				return true
			}
			return false
		} catch (error) {
			console.error('Login error:', error)
			return false
		}
	}

	const logout = () => {
		localStorage.removeItem('auth_token')
		setUser(null)
	}

	const value = {
		user,
		login,
		logout,
		isLoading
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
