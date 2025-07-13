
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '@/styles/Maps.module.css';

interface PastureMapProps {
  latitude: number;
  longitude: number;
  dogParkName?: string | null;
  address?: string;
}

const icon = new L.Icon({
  iconUrl: '/leaflet/marker-pastures.png',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [17.5, -35],
});

export default function PastureMap({
  latitude,
  longitude,
  dogParkName = 'Naam onbekend',
  address = 'Adres onbekend',
}: PastureMapProps) {
  // Create Google Maps route URL from user's location to pasture
  const handleGetRouteClick = () => {
    // Google Maps URL with destination lat,lng - user's location is "current location"
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[latitude, longitude]} icon={icon}>
          <Popup>
            <strong>{dogParkName}</strong>
            <br />
            {address}
            <br />
            <button
              onClick={handleGetRouteClick}
              style={{
                marginTop: '0.5rem',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0070f3',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Route plannen
            </button>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
