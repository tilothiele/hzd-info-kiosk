import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

// Schema für Validierung
const uuidSchema = z.string().uuid()

// GET /api/dogs - Alle Hunde abrufen
router.get('/', async (req, res) => {
	try {
		const { 
			gender, 
			color, 
			location, 
			owner, 
			breedingStatus, 
			isStudAvailable,
			search,
			limit = '50',
			offset = '0'
		} = req.query

		// Filter für Hunde
		const whereClause: any = {
			isActive: true
		}

		// Suchfilter
		if (search) {
			whereClause.OR = [
				{ name: { contains: search as string, mode: 'insensitive' } },
				{ pedigreeNumber: { contains: search as string, mode: 'insensitive' } },
				{ microchipId: { contains: search as string, mode: 'insensitive' } },
				{ owner: { firstName: { contains: search as string, mode: 'insensitive' } } },
				{ owner: { lastName: { contains: search as string, mode: 'insensitive' } } }
			]
		}

		// Geschlecht Filter
		if (gender && gender !== 'alle') {
			whereClause.gender = gender
		}

		// Farbe Filter
		if (color && color !== 'alle') {
			whereClause.color = color
		}

		// Zuchtstatus Filter
		if (breedingStatus && breedingStatus !== 'alle') {
			whereClause.breedingStatus = breedingStatus
		}

		// Deckrüde verfügbar Filter
		if (isStudAvailable === 'true') {
			whereClause.isStudAvailable = true
		}

		// Standort Filter
		if (location && location !== 'alle') {
			whereClause.OR = [
				{ owner: { city: { contains: location as string, mode: 'insensitive' } } },
				{ owner: { postalCode: { contains: location as string, mode: 'insensitive' } } }
			]
		}

		// Besitzer Filter
		if (owner && owner !== 'alle') {
			whereClause.owner = {
				OR: [
					{ firstName: { contains: owner as string, mode: 'insensitive' } },
					{ lastName: { contains: owner as string, mode: 'insensitive' } }
				]
			}
		}

		const dogs = await prisma.dog.findMany({
			where: whereClause,
			include: {
				owner: {
					include: {
						userRoles: { select: { role: true } }
					}
				},
				awards: true,
				medicalFindings: true,
				geneticTests: true,
				offspringAsMother: {
					include: {
						father: true,
						mother: true
					}
				},
				offspringAsFather: {
					include: {
						father: true,
						mother: true
					}
				}
			},
			orderBy: [
				{ name: 'asc' }
			],
			take: parseInt(limit as string),
			skip: parseInt(offset as string)
		})

		// Formatiere die Antwort
		const formattedDogs = dogs.map(dog => ({
			id: dog.id,
			name: dog.name,
			gender: dog.gender,
			birthDate: dog.birthDate,
			deathDate: dog.deathDate,
			color: dog.color,
			pedigreeNumber: dog.pedigreeNumber,
			microchipId: dog.microchipId,
			isStudAvailable: dog.isStudAvailable,
			breedingStatus: dog.breedingStatus,
			website: dog.website,
			imageUrl: dog.imageUrl,
			litterNumber: dog.litterNumber,
			owner: {
				id: dog.owner.id,
				name: `${dog.owner.firstName} ${dog.owner.lastName}`,
				location: `${dog.owner.city}, ${dog.owner.country}`,
				postalCode: dog.owner.postalCode,
				coordinates: null,
				website: dog.owner.website,
				roles: dog.owner.userRoles.map(ur => ur.role)
			},
			healthTests: dog.geneticTests.map(test => test.testType),
			awards: dog.awards.map(award => ({
				code: award.code,
				date: award.date,
				description: award.description,
				issuer: award.issuer
			})),
			medicalFindings: dog.medicalFindings.map(finding => ({
				date: finding.date,
				shortDescription: finding.shortDescription,
				remarks: finding.remarks
			})),
			geneticTests: dog.geneticTests.map(test => ({
				testType: test.testType,
				testDate: test.testDate,
				result: test.result,
				laboratory: test.laboratory,
				certificateNumber: test.certificateNumber,
				notes: test.notes
			})),
			offspring: [
				...dog.offspringAsMother.map(offspring => ({
					id: offspring.id,
					name: offspring.name,
					gender: offspring.gender,
					birthDate: offspring.birthDate,
					father: offspring.father ? {
						id: offspring.father.id,
						name: offspring.father.name
					} : null,
					mother: offspring.mother ? {
						id: offspring.mother.id,
						name: offspring.mother.name
					} : null
				})),
				...dog.offspringAsFather.map(offspring => ({
					id: offspring.id,
					name: offspring.name,
					gender: offspring.gender,
					birthDate: offspring.birthDate,
					father: offspring.father ? {
						id: offspring.father.id,
						name: offspring.father.name
					} : null,
					mother: offspring.mother ? {
						id: offspring.mother.id,
						name: offspring.mother.name
					} : null
				}))
			]
		}))

		res.json(formattedDogs)
	} catch (error) {
		console.error('Error fetching dogs:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// GET /api/dogs/:id - Einzelnen Hund abrufen
router.get('/:id', async (req, res) => {
	try {
		const validatedId = uuidSchema.parse(req.params.id)

		const dog = await prisma.dog.findUnique({
			where: { 
				id: validatedId,
				isActive: true
			},
			include: {
				owner: {
					include: {
						userRoles: { select: { role: true } }
					}
				},
				mother: {
					include: {
						owner: true,
						awards: true
					}
				},
				father: {
					include: {
						owner: true,
						awards: true
					}
				},
				awards: true,
				medicalFindings: true,
				geneticTests: true,
				offspringAsMother: {
					include: {
						father: true,
						mother: true
					}
				},
				offspringAsFather: {
					include: {
						father: true,
						mother: true
					}
				}
			}
		})

		if (!dog) {
			return res.status(404).json({ error: 'Dog not found' })
		}

		// Formatiere die Antwort
		const formattedDog = {
			id: dog.id,
			name: dog.name,
			gender: dog.gender,
			birthDate: dog.birthDate,
			deathDate: dog.deathDate,
			color: dog.color,
			pedigreeNumber: dog.pedigreeNumber,
			microchipId: dog.microchipId,
			isStudAvailable: dog.isStudAvailable,
			breedingStatus: dog.breedingStatus,
			website: dog.website,
			imageUrl: dog.imageUrl,
			litterNumber: dog.litterNumber,
			owner: {
				id: dog.owner.id,
				name: `${dog.owner.firstName} ${dog.owner.lastName}`,
				location: `${dog.owner.city}, ${dog.owner.country}`,
				postalCode: dog.owner.postalCode,
				coordinates: null,
				website: dog.owner.website,
				roles: dog.owner.userRoles.map(ur => ur.role)
			},
			mother: dog.mother ? {
				id: dog.mother.id,
				name: dog.mother.name,
				gender: dog.mother.gender,
				birthDate: dog.mother.birthDate,
				color: dog.mother.color,
				pedigreeNumber: dog.mother.pedigreeNumber,
				imageUrl: dog.mother.imageUrl,
				owner: {
					id: dog.mother.owner.id,
					name: `${dog.mother.owner.firstName} ${dog.mother.owner.lastName}`,
					kennelName: dog.mother.owner.kennelName
				},
				awards: dog.mother.awards.map(award => ({
					code: award.code,
					date: award.date,
					description: award.description,
					issuer: award.issuer
				}))
			} : null,
			father: dog.father ? {
				id: dog.father.id,
				name: dog.father.name,
				gender: dog.father.gender,
				birthDate: dog.father.birthDate,
				color: dog.father.color,
				pedigreeNumber: dog.father.pedigreeNumber,
				imageUrl: dog.father.imageUrl,
				owner: {
					id: dog.father.owner.id,
					name: `${dog.father.owner.firstName} ${dog.father.owner.lastName}`,
					kennelName: dog.father.owner.kennelName
				},
				awards: dog.father.awards.map(award => ({
					code: award.code,
					date: award.date,
					description: award.description,
					issuer: award.issuer
				}))
			} : null,
			healthTests: dog.geneticTests.map(test => test.testType),
			awards: dog.awards.map(award => ({
				code: award.code,
				date: award.date,
				description: award.description,
				issuer: award.issuer
			})),
			medicalFindings: dog.medicalFindings.map(finding => ({
				date: finding.date,
				shortDescription: finding.shortDescription,
				remarks: finding.remarks
			})),
			geneticTests: dog.geneticTests.map(test => ({
				testType: test.testType,
				testDate: test.testDate,
				result: test.result,
				laboratory: test.laboratory,
				certificateNumber: test.certificateNumber,
				notes: test.notes
			})),
			offspring: [
				...dog.offspringAsMother.map(offspring => ({
					id: offspring.id,
					name: offspring.name,
					gender: offspring.gender,
					birthDate: offspring.birthDate,
					father: offspring.father ? {
						id: offspring.father.id,
						name: offspring.father.name
					} : null,
					mother: offspring.mother ? {
						id: offspring.mother.id,
						name: offspring.mother.name
					} : null
				})),
				...dog.offspringAsFather.map(offspring => ({
					id: offspring.id,
					name: offspring.name,
					gender: offspring.gender,
					birthDate: offspring.birthDate,
					father: offspring.father ? {
						id: offspring.father.id,
						name: offspring.father.name
					} : null,
					mother: offspring.mother ? {
						id: offspring.mother.id,
						name: offspring.mother.name
					} : null
				}))
			]
		}

		res.json(formattedDog)
	} catch (error) {
		console.error('Error fetching dog:', error)
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'Invalid dog ID' })
		}
		res.status(500).json({ error: 'Internal server error' })
	}
})

export default router


