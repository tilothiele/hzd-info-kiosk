import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import littersRoutes from './routes/litters'
import dogsRoutes from './routes/dogs'
// import breedersRoutes from './routes/breeders'

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3004'],
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json())

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'hovawart-api'
  })
})


// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Hovawart API is running',
    version: '1.0.0'
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)

// Litter routes
app.use('/api/litters', littersRoutes)

// Dog routes
app.use('/api/dogs', dogsRoutes)

// app.use('/api/breeders', breedersRoutes)

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
  // Mock data - in production this would come from the database
  const stats = {
    totalDogs: 2847,
    activeBreeders: 156,
    availableStudDogs: 23,
    healthTests: 8421,
    totalLitters: 1247,
    registeredUsers: 89
  }

  res.json(stats)
})

// Activities endpoint
app.get('/api/activities', (req, res) => {
  // Mock data - in production this would come from the database
  const activities = [
    {
      id: 1,
      type: 'dog_registered',
      message: '5 neue Hunde registriert',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      icon: 'CircleStackIcon'
    },
    {
      id: 2,
      type: 'breeder_joined',
      message: '2 neue Züchter beigetreten',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      icon: 'UsersIcon'
    },
    {
      id: 3,
      type: 'stud_available',
      message: '1 Deckrüde verfügbar',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      icon: 'HeartIcon'
    },
    {
      id: 4,
      type: 'health_updated',
      message: '12 Gesundheitsdaten aktualisiert',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      icon: 'ShieldCheckIcon'
    },
    {
      id: 5,
      type: 'litter_announced',
      message: '3 neue Würfe angekündigt',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      icon: 'CalendarIcon'
    },
    {
      id: 6,
      type: 'website_updated',
      message: '7 Züchter-Websites aktualisiert',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      icon: 'GlobeAltIcon'
    }
  ]

  res.json(activities)
})

// Breeder routes - vor dem 404 Handler
app.get('/api/breeders', (req, res) => {
	const mockBreeders = [
		{
			id: 'test-1',
			name: 'Max Mustermann',
			kennelName: 'vom Schwarzen Wald',
			location: 'München, Deutschland',
			experience: '5 Jahre',
			specialization: 'Arbeitslinie',
			dogs: 3,
			litters: 2,
			contact: 'max.mustermann@email.de',
			phone: '+49 89 12345678',
			website: 'https://www.hovawart-muenchen.de',
			roles: ['BREEDER'],
			mainImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
			gallery: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face']
		}
	]
	res.json(mockBreeders)
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Hovawart API running on port ${PORT}`)
})
