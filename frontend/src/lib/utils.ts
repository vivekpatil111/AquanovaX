// lib/utils.ts — shared utility helpers

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TrustBadge, RiskLevel, OrderStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a time-aware greeting in India Standard Time (IST, UTC+5:30)
 *  0–11  → Good Morning 🌅
 * 12–16  → Good Afternoon ☀️
 * 17–20  → Good Evening 🌆
 * 21–23  → Good Night 🌙
 */
export function getGreeting(): string {
  const now = new Date();
  // Get current hour in IST (UTC+5:30)
  const istOffset = 5.5 * 60; // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istHour = Math.floor((utcMinutes + istOffset) / 60) % 24;

  if (istHour >= 5 && istHour < 12) return 'Good Morning 🌅';
  if (istHour >= 12 && istHour < 17) return 'Good Afternoon ☀️';
  if (istHour >= 17 && istHour < 21) return 'Good Evening 🌆';
  return 'Good Night 🌙';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  if (days < 7)     return `${days}d ago`;
  return formatDate(dateStr);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getBadgeColor(badge: TrustBadge) {
  const map: Record<TrustBadge, { bg: string; text: string; border: string }> = {
    bronze:   { bg: 'bg-orange-100',  text: 'text-orange-700',  border: 'border-orange-200' },
    silver:   { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200'  },
    gold:     { bg: 'bg-yellow-100',  text: 'text-yellow-700',  border: 'border-yellow-200' },
    platinum: { bg: 'bg-purple-100',  text: 'text-purple-700',  border: 'border-purple-200' },
  };
  return map[badge];
}

export function getBadgeIcon(badge: TrustBadge): string {
  const map: Record<TrustBadge, string> = {
    bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎',
  };
  return map[badge];
}

export function getRiskColor(risk: RiskLevel) {
  const map: Record<RiskLevel, { bg: string; text: string }> = {
    low:    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    medium: { bg: 'bg-amber-100',   text: 'text-amber-700'   },
    high:   { bg: 'bg-red-100',     text: 'text-red-700'     },
  };
  return map[risk];
}

export function getStatusConfig(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
    pending:    { label: 'Pending',     bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
    confirmed:  { label: 'Confirmed',   bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    dispatched: { label: 'Dispatched',  bg: 'bg-indigo-100',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
    en_route:   { label: 'En Route',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    delivered:  { label: 'Delivered',   bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    cancelled:  { label: 'Cancelled',   bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
  };
  return map[status] || { label: status || 'Unknown', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
}

export function getQualityLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600' };
  if (score >= 60) return { label: 'Good',      color: 'text-green-600'   };
  if (score >= 40) return { label: 'Fair',      color: 'text-amber-600'   };
  return { label: 'Poor', color: 'text-red-600' };
}

export function getTDSLabel(tds: number): { label: string; color: string } {
  if (tds <= 150)  return { label: 'Excellent', color: 'text-emerald-600' };
  if (tds <= 300)  return { label: 'Good',      color: 'text-green-600'   };
  if (tds <= 500)  return { label: 'Acceptable', color: 'text-amber-600'  };
  return { label: 'Poor', color: 'text-red-600' };
}

export function getPHLabel(ph: number): { label: string; color: string } {
  if (ph >= 6.5 && ph <= 8.5) return { label: 'Ideal',    color: 'text-emerald-600' };
  if (ph >= 6.0 && ph <= 9.0) return { label: 'Acceptable', color: 'text-amber-600' };
  return { label: 'Unsafe', color: 'text-red-600' };
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function randomBetween(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Haversine distance in km
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}
