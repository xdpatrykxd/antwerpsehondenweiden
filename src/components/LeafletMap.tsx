'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "@/styles/Maps.module.css";
import { useEffect, useState } from 'react';
import parksData from '../data/pastures.json'; // New JSON format

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

const parseDogParkMarkers = (parks: DogPark[]): MarkerData[] => {
  const icon = getIcon('pastures');

  return parks
    .filter((park) => park.location && park.location.latitude && park.location.longitude) // ✅ filter out invalid locations
    .map((park, idx) => {
      const amenities: string[] = [
        park.hasWaterFountain && "Drinkfontein",
        park.hasWaterPool && "Waterspeelzone",
        park.hasShade && "Schaduw",
        park.hasTrashbin && "Vuilnisbak",
        park.hasParcourObstacles && "Parcours obstakels",
        park.hasEveningLight && "Verlichting",
        park.isFenced && `Afgesloten (${park.fenceDetail})`,
        park.benchCount > 0 && `${park.benchCount} zitbanken`,
        ...park.groundTypes.map((type) => `Bodem: ${type}`),
      ].filter(Boolean) as string[];

      return {
        id: `${idx}-${park.address}`,
        position: [park.location.latitude, park.location.longitude],
        label: park.dogParkName || "Naam onbekend",
        address: park.address,
        rating: park.rating,
        amenities,
        icon,
      };
    });
};

const LeafletMap: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const parsed = parseDogParkMarkers(parksData);
    setMarkers(parsed);
  }, []);

  return (
    <MapContainer center={[51.2194, 4.4025]} zoom={12} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {markers.map(({ id, label, position, icon, address, rating, amenities }) => (
        <Marker key={id} position={position} icon={icon}>
          <Popup>
            <strong>{label}</strong><br />
            {address}<br />
            Beoordeling: {rating.toFixed(1)}<br />
            Voorzieningen: {amenities.join(', ')}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
