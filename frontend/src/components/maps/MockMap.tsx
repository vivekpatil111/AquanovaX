// Mock Map component — SVG-based GPS visualization
import { cn } from '@/lib/utils';
import { MapPin, Navigation, Truck, Home } from 'lucide-react';
import type { Coordinates } from '@/types';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'driver' | 'customer' | 'supplier' | 'depot';
  label?: string;
  isAnimated?: boolean;
}

interface MockMapProps {
  points?: MapPoint[];
  routePoints?: Coordinates[];
  height?: string;
  className?: string;
  zoom?: number;
  showGrid?: boolean;
}

// Normalize lat/lng to pixel space
function toPixel(
  lat: number, lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number, height: number,
  padding = 40
): { x: number; y: number } {
  const latRange = bounds.maxLat - bounds.minLat || 0.1;
  const lngRange = bounds.maxLng - bounds.minLng || 0.1;
  const x = padding + ((lng - bounds.minLng) / lngRange) * (width - padding * 2);
  const y = padding + ((bounds.maxLat - lat) / latRange) * (height - padding * 2);
  return { x, y };
}

const POINT_ICONS: Record<MapPoint['type'], typeof MapPin> = {
  driver:   Truck,
  customer: Home,
  supplier: MapPin,
  depot:    Navigation,
};

const POINT_COLORS: Record<MapPoint['type'], string> = {
  driver:   '#0EA5E9',
  customer: '#10B981',
  supplier: '#F59E0B',
  depot:    '#8B5CF6',
};

export function MockMap({ points = [], routePoints = [], height = '300px', className, showGrid = true }: MockMapProps) {
  const allCoords = [
    ...points.map(p => ({ lat: p.lat, lng: p.lng })),
    ...routePoints,
  ];

  if (allCoords.length === 0) {
    allCoords.push(
      { lat: 19.07, lng: 72.87 },
      { lat: 19.10, lng: 72.90 },
    );
  }

  const lats = allCoords.map(c => c.lat);
  const lngs = allCoords.map(c => c.lng);
  const bounds = {
    minLat: Math.min(...lats) - 0.01,
    maxLat: Math.max(...lats) + 0.01,
    minLng: Math.min(...lngs) - 0.01,
    maxLng: Math.max(...lngs) + 0.01,
  };

  const W = 600;
  const H = 300;

  const routePixels = routePoints.map(p => toPixel(p.lat, p.lng, bounds, W, H));
  const pointPixels = points.map(p => ({
    ...p,
    ...toPixel(p.lat, p.lng, bounds, W, H),
  }));

  return (
    <div
      className={cn('map-container relative', className)}
      style={{ height }}
    >
      {/* Background grid */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Road grid */}
        {showGrid && (
          <g opacity="0.3">
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={(H / 8) * i} x2={W} y2={(H / 8) * i}
                stroke="#94A3B8" strokeWidth="1" />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`v${i}`} x1={(W / 12) * i} y1={0} x2={(W / 12) * i} y2={H}
                stroke="#94A3B8" strokeWidth="1" />
            ))}
            {/* Road highlights */}
            <line x1={0} y1={H * 0.4} x2={W} y2={H * 0.4} stroke="#CBD5E1" strokeWidth="3" />
            <line x1={W * 0.35} y1={0} x2={W * 0.35} y2={H} stroke="#CBD5E1" strokeWidth="3" />
            <line x1={W * 0.65} y1={0} x2={W * 0.65} y2={H} stroke="#CBD5E1" strokeWidth="3" />
          </g>
        )}

        {/* City area fills */}
        <rect x={W*0.1} y={H*0.1} width={W*0.25} height={H*0.3} rx="4" fill="#E0F2FE" opacity="0.5" />
        <rect x={W*0.5} y={H*0.15} width={W*0.2} height={H*0.25} rx="4" fill="#DCF9EC" opacity="0.5" />
        <rect x={W*0.7} y={H*0.55} width={W*0.15} height={H*0.2} rx="4" fill="#FEF3C7" opacity="0.5" />

        {/* Route line */}
        {routePixels.length >= 2 && (
          <>
            <polyline
              points={routePixels.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
              opacity="0.8"
            />
            {/* Route direction arrows */}
            {routePixels.slice(0, -1).map((p, i) => {
              const next = routePixels[i + 1];
              const mx = (p.x + next.x) / 2;
              const my = (p.y + next.y) / 2;
              return (
                <circle key={i} cx={mx} cy={my} r="3" fill="#0EA5E9" opacity="0.7" />
              );
            })}
          </>
        )}

        {/* Points */}
        {pointPixels.map(pt => (
          <g key={pt.id}>
            {pt.isAnimated && (
              <circle cx={pt.x} cy={pt.y} r="18" fill={POINT_COLORS[pt.type]} opacity="0.15">
                <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={pt.x} cy={pt.y} r="10"
              fill={POINT_COLORS[pt.type]}
              stroke="white"
              strokeWidth="2"
              className="drop-shadow"
            />
            {pt.label && (
              <text x={pt.x} y={pt.y + 22} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">
                {pt.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white/70 px-1.5 py-0.5 rounded">
        AquaMap™ Demo
      </div>

      {/* Legend */}
      {points.length > 0 && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs space-y-1">
          {['driver', 'customer', 'supplier'].includes(points[0]?.type) && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-slate-600">Driver</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Customer</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Simplified heatmap
interface HeatmapProps {
  zones: { zone: string; intensity: number; orders: number }[];
  height?: string;
  className?: string;
}

export function DemandHeatmap({ zones, height = '300px', className }: HeatmapProps) {
  return (
    <div className={cn('map-container', className)} style={{ height }}>
      <svg viewBox="0 0 600 300" className="w-full h-full">
        {/* Background */}
        <rect x={0} y={0} width={600} height={300} fill="#EFF6FF" />

        {/* Grid */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={50 * i} x2={600} y2={50 * i} stroke="#BFDBFE" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`v${i}`} x1={60 * i} y1={0} x2={60 * i} y2={300} stroke="#BFDBFE" strokeWidth="1" />
        ))}

        {/* Heatmap circles */}
        {zones.map((zone, i) => {
          const x = 60 + (i % 4) * 130 + ((i > 3 ? i - 4 : 0) * 10);
          const y = 80 + Math.floor(i / 4) * 100;
          const r = 30 + zone.intensity * 40;
          const opacity = 0.3 + zone.intensity * 0.5;
          const color = zone.intensity > 0.75 ? '#EF4444'
            : zone.intensity > 0.5 ? '#F59E0B'
            : '#10B981';

          return (
            <g key={zone.zone}>
              <circle cx={x} cy={y} r={r} fill={color} opacity={opacity} />
              <circle cx={x} cy={y} r={r * 0.5} fill={color} opacity={opacity + 0.2} />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="white" fontWeight="700">
                {zone.orders}
              </text>
              <text x={x} y={y + r + 12} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">
                {zone.zone}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-xs space-y-1">
        <div className="text-slate-500 font-semibold mb-1">Demand Level</div>
        {[['High', '#EF4444'], ['Medium', '#F59E0B'], ['Low', '#10B981']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white/70 px-1.5 py-0.5 rounded">
        AquaMap™ Heatmap
      </div>
    </div>
  );
}
