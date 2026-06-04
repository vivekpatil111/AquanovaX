// AppShell — main layout wrapper
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface AppShellProps {
  title?: string;
}

export function AppShell({ title }: AppShellProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16',
      )}>
        <TopNavbar title={title} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
