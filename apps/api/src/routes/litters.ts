import { Router } from 'express'
import { z } from 'zod'

const router = Router()

// Validation schemas
const uuidSchema = z.string().uuid('Ungültige UUID')

const createLitterSchema = z.object({
  motherId: uuidSchema,
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().min(1, 'Wurfnummer ist erforderlich').max(10, 'Wurfnummer darf maximal 10 Zeichen haben'),
  plannedDate: z.date().optional(),
  expectedDate: z.date().optional(),
  actualDate: z.date().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).default('PLANNED'),
  expectedPuppies: z.number().positive().optional(),
  actualPuppies: z.number().positive().optional(),
  av: z.number().min(0).max(100).optional(),
  iz: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  contactInfo: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional()
})

const updateLitterSchema = z.object({
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().min(1).max(10).optional(),
  plannedDate: z.date().optional(),
  expectedDate: z.date().optional(),
  actualDate: z.date().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).optional(),
  expectedPuppies: z.number().positive().optional(),
  actualPuppies: z.number().positive().optional(),
  av: z.number().min(0).max(100).optional(),
  iz: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  contactInfo: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional()
})

// Mock-Daten für Würfe (entsprechend der Frontend-Daten)
const mockLitters = [
	{
		id: '1',
		motherId: 'mother-1',
		fatherId: 'father-1',
		breederId: 'breeder-1',
		litterNumber: 'W-2024-001',
		plannedDate: new Date('2024-06-15'),
		expectedDate: new Date('2024-06-15'),
		actualDate: new Date('2024-06-12'),
		status: 'AVAILABLE',
		expectedPuppies: 6,
		actualPuppies: 5,
		puppyColors: {
			'Schwarz': { born: 2, available: 1 },
			'Blond': { born: 2, available: 1 },
			'Schwarzmarken': { born: 1, available: 1 }
		}, // Welpenfarben mit geboren/verfügbar
		av: 8.5, // Ahnenverlustkoeffizient in %
		iz: 3.2, // Inzuchtkoeffizient in %
		description: 'Wunderschöner Wurf aus bewährter Zuchtlinie. Beide Elterntiere sind HD/ED-frei und haben ausgezeichnete Wesensmerkmale.',
		isPublic: true,
		contactInfo: 'max.mustermann@email.de',
		price: 1200,
		location: 'München, Bayern',
		website: 'https://www.hovawart-muenchen.de/wurf-2024-001',
		imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-06-12'),
		mother: {
			id: 'mother-1',
			name: 'Bella vom Schwarzen Wald',
			gender: 'H'
		},
		father: {
			id: 'father-1',
			name: 'Thor von der Eifel',
			gender: 'R'
		},
		breeder: {
			id: 'breeder-1',
			firstName: 'Max',
			lastName: 'Mustermann',
			email: 'max.mustermann@email.de',
			kennelName: 'vom Schwarzen Wald'
		}
	},
	{
		id: '2',
		motherId: 'mother-2',
		fatherId: 'father-2',
		breederId: 'breeder-2',
		litterNumber: 'W-2024-002',
		plannedDate: new Date('2024-08-20'),
		expectedDate: new Date('2024-08-20'),
		actualDate: null,
		status: 'PLANNED',
		expectedPuppies: 7,
		actualPuppies: null,
		av: 12.3, // Ahnenverlustkoeffizient in %
		iz: 4.7, // Inzuchtkoeffizient in %
		description: 'Geplanter Wurf für Herbst 2024. Mutter ist eine sehr ruhige und ausgeglichene Hündin, Vater ist ein erfahrener Deckrüde.',
		isPublic: true,
		contactInfo: 'anna.schmidt@email.de',
		price: 1100,
		location: 'Hamburg, Hamburg',
		website: 'https://www.hovawart-hamburg.de/geplanter-wurf-2024',
		imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face',
		createdAt: new Date('2024-02-10'),
		updatedAt: new Date('2024-02-10'),
		mother: {
			id: 'mother-2',
			name: 'Luna aus dem Harz',
			gender: 'H'
		},
		father: {
			id: 'father-2',
			name: 'Rex vom Bodensee',
			gender: 'R'
		},
		breeder: {
			id: 'breeder-2',
			firstName: 'Anna',
			lastName: 'Schmidt',
			email: 'anna.schmidt@email.de',
			kennelName: 'aus dem Harz'
		}
	},
	{
		id: '3',
		motherId: 'mother-3',
		fatherId: 'father-3',
		breederId: 'breeder-3',
		litterNumber: 'W-2024-003',
		plannedDate: new Date('2024-05-10'),
		expectedDate: new Date('2024-05-10'),
		actualDate: new Date('2024-05-08'),
		status: 'RESERVED',
		expectedPuppies: 5,
		actualPuppies: 6,
		puppyColors: {
			'Schwarzmarken': { born: 4, available: 0 },
			'Blond': { born: 2, available: 0 }
		}, // Welpenfarben mit geboren/verfügbar
		av: 6.8, // Ahnenverlustkoeffizient in %
		iz: 2.1, // Inzuchtkoeffizient in %
		description: 'Alle Welpen sind bereits reserviert. Wurf ist geboren und entwickelt sich prächtig.',
		isPublic: true,
		contactInfo: 'peter.weber@email.de',
		price: 1300,
		location: 'Köln, Nordrhein-Westfalen',
		website: 'https://www.hovawart-koeln.de/wurf-2024-003',
		imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		createdAt: new Date('2024-01-20'),
		updatedAt: new Date('2024-05-08'),
		mother: {
			id: 'mother-3',
			name: 'Nala von der Mosel',
			gender: 'H'
		},
		father: {
			id: 'father-3',
			name: 'Zeus aus dem Schwarzwald',
			gender: 'R'
		},
		breeder: {
			id: 'breeder-3',
			firstName: 'Peter',
			lastName: 'Weber',
			email: 'peter.weber@email.de',
			kennelName: 'von der Mosel'
		}
	},
	{
		id: '4',
		motherId: 'mother-4',
		fatherId: 'father-4',
		breederId: 'breeder-4',
		litterNumber: 'W-2024-004',
		plannedDate: new Date('2024-07-30'),
		expectedDate: new Date('2024-07-30'),
		actualDate: new Date('2024-07-28'),
		status: 'AVAILABLE',
		expectedPuppies: 6,
		actualPuppies: 4,
		puppyColors: {
			'Schwarz': { born: 3, available: 1 },
			'Schwarzmarken': { born: 1, available: 1 }
		}, // Welpenfarben mit geboren/verfügbar
		av: 9.7, // Ahnenverlustkoeffizient in %
		iz: 3.8, // Inzuchtkoeffizient in %
		description: 'Kleiner aber feiner Wurf. Beide Elterntiere stammen aus Arbeitslinien und haben ausgezeichnete Arbeitsleistungen.',
		isPublic: true,
		contactInfo: 'maria.fischer@email.de',
		price: 1150,
		location: 'Stuttgart, Baden-Württemberg',
		website: 'https://www.hovawart-stuttgart.de/wurf-2024-004',
		imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face',
		createdAt: new Date('2024-03-05'),
		updatedAt: new Date('2024-07-28'),
		mother: {
			id: 'mother-4',
			name: 'Maya vom Neckar',
			gender: 'H'
		},
		father: {
			id: 'father-4',
			name: 'Apollo aus dem Odenwald',
			gender: 'R'
		},
		breeder: {
			id: 'breeder-4',
			firstName: 'Maria',
			lastName: 'Fischer',
			email: 'maria.fischer@email.de',
			kennelName: 'vom Neckar'
		}
	}
]

// GET /api/litters - Alle öffentlichen Würfe abrufen
router.get('/', (req, res) => {
	try {
		const { status, location, year } = req.query

		let filteredLitters = mockLitters.filter(litter => litter.isPublic)

		// Filter nach Status
		if (status) {
			const statusMap: Record<string, string> = {
				'verfügbar': 'AVAILABLE',
				'geplant': 'PLANNED',
				'reserviert': 'RESERVED',
				'verkauft': 'SOLD'
			}
			const mappedStatus = statusMap[status as string]
			if (mappedStatus) {
				filteredLitters = filteredLitters.filter(litter => litter.status === mappedStatus)
			}
		}

		// Filter nach Bundesland
		if (location) {
			const locationMap: Record<string, string> = {
				'bayern': 'Bayern',
				'hamburg': 'Hamburg',
				'nrw': 'Nordrhein-Westfalen',
				'bw': 'Baden-Württemberg'
			}
			const mappedLocation = locationMap[location as string]
			if (mappedLocation) {
				filteredLitters = filteredLitters.filter(litter =>
					litter.location?.includes(mappedLocation)
				)
			}
		}

		// Filter nach Jahr
		if (year) {
			filteredLitters = filteredLitters.filter(litter => {
				const litterYear = litter.actualDate?.getFullYear() || litter.expectedDate?.getFullYear()
				return litterYear?.toString() === year
			})
		}

		res.json({
			success: true,
			data: filteredLitters,
			total: filteredLitters.length
		})
	} catch (error) {
		console.error('Error fetching litters:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Abrufen der Würfe'
		})
	}
})

// GET /api/litters/:id - Einzelnen Wurf abrufen
router.get('/:id', (req, res) => {
	try {
		const { id } = req.params
		const litter = mockLitters.find(l => l.id === id)

		if (!litter) {
			return res.status(404).json({
				success: false,
				error: 'Wurf nicht gefunden'
			})
		}

		if (!litter.isPublic) {
			return res.status(403).json({
				success: false,
				error: 'Zugriff verweigert'
			})
		}

		res.json({
			success: true,
			data: litter
		})
	} catch (error) {
		console.error('Error fetching litter:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Abrufen des Wurfs'
		})
	}
})

// POST /api/litters - Neuen Wurf erstellen
router.post('/', (req, res) => {
	try {
		const validatedData = createLitterSchema.parse(req.body)

		// In einer echten Anwendung würde hier die Datenbank aktualisiert werden
		const newLitter = {
			id: Date.now().toString(),
			...validatedData,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		res.status(201).json({
			success: true,
			data: newLitter,
			message: 'Wurf erfolgreich erstellt'
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				error: 'Ungültige Eingabedaten',
				details: error.errors
			})
		}

		console.error('Error creating litter:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Erstellen des Wurfs'
		})
	}
})

// PUT /api/litters/:id - Wurf aktualisieren
router.put('/:id', (req, res) => {
	try {
		const { id } = req.params
		const validatedData = updateLitterSchema.parse(req.body)

		const litterIndex = mockLitters.findIndex(l => l.id === id)
		if (litterIndex === -1) {
			return res.status(404).json({
				success: false,
				error: 'Wurf nicht gefunden'
			})
		}

		// In einer echten Anwendung würde hier die Datenbank aktualisiert werden
		mockLitters[litterIndex] = {
			...mockLitters[litterIndex],
			...validatedData,
			updatedAt: new Date()
		}

		res.json({
			success: true,
			data: mockLitters[litterIndex],
			message: 'Wurf erfolgreich aktualisiert'
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				error: 'Ungültige Eingabedaten',
				details: error.errors
			})
		}

		console.error('Error updating litter:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Aktualisieren des Wurfs'
		})
	}
})

// DELETE /api/litters/:id - Wurf löschen
router.delete('/:id', (req, res) => {
	try {
		const { id } = req.params
		const litterIndex = mockLitters.findIndex(l => l.id === id)

		if (litterIndex === -1) {
			return res.status(404).json({
				success: false,
				error: 'Wurf nicht gefunden'
			})
		}

		// In einer echten Anwendung würde hier die Datenbank aktualisiert werden
		mockLitters.splice(litterIndex, 1)

		res.json({
			success: true,
			message: 'Wurf erfolgreich gelöscht'
		})
	} catch (error) {
		console.error('Error deleting litter:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Löschen des Wurfs'
		})
	}
})

export default router
