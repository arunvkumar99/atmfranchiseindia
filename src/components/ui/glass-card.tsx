import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'premium' | 'success' | 'warning';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant = 'default', 
    blur = 'md',
    animated = true,
    hover = true,
    glow = false,
    children,
    ...props 
  }, ref) => {
    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    };

    const variantClasses = {
      default: 'bg-white/10 border-white/20',
      elevated: 'bg-white/15 border-white/25 shadow-2xl',
      premium: 'bg-gradient-to-br from-white/20 to-white/5 border-gold/30',
      success: 'bg-green-500/10 border-green-500/20',
      warning: 'bg-yellow-500/10 border-yellow-500/20',
    };

    const glowClasses = {
      default: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      elevated: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
      premium: 'shadow-[0_0_40px_rgba(251,191,36,0.3)]',
      success: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      warning: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]',
    };

    const Component = animated ? motion.div : 'div';
    const componentProps = animated ? {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      whileHover: hover ? { scale: 1.02, y: -4 } : undefined,
      ...props
    } : props;

    return (
      <Component
        ref={ref}
        className={cn(
          "relative rounded-xl border",
          blurClasses[blur],
          variantClasses[variant],
          glow && glowClasses[variant],
          hover && "transition-all duration-300 hover:shadow-xl hover:border-white/30",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50",
          className
        )}
        {...componentProps}
      >
        <div className="relative z-10">
          {children}
        </div>
      </Component>
    );
  }
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b border-white/10",
      className
    )}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/70", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      className
    )}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";

// Premium Floating Card with 3D effect
export const FloatingGlassCard = ({ 
  children, 
  className,
  ...props 
}: GlassCardProps) => {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Floating shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-full" />
      
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <GlassCard variant="elevated" glow>
          {children}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// Premium Stats Card with Glass Effect
export const GlassStatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) => {
  return (
    <GlassCard variant="elevated" className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {description && (
            <p className="text-xs text-white/60 mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2",
              trend.isPositive ? "text-green-400" : "text-red-400"
            )}>
              <span className="text-sm font-medium">
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardFooter, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent 
};