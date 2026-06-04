// App Store — UI state (sidebar, notifications, active booking, etc.)
import { create } from 'zustand';
import type { Notification } from '@/types';

interface AppStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAllRead: () => void;

  // Active booking in progress
  bookingStep: number;
  setBookingStep: (step: number) => void;
  resetBooking: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  notifications: [
    {
      id: 'notif_1',
      userId: 'any',
      title: 'Order Delivered!',
      message: 'Your order #ord_0042 has been delivered successfully.',
      type: 'success',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: 'notif_2',
      userId: 'any',
      title: 'New Supplier Available',
      message: 'AquaGold Services is now available in your area.',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      id: 'notif_3',
      userId: 'any',
      title: 'Quality Alert',
      message: 'Your preferred supplier has updated their water quality report.',
      type: 'info',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
  ],
  unreadCount: 2,

  addNotification: (n) => {
    const notif: Notification = {
      ...n,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set(s => ({
      notifications: [notif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }));
  },

  markAllRead: () => {
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  bookingStep: 0,
  setBookingStep: (step) => set({ bookingStep: step }),
  resetBooking: () => set({ bookingStep: 0 }),
}));
