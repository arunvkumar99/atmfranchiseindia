import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg'
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'circular' ? width : undefined)
      }}
      {...props}
    />
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
      
      {/* Form fields */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="25%" height={14} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </div>
      ))}
      
      {/* Submit button */}
      <Skeleton variant="rectangular" width="100%" height={44} />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={100} />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="text" width={`${25}%`} height={16} />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} variant="text" width={`${25}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <Skeleton variant="text" width="50%" height={40} className="mx-auto mb-4" />
          <Skeleton variant="text" width="70%" height={20} className="mx-auto" />
        </div>
        
        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <CardSkeleton />
          <FormSkeleton />
        </div>
      </div>
    </div>
  );
}