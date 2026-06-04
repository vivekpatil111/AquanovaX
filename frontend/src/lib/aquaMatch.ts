// AquaMatch AI — Supplier Matching & Forecasting Intelligence
import type { Supplier, Coordinates, ForecastData } from '@/types';
import { distanceKm } from './utils';

// Weighted supplier scoring for AquaMatch AI
export interface MatchScore {
  supplier: Supplier;
  score: number;
  matchPercent: number;
  distanceKm: number;
  breakdown: {
    distance: number;
    quality: number;
    price: number;
    rating: number;
  };
}

const WEIGHTS = {
  distance: 0.25,
  quality:  0.35,
  price:    0.25,
  rating:   0.15,
};

export function matchSuppliers(
  suppliers: Supplier[],
  userLocation: Coordinates,
  maxDistanceKm = 30
): MatchScore[] {
  const maxPrice = Math.max(...suppliers.map(s => s.pricePerKL));
  const minPrice = Math.min(...suppliers.map(s => s.pricePerKL));

  const scored = suppliers
    .map(s => {
      const dist = distanceKm(
        userLocation.lat, userLocation.lng,
        s.address.lat ?? 19.07, s.address.lng ?? 72.87
      );
      if (dist > maxDistanceKm) return null;

      const distScore    = Math.max(0, 1 - dist / maxDistanceKm);
      const qualityScore = (s.waterQuality.qualityScore / 100);
      const priceScore   = maxPrice === minPrice ? 1 : 1 - (s.pricePerKL - minPrice) / (maxPrice - minPrice);
      const ratingScore  = s.rating / 5;

      const total =
        distScore * WEIGHTS.distance +
        qualityScore * WEIGHTS.quality +
        priceScore * WEIGHTS.price +
        ratingScore * WEIGHTS.rating;

      return {
        supplier: s,
        score: total,
        matchPercent: Math.round(total * 100),
        distanceKm: dist,
        breakdown: {
          distance: Math.round(distScore * 100),
          quality:  Math.round(qualityScore * 100),
          price:    Math.round(priceScore * 100),
          rating:   Math.round(ratingScore * 100),
        },
      } as MatchScore;
    })
    .filter((x): x is MatchScore => x !== null)
    .sort((a, b) => b.score - a.score);

  return scored;
}

export function generateWeeklyForecast(weeks = 12): ForecastData[] {
  const data: ForecastData[] = [];
  let base = 1200;
  for (let i = 0; i < weeks; i++) {
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * 200;
    const trend = i * 15;
    const noise = (Math.random() - 0.5) * 150;
    base += 5;
    const demand = Math.round(base + seasonal + trend + noise);
    const supply = Math.round(demand * (0.85 + Math.random() * 0.3));
    data.push({
      week: `W${i + 1}`,
      demand,
      supply,
      predicted: Math.round(demand * (1 + 0.02 * i)),
    });
  }
  return data;
}

export function suggestPrice(
  basePrice: number,
  demandIndex: number, // 0-1
  competitorAvgPrice: number
): number {
  const demandPremium = demandIndex * 0.15;
  const competitive = (basePrice + competitorAvgPrice) / 2;
  const suggested = competitive * (1 + demandPremium);
  return Math.round(suggested / 10) * 10;
}
