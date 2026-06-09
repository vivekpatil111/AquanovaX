// Sidebar navigation — role-aware
import { Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import {
  LayoutDashboard, Store, Package, MapPin, Wallet, Star, Settings,
  Truck, Users, ShieldCheck, BarChart3, AlertCircle, FileText,
  Navigation, TrendingUp, Droplets, ClipboardList, LogOut,
  ChevronLeft, Zap, Globe, Activity,
} from 'lucide-react';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  path?: string;
  icon?: any;
  badge?: string;
  isHeader?: boolean;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  customer: [
    { label: 'Dashboard',    path: '/customer',                   icon: LayoutDashboard },
    { label: 'Marketplace',  path: '/customer/marketplace',       icon: Store            },
    { label: 'Book Water',   path: '/customer/book',              icon: Droplets         },
    { label: 'My Orders',    path: '/customer/orders',            icon: Package          },
    { label: 'Track Order',  path: '/customer/track',             icon: MapPin           },
    { label: 'Payments',     path: '/customer/payments',          icon: Wallet           },
    { label: 'Wallet',       path: '/customer/wallet',            icon: Wallet           },
    { label: 'Water Quality',path: '/customer/quality',           icon: Droplets         },
    { label: 'Reviews',      path: '/customer/reviews',           icon: Star             },
  ],
  supplier: [
    { label: 'Dashboard',    path: '/supplier',                   icon: LayoutDashboard },
    { label: 'Orders',       path: '/supplier/orders',            icon: Package          },
    { label: 'Tankers',      path: '/supplier/tankers',           icon: Truck            },
    { label: 'Water Quality',path: '/supplier/quality',           icon: Droplets         },
    { label: 'Analytics',    path: '/supplier/analytics',         icon: BarChart3        },
    { label: 'Profile',      path: '/supplier/profile',           icon: Settings         },
  ],
  driver: [
    { label: 'Dashboard',    path: '/driver',                     icon: LayoutDashboard },
    { label: 'Deliveries',   path: '/driver/deliveries',          icon: Package          },
    { label: 'Route',        path: '/driver/route',               icon: Navigation       },
    { label: 'Performance',  path: '/driver/performance',         icon: TrendingUp       },
  ],
  admin: [
    { label: 'Dashboard',        path: '/admin',             icon: LayoutDashboard },
    { label: 'Dispatch Engine',  path: '/admin/dispatch',    icon: Truck            },
    { label: 'Verified Network', path: '/admin/network',     icon: ShieldCheck      },
    { label: 'Quality Intel',    path: '/admin/quality',     icon: Droplets         },
    { label: 'AquaMatch AI',     path: '/admin/aquamatch',   icon: Zap              },
    { label: 'MANAGEMENT',       isHeader: true },
    { label: 'All Orders',       path: '/admin/orders',      icon: Package          },
    { label: 'Analytics',        path: '/admin/analytics',   icon: BarChart3        },
    { label: 'Users',            path: '/admin/users',       icon: Users            },
  ],
};

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; icon: typeof Globe }> = {
  customer: { label: 'Customer Portal',  color: 'text-primary-600', bg: 'bg-primary-50',  icon: Globe    },
  supplier: { label: 'Supplier Portal',  color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: Store    },
  driver:   { label: 'Driver Portal',    color: 'text-amber-600',   bg: 'bg-amber-50',    icon: Truck    },
  admin:    { label: 'Admin Portal',     color: 'text-purple-600',  bg: 'bg-purple-50',   icon: Activity },
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const navigate = useNavigate();
  const role = user?.role ?? 'customer';
  const navItems = NAV_ITEMS[role];
  const roleConfig = ROLE_CONFIG[role];
  const RoleIcon = roleConfig.icon;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        onClick={() => {
          if (!sidebarOpen) setSidebarOpen(true);
        }}
        className={cn(
        'fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out flex flex-col',
        'glass shadow-xl m-0 lg:m-4 lg:rounded-2xl',
        sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]',
        !sidebarOpen && 'cursor-pointer hover:bg-white/80'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/20 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              !sidebarOpen && 'lg:w-0 lg:opacity-0'
            )}
          >
            <div className="font-extrabold text-slate-800 text-lg leading-tight whitespace-nowrap">Aquanova<span className="text-primary-500">X</span></div>
          </div>
        </div>

        {/* Role Context */}
        <div className={cn(
          "px-4 py-3 border-b border-white/20 transition-all duration-300 overflow-hidden",
          !sidebarOpen && "lg:h-0 lg:py-0 lg:opacity-0 lg:border-none"
        )}>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-xl border border-white/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 capitalize tracking-wide whitespace-nowrap">{user?.role} Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          <nav className="space-y-1.5">
            {navItems.map((item, idx) => (
              item.isHeader ? (
                <Fragment key={`header-${idx}`}>
                  <div className={cn(
                    "px-3 pt-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-all",
                    !sidebarOpen && "lg:hidden"
                  )}>
                    {item.label}
                  </div>
                </Fragment>
              ) : (
                <NavLink
                  key={item.path!}
                  to={item.path!}
                  onClick={() => setSidebarOpen(false)}
                  end={item.path === '/customer' || item.path === '/supplier' || item.path === '/driver' || item.path === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl transition-all duration-200 group relative',
                      sidebarOpen ? 'px-3 py-2.5' : 'justify-center p-2.5 mx-auto w-10 h-10',
                      isActive
                        ? 'bg-primary-500/10 text-primary-600 font-semibold shadow-inner border border-primary-500/20'
                        : 'text-slate-600 hover:bg-white/60 hover:text-primary-500 font-medium border border-transparent'
                    )
                  }
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {item.icon && (
                        <item.icon className={cn(
                          "w-5 h-5 shrink-0 transition-transform duration-200",
                          isActive ? "scale-110" : "group-hover:scale-110"
                        )} />
                      )}
                      
                      <span
                        className={cn(
                          'whitespace-nowrap transition-all duration-300',
                          !sidebarOpen && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                        )}
                      >
                        {item.label}
                      </span>

                      {isActive && sidebarOpen && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/20 shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 rounded-xl transition-all duration-200 group relative w-full text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium',
              sidebarOpen ? 'px-3 py-2.5' : 'justify-center p-2.5 mx-auto w-10 h-10'
            )}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-12" />
            <span
              className={cn(
                'whitespace-nowrap transition-all duration-300',
                !sidebarOpen && 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
              )}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
