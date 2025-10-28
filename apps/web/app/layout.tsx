import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'


export const metadata: Metadata = {
	title: 'HZD Info Kiosk',
	description: 'Hovawart-Züchterdatenbank mit öffentlicher Suchfunktion',
	icons: {
		icon: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
		shortcut: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
		apple: 'https://www.hovawarte.com/templates/firmennest.de/favicon.ico',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="de">
			<head>
				<script src="/runtime-config.js" async={false} />
			</head>
			<body className="min-h-screen bg-gray-50">
				<AuthProvider>
					<Header />
					<main>
						{children}
					</main>
				</AuthProvider>
			</body>
		</html>
	)
}
