// Trust Score Engine — AquanovaX Verified Network
import type { TrustBadge, Supplier } from '@/types';

export function computeTrustScore(supplier: Partial<Supplier>): number {
  let score = 0;

  // Verification (30 pts)
  const v = supplier.verification;
  if (v) {
    if (v.aadhaar === 'verified')  score += 8;
    if (v.gst === 'verified')      score += 8;
    if (v.business === 'verified') score += 8;
    if (v.fssai === 'verified')    score += 6;
  }

  // Rating (25 pts)
  const rating = supplier.rating ?? 0;
  score += (rating / 5) * 25;

  // Order completion (20 pts)
  const total = supplier.totalOrders ?? 0;
  const completed = supplier.completedOrders ?? 0;
  if (total > 0) {
    score += (completed / total) * 20;
  }

  // Water quality (15 pts)
  const quality = supplier.waterQuality?.qualityScore ?? 0;
  score += (quality / 100) * 15;

  // Review count bonus (10 pts)
  const reviews = supplier.reviewCount ?? 0;
  score += Math.min(reviews / 50, 1) * 10;

  return Math.round(Math.min(score, 100));
}

export function getTrustBadge(score: number): TrustBadge {
  if (score >= 86) return 'platinum';
  if (score >= 66) return 'gold';
  if (score >= 41) return 'silver';
  return 'bronze';
}

export function getTrustBadgeLabel(badge: TrustBadge): string {
  const map: Record<TrustBadge, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };
  return map[badge];
}

export function computeRiskLevel(
  complaints: number,
  cancellations: number,
  verificationMissing: number
): 'low' | 'medium' | 'high' {
  const riskScore = complaints * 3 + cancellations * 1.5 + verificationMissing * 5;
  if (riskScore > 20) return 'high';
  if (riskScore > 8)  return 'medium';
  return 'low';
}
