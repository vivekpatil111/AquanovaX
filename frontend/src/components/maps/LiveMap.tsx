import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const tankerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/411/411712.png', // Delivery Truck
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const homeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface LiveMapProps {
  routePoints: { lat: number; lng: number }[];
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
  height?: string;
}

export function LiveMap({ routePoints, startPoint, endPoint, height = '400px' }: LiveMapProps) {
  const [currentPosition, setCurrentPosition] = useState(startPoint);
  const [progress, setProgress] = useState(0);

  // Animate Tanker movement along the route
  useEffect(() => {
    if (routePoints.length === 0) return;
    
    let interval: any;
    let step = 0;
    const totalSteps = 100;
    
    interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      setProgress(step);
      
      // Interpolate position based on progress (simplistic animation for demo)
      const ratio = step / totalSteps;
      
      // Find segment
      const segmentCount = routePoints.length - 1;
      const exactIndex = ratio * segmentCount;
      const lowerIndex = Math.floor(exactIndex);
      const upperIndex = Math.min(lowerIndex + 1, segmentCount);
      const segmentRatio = exactIndex - lowerIndex;
      
      if (lowerIndex >= 0 && upperIndex < routePoints.length) {
        const p1 = routePoints[lowerIndex];
        const p2 = routePoints[upperIndex];
        
        setCurrentPosition({
          lat: p1.lat + (p2.lat - p1.lat) * segmentRatio,
          lng: p1.lng + (p2.lng - p1.lng) * segmentRatio,
        });
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [routePoints]);

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer 
        center={endPoint} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        {/* Customer Location */}
        <Marker position={endPoint} icon={homeIcon}>
          <Popup>Delivery Location</Popup>
        </Marker>

        {/* Route Line */}
        <Polyline positions={routePoints.map(p => [p.lat, p.lng])} color="#0EA5E9" weight={5} opacity={0.7} />

        {/* Moving Tanker */}
        <Marker position={currentPosition} icon={tankerIcon}>
          <Popup>Tanker (In Transit)</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
