'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RatingProps = {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  readonly?: boolean;
  onChange?: (value: number) => void;
};

export const Rating = ({
  value,
  maxValue = 5,
  size = 'md',
  showLabel = false,
  label,
  className,
  readonly = true,
  onChange,
}: RatingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex gap-0.5">
        {[...Array(maxValue)].map((_, index) => {
          const rating = index + 1;
          const filled = rating <= value;
          const partial = rating - 0.5 === value;
          
          return (
            <button
              key={index}
              onClick={() => handleClick(rating)}
              disabled={readonly}
              className={cn(
                'relative transition-all duration-200',
                !readonly && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
              aria-label={`${rating} out of ${maxValue} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors duration-200',
                  filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
                  !readonly && !filled && 'hover:text-yellow-300'
                )}
              />
              {partial && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'absolute inset-0 text-yellow-400 fill-yellow-400',
                    'clip-path-[polygon(0_0,50%_0,50%_100%,0_100%)]'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className={cn(
          'font-medium',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}>
          {label || `${value}/${maxValue}`}
        </span>
      )}
    </div>
  );
};

export type RatingDisplayProps = {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
};

export const RatingDisplay = ({
  rating,
  reviews,
  size = 'md',
  showBadge = false,
  className,
}: RatingDisplayProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Rating value={rating} size={size} />
      {reviews !== undefined && (
        <span className={cn(
          'text-muted-foreground',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          ({reviews.toLocaleString()} reviews)
        </span>
      )}
      {showBadge && rating >= 4.5 && (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
          Excellent
        </span>
      )}
    </div>
  );
};

export type TrustRatingProps = {
  score: number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export const TrustRating = ({
  score,
  label,
  description,
  icon,
  className,
}: TrustRatingProps) => {
  const percentage = (score / 100) * 100;
  
  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{label}</h4>
            <span className="text-2xl font-bold text-primary">{score}%</span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
          )}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};