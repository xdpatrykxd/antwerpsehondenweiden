"use client";

import { useState, useEffect } from "react";
import { ZoneCard } from "./ZoneCard";
import styles from "../styles/LocationList.module.css";

interface Review {
  id: number;
  user: string;
  text: string;
  rating: number;
}

interface Pasture {
  _id?: string;
  area: string;
  image: string;
  dogParkName: string;
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
  hasParkourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: Review[];
  rating: number;
  extraInfo: string;
}

const FILTER_OPTIONS = [
  { key: "isFenced", label: "Afgesloten" },
  { key: "hasWaterPool", label: "Waterspeelzone" },
  { key: "hasShade", label: "Schaduw" },
  { key: "hasTrashbin", label: "Vuilnisbak" },
  { key: "hasWaterFountain", label: "Drinkfontein" },
  { key: "hasParkourObstacles", label: "Parcours obstakels" },
  { key: "hasEveningLight", label: "Verlichting" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

export function LocationList() {
  const [pasturesRaw, setPasturesRaw] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("Alle gebieden");
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);

  useEffect(() => {
    async function fetchPastures() {
      try {
        const res = await fetch("/api/pastures");
        if (!res.ok) throw new Error("Failed to fetch pastures");
        const data = await res.json();
        setPasturesRaw(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPastures();
  }, []);

  // Normalize pastures data
  const normalizedPastures: Pasture[] = pasturesRaw.map((pasture) => ({
    _id: pasture._id?.toString() ?? undefined,
    area: pasture.area || "Onbekend",
    dogParkName: pasture.dogParkName ?? "Naam onbekend",
    address: pasture.address || "Onbekend adres",
    location: {
      latitude: pasture.location?.latitude ?? 0,
      longitude: pasture.location?.longitude ?? 0,
    },
    size: pasture.size || "Unknown",
    benchCount: pasture.benchCount ?? 0,
    hasShade: !!pasture.hasShade,
    hasTrashbin: !!pasture.hasTrashbin,
    hasWaterFountain: !!pasture.hasWaterFountain,
    waterFountainDetail: pasture.waterFountainDetail ?? "",
    hasWaterPool: !!pasture.hasWaterPool,
    hasParkourObstacles: !!pasture.hasParkourObstacles,
    hasEveningLight: !!pasture.hasEveningLight,
    isFenced: !!pasture.isFenced,
    fenceDetail: pasture.fenceDetail ?? "",
    groundTypes: pasture.groundTypes ?? [],
    reviews: pasture.reviews ?? [],
    rating: pasture.rating ?? 0,
    extraInfo: pasture.extraInfo ?? "",
    image: pasture.image ?? "/placeholder.svg",
  }));

  // Group by area
  const groupedByArea: Record<string, Pasture[]> = {};
  normalizedPastures.forEach((pasture) => {
    if (!groupedByArea[pasture.area]) groupedByArea[pasture.area] = [];
    groupedByArea[pasture.area].push(pasture);
  });

  const areas = ["Alle gebieden", ...Object.keys(groupedByArea)];

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const pasturesInArea =
    selectedArea === "Alle gebieden"
      ? normalizedPastures
      : groupedByArea[selectedArea] || [];

  const filteredPastures = pasturesInArea.filter((pasture) =>
    activeFilters.every((key) => pasture[key])
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
        {filteredPastures.length > 0 ? (
          <div className={styles.zoneContent}>
            <h2 className={styles.zoneTitle}>
              Hondenzones in{" "}
              {selectedArea === "Alle gebieden" ? "alle gebieden" : selectedArea}
            </h2>
            <div className={styles.zoneGrid}>
              {filteredPastures.map((pasture) => (
                <ZoneCard key={pasture._id || pasture.dogParkName} zone={pasture} />
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
