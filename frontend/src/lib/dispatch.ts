// Dispatch Engine — AquaTrack Logistics Intelligence
import type { Driver, Tanker, Order, Coordinates } from '@/types';
import { distanceKm } from './utils';

export interface DispatchResult {
  driver: Driver;
  tanker: Tanker;
  score: number;
  estimatedArrivalMinutes: number;
}

// Auto-assign best driver+tanker for an order
export function autoDispatch(
  order: Order,
  availableDrivers: Driver[],
  availableTankers: Tanker[]
): DispatchResult | null {
  const candidates: DispatchResult[] = [];

  for (const driver of availableDrivers) {
    if (!driver.isAvailable) continue;

    // Find tanker assigned to driver with enough capacity
    const tanker = availableTankers.find(
      t => driver.tankerIds.includes(t.id) &&
           t.status === 'available' &&
           t.capacity >= order.quantity
    );
    if (!tanker) continue;

    const driverLat = driver.currentLocation?.lat ?? 19.07;
    const driverLng = driver.currentLocation?.lng ?? 72.87;
    const destLat   = order.deliveryAddress.lat ?? 19.07;
    const destLng   = order.deliveryAddress.lng ?? 72.87;

    const dist = distanceKm(driverLat, driverLng, destLat, destLng);
    const eta  = Math.round(dist / 30 * 60 + 10); // ~30 km/h avg, +10 min buffer

    // Score: proximity (60%) + driver rating (25%) + completion rate (15%)
    const proximityScore = Math.max(0, 1 - dist / 20);
    const ratingScore    = driver.rating / 5;
    const completionRate = driver.totalDeliveries > 0
      ? driver.completedDeliveries / driver.totalDeliveries
      : 0;

    const score = proximityScore * 0.6 + ratingScore * 0.25 + completionRate * 0.15;

    candidates.push({ driver, tanker, score, estimatedArrivalMinutes: eta });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] ?? null;
}

// Nearest-neighbor route optimization (mock TSP)
export function optimizeRoute(stops: Coordinates[]): Coordinates[] {
  if (stops.length <= 2) return stops;

  const visited = new Set<number>();
  const result: Coordinates[] = [stops[0]];
  visited.add(0);

  while (result.length < stops.length) {
    const current = result[result.length - 1];
    let nearest = -1;
    let minDist = Infinity;

    for (let i = 0; i < stops.length; i++) {
      if (visited.has(i)) continue;
      const d = distanceKm(current.lat, current.lng, stops[i].lat, stops[i].lng);
      if (d < minDist) { minDist = d; nearest = i; }
    }

    if (nearest === -1) break;
    result.push(stops[nearest]);
    visited.add(nearest);
  }

  return result;
}

// ETA prediction based on distance and time-of-day
export function predictETA(distanceKm: number, hour: number): number {
  // Peak hours: 8-10am, 5-8pm
  const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
  const avgSpeed = isPeak ? 20 : 35; // km/h
  const eta = Math.round((distanceKm / avgSpeed) * 60 + 8);
  return eta;
}
