// Avatar component
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

// Deterministic color from name
function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500',
  ];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % colors.length;
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const color    = getAvatarColor(name);

  return (
    <div className={cn('rounded-full flex items-center justify-center overflow-hidden flex-shrink-0', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center text-white font-semibold', color)}>
          {initials}
        </div>
      )}
    </div>
  );
}
