import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginSchema } from '../../../../packages/shared/src/validators'

const router = express.Router()

// Mock user data - in production this would come from the database
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hovawart.de',
    password: '$2a$10$0.PHK.cbhCyex87aTKV9nec4VxGNmRGZwll4R93sEledbW25AXoC.', // "startstart" hashed
    firstName: 'Admin',
    lastName: 'User',
    memberNumber: 'HZD-001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    memberSince: new Date('2020-01-15'),
    phone: '+49 123 456789',
    address: 'Musterstraße 123',
    postalCode: '12345',
    city: 'Musterstadt',
    country: 'Deutschland',
    website: 'https://admin.hovawart.de',
    roles: ['ADMIN'],
    isActive: true,
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date()
  },
  {
    id: '2',
    username: 'zuechter1',
    email: 'zuechter1@example.de',
    password: '$2a$10$0.PHK.cbhCyex87aTKV9nec4VxGNmRGZwll4R93sEledbW25AXoC.', // "startstart" hashed
    firstName: 'Max',
    lastName: 'Mustermann',
    memberNumber: 'HZD-042',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    memberSince: new Date('2022-03-10'),
    phone: '+49 987 654321',
    address: 'Hundeweg 456',
    postalCode: '54321',
    city: 'Hundestadt',
    country: 'Deutschland',
    website: 'https://zuechter1.hovawart.de',
    roles: ['BREEDER'],
    isActive: true,
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date()
  }
]

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body)

    // Find user by username
    const user = mockUsers.find(u => u.username === username && u.isActive)
    
    if (!user) {
      return res.status(401).json({
        message: 'Ungültiger Benutzername oder Passwort'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Ungültiger Benutzername oder Passwort'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        roles: user.roles 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    )

    // Return success response
    res.json({
      message: 'Anmeldung erfolgreich',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        memberNumber: user.memberNumber,
        avatarUrl: user.avatarUrl,
        memberSince: user.memberSince,
        phone: user.phone,
        address: user.address,
        postalCode: user.postalCode,
        city: user.city,
        country: user.country,
        website: user.website,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Ungültige Eingabedaten',
        errors: error.message
      })
    }

    res.status(500).json({
      message: 'Interner Serverfehler'
    })
  }
})

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Kein gültiger Token'
      })
    }

    const token = authHeader.substring(7)
    
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Ungültiger Token'
        })
      }

      res.json({
        valid: true,
        user: decoded
      })
    })

  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({
      message: 'Interner Serverfehler'
    })
  }
})

export default router
