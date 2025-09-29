import { type NextRequest, NextResponse } from "next/server"

const MAPBOX_TOKEN =
  process.env.MAPBOX_TOKEN ||
  "sk.eyJ1IjoibXV0aGFzc2ltNCIsImEiOiJjbWcyaW5zOTgxMTRyMmtzOTQydDNjbzN1In0.GzRk_OFR53CrS2r6cspn-w"
const BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"

// IP থেকে coordinates পাওয়ার ফাংশন
async function ipToCoords(ip: string): Promise<{ lon: number; lat: number } | null> {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`, {
      method: "GET",
      headers: {
        "User-Agent": "AddressGenerator/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`IP API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.loc) {
      const [lat, lon] = data.loc.split(",").map(Number)
      return { lon, lat } // Mapbox expects lon, lat
    }

    return null
  } catch (error) {
    console.error("IP to coords error:", error)
    return null
  }
}

// Coordinates থেকে addresses পাওয়ার ফাংশন
async function coordsToAddresses(lon: number, lat: number, limit = 5): Promise<string[]> {
  try {
    const url = `${BASE_URL}/${lon},${lat}.json`
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types: "address",
      limit: limit.toString(),
    })

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "User-Agent": "AddressGenerator/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`)
    }

    const data = await response.json()
    const addresses: string[] = []

    if (data.features) {
      for (const feature of data.features) {
        if (feature.place_name) {
          addresses.push(feature.place_name)
        }
      }
    }

    return addresses
  } catch (error) {
    console.error("Coords to addresses error:", error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json()

    if (!ip || typeof ip !== "string") {
      return NextResponse.json({ success: false, error: "IP ঠিকানা প্রয়োজন" }, { status: 400 })
    }

    // IP validation (basic)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(ip)) {
      return NextResponse.json({ success: false, error: "ভালো IP ঠিকানা দিন" }, { status: 400 })
    }

    // IP থেকে coordinates পাওয়া
    const coords = await ipToCoords(ip)

    if (!coords) {
      return NextResponse.json({ success: false, error: "IP ঠিকানা রেজলভ করতে পারছি না" }, { status: 400 })
    }

    // Coordinates থেকে addresses পাওয়া
    const addresses = await coordsToAddresses(coords.lon, coords.lat, 5)

    if (addresses.length === 0) {
      return NextResponse.json({ success: false, error: "কোনো এড্রেস পাওয়া যায়নি" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      addresses,
      coordinates: coords,
      count: addresses.length,
    })
  } catch (error) {
    console.error("IP address generator error:", error)
    return NextResponse.json({ success: false, error: "সার্ভার এরর" }, { status: 500 })
  }
}
