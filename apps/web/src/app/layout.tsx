import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hovawart-Züchterdatenbank',
  description: 'Datenbank für Hovawart-Züchter und Deckrüdenbesitzer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
