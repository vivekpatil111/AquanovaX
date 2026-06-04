// Mock Drivers — 100 drivers
import type { Driver } from '@/types';
import { SUPPLIERS } from './suppliers';

const FIRST = [
  'Raju', 'Mohan', 'Sunil', 'Rajesh', 'Vinod', 'Prakash', 'Dinesh', 'Satish',
  'Ramesh', 'Ganesh', 'Mahesh', 'Naresh', 'Kamlesh', 'Mukesh', 'Rakesh', 'Vijay',
  'Ajay', 'Sanjay', 'Sameer', 'Amar', 'Ashok', 'Santosh', 'Ravindra', 'Sachin',
  'Vivek', 'Nilesh', 'Umesh', 'Vishal', 'Rishav', 'Dhruv',
];

const LAST = [
  'Patil', 'Jadhav', 'Shinde', 'Kale', 'Pawar', 'Bhosale', 'Desai', 'More',
  'Gaikwad', 'Salve', 'Yadav', 'Sawant', 'Mane', 'Kamble', 'Tupe', 'Nagare',
];

function makeDriver(i: number): Driver {
  const first = FIRST[i % FIRST.length];
  const last  = LAST[i % LAST.length];
  const name  = `${first} ${last}`;
  const supplier = SUPPLIERS[i % SUPPLIERS.length];

  const totalDeliveries     = 50 + (i * 13 % 450);
  const completedDeliveries = Math.round(totalDeliveries * (0.90 + (i % 10) * 0.01));
  const distanceCovered     = Math.round(completedDeliveries * (8 + (i % 7)));

  return {
    id: `drv_${String(i + 1).padStart(3, '0')}`,
    userId: `usr_drv_${i + 1}`,
    name,
    email: `${first.toLowerCase()}${i}@driver.aquanovax.com`,
    phone: `+91 97${String(10000000 + i * 231).slice(0, 8)}`,
    licenseNumber: `MH${String(10 + i * 3 % 40).padStart(2,'0')}${String(20190000 + i * 137).slice(0,8)}`,
    supplierId: supplier.id,
    supplierName: supplier.businessName,
    tankerIds: [`tnk_${String(i * 2 + 1).padStart(3,'0')}`, `tnk_${String(i * 2 + 2).padStart(3,'0')}`],
    currentLocation: {
      lat: 19.07 + (i * 0.007 % 0.3),
      lng: 72.87 + (i * 0.007 % 0.3),
    },
    rating: parseFloat((3.6 + (i * 0.039 % 1.4)).toFixed(1)),
    totalDeliveries,
    completedDeliveries,
    distanceCovered,
    isAvailable: i % 5 !== 0,
    isActive: i % 12 !== 7,
    joinedAt: `202${3 + (i % 3)}-0${((i % 12) + 1).toString().padStart(2,'0')}-01`,
  };
}

export const DRIVERS: Driver[] = Array.from({ length: 100 }, (_, i) => makeDriver(i));

export function getDriverById(id: string): Driver | undefined {
  return DRIVERS.find(d => d.id === id);
}
