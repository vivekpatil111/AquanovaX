// ============================================================
// CORE TYPES — AquanovaX
// ============================================================

export type Role = 'customer' | 'supplier' | 'driver' | 'admin';

export type TrustBadge = 'bronze' | 'silver' | 'gold' | 'platinum';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'en_route'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus = 'assigned' | 'started' | 'completed';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ComplaintStatus = 'open' | 'under_review' | 'resolved' | 'escalated';

export type RiskLevel = 'low' | 'medium' | 'high';

export type TransactionType = 'credit' | 'debit' | 'refund' | 'promo';

// ============================================================
// USER & AUTH
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  signup: (data: SignupData) => Promise<boolean>;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

// ============================================================
// CUSTOMER
// ============================================================

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address: Address;
  walletBalance: number;
  totalOrders: number;
  memberSince: string;
  isActive: boolean;
}

// ============================================================
// SUPPLIER
// ============================================================

export interface Supplier {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  logo?: string;
  address: Address;
  serviceAreas: string[];
  pricePerKL: number; // per kiloliter
  minOrder: number;
  maxCapacity: number;
  totalOrders: number;
  completedOrders: number;
  rating: number;
  reviewCount: number;
  trustScore: number;
  trustBadge: TrustBadge;
  waterQuality: WaterQuality;
  verification: SupplierVerification;
  isActive: boolean;
  joinedAt: string;
  description: string;
  deliveryTime: string; // e.g. "2-4 hours"
}

export interface WaterQuality {
  tds: number;        // ppm
  ph: number;
  hardness: number;   // mg/L
  turbidity: number;  // NTU
  qualityScore: number; // 0-100
  lastTested: string;
  certificate?: string;
}

export interface SupplierVerification {
  aadhaar: VerificationStatus;
  gst: VerificationStatus;
  business: VerificationStatus;
  fssai: VerificationStatus;
  overallStatus: VerificationStatus;
}

// ============================================================
// DRIVER
// ============================================================

export interface Driver {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  licenseNumber: string;
  supplierId: string;
  supplierName: string;
  tankerIds: string[];
  currentLocation?: Coordinates;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  distanceCovered: number; // km
  isAvailable: boolean;
  isActive: boolean;
  joinedAt: string;
}

// ============================================================
// TANKER
// ============================================================

export interface Tanker {
  id: string;
  registrationNumber: string;
  supplierId: string;
  driverId?: string;
  capacity: number;    // liters
  currentLoad: number; // liters
  type: 'small' | 'medium' | 'large';
  status: 'available' | 'in_use' | 'maintenance';
  lastServiced: string;
  location?: Coordinates;
}

// ============================================================
// ORDER
// ============================================================

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  driverId?: string;
  driverName?: string;
  tankerId?: string;
  quantity: number;   // liters
  amount: number;     // INR
  status: OrderStatus;
  type: 'standard' | 'emergency' | 'scheduled';
  deliveryAddress: Address;
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  rating?: number;
  review?: string;
}

// ============================================================
// DELIVERY & TRACKING
// ============================================================

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  tankerID: string;
  status: DeliveryStatus;
  startedAt?: string;
  completedAt?: string;
  route: Coordinates[];
  currentLocation?: Coordinates;
  eta?: number; // minutes
}

export interface TrackingEvent {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  message: string;
  location?: Coordinates;
}

// ============================================================
// REVIEW
// ============================================================

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  supplierId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

// ============================================================
// COMPLAINT
// ============================================================

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  supplierId?: string;
  orderId?: string;
  category: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  riskLevel: RiskLevel;
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  resolution?: string;
}

// ============================================================
// WALLET
// ============================================================

export interface WalletTransaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  description: string;
  orderId?: string;
  createdAt: string;
  balance: number;
}

// ============================================================
// QUALITY REPORT
// ============================================================

export interface QualityReport {
  id: string;
  supplierId: string;
  supplierName: string;
  tds: number;
  ph: number;
  hardness: number;
  turbidity: number;
  qualityScore: number;
  riskLevel: RiskLevel;
  testedAt: string;
  certifiedBy: string;
}

// ============================================================
// ANALYTICS
// ============================================================

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface ForecastData {
  week: string;
  demand: number;
  supply: number;
  predicted: number;
}

export interface HeatmapZone {
  zone: string;
  lat: number;
  lng: number;
  intensity: number;
  orders: number;
}

export interface FleetMetrics {
  totalTankers: number;
  activeTankers: number;
  utilizationRate: number;
  deliverySuccessRate: number;
  avgDeliveryTime: number;
}

// ============================================================
// SHARED
// ============================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
