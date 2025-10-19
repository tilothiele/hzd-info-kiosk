import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
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

// Hilfsfunktion für Datumsformatierung
function formatDate(date: Date): string {
	return date.toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	})
}

// GET /api/litters - Alle öffentlichen Würfe abrufen
router.get('/', async (req, res) => {
	try {
		// Filter-Parameter aus Query-String
		const { status, location, date, breeder } = req.query

		// Prisma Query Builder
		const where: any = {
			isPublic: true
		}

		// Status-Filter
		if (status) {
			const statusMap: Record<string, string> = {
				'verfügbar': 'AVAILABLE',
				'geplant': 'PLANNED',
				'reserviert': 'RESERVED',
				'verkauft': 'SOLD',
				'geboren': 'BORN'
			}
			where.status = statusMap[status.toString().toLowerCase()] || status.toString().toUpperCase()
		}

		// Standort-Filter
		if (location) {
			where.location = {
				contains: location.toString(),
				mode: 'insensitive'
			}
		}

		// Datum-Filter
		if (date) {
			where.OR = [
				{
					expectedDate: {
						gte: new Date(`${date}-01-01`),
						lt: new Date(`${parseInt(date.toString()) + 1}-01-01`)
					}
				},
				{
					actualDate: {
						gte: new Date(`${date}-01-01`),
						lt: new Date(`${parseInt(date.toString()) + 1}-01-01`)
					}
				}
			]
		}

		// Züchter-Filter
		if (breeder) {
			where.breeder = {
				OR: [
					{
						firstName: {
							contains: breeder.toString(),
							mode: 'insensitive'
						}
					},
					{
						lastName: {
							contains: breeder.toString(),
							mode: 'insensitive'
						}
					}
				]
			}
		}

		const litters = await prisma.litter.findMany({
			where,
			include: {
				mother: {
					include: {
						owner: true,
						breeder: true,
						awards: true
					}
				},
				father: {
					include: {
						owner: true,
						breeder: true,
						awards: true
					}
				},
				breeder: true
			},
			orderBy: {
				expectedDate: 'desc'
			}
		})

		// Daten für Frontend formatieren
		const formattedLitters = litters.map(litter => ({
			id: litter.id,
			litterNumber: litter.litterNumber,
			litterSequence: litter.litterSequence,
			mother: litter.mother.name,
			father: litter.father?.name || 'Unbekannt',
			breeder: `${litter.breeder.firstName} ${litter.breeder.lastName}`,
			breederKennelName: litter.breeder.kennelName,
			location: litter.location,
			status: litter.status,
			price: litter.price,
			date: litter.actualDate ? formatDate(litter.actualDate) : formatDate(litter.expectedDate),
			expectedDate: litter.expectedDate?.toISOString().split('T')[0],
			actualDate: litter.actualDate?.toISOString().split('T')[0],
			expectedPuppies: litter.expectedPuppies,
			actualPuppies: litter.actualPuppies,
			availablePuppies: litter.actualPuppies || 0, // Vereinfacht
			contact: litter.contactInfo?.split(',')[0] || '',
			phone: litter.contactInfo?.split(',')[1]?.trim() || '',
			website: litter.website,
			imageUrl: litter.imageUrl,
			motherId: litter.motherId,
			fatherId: litter.fatherId,
			// Besitzer-Informationen
			motherOwner: {
				name: `${litter.mother.owner.firstName} ${litter.mother.owner.lastName}`,
				id: litter.mother.owner.id,
				imageUrl: litter.mother.owner.avatarUrl
			},
			fatherOwner: litter.father ? {
				name: `${litter.father.owner.firstName} ${litter.father.owner.lastName}`,
				id: litter.father.owner.id,
				imageUrl: litter.father.owner.avatarUrl
			} : null,
			// Züchter-Informationen
			motherBreeder: {
				name: `${litter.mother.breeder.firstName} ${litter.mother.breeder.lastName}`,
				id: litter.mother.breeder.id,
				imageUrl: litter.mother.breeder.avatarUrl,
				kennelName: litter.mother.breeder.kennelName
			},
			fatherBreeder: litter.father ? {
				name: `${litter.father.breeder.firstName} ${litter.father.breeder.lastName}`,
				id: litter.father.breeder.id,
				imageUrl: litter.father.breeder.avatarUrl,
				kennelName: litter.father.breeder.kennelName
			} : null,
			// Hauptbilder der Elterntiere
			motherImageUrl: litter.mother.imageUrl,
			fatherImageUrl: litter.father?.imageUrl,
			// Auszeichnungen
			motherAwards: litter.mother.awards.map(award => ({
				code: award.code,
				description: award.description,
				date: award.date?.toISOString().split('T')[0],
				issuer: award.issuer
			})),
			fatherAwards: litter.father?.awards.map(award => ({
				code: award.code,
				description: award.description,
				date: award.date?.toISOString().split('T')[0],
				issuer: award.issuer
			})) || [],
			// Genetik-Daten
			av: litter.av,
			iz: litter.iz,
			puppyColors: litter.puppyColors as any,
			description: litter.description
		}))

		res.json(formattedLitters)
	} catch (error) {
		console.error('Fehler beim Abrufen der Würfe:', error)
		res.status(500).json({ error: 'Fehler beim Abrufen der Würfe' })
	}
})

// GET /api/litters/:id - Einzelnen Wurf abrufen
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params

		const litter = await prisma.litter.findUnique({
			where: { id },
			include: {
				mother: {
					include: {
						owner: true,
						breeder: true,
						awards: true
					}
				},
				father: {
					include: {
						owner: true,
						breeder: true,
						awards: true
					}
				},
				breeder: true
			}
		})

		if (!litter) {
			return res.status(404).json({
				success: false,
				error: 'Wurf nicht gefunden'
			})
		}

		// Daten für Frontend formatieren
		const formattedLitter = {
			id: litter.id,
			litterNumber: litter.litterNumber,
			litterSequence: litter.litterSequence,
			mother: litter.mother.name,
			father: litter.father?.name || 'Unbekannt',
			breeder: `${litter.breeder.firstName} ${litter.breeder.lastName}`,
			breederKennelName: litter.breeder.kennelName,
			location: litter.location,
			status: litter.status,
			price: litter.price,
			date: litter.actualDate ? formatDate(litter.actualDate) : formatDate(litter.expectedDate),
			expectedDate: litter.expectedDate?.toISOString().split('T')[0],
			actualDate: litter.actualDate?.toISOString().split('T')[0],
			expectedPuppies: litter.expectedPuppies,
			actualPuppies: litter.actualPuppies,
			availablePuppies: litter.actualPuppies || 0,
			contact: litter.contactInfo?.split(',')[0] || '',
			phone: litter.contactInfo?.split(',')[1]?.trim() || '',
			website: litter.website,
			imageUrl: litter.imageUrl,
			motherId: litter.motherId,
			fatherId: litter.fatherId,
			// Besitzer-Informationen
			motherOwner: {
				name: `${litter.mother.owner.firstName} ${litter.mother.owner.lastName}`,
				id: litter.mother.owner.id,
				imageUrl: litter.mother.owner.avatarUrl
			},
			fatherOwner: litter.father ? {
				name: `${litter.father.owner.firstName} ${litter.father.owner.lastName}`,
				id: litter.father.owner.id,
				imageUrl: litter.father.owner.avatarUrl
			} : null,
			// Züchter-Informationen
			motherBreeder: {
				name: `${litter.mother.breeder.firstName} ${litter.mother.breeder.lastName}`,
				id: litter.mother.breeder.id,
				imageUrl: litter.mother.breeder.avatarUrl,
				kennelName: litter.mother.breeder.kennelName
			},
			fatherBreeder: litter.father ? {
				name: `${litter.father.breeder.firstName} ${litter.father.breeder.lastName}`,
				id: litter.father.breeder.id,
				imageUrl: litter.father.breeder.avatarUrl,
				kennelName: litter.father.breeder.kennelName
			} : null,
			// Hauptbilder der Elterntiere
			motherImageUrl: litter.mother.imageUrl,
			fatherImageUrl: litter.father?.imageUrl,
			// Auszeichnungen
			motherAwards: litter.mother.awards.map(award => ({
				code: award.code,
				description: award.description,
				date: award.date?.toISOString().split('T')[0],
				issuer: award.issuer
			})),
			fatherAwards: litter.father?.awards.map(award => ({
				code: award.code,
				description: award.description,
				date: award.date?.toISOString().split('T')[0],
				issuer: award.issuer
			})) || [],
			// Genetik-Daten
			av: litter.av,
			iz: litter.iz,
			puppyColors: litter.puppyColors as any,
			description: litter.description
		}

		res.json({
			success: true,
			data: formattedLitter
		})
	} catch (error) {
		console.error('Fehler beim Abrufen des Wurfes:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Abrufen des Wurfes'
		})
	}
})

// POST /api/litters - Neuen Wurf erstellen
router.post('/', async (req, res) => {
	try {
		const validatedData = createLitterSchema.parse(req.body)

		const litter = await prisma.litter.create({
			data: validatedData,
			include: {
				mother: true,
				father: true,
				breeder: true
			}
		})

		res.status(201).json({
			success: true,
			data: litter
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				error: 'Validierungsfehler',
				details: error.errors
			})
		}

		console.error('Fehler beim Erstellen des Wurfes:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Erstellen des Wurfes'
		})
	}
})

// PUT /api/litters/:id - Wurf aktualisieren
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const validatedData = updateLitterSchema.parse(req.body)

		const litter = await prisma.litter.update({
			where: { id },
			data: validatedData,
			include: {
				mother: true,
				father: true,
				breeder: true
			}
		})

		res.json({
			success: true,
			data: litter
		})
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				error: 'Validierungsfehler',
				details: error.errors
			})
		}

		console.error('Fehler beim Aktualisieren des Wurfes:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Aktualisieren des Wurfes'
		})
	}
})

// DELETE /api/litters/:id - Wurf löschen
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params

		await prisma.litter.delete({
			where: { id }
		})

		res.json({
			success: true,
			message: 'Wurf erfolgreich gelöscht'
		})
	} catch (error) {
		console.error('Fehler beim Löschen des Wurfes:', error)
		res.status(500).json({
			success: false,
			error: 'Fehler beim Löschen des Wurfes'
		})
	}
})

export default router