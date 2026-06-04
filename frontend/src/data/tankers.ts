// Mock Tankers — 200 tankers
import type { Tanker } from '@/types';
import { SUPPLIERS } from './suppliers';

const STATUSES: Tanker['status'][] = ['available', 'in_use', 'maintenance'];
const TYPES: Tanker['type'][] = ['small', 'medium', 'large'];
const CAPACITIES = { small: 3000, medium: 5000, large: 10000 };

function makeTanker(i: number): Tanker {
  const supplier = SUPPLIERS[i % SUPPLIERS.length];
  const type     = TYPES[i % 3];
  const capacity = CAPACITIES[type];
  const status   = i % 7 === 5 ? 'maintenance' : i % 3 === 0 ? 'in_use' : 'available';

  return {
    id: `tnk_${String(i + 1).padStart(3, '0')}`,
    registrationNumber: `MH${String(10 + (i % 30)).padStart(2,'0')} T ${String(1000 + i * 7).slice(0,4)}`,
    supplierId: supplier.id,
    driverId: i % 4 !== 3 ? `drv_${String((i % 100) + 1).padStart(3,'0')}` : undefined,
    capacity,
    currentLoad: status === 'available' ? capacity : Math.round(capacity * (i * 0.13 % 0.9)),
    type,
    status,
    lastServiced: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2,'0')}`,
    location: {
      lat: 19.07 + (i * 0.005 % 0.3),
      lng: 72.87 + (i * 0.005 % 0.3),
    },
  };
}

export const TANKERS: Tanker[] = Array.from({ length: 200 }, (_, i) => makeTanker(i));

export function getTankerById(id: string): Tanker | undefined {
  return TANKERS.find(t => t.id === id);
}

export function getTankersBySupplier(supplierId: string): Tanker[] {
  return TANKERS.filter(t => t.supplierId === supplierId);
}
