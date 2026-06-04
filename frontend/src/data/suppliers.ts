// Mock Suppliers — 50 suppliers with full data
import type { Supplier } from '@/types';
import { computeTrustScore, getTrustBadge } from '@/lib/trustScore';

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.520, lng: 73.856 },
  { city: 'Thane', state: 'Maharashtra', lat: 19.218, lng: 72.978 },
  { city: 'Navi Mumbai', state: 'Maharashtra', lat: 19.033, lng: 73.029 },
  { city: 'Nashik', state: 'Maharashtra', lat: 19.997, lng: 73.789 },
];

const AREAS = [
  'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Powai',
  'Worli', 'Kurla', 'Mulund', 'Goregaon', 'Malad',
  'Vashi', 'Airoli', 'Kopar Khairane', 'Belapur', 'Kharghar',
  'Kothrud', 'Wakad', 'Hinjewadi', 'Shivaji Nagar', 'Hadapsar',
];

const NAMES = [
  'AquaPure Solutions', 'ClearWater Pvt Ltd', 'HydroFlow Enterprises',
  'PureSpring Water Co', 'BlueTide Logistics', 'AquaFirst Services',
  'CrystalDrop Water', 'PureLife Hydro', 'WaterWell India',
  'AquaVision Systems', 'NatureFlow Water', 'PurePath Aqua',
  'RainDrop Services', 'AquaStream Ltd', 'FreshWater Hub',
  'OceanBlue Tankers', 'SkyWater Solutions', 'EarthSpring Aqua',
  'SilverDrop Water', 'AquaMaster Pro', 'WaterGenie India',
  'ClearPath Aqua', 'HydroElite Services', 'PureZone Water',
  'AquaLogic Ltd', 'BlueSpring Co', 'WaterStar Enterprises',
  'AquaCore Systems', 'PureHarvest Water', 'HydroMax Pvt Ltd',
  'WaterBridge Services', 'AquaPeak Solutions', 'ClearRiver Aqua',
  'PureDepth Water', 'HydroBliss India', 'WaterCraft Logistics',
  'AquaGold Services', 'PureTide Solutions', 'HydroNest Water',
  'WaterFlow Pro', 'AquaVibe India', 'PureGlacier Aqua',
  'HydroSpark Services', 'WaterPulse Ltd', 'AquaEdge Systems',
  'PureWave Water', 'HydroLink Enterprises', 'WaterShield India',
  'AquaRidge Solutions', 'PureCrest Water',
];

const DESCRIPTIONS = [
  'Leading water tanker service with ISO certification and state-of-the-art purification technology.',
  'Trusted water supplier serving residential and commercial clients for over 10 years.',
  'Premium water logistics with real-time tracking and guaranteed quality delivery.',
  'Certified water service provider with FDA-approved purification systems.',
  'Community-focused water supplier committed to quality, affordability, and reliability.',
];

function makeSupplier(index: number): Supplier {
  const location = CITIES[index % CITIES.length];
  const area1 = AREAS[(index * 3) % AREAS.length];
  const area2 = AREAS[(index * 3 + 1) % AREAS.length];
  const area3 = AREAS[(index * 3 + 2) % AREAS.length];

  const tds         = 80 + (index * 7 % 400);
  const ph          = parseFloat((6.5 + (index * 0.04 % 2)).toFixed(1));
  const hardness    = 50 + (index * 11 % 200);
  const turbidity   = parseFloat((0.1 + (index * 0.03 % 3)).toFixed(1));
  const qualityScore = Math.round(100 - tds / 5 - hardness / 10 + 40);
  const boundedQS    = Math.min(98, Math.max(45, qualityScore));

  const rating       = parseFloat((3.5 + (index * 0.037 % 1.5)).toFixed(1));
  const reviewCount  = 20 + (index * 17 % 180);
  const totalOrders  = 100 + index * 23;
  const completedOrders = Math.round(totalOrders * (0.88 + (index % 10) * 0.01));
  const pricePerKL   = 400 + (index * 30 % 800);

  const aadhaarV  = index % 5 !== 0 ? 'verified' : 'pending';
  const gstV      = index % 7 !== 3 ? 'verified' : 'pending';
  const businessV = index % 6 !== 2 ? 'verified' : 'pending';
  const fssaiV    = index % 4 !== 1 ? 'verified' : 'rejected';

  const allVerified =
    aadhaarV === 'verified' && gstV === 'verified' &&
    businessV === 'verified' && fssaiV === 'verified';
  const anyRejected = fssaiV === 'rejected';
  const overallStatus = anyRejected ? 'rejected' : allVerified ? 'verified' : 'pending';

  const partial: Partial<Supplier> = {
    rating, reviewCount, totalOrders, completedOrders,
    waterQuality: { tds, ph, hardness, turbidity, qualityScore: boundedQS, lastTested: '2026-05-20' },
    verification: { aadhaar: aadhaarV as any, gst: gstV as any, business: businessV as any, fssai: fssaiV as any, overallStatus: overallStatus as any },
  };

  const trustScore = computeTrustScore(partial);
  const trustBadge = getTrustBadge(trustScore);

  return {
    id: `sup_${String(index + 1).padStart(3, '0')}`,
    userId: `usr_sup_${index + 1}`,
    businessName: NAMES[index],
    ownerName: `Owner ${index + 1}`,
    email: `supplier${index + 1}@aquanovax.com`,
    phone: `+91 9${String(index + 1).padStart(9, '0').slice(0, 9)}`,
    address: {
      street: `${100 + index} ${area1} Road`,
      city: location.city,
      state: location.state,
      pincode: `4${String(10000 + index).slice(0, 5)}`,
      lat: location.lat + (index * 0.003 % 0.1),
      lng: location.lng + (index * 0.003 % 0.1),
    },
    serviceAreas: [area1, area2, area3],
    pricePerKL,
    minOrder: 1000,
    maxCapacity: 5000 + (index * 500 % 25000),
    totalOrders,
    completedOrders,
    rating,
    reviewCount,
    trustScore,
    trustBadge,
    waterQuality: {
      tds, ph, hardness, turbidity,
      qualityScore: boundedQS,
      lastTested: `2026-0${(index % 5) + 1}-${String((index % 28) + 1).padStart(2, '0')}`,
    },
    verification: {
      aadhaar: aadhaarV as any,
      gst: gstV as any,
      business: businessV as any,
      fssai: fssaiV as any,
      overallStatus: overallStatus as any,
    },
    isActive: index % 12 !== 11,
    joinedAt: `202${3 + (index % 3)}-0${(index % 12) + 1}-01`,
    description: DESCRIPTIONS[index % DESCRIPTIONS.length],
    deliveryTime: ['1-2 hours', '2-4 hours', '3-5 hours', 'Same Day', '4-6 hours'][index % 5],
  };
}

export const SUPPLIERS: Supplier[] = Array.from({ length: 50 }, (_, i) => makeSupplier(i));

export function getSupplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find(s => s.id === id);
}
