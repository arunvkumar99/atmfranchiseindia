import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const { t } = useTranslation('forms');
  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={onLoad}
      onError={onError}
      width={width}
      height={height}
    />
  );
};