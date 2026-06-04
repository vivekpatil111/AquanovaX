// Mock Customers — 100 customers
import type { Customer } from '@/types';

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Rohan', 'Meera',
  'Arjun', 'Kavya', 'Siddharth', 'Pooja', 'Nikhil', 'Divya', 'Amit', 'Riya',
  'Kartik', 'Nisha', 'Varun', 'Aditi', 'Suresh', 'Lakshmi', 'Manish', 'Swati',
  'Deepak', 'Anjali', 'Rajesh', 'Sonal', 'Anil', 'Tanya',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Gupta', 'Singh', 'Mehta', 'Joshi', 'Kumar', 'Shah',
  'Verma', 'Chopra', 'Kapoor', 'Mishra', 'Tiwari', 'Pandey', 'Yadav', 'Reddy',
];

const AREAS = [
  'Andheri West', 'Bandra East', 'Powai', 'Kurla', 'Borivali North',
  'Dadar', 'Mulund West', 'Goregaon East', 'Malad West', 'Vashi',
  'Airoli', 'Kharghar', 'Wakad', 'Kothrud', 'Hinjewadi',
];

function makeCustomer(i: number): Customer {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last  = LAST_NAMES[i % LAST_NAMES.length];
  const name  = `${first} ${last}`;
  const area  = AREAS[i % AREAS.length];

  return {
    id: `cus_${String(i + 1).padStart(3, '0')}`,
    userId: `usr_cus_${i + 1}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`,
    phone: `+91 98${String(10000000 + i * 137).slice(0, 8)}`,
    address: {
      street: `${10 + i} ${area} Lane`,
      city: i % 3 === 0 ? 'Pune' : i % 3 === 1 ? 'Thane' : 'Mumbai',
      state: 'Maharashtra',
      pincode: `40${String(1000 + i).slice(0, 4)}`,
      lat: 19.07 + (i * 0.005 % 0.4),
      lng: 72.87 + (i * 0.005 % 0.4),
    },
    walletBalance: Math.round(500 + (i * 137 % 4500)),
    totalOrders: Math.round(2 + (i * 7 % 50)),
    memberSince: `202${3 + (i % 3)}-0${(i % 12) + 1 > 9 ? 12 : (i % 12) + 1}-01`,
    isActive: i % 15 !== 7,
  };
}

export const CUSTOMERS: Customer[] = Array.from({ length: 100 }, (_, i) => makeCustomer(i));

export function getCustomerById(id: string): Customer | undefined {
  return CUSTOMERS.find(c => c.id === id);
}
