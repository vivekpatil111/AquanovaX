// AppShell — main layout wrapper
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { WaterFooter } from '@/components/common/WaterFooter';

interface AppShellProps {
  title?: string;
}

export function AppShell({ title }: AppShellProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Subtle Global Animated Water Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[120px] animate-pulse-dot" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-sky-300/10 rounded-full blur-[150px] animate-pulse-dot" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] animate-bounce-gentle" />
      </div>

      <Sidebar />

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]',
      )}>
        <TopNavbar title={title} />
        <main 
          className="flex-1 flex flex-col overflow-auto bg-transparent"
          onClick={() => {
            if (sidebarOpen) {
              useAppStore.getState().setSidebarOpen(false);
            }
          }}
        >
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
          <WaterFooter />
        </main>
      </div>
    </div>
  );
}
