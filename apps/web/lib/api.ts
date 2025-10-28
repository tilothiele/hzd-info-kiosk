
export function getApiBase() {
    if (typeof window !== "undefined" && (window as any).RUNTIME_API_URL) {
      const rv = (window as any).RUNTIME_API_URL;
      console.log("API Base URL from window:", rv);
      return rv;
    }
    const rv= process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
    console.log("API Base URL:", rv);
    return rv;
  }


export interface Statistics {
  totalDogs: number
  activeBreeders: number
  availableStudDogs: number
  healthTests: number
  totalLitters: number
  registeredUsers: number
}

export interface Activity {
  id: number
  type: string
  message: string
  timestamp: string
  icon: string
}

export async function fetchStatistics(): Promise<Statistics> {
  try {
    const API_BASE_URL = getApiBase();
    const response = await fetch(`${API_BASE_URL}/api/statistics`)
    if (!response.ok) {
      throw new Error('Failed to fetch statistics')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching statistics:', error)
    // Return fallback data
    return {
      totalDogs: 2847,
      activeBreeders: 156,
      availableStudDogs: 23,
      healthTests: 8421,
      totalLitters: 1247,
      registeredUsers: 89
    }
  }
}

export async function fetchActivities(): Promise<Activity[]> {
  try {
    const API_BASE_URL = getApiBase();
    const response = await fetch(`${API_BASE_URL}/api/activities`)
    if (!response.ok) {
      throw new Error('Failed to fetch activities')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching activities:', error)
    // Return fallback data
    return [
      {
        id: 1,
        type: 'dog_registered',
        message: '5 neue Hunde registriert',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: 'CircleStackIcon'
      },
      {
        id: 2,
        type: 'breeder_joined',
        message: '2 neue Züchter beigetreten',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        icon: 'UsersIcon'
      },
      {
        id: 3,
        type: 'stud_available',
        message: '1 Deckrüde verfügbar',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        icon: 'HeartIcon'
      },
      {
        id: 4,
        type: 'health_updated',
        message: '12 Gesundheitsdaten aktualisiert',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        icon: 'ShieldCheckIcon'
      }
    ]
  }
}

// Helper function to format time ago
export function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'vor wenigen Sekunden'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `vor ${days} Tag${days > 1 ? 'en' : ''}`
  }
}
