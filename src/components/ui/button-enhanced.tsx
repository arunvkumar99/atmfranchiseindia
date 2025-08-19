import * as React from "react"
import { useTranslation } from 'react-i18next';
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-system"

const buttonVariants = cva(
  // Base styles with accessibility enhancements
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden transform-gpu",
  {
    variants: {
      variant: {
        // High contrast primary button
        default: "bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-600",
        
        // High contrast destructive button
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600",
        
        // Outline with proper contrast
        outline: "border-2 border-neutral-700 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-900 active:bg-neutral-100 focus-visible:ring-neutral-700",
        
        // Secondary with better visibility
        secondary: "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-500",
        
        // Ghost with hover feedback
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 focus-visible:ring-neutral-500",
        
        // Link style with underline
        link: "text-blue-700 underline-offset-4 hover:underline hover:text-blue-800 focus-visible:ring-blue-600",
        
        // Success variant
        success: "bg-green-600 text-white shadow hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-600",
        
        // Warning variant
        warning: "bg-amber-600 text-white shadow hover:bg-amber-700 active:bg-amber-800 focus-visible:ring-amber-600",
      },
      size: {
        // Sizes with WCAG minimum touch target (44x44px)
        default: "h-11 px-5 py-2.5 min-w-[44px]",
        sm: "h-10 px-4 py-2 text-xs min-w-[44px]",
        lg: "h-12 px-8 py-3 text-base min-w-[44px]",
        xl: "h-14 px-10 py-4 text-lg min-w-[44px]",
        icon: "h-11 w-11",
        iconSm: "h-10 w-10",
        iconLg: "h-12 w-12",
      },
      // New props for enhanced styling
      fullWidth: {
        true: "w-full",
      },
      loading: {
        true: "cursor-wait",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
}

const ButtonEnhanced = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      loadingText = "Loading...",
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ariaLabel,
      ariaDescribedBy,
      ariaPressed,
      ariaExpanded,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effect container */}
        <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <span className="button-ripple" />
        </span>
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="sr-only">{loadingText}</span>
              {loadingText && <span aria-hidden="true">{loadingText}</span>}
            </>
          ) : (
            <>
              {leftIcon && <span className="inline-flex" aria-hidden="true">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="inline-flex" aria-hidden="true">{rightIcon}</span>}
            </>
          )}
        </span>
      </Comp>
    )
  }
)
ButtonEnhanced.displayName = "ButtonEnhanced"

// Button Group Component for consistent spacing
export const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    spacing?: 'sm' | 'md' | 'lg'
  }
>(({ className, orientation = 'horizontal', spacing = 'md', ...props }, ref) => {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    md: orientation === 'horizontal' ? 'gap-4' : 'gap-3',
    lg: orientation === 'horizontal' ? 'gap-6' : 'gap-4',
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col',
        spacingClasses[spacing],
        className
      )}
      role="group"
      {...props}
    />
  )
})
ButtonGroup.displayName = "ButtonGroup"

// Icon Button with proper ARIA
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { 
    icon: React.ReactNode
    label: string // Required for accessibility
  }
>(({ icon, label, size = 'icon', ...props }, ref) => {
  return (
    <ButtonEnhanced
      ref={ref}
      size={size}
      ariaLabel={label}
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </ButtonEnhanced>
  )
})
IconButton.displayName = "IconButton"

export { ButtonEnhanced, buttonVariants }