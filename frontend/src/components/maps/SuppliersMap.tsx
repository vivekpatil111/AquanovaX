import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Point {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  type?: string;
}

interface SuppliersMapProps {
  points: Point[];
  height?: string;
}

export function SuppliersMap({ points, height = '400px' }: SuppliersMapProps) {
  // Center map on the first point, or default to Mumbai coordinates
  const center = points.length > 0 ? { lat: points[0].lat, lng: points[0].lng } : { lat: 19.07, lng: 72.87 };

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer 
        center={center as [number, number]} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        {points.map(point => (
          <Marker key={point.id} position={[point.lat, point.lng]}>
            <Popup>{point.label || 'Supplier'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
