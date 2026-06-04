// Status Badge component
import { cn } from '@/lib/utils';
import { getStatusConfig, getBadgeColor, getBadgeIcon, getRiskColor } from '@/lib/utils';
import type { OrderStatus, TrustBadge, RiskLevel } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  return (
    <span className={cn('badge', config.bg, config.text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

interface TrustBadgeProps {
  badge: TrustBadge;
  className?: string;
}

export function TrustBadgeComp({ badge, className }: TrustBadgeProps) {
  const colors = getBadgeColor(badge);
  const icon   = getBadgeIcon(badge);
  const labels: Record<TrustBadge, string> = {
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
  };
  return (
    <span className={cn('badge border', colors.bg, colors.text, colors.border, className)}>
      {icon} {labels[badge]}
    </span>
  );
}

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const colors = getRiskColor(level);
  return (
    <span className={cn('badge', colors.bg, colors.text, className)}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
}

interface GenericBadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
}

export function Badge({ label, variant = 'primary', className }: GenericBadgeProps) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger:  'badge-danger',
    muted:   'badge-muted',
  };
  return <span className={cn(variants[variant], className)}>{label}</span>;
}
