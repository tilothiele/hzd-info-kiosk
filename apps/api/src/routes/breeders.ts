import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

// Schema für Validierung
const uuidSchema = z.string().uuid()

// GET /api/breeders - Alle Züchter und Deckrüdenbesitzer abrufen
router.get('/', async (req, res) => {
	try {

		const { location, role, search } = req.query

		// Filter für Züchter und Deckrüdenbesitzer
		const whereClause: any = {
			isActive: true,
			userRoles: {
				some: {
					role: {
						in: ['BREEDER', 'STUD_OWNER']
					}
				}
			}
		}

		// Suchfilter
		if (search) {
			whereClause.OR = [
				{ firstName: { contains: search as string, mode: 'insensitive' } },
				{ lastName: { contains: search as string, mode: 'insensitive' } },
				{ kennelName: { contains: search as string, mode: 'insensitive' } },
				{ city: { contains: search as string, mode: 'insensitive' } }
			]
		}

		// Rollenfilter
		if (role) {
			whereClause.userRoles = {
				some: {
					role: role as string
				}
			}
		}

		// Standortfilter
		if (location) {
			whereClause.OR = [
				{ city: { contains: location as string, mode: 'insensitive' } },
				{ postalCode: { contains: location as string } }
			]
		}

		const breeders = await prisma.user.findMany({
			where: whereClause,
			include: {
				userRoles: {
					select: { role: true }
				},
				_count: {
					select: { dogs: true, litters: true }
				}
			},
			orderBy: [
				{ lastName: 'asc' },
				{ firstName: 'asc' }
			]
		})

		// Daten für Frontend formatieren
		const formattedBreeders = breeders.map(breeder => ({
			id: breeder.id,
			name: `${breeder.firstName} ${breeder.lastName}`,
			kennelName: breeder.kennelName,
			location: breeder.postalCode ? `${breeder.city}, ${breeder.postalCode}` : `${breeder.city}, ${breeder.country}`,
			experience: breeder.memberSince
				? `${new Date().getFullYear() - breeder.memberSince.getFullYear()} Jahre`
				: 'Unbekannt',
			specialization: 'Arbeitslinie', // TODO: Aus Datenbank
			dogs: breeder._count.dogs,
			litters: breeder._count.litters,
			contact: breeder.email,
			phone: breeder.phone,
			website: breeder.website,
			roles: breeder.userRoles.map(ur => ur.role),
			mainImage: breeder.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
			gallery: breeder.avatarUrl
				? [breeder.avatarUrl, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face']
				: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face']
		}))

		res.json(formattedBreeders)
	} catch (error) {
		console.error('Fehler beim Abrufen der Züchter:', error)
		res.status(500).json({ error: 'Fehler beim Abrufen der Züchter' })
	}
})

// GET /api/breeders/:id - Einzelnen Züchter abrufen
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params

		// UUID validieren
		const validatedId = uuidSchema.parse(id)

		const breeder = await prisma.user.findUnique({
			where: {
				id: validatedId,
				isActive: true,
				userRoles: {
					some: {
						role: {
							in: ['BREEDER', 'STUD_OWNER']
						}
					}
				}
			},
			include: {
				userRoles: { select: { role: true } },
				litters: true,
				_count: { select: { dogs: true, litters: true } }
			}
		})

		if (!breeder) {
			return res.status(404).json({ error: 'Züchter nicht gefunden' })
		}

		// Daten für Frontend formatieren
		const formattedBreeder = {
			id: breeder.id,
			name: `${breeder.firstName} ${breeder.lastName}`,
			kennelName: breeder.kennelName,
			location: breeder.postalCode ? `${breeder.city}, ${breeder.postalCode}` : `${breeder.city}, ${breeder.country}`,
			experience: breeder.memberSince
				? `${new Date().getFullYear() - breeder.memberSince.getFullYear()} Jahre`
				: 'Unbekannt',
			specialization: 'Arbeitslinie', // TODO: Aus Datenbank
			dogs: breeder._count.dogs,
			litters: breeder._count.litters,
			contact: breeder.email,
			phone: breeder.phone,
			website: breeder.website,
			roles: breeder.userRoles.map(ur => ur.role),
			mainImage: breeder.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
			gallery: breeder.avatarUrl
				? [breeder.avatarUrl, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face']
				: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face'],
			address: breeder.address,
			postalCode: breeder.postalCode,
			memberNumber: breeder.memberNumber,
			memberSince: breeder.memberSince,
			// Würfe (Bild optional, Default wenn nicht vorhanden)
			littersWithImages: breeder.litters.map(litter => ({
				id: litter.id,
				title: litter.litterSequence || 'Wurf',
				description: litter.description || 'Wunderschöner Wurf',
				image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
				status: litter.status,
				date: litter.actualDate || new Date().toISOString().split('T')[0],
				puppies: litter.actualPuppies || litter.expectedPuppies || 0,
				available: Math.max(0, (litter.actualPuppies || litter.expectedPuppies || 0) - 2) // Beispiel
			}))
		}

		res.json(formattedBreeder)
	} catch (error) {
		console.error('Fehler beim Abrufen des Züchters:', error)
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'Ungültige ID' })
		}
		res.status(500).json({ error: 'Fehler beim Abrufen des Züchters' })
	}
})

export default router

