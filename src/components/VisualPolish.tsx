import { useState, useEffect, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================
// Smooth Scroll Component
// ============================================
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
};

// ============================================
// Parallax Section Component
// ============================================
export const ParallaxSection = ({
  children,
  offset = 50,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Glass Morphism Card
// ============================================
export const GlassCard = ({
  children,
  className,
  blur = 'md',
}: {
  children: ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/10 dark:bg-black/10',
        blurMap[blur],
        'border border-white/20 dark:border-white/10',
        'shadow-xl',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================
// Animated Gradient Background
// ============================================
export const AnimatedGradient = ({
  className,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
}: {
  className?: string;
  colors?: string[];
}) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${colors.join(', ')})`,
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

// ============================================
// Skeleton Loader
// ============================================
export const Skeleton = ({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'circular' | 'text' | 'card';
}) => {
  const variants = {
    default: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    text: 'h-4 w-3/4',
    card: 'h-48 w-full rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        'bg-[length:200%_100%]',
        variants[variant],
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

// ============================================
// Magnetic Button
// ============================================
export const MagneticButton = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.2;
    const y = (clientY - top - height / 2) * 0.2;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn(
        'relative inline-flex items-center justify-center',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </motion.button>
  );
};

// ============================================
// Hover Card with 3D Effect
// ============================================
export const Card3D = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    setRotateX((y - 0.5) * -20);
    setRotateY((x - 0.5) * 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={cn('relative', className)}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

// ============================================
// Text Reveal Animation
// ============================================
export const TextReveal = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay + index * 0.03 }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// ============================================
// Floating Animation
// ============================================
export const FloatingElement = ({
  children,
  duration = 3,
  delay = 0,
  className,
}: {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Pulse Animation
// ============================================
export const PulseElement = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      <div className="relative">{children}</div>
    </div>
  );
};

// ============================================
// Page Transition Wrapper
// ============================================
export const PageTransition = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// Spotlight Effect
// ============================================
export const Spotlight = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

// ============================================
// Morphing Shape Background
// ============================================
export const MorphingShapes = ({ className }: { className?: string }) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g>
          <circle
            cx="20%"
            cy="30%"
            r="15%"
            fill="url(#gradient1)"
            className="animate-morph1"
          />
          <circle
            cx="80%"
            cy="70%"
            r="20%"
            fill="url(#gradient1)"
            className="animate-morph2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="25%"
            fill="url(#gradient1)"
            className="animate-morph3"
          />
        </g>
      </svg>
      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes morph2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes morph3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 20px) scale(1.1); }
          66% { transform: translate(-30px, -30px) scale(0.9); }
        }
        .animate-morph1 { animation: morph1 8s ease-in-out infinite; }
        .animate-morph2 { animation: morph2 10s ease-in-out infinite; }
        .animate-morph3 { animation: morph3 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
};