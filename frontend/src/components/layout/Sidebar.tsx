// Sidebar navigation — role-aware
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
  path: string;
  icon: typeof LayoutDashboard;
  badge?: string;
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
    { label: 'Dashboard',    path: '/admin',                      icon: LayoutDashboard },
    { label: 'Users',        path: '/admin/users',                icon: Users            },
    { label: 'Suppliers',    path: '/admin/suppliers',            icon: Store            },
    { label: 'Drivers',      path: '/admin/drivers',              icon: Truck            },
    { label: 'Orders',       path: '/admin/orders',               icon: ClipboardList    },
    { label: 'Complaints',   path: '/admin/complaints',           icon: AlertCircle      },
    { label: 'Analytics',    path: '/admin/analytics',            icon: BarChart3        },
    { label: 'AquaMatch AI', path: '/admin/aquamatch',            icon: Zap              },
    { label: 'Quality',      path: '/admin/quality',              icon: ShieldCheck      },
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-border z-30 flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden',
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-primary-bg flex items-center justify-center flex-shrink-0">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-bold text-dark text-base leading-tight">AquanovaX</div>
              <div className="text-xs text-muted truncate">Water Intelligence</div>
            </div>
          )}
          {sidebarOpen && (
            <button
              className="ml-auto text-slate-400 hover:text-slate-600 flex-shrink-0 lg:flex hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className={cn('mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2', roleConfig.bg)}>
            <RoleIcon className={cn('w-4 h-4 flex-shrink-0', roleConfig.color)} />
            <span className={cn('text-xs font-semibold', roleConfig.color)}>{roleConfig.label}</span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/customer' || item.path === '/supplier' || item.path === '/driver' || item.path === '/admin'}
              className={({ isActive }) =>
                cn(isActive ? 'sidebar-link-active' : 'sidebar-link', !sidebarOpen && 'justify-center px-2')
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && (
                <span className="truncate">{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span className="ml-auto badge-danger text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn('sidebar-link w-full text-danger hover:bg-red-50', !sidebarOpen && 'justify-center px-2')}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
