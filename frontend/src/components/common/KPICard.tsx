// KPI Card component
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // percentage
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  gradient?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function KPICard({
  title, value, change, changeLabel, icon: Icon,
  iconColor = 'text-primary-500',
  iconBg = 'bg-primary-50',
  gradient,
  className,
  prefix,
  suffix,
}: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn('kpi-card', className)}>
      {gradient && (
        <div className={cn('absolute inset-0 opacity-5 rounded-xl', gradient)} />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="stat-label truncate">{title}</p>
          <div className="mt-1.5 flex items-baseline gap-1">
            {prefix && <span className="text-base font-semibold text-muted">{prefix}</span>}
            <span className="stat-value">{value}</span>
            {suffix && <span className="text-sm font-medium text-muted">{suffix}</span>}
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2', isPositive ? 'stat-change-up' : 'stat-change-down')}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{isPositive ? '+' : ''}{change}%</span>
              {changeLabel && <span className="text-muted font-normal">{changeLabel}</span>}
            </div>
          )}
        </div>

        <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
