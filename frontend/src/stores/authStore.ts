// Auth Store — Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role, SignupData } from '@/types';
import { api } from '@/lib/api';

// Mock demo credentials
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'customer@demo.com': {
    password: 'demo123',
    user: {
      id: 'usr_cus_001',
      name: 'Priya Sharma',
      email: 'customer@demo.com',
      phone: '+91 98765 43210',
      role: 'customer',
      avatar: undefined,
      createdAt: '2024-01-15T00:00:00Z',
      isActive: true,
    },
  },
  'supplier@demo.com': {
    password: 'demo123',
    user: {
      id: 'usr_sup_001',
      name: 'AquaPure Solutions',
      email: 'supplier@demo.com',
      phone: '+91 98765 43211',
      role: 'supplier',
      avatar: undefined,
      createdAt: '2023-06-01T00:00:00Z',
      isActive: true,
    },
  },
  'driver@demo.com': {
    password: 'demo123',
    user: {
      id: 'usr_drv_001',
      name: 'Raju Patil',
      email: 'driver@demo.com',
      phone: '+91 97654 32109',
      role: 'driver',
      avatar: undefined,
      createdAt: '2023-09-01T00:00:00Z',
      isActive: true,
    },
  },
  'admin@demo.com': {
    password: 'demo123',
    user: {
      id: 'usr_adm_001',
      name: 'Admin User',
      email: 'admin@demo.com',
      phone: '+91 99999 00001',
      role: 'admin',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00Z',
      isActive: true,
    },
  },
};

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: Role) => void;
  logout: () => void;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
}

const ROLE_DEMO_EMAIL: Record<Role, string> = {
  customer: 'customer@demo.com',
  supplier: 'supplier@demo.com',
  driver:   'driver@demo.com',
  admin:    'admin@demo.com',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await api.auth.login({ email, password });
          if (data.access_token) {
            localStorage.setItem('aquanovax_token', data.access_token);
            // Reconstruct user object from Supabase response
            const loggedInUser: User = {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || 'User',
              email: data.user.email,
              phone: '',
              role: data.user.user_metadata?.role || 'customer',
              createdAt: data.user.created_at,
              isActive: true,
            };
            set({ user: loggedInUser, isAuthenticated: true, isLoading: false });
            return { success: true };
          }
          throw new Error('No token received');
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Login failed' };
        }
      },

      quickLogin: async (role) => {
        const email = ROLE_DEMO_EMAIL[role];
        const state = useAuthStore.getState();
        await state.login(email, 'SecurePassword123!');
      },

      logout: () => {
        localStorage.removeItem('aquanovax_token');
        api.auth.logout().catch(() => {});
        set({ user: null, isAuthenticated: false });
      },

      signup: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.register({
            email: data.email,
            password: data.password, // Frontend needs to send password
            full_name: data.name,
            role: data.role || 'customer'
          });
          
          // Registration successful, but they need to log in to get a token, 
          // or we can auto-login them. We'll auto-login.
          const loginData = await api.auth.login({ email: data.email, password: data.password });
          
          if (loginData.access_token) {
            localStorage.setItem('aquanovax_token', loginData.access_token);
            const newUser: User = {
              id: loginData.user.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              role: data.role || 'customer',
              createdAt: new Date().toISOString(),
              isActive: true,
            };
            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return { success: true };
          }
          throw new Error('Auto-login after signup failed');
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Signup failed' };
        }
      },
    }),
    {
      name: 'aquanovax-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
