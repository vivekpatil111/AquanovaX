// TopNavbar component
import { Bell, Menu, Search, ChevronDown } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { Avatar } from '@/components/common/Avatar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TopNavbar({ title }: { title?: string }) {
  const { user, logout } = useAuthStore();
  const { toggleSidebar, sidebarOpen, notifications, unreadCount, markAllRead } = useAppStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-20 lg:h-24 px-4 sm:px-6 lg:px-8 flex items-center gap-4 sticky top-0 z-40 mb-6 transition-all duration-300">
      <div className="flex-1 w-full h-16 glass rounded-2xl px-4 flex items-center gap-3">
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      {title && (
        <h1 className="font-semibold text-dark hidden sm:block">{title}</h1>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search orders, suppliers…"
            className="input pl-9 py-2 text-sm bg-slate-50 border-0 focus:bg-white focus:ring-1"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); markAllRead(); }}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card-lg border border-border animate-slide-up z-50">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-dark">Notifications</h3>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.map(n => (
                  <div key={n.id} className={cn('p-3 hover:bg-slate-50 transition-colors', !n.isRead && 'bg-primary-50/50')}>
                    <div className="flex gap-3">
                      <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0',
                        n.type === 'success' ? 'bg-success' :
                        n.type === 'warning' ? 'bg-warning' :
                        n.type === 'error'   ? 'bg-danger'  : 'bg-primary-500'
                      )} />
                      <div>
                        <p className="text-sm font-medium text-dark">{n.title}</p>
                        <p className="text-xs text-muted mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Avatar name={user?.name ?? 'User'} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-dark leading-tight">{user?.name}</p>
              <p className="text-xs text-muted capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-lg border border-border animate-slide-up z-50">
              <div className="p-3 border-b border-border">
                <p className="font-semibold text-sm text-dark">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  className="sidebar-link w-full text-danger hover:bg-red-50"
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showNotifs || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifs(false); setShowProfile(false); }} />
      )}
      </div>
    </header>
  );
}
