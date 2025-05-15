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

// Normalize parks
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

// Group by area
const groupedByArea: Record<string, DogPark[]> = {};
normalizedParks.forEach((park) => {
  if (!groupedByArea[park.area]) groupedByArea[park.area] = [];
  groupedByArea[park.area].push(park);
});

const areas = ["Alle gebieden", ...Object.keys(groupedByArea)];

// Filter options
const FILTER_OPTIONS = [
  { key: "isFenced", label: "Afgesloten" },
  { key: "hasWaterPool", label: "Waterspeelzone" },
  { key: "hasShade", label: "Schaduw" },
  { key: "hasTrashbin", label: "Vuilnisbak" },
  { key: "hasWaterFountain", label: "Drinkfontein" },
  { key: "hasParcourObstacles", label: "Parcours obstakels" },
  { key: "hasEveningLight", label: "Verlichting" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

export function LocationList() {
  const [selectedArea, setSelectedArea] = useState<string>("Alle gebieden");
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const parksInArea =
    selectedArea === "Alle gebieden"
      ? normalizedParks
      : groupedByArea[selectedArea] || [];

  const filteredParks = parksInArea.filter((park) =>
    activeFilters.every((key) => park[key])
  );

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

        <div className={styles.filters}>
          {FILTER_OPTIONS.map(({ key, label }) => (
            <label key={key} className={styles.filterCheckbox}>
              <input
                type="checkbox"
                checked={activeFilters.includes(key)}
                onChange={() => toggleFilter(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {filteredParks.length > 0 ? (
          <div className={styles.zoneContent}>
            <h2 className={styles.zoneTitle}>
              Hondenzones in{" "}
              {selectedArea === "Alle gebieden" ? "alle gebieden" : selectedArea}
            </h2>
            <div className={styles.zoneGrid}>
              {filteredParks.map((park, index) => (
                <ZoneCard key={index} zone={park} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Geen hondenzones beschikbaar</h3>
            <p>Pas je filters aan of kies een andere locatie</p>
          </div>
        )}
      </div>
    </div>
  );
}
