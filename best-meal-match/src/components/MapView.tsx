import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { ScoredResource } from '../types/index';
import styles from './MapView.module.css';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  results: ScoredResource[];
  homeLat: number;
  homeLng: number;
}

function createNumberedIcon(num: number): L.DivIcon {
  return L.divIcon({
    className: styles.markerIcon,
    html: `<div style="background:#2d6a4f;color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${num}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const homeIcon = L.divIcon({
  className: styles.markerIcon,
  html: `<div style="background:#d32f2f;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🏠</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function MapView({ results, homeLat, homeLng }: MapViewProps) {
  return (
    <div className={styles.mapWrapper}>
      <MapContainer center={[homeLat, homeLng]} zoom={11} className={styles.map} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[homeLat, homeLng]} icon={homeIcon}>
          <Popup>📍 Your Location</Popup>
        </Marker>
        {results.map((result, i) => (
          <Marker key={result.resource.id} position={[result.resource.lat, result.resource.lng]} icon={createNumberedIcon(i + 1)}>
            <Popup>
              <strong>{result.resource.organizationName}</strong><br />
              {result.resource.address}<br />
              {result.distanceMiles.toFixed(1)} miles away<br />
              {result.resource.operatingHours}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
