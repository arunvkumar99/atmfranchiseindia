import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Sparkles, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Ripple Effect Button
// ============================================
export const RippleButton = ({
  children,
  className,
  onClick,
  variant = 'primary',
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
  const { t } = useTranslation('forms');
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples([...ripples, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const variantColors = {
    primary: 'bg-white/30',
    secondary: 'bg-black/20',
    success: 'bg-green-300/30',
    danger: 'bg-red-300/30',
  };

  return (
    <button
      onClick={(e) => {
        createRipple(e);
        onClick?.();
      }}
      className={cn(
        'relative overflow-hidden transition-all',
        'transform active:scale-95',
        className
      )}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className={cn('absolute rounded-full', variantColors[variant])}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              width: 300, 
              height: 300, 
              x: -150, 
              y: -150, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};

// ============================================
// Success Animation
// ============================================
export const SuccessAnimation = ({ show }: { show: boolean }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="bg-green-500 text-white rounded-full p-8"
          >
            <Check size={48} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Interactive Form Field
// ============================================
export const InteractiveInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <motion.label
        animate={{
          top: focused || hasValue ? -10 : 16,
          fontSize: focused || hasValue ? 12 : 16,
          color: focused ? '#3b82f6' : '#9ca3af',
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-3 bg-white dark:bg-gray-900 px-1 pointer-events-none"
      >
        {label}
      </motion.label>
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'w-full px-4 py-4 rounded-lg border-2 transition-all outline-none',
          focused 
            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
            : 'border-gray-300 hover:border-gray-400',
          'dark:bg-gray-800 dark:border-gray-600'
        )}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
      />
    </div>
  );
};

// ============================================
// Like Button with Animation
// ============================================
export const LikeButton = ({ initialLiked = false }: { initialLiked?: boolean }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [particles, setParticles] = useState<number[]>([]);

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setParticles([...Array(6)].map((_, i) => i));
      setTimeout(() => setParticles([]), 1000);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <motion.div
        animate={{
          scale: liked ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={24}
          className={cn(
            'transition-colors',
            liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
          )}
        />
      </motion.div>
      
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * 60) * Math.PI / 180) * 30,
            y: Math.sin((i * 60) * Math.PI / 180) * 30,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </button>
  );
};

// ============================================
// Star Rating Component
// ============================================
export const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          disabled={readonly}
          className={cn(
            'p-1 transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer'
          )}
        >
          <Star
            size={24}
            className={cn(
              'transition-all',
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
};

// ============================================
// Toggle Switch with Animation
// ============================================
export const AnimatedToggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <motion.div
          animate={{
            backgroundColor: checked ? '#3b82f6' : '#d1d5db',
          }}
          transition={{ duration: 0.3 }}
          className="w-14 h-7 rounded-full"
          onClick={() => onChange(!checked)}
        >
          <motion.div
            animate={{
              x: checked ? 28 : 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
          />
        </motion.div>
      </div>
      {label && <span className="select-none">{label}</span>}
    </label>
  );
};

// ============================================
// Loading Button
// ============================================
export const LoadingButton = ({
  loading,
  children,
  onClick,
  className,
  loadingText = 'Loading...',
}: {
  loading: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  loadingText?: string;
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'transition-all duration-200',
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 className="animate-spin" size={18} />
            <span>{loadingText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ============================================
// Sparkle Effect
// ============================================
export const SparkleEffect = ({
  children,
  color = '#fbbf24',
}: {
  children: ReactNode;
  color?: string;
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      ]);
      
      setTimeout(() => {
        setSparkles(prev => prev.slice(1));
      }, 1000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {children}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 1 }}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
        >
          <Sparkles size={16} style={{ color }} />
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// Confetti Effect
// ============================================
export const ConfettiButton = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  const triggerConfetti = () => {
    setConfetti([...Array(20)].map((_, i) => i));
    setTimeout(() => setConfetti([]), 3000);
    onClick?.();
  };

  const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];

  return (
    <button onClick={triggerConfetti} className={cn('relative', className)}>
      {children}
      {confetti.map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2"
          style={{
            backgroundColor: colors[i % colors.length],
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: Math.random() * -200,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
            delay: i * 0.02,
          }}
        />
      ))}
    </button>
  );
};