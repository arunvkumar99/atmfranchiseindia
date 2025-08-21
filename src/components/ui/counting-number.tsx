'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type CountingNumberProps = {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatNumber?: (value: number) => string;
};

export function CountingNumber({
  value,
  from = 0,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  formatNumber,
}: CountingNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (latest) => {
    const formatted = decimals > 0 
      ? latest.toFixed(decimals)
      : Math.round(latest).toString();
    
    if (formatNumber) {
      return formatNumber(parseFloat(formatted));
    }
    
    // Add thousand separators
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  });

  const isInView = useInView(ref, { once: true, margin: '-100px' });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        delay,
        ease: 'easeOut',
      });

      return controls.stop;
    }
  }, [motionValue, value, duration, delay, isInView]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

type StatCardProps = {
  value: number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export function StatCard({
  value,
  label,
  description,
  icon,
  prefix = '',
  suffix = '',
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border bg-card p-6',
      'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      className
    )}>
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <CountingNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            className="text-3xl font-bold text-foreground"
          />
          
          {trend && (
            <span className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <svg
                className={cn('w-3 h-3', !trend.isPositive && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

type StatsGridProps = {
  stats: StatCardProps[];
  className?: string;
};

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn(
      'grid gap-4 md:gap-6',
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      className
    )}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

// Live counter for real-time stats
type LiveCounterProps = {
  getValue: () => number;
  updateInterval?: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function LiveCounter({
  getValue,
  updateInterval = 5000,
  label,
  prefix = '',
  suffix = '',
  className,
}: LiveCounterProps) {
  const [value, setValue] = React.useState(getValue());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue(getValue());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [getValue, updateInterval]);

  return (
    <div className={cn('text-center', className)}>
      <CountingNumber
        value={value}
        prefix={prefix}
        suffix={suffix}
        duration={1}
        className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
      />
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
}