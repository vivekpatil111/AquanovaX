// API Client for AquanovaX Backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth token from local storage
const getAuthToken = () => localStorage.getItem('aquanovax_token');

// Generic fetch wrapper with auth header
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'API Error');
  }

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  auth: {
    login: (data: any) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
  },
  listings: {
    getAll: () => fetchWithAuth('/listings/'),
    getById: (id: string) => fetchWithAuth(`/listings/${id}`),
    create: (data: any) => fetchWithAuth('/listings/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchWithAuth(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchWithAuth(`/listings/${id}`, { method: 'DELETE' }),
  },
  suppliers: {
    getAll: () => fetchWithAuth('/suppliers/'),
    getOne: (id: string) => fetchWithAuth(`/suppliers/${id}`)
  },
  orders: {
    getAll: (params?: { customerId?: string; supplierId?: string }) => {
      const qs = new URLSearchParams();
      if (params?.customerId) qs.append('customer_id', params.customerId);
      if (params?.supplierId) qs.append('supplier_id', params.supplierId);
      const url = qs.toString() ? `/orders/?${qs.toString()}` : '/orders/';
      return fetchWithAuth(url);
    },
    getOne: (id: string) => fetchWithAuth(`/orders/${id}`),
    create: (data: any) => fetchWithAuth('/orders/', { method: 'POST', body: JSON.stringify(data) })
  },
  tracking: {
    getOne: (orderId: string) => fetchWithAuth(`/tracking/${orderId}`),
    update: (orderId: string, data: any) => fetchWithAuth(`/tracking/${orderId}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  tankers: {
    getAll: (supplierId: string) => fetchWithAuth(`/tankers/?supplier_id=${supplierId}`),
    create: (data: any) => fetchWithAuth('/tankers/', { method: 'POST', body: JSON.stringify(data) })
  },
  reviews: {
    getBySupplier: (supplierId: string) => fetchWithAuth(`/reviews/${supplierId}`),
    create: (data: any) => fetchWithAuth('/reviews/', { method: 'POST', body: JSON.stringify(data) })
  },
  wallet: {
    getByCustomer: (customerId: string) => fetchWithAuth(`/wallet/${customerId}`),
    addTransaction: (data: any) => fetchWithAuth('/wallet/', { method: 'POST', body: JSON.stringify(data) })
  },
  notifications: {
    getByCustomer: (customerId: string) => fetchWithAuth(`/notifications/${customerId}`),
    markRead: (id: string) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PUT' })
  },
  transactions: {
    getMyTransactions: () => fetchWithAuth('/transactions/'),
    create: (data: any) => fetchWithAuth('/transactions/', { method: 'POST', body: JSON.stringify(data) }),
  }
};
