"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "@/styles/Maps.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Pasture {
  _id:string,
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
  hasParkourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: {
    id: number;
    user: string;
    text: string;
    rating: number;
  }[];
  rating: number;
  extraInfo: string;
}

interface MarkerData {
  id: string;
  position: [number, number];
  label: string;
  address: string;
  rating: number;
  amenities: string[];
  icon: L.Icon;
}

const getIcon = (type: string) =>
  new L.Icon({
    iconUrl: `/leaflet/marker-${type}.png`,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [17.5, -35],
  });

const parsePastureMarkers = (pastures: Pasture[]): MarkerData[] => {
  const icon = getIcon("pastures");

  return pastures
    .filter((p) => p.location?.latitude && p.location?.longitude)
    .map((pasture, idx) => {
      const amenities: string[] = [
        pasture.hasWaterFountain && "Drinkfontein",
        pasture.hasWaterPool && "Waterspeelzone",
        pasture.hasShade && "Schaduw",
        pasture.hasTrashbin && "Vuilnisbak",
        pasture.hasParkourObstacles && "Parcours obstakels",
        pasture.hasEveningLight && "Verlichting",
        pasture.isFenced && `Afgesloten (${pasture.fenceDetail})`,
        pasture.benchCount > 0 && `${pasture.benchCount} zitbanken`,
        ...pasture.groundTypes.map((type) => `Bodem: ${type}`),
      ].filter(Boolean) as string[];

      return {
        id: `${idx}-${pasture.address}`,
        position: [pasture.location.latitude, pasture.location.longitude],
        label: pasture.dogParkName || "Naam onbekend",
        address: pasture.address,
        rating: pasture.rating,
        amenities,
        icon,
      };
    });
};

const normalizePasturesData = (data: any[]): Pasture[] => {
  return data.map((p) => ({
    _id : p._id,
    area: p.area ?? "",
    dogParkName: p.dogParkName ?? null,
    address: p.address ?? "Onbekend adres",
    location: {
      latitude: p.location?.latitude ?? 0,
      longitude: p.location?.longitude ?? 0,
    },
    size: p.size ?? "Onbekend",
    benchCount: typeof p.benchCount === "number" ? p.benchCount : 0,
    hasShade: !!p.hasShade,
    hasTrashbin: !!p.hasTrashbin,
    hasWaterFountain: !!p.hasWaterFountain,
    waterFountainDetail: p.waterFountainDetail ?? "",
    hasWaterPool: !!p.hasWaterPool,
    hasParkourObstacles: !!p.hasParkourObstacles,
    hasEveningLight: !!p.hasEveningLight,
    isFenced: !!p.isFenced,
    fenceDetail: p.fenceDetail ?? "",
    groundTypes: Array.isArray(p.groundTypes) ? p.groundTypes : [],
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    rating: typeof p.rating === "number" ? p.rating : 0,
    extraInfo: p.extraInfo ?? "",
  }));
};

const LeafletMap: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastures = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pastures");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const normalized = normalizePasturesData(data);
        const parsedMarkers = parsePastureMarkers(normalized);
        setMarkers(parsedMarkers);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPastures();
  }, []);

  if (loading) return <p>Loading pastures...</p>;
  if (error) return <p>Error loading pastures: {error}</p>;

  return (
    <MapContainer center={[51.2194, 4.4025]} zoom={12} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(
        ({ id, label, position, icon, address, rating, amenities }) => (
          <Marker key={id} position={position} icon={icon} title={label}>
            <Popup>
              <strong>{label}</strong>
              <br />
              {address}
              <br />
              Beoordeling: {rating.toFixed(1)}
              <br />
              Voorzieningen: {amenities.join(", ")}
              <Link href={`/details/${id}`} target="_blank" rel="noopener noreferrer" className={styles.popupLink}>
  Bekijk details
</Link>

            </Popup>
          </Marker>
        )
      )}
    </MapContainer>
  );
};

export default LeafletMap;
