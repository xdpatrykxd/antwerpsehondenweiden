"use client"

import { useState } from "react"
import { ZoneCard } from "../components/zone-card"
import styles from "../styles/location-list.module.css"

// Mock data for locations
const locations = [
  {
    id: 1,
    name: "Antwerp",
    zones: [
      {
        id: 101,
        name: "Wilrijk",
        subZones: [
          {
            id: 1001,
            name: "Zone 1",
            address: "Krijgslaan 20, 2610 Wilrijk",
            image: "/placeholder.svg?height=300&width=400",
            amenities: ["Benches", "Water", "Fenced"],
            rating: 4.5,
            reviews: [
              { id: 1, user: "John", text: "Great place for dogs to run!", rating: 5 },
              { id: 2, user: "Sarah", text: "Clean and well maintained.", rating: 4 },
            ],
          },
          {
            id: 1002,
            name: "Zone 2",
            address: "Boomsesteenweg 155, 2610 Wilrijk",
            image: "/placeholder.svg?height=300&width=400",
            amenities: ["Benches", "Fenced"],
            rating: 3.8,
            reviews: [
              { id: 3, user: "Mike", text: "Nice area but could use water bowls.", rating: 3 },
              { id: 4, user: "Lisa", text: "My dog loves it here!", rating: 4 },
            ],
          },
          {
            id: 1003,
            name: "Zone 3",
            address: "Kleine Doornstraat 145, 2610 Wilrijk",
            image: "/placeholder.svg?height=300&width=400",
            amenities: ["Water", "Fenced", "Shade"],
            rating: 4.2,
            reviews: [
              { id: 5, user: "David", text: "Great shade for hot days.", rating: 5 },
              { id: 6, user: "Emma", text: "Good size for small dogs.", rating: 4 },
            ],
          },
        ],
      },
      {
        id: 102,
        name: "Berchem",
        subZones: [
          {
            id: 2001,
            name: "Zone 1",
            address: "Polygoonstraat 16, 2600 Berchem",
            image: "/placeholder.svg?height=300&width=400",
            amenities: ["Benches", "Water", "Fenced", "Agility Equipment"],
            rating: 4.7,
            reviews: [
              { id: 7, user: "Tom", text: "The agility equipment is fantastic!", rating: 5 },
              { id: 8, user: "Anna", text: "Very clean and well maintained.", rating: 5 },
            ],
          },
          {
            id: 2002,
            name: "Zone 2",
            address: "Roderveldlaan 5, 2600 Berchem",
            image: "/placeholder.svg?height=300&width=400",
            amenities: ["Fenced", "Shade"],
            rating: 3.5,
            reviews: [
              { id: 9, user: "Peter", text: "A bit small but nice shade.", rating: 3 },
              { id: 10, user: "Sophie", text: "Good for quick visits.", rating: 4 },
            ],
          },
        ],
      },
    ],
  },
]

export function LocationList() {
  const [expandedLocation, setExpandedLocation] = useState<number | null>(1) // Default to expanded
  const [expandedZone, setExpandedZone] = useState<number | null>(101) // Default to expanded

  const toggleLocation = (locationId: number) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId)
  }

  const toggleZone = (zoneId: number) => {
    setExpandedZone(expandedZone === zoneId ? null : zoneId)
  }

  return (
    <div className={styles.locationList}>
      {locations.map((location) => (
        <div key={location.id} className={styles.location}>
          <button className={styles.locationButton} onClick={() => toggleLocation(location.id)}>
            {location.name} {expandedLocation === location.id ? "▼" : "►"}
          </button>

          {expandedLocation === location.id && (
            <div className={styles.zones}>
              {location.zones.map((zone) => (
                <div key={zone.id} className={styles.zone}>
                  <button className={styles.zoneButton} onClick={() => toggleZone(zone.id)}>
                    {zone.name} ({zone.subZones.length} dog zones) {expandedZone === zone.id ? "▼" : "►"}
                  </button>

                  {expandedZone === zone.id && (
                    <div className={styles.subZones}>
                      {zone.subZones.map((subZone) => (
                        <ZoneCard key={subZone.id} zone={subZone} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
