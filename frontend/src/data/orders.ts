// Mock Orders — 500 orders
import type { Order, OrderStatus } from '@/types';
import { CUSTOMERS } from './customers';
import { SUPPLIERS } from './suppliers';
import { DRIVERS } from './drivers';

const STATUSES: OrderStatus[] = ['pending','confirmed','dispatched','en_route','delivered','cancelled'];
const TYPES: Order['type'][] = ['standard','emergency','scheduled'];
const PAYMENT_METHODS = ['UPI', 'Card', 'Netbanking', 'Wallet', 'COD'];

const STREETS = [
  'Sector 5', 'MG Road', 'Link Road', 'Station Road', 'Market Lane',
  'Main Street', 'Park Avenue', 'Garden Road', 'Hill View', 'Lake Side',
];

function makeOrder(i: number): Order {
  const customer  = CUSTOMERS[i % CUSTOMERS.length];
  const supplier  = SUPPLIERS[i % SUPPLIERS.length];
  const driver    = DRIVERS[i % DRIVERS.length];

  // Distribute statuses realistically
  let status: OrderStatus;
  const rand = i % 10;
  if (rand <= 3)      status = 'delivered';
  else if (rand === 4) status = 'en_route';
  else if (rand === 5) status = 'dispatched';
  else if (rand === 6) status = 'confirmed';
  else if (rand === 7) status = 'pending';
  else                 status = 'cancelled';

  const quantity = [1000, 2000, 3000, 5000, 10000][i % 5];
  const amount   = Math.round((quantity / 1000) * supplier.pricePerKL);
  const type     = TYPES[i % 3];

  const daysAgo = i % 30;
  const date = new Date(2026, 4, 31 - daysAgo);
  const createdAt = date.toISOString();

  const deliveredAt = status === 'delivered'
    ? new Date(date.getTime() + 3 * 3600000).toISOString()
    : undefined;

  const hasRating = status === 'delivered' && i % 3 !== 0;

  return {
    id: `ord_${String(i + 1).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    supplierId: supplier.id,
    supplierName: supplier.businessName,
    driverId: status !== 'pending' && status !== 'cancelled' ? driver.id : undefined,
    driverName: status !== 'pending' && status !== 'cancelled' ? driver.name : undefined,
    tankerId: status !== 'pending' && status !== 'cancelled' ? `tnk_${String((i % 200) + 1).padStart(3,'0')}` : undefined,
    quantity,
    amount,
    status,
    type,
    deliveryAddress: {
      street: `${10 + i} ${STREETS[i % STREETS.length]}`,
      city: customer.address.city,
      state: 'Maharashtra',
      pincode: customer.address.pincode,
      lat: customer.address.lat,
      lng: customer.address.lng,
    },
    scheduledDate: date.toISOString().split('T')[0],
    scheduledTime: `${String(8 + (i % 10)).padStart(2,'0')}:00`,
    createdAt,
    updatedAt: createdAt,
    deliveredAt,
    notes: i % 5 === 0 ? 'Please deliver before noon.' : undefined,
    paymentStatus: status === 'cancelled' ? 'refunded' : status === 'pending' ? 'pending' : 'paid',
    paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    rating: hasRating ? parseFloat((3 + (i % 20) / 10).toFixed(1)) : undefined,
    review: hasRating ? 'Good service, water quality was excellent.' : undefined,
  };
}

export const ORDERS: Order[] = Array.from({ length: 500 }, (_, i) => makeOrder(i));

export function getOrderById(id: string): Order | undefined {
  return ORDERS.find(o => o.id === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return ORDERS.filter(o => o.customerId === customerId);
}

export function getOrdersBySupplier(supplierId: string): Order[] {
  return ORDERS.filter(o => o.supplierId === supplierId);
}

export function getOrdersByDriver(driverId: string): Order[] {
  return ORDERS.filter(o => o.driverId === driverId);
}
