// Mock Reviews, Quality Reports, Tracking, Complaints, Wallet, Analytics, Forecasting
import type { Review, QualityReport, WalletTransaction, Complaint, RevenueData, HeatmapZone, ForecastData } from '@/types';
import { SUPPLIERS } from './suppliers';
import { CUSTOMERS } from './customers';
import { ORDERS } from './orders';
import { generateWeeklyForecast } from '@/lib/aquaMatch';

// ── REVIEWS ──────────────────────────────────────────────────
const COMMENTS = [
  'Excellent water quality! Very satisfied with the service.',
  'Delivery was on time and driver was professional.',
  'Good service, but could be faster during peak hours.',
  'Water quality is great. TDS levels were within safe limits.',
  'Very reliable service. Will order again.',
  'Driver was helpful and delivery was smooth.',
  'Slight delay but quality was excellent as always.',
  'Best water supplier in our area. Highly recommended!',
  'Consistent quality across multiple orders.',
  'Affordable pricing with premium quality water.',
];

export const REVIEWS: Review[] = Array.from({ length: 150 }, (_, i) => {
  const order    = ORDERS.filter(o => o.status === 'delivered')[i % 200];
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  const supplier = SUPPLIERS[i % SUPPLIERS.length];
  return {
    id: `rev_${String(i + 1).padStart(3, '0')}`,
    orderId: order?.id ?? `ord_${i + 1}`,
    customerId: customer.id,
    customerName: customer.name,
    supplierId: supplier.id,
    rating: parseFloat((3.5 + (i * 0.1 % 1.5)).toFixed(1)),
    comment: COMMENTS[i % COMMENTS.length],
    createdAt: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2,'0')}T10:00:00Z`,
    helpful: Math.round(i * 3 % 25),
  };
});

// ── QUALITY REPORTS ──────────────────────────────────────────
export const QUALITY_REPORTS: QualityReport[] = SUPPLIERS.slice(0, 30).map((s, i) => ({
  id: `qr_${String(i + 1).padStart(3,'0')}`,
  supplierId: s.id,
  supplierName: s.businessName,
  tds: s.waterQuality.tds,
  ph: s.waterQuality.ph,
  hardness: s.waterQuality.hardness,
  turbidity: s.waterQuality.turbidity,
  qualityScore: s.waterQuality.qualityScore,
  riskLevel: s.waterQuality.qualityScore >= 70 ? 'low' : s.waterQuality.qualityScore >= 50 ? 'medium' : 'high',
  testedAt: `2026-05-${String((i % 28) + 1).padStart(2,'0')}`,
  certifiedBy: ['WaterTest Lab Mumbai', 'NABL Certified Lab Pune', 'AquaVerify India'][i % 3],
}));

// ── WALLET TRANSACTIONS ────────────────────────────────────────
export const WALLET_TRANSACTIONS: WalletTransaction[] = Array.from({ length: 80 }, (_, i) => {
  const types: WalletTransaction['type'][] = ['credit','debit','refund','promo'];
  const type = types[i % 4];
  const amount = type === 'promo' ? 50 + (i * 7 % 150)
    : type === 'refund' ? 200 + (i * 13 % 800)
    : type === 'credit' ? 500 + (i * 37 % 2000)
    : 300 + (i * 23 % 1500);
  return {
    id: `txn_${String(i + 1).padStart(3,'0')}`,
    customerId: CUSTOMERS[i % CUSTOMERS.length].id,
    type,
    amount,
    description: type === 'credit' ? 'Wallet Top-up'
      : type === 'debit' ? `Order #ord_${String(i + 1).padStart(4,'0')} Payment`
      : type === 'refund' ? 'Refund for cancelled order'
      : 'Referral Bonus',
    orderId: type === 'debit' ? `ord_${String(i + 1).padStart(4,'0')}` : undefined,
    createdAt: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2,'0')}T${String((i % 12) + 8).padStart(2,'0')}:00:00Z`,
    balance: 500 + (i * 137 % 4000),
  };
});

// ── COMPLAINTS ────────────────────────────────────────────────
const COMPLAINT_CATEGORIES = ['Water Quality', 'Late Delivery', 'Wrong Quantity', 'Driver Behavior', 'Billing Issue'];
const COMPLAINT_TITLES = [
  'Water had unusual smell', 'Delivery was 3 hours late', 'Received less water than ordered',
  'Driver was rude and unprofessional', 'Overcharged for delivery',
  'TDS level too high in water', 'Tanker was dirty', 'No communication on delay',
];

export const COMPLAINTS: Complaint[] = Array.from({ length: 40 }, (_, i) => {
  const statuses: Complaint['status'][] = ['open','under_review','resolved','escalated'];
  const risks: Complaint['riskLevel'][] = ['low','medium','high'];
  return {
    id: `cmp_${String(i + 1).padStart(3,'0')}`,
    customerId: CUSTOMERS[i % CUSTOMERS.length].id,
    customerName: CUSTOMERS[i % CUSTOMERS.length].name,
    supplierId: SUPPLIERS[i % SUPPLIERS.length].id,
    orderId: ORDERS[i % ORDERS.length].id,
    category: COMPLAINT_CATEGORIES[i % COMPLAINT_CATEGORIES.length],
    title: COMPLAINT_TITLES[i % COMPLAINT_TITLES.length],
    description: 'Detailed description of the issue reported by the customer regarding their recent order.',
    status: statuses[i % 4],
    riskLevel: risks[i % 3],
    createdAt: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2,'0')}T09:00:00Z`,
    resolvedAt: i % 4 === 2 ? `2026-0${(i % 5) + 1}-${String((i % 28) + 3).padStart(2,'0')}T15:00:00Z` : undefined,
    assignedTo: i % 3 !== 0 ? 'Admin Support Team' : undefined,
    resolution: i % 4 === 2 ? 'Issue resolved after investigation. Refund processed.' : undefined,
  };
});

// ── REVENUE ANALYTICS ─────────────────────────────────────────
export const REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', revenue: 842000, orders: 1240, customers: 890 },
  { month: 'Feb', revenue: 915000, orders: 1380, customers: 920 },
  { month: 'Mar', revenue: 1100000, orders: 1620, customers: 1050 },
  { month: 'Apr', revenue: 1380000, orders: 2100, customers: 1250 },
  { month: 'May', revenue: 1650000, orders: 2450, customers: 1480 },
  { month: 'Jun', revenue: 1920000, orders: 2800, customers: 1720 },
  { month: 'Jul', revenue: 2250000, orders: 3200, customers: 1980 },
  { month: 'Aug', revenue: 2100000, orders: 3050, customers: 1890 },
  { month: 'Sep', revenue: 1870000, orders: 2780, customers: 1750 },
  { month: 'Oct', revenue: 2050000, orders: 3100, customers: 1900 },
  { month: 'Nov', revenue: 2380000, orders: 3500, customers: 2100 },
  { month: 'Dec', revenue: 2750000, orders: 4000, customers: 2400 },
];

// ── HEATMAP ZONES ─────────────────────────────────────────────
export const HEATMAP_ZONES: HeatmapZone[] = [
  { zone: 'Andheri', lat: 19.119, lng: 72.847, intensity: 0.9, orders: 342 },
  { zone: 'Bandra', lat: 19.054, lng: 72.819, intensity: 0.75, orders: 287 },
  { zone: 'Powai', lat: 19.118, lng: 72.906, intensity: 0.65, orders: 248 },
  { zone: 'Borivali', lat: 19.228, lng: 72.856, intensity: 0.55, orders: 211 },
  { zone: 'Dadar', lat: 19.018, lng: 72.843, intensity: 0.80, orders: 305 },
  { zone: 'Mulund', lat: 19.176, lng: 72.954, intensity: 0.45, orders: 172 },
  { zone: 'Goregaon', lat: 19.162, lng: 72.849, intensity: 0.60, orders: 229 },
  { zone: 'Vashi', lat: 19.075, lng: 73.008, intensity: 0.70, orders: 267 },
  { zone: 'Kurla', lat: 19.072, lng: 72.879, intensity: 0.85, orders: 324 },
  { zone: 'Wakad', lat: 18.594, lng: 73.756, intensity: 0.50, orders: 191 },
  { zone: 'Kothrud', lat: 18.504, lng: 73.808, intensity: 0.65, orders: 248 },
  { zone: 'Hinjewadi', lat: 18.593, lng: 73.738, intensity: 0.40, orders: 153 },
];

// ── FORECASTING ───────────────────────────────────────────────
export const FORECAST_DATA: ForecastData[] = generateWeeklyForecast(16);

// ── TRACKING EVENTS (mock per order) ─────────────────────────
export function getMockTrackingEvents(orderId: string) {
  const base = new Date('2026-05-30T08:00:00Z');
  return [
    { orderId, status: 'pending',    timestamp: new Date(base.getTime() + 0).toISOString(),           message: 'Order placed successfully', },
    { orderId, status: 'confirmed',  timestamp: new Date(base.getTime() + 5*60000).toISOString(),     message: 'Supplier confirmed your order', },
    { orderId, status: 'dispatched', timestamp: new Date(base.getTime() + 20*60000).toISOString(),    message: 'Tanker dispatched from depot', location: { lat: 19.07, lng: 72.87 } },
    { orderId, status: 'en_route',   timestamp: new Date(base.getTime() + 45*60000).toISOString(),    message: 'Driver en route to your location', location: { lat: 19.08, lng: 72.88 } },
    { orderId, status: 'delivered',  timestamp: new Date(base.getTime() + 90*60000).toISOString(),    message: 'Water delivered successfully! 🎉', location: { lat: 19.09, lng: 72.89 } },
  ];
}

// ── MOCK DRIVER ROUTE (animated tracking) ────────────────────
export const MOCK_ROUTE_POINTS = [
  { lat: 19.070, lng: 72.870 },
  { lat: 19.073, lng: 72.873 },
  { lat: 19.076, lng: 72.876 },
  { lat: 19.079, lng: 72.879 },
  { lat: 19.082, lng: 72.882 },
  { lat: 19.085, lng: 72.885 },
  { lat: 19.088, lng: 72.888 },
  { lat: 19.090, lng: 72.890 },
];
