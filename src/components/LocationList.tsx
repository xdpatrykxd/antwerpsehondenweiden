"use client";

import { useState } from "react";
import { ZoneCard } from "./ZoneCard";
import styles from "../styles/LocationList.module.css";
import dogParksRaw from "../data/pastures.json";

interface DogPark {
  area: string;
  dogParkName: string | null;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  size: string;
  benchCount: number;
  hasShade: boolean;
  hasTrashbin: boolean;
  hasWaterFountain: boolean;
  waterFountainDetail: string;
  hasWaterPool: boolean;
  hasParcourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: any[];
  rating: number;
  extraInfo: string;
}

// ✅ Normalize parks so that nulls become safe values
const normalizedParks: DogPark[] = (dogParksRaw as any[]).map((park) => ({
  area: park.area || "Onbekend",
  dogParkName: park.dogParkName ?? null,
  address: park.address || "Onbekend adres",
  location: {
    latitude: park.location?.latitude ?? 0,
    longitude: park.location?.longitude ?? 0,
  },
  size: park.size || "Unknown",
  benchCount: park.benchCount ?? 0,
  hasShade: !!park.hasShade,
  hasTrashbin: !!park.hasTrashbin,
  hasWaterFountain: !!park.hasWaterFountain,
  waterFountainDetail: park.waterFountainDetail ?? "",
  hasWaterPool: !!park.hasWaterPool,
  hasParcourObstacles: !!park.hasParcourObstacles,
  hasEveningLight: !!park.hasEveningLight,
  isFenced: !!park.isFenced,
  fenceDetail: park.fenceDetail ?? "",
  groundTypes: park.groundTypes ?? [],
  reviews: park.reviews ?? [],
  rating: park.rating ?? 0,
  extraInfo: park.extraInfo ?? "",
}));

// ✅ Group by area
const groupedByArea: Record<string, DogPark[]> = {};
normalizedParks.forEach((park) => {
  if (!groupedByArea[park.area]) groupedByArea[park.area] = [];
  groupedByArea[park.area].push(park);
});

const areas = Object.keys(groupedByArea);

export function LocationList() {
  const [selectedArea, setSelectedArea] = useState<string>(areas[0] || "");
  const dogParks = groupedByArea[selectedArea] || [];

  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.locationTabs}>
          {areas.map((area) => (
            <button
              key={area}
              className={`${styles.tabButton} ${
                selectedArea === area ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedArea(area)}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {dogParks.length > 0 ? (
          <div className={styles.zoneContent}>
            <h2 className={styles.zoneTitle}>Hondenzones in {selectedArea}</h2>
            <div className={styles.zoneGrid}>
              {dogParks.map((park, index) => (
                <ZoneCard key={index} zone={park} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Geen hondenzones beschikbaar</h3>
            <p>Probeer een andere locatie</p>
          </div>
        )}
      </div>
    </div>
  );
}
