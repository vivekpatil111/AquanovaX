// Star Rating component
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const starSizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

export function StarRating({ value, max = 5, size = 'md', interactive, onChange, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half   = !filled && i < value;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn('focus:outline-none', interactive && 'cursor-pointer hover:scale-110 transition-transform')}
          >
            <Star
              className={cn(
                starSizes[size],
                filled || half ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-100'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingDisplay({ rating, count, size = 'sm', className }: RatingDisplayProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <StarRating value={rating} size={size} />
      <span className="font-semibold text-sm text-dark">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
