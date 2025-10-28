import { getApiBase } from 'lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiUrl = getApiBase();
    const response = await fetch(`${apiUrl}/api/litters`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching litters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch litters' },
      { status: 500 }
    )
  }
}



