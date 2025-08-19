import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  blurDataUrl?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoadComplete?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = '/assets/placeholder.png',
  blurDataUrl,
  priority = false,
  quality = 75,
  sizes = '100vw',
  aspectRatio,
  objectFit = 'cover',
  className,
  onLoadComplete,
  ...props
}: OptimizedImageProps) => {
  const { t } = useTranslation('forms');
  const [imageSrc, setImageSrc] = useState(blurDataUrl || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      onLoadComplete?.();
    };

    img.onerror = () => {
      setHasError(true);
      setImageSrc(fallbackSrc);
      setIsLoading(false);
    };

    img.src = src;
  }, [isInView, src, fallbackSrc, onLoadComplete]);

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (!src || hasError) return undefined;
    
    const widths = [320, 640, 768, 1024, 1280, 1536];
    const srcSetEntries = widths.map((width) => {
      // If src is a local path, just return it with width descriptor
      if (src.startsWith('/') || src.startsWith('./')) {
        return `${src} ${width}w`;
      }
      // For external URLs, you might want to use an image service
      return `${src}?w=${width}&q=${quality} ${width}w`;
    });
    
    return srcSetEntries.join(', ');
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder */}
      {isLoading && blurDataUrl && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {isLoading && !blurDataUrl && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={imageSrc || fallbackSrc}
        alt={alt}
        srcSet={!hasError ? generateSrcSet() : undefined}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImageSrc(fallbackSrc);
          }
        }}
        {...props}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Picture component for art direction
interface OptimizedPictureProps {
  sources: {
    srcSet: string;
    media?: string;
    type?: string;
  }[];
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedPicture = ({
  sources,
  src,
  alt,
  className,
  priority = false,
}: OptimizedPictureProps) => {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        priority={priority}
      />
    </picture>
  );
};

// Background Image Component for Hero Sections
interface OptimizedBackgroundProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  parallax?: boolean;
}

export const OptimizedBackground = ({
  src,
  alt = '',
  className,
  children,
  overlay = false,
  overlayOpacity = 0.5,
  parallax = false,
}: OptimizedBackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setOffset(scrolled * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundImage: `url(${src})`,
          transform: parallax ? `translateY(${offset}px)` : undefined,
        }}
        role="img"
        aria-label={alt}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

// Image Gallery Component with Lightbox
interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  columns?: number;
  gap?: number;
  lightbox?: boolean;
}

export const ImageGallery = ({
  images,
  columns = 3,
  gap = 4,
  lightbox = true,
}: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightbox || selectedImage === null) return;
    
    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === 'ArrowRight') {
      setSelectedImage((prev) => 
        prev !== null && prev < images.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowLeft') {
      setSelectedImage((prev) => 
        prev !== null && prev > 0 ? prev - 1 : images.length - 1
      );
    }
  };

  useEffect(() => {
    if (lightbox) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightbox, selectedImage]);

  return (
    <>
      <div
        className={cn(
          'grid',
          `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
          `gap-${gap}`
        )}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => lightbox && setSelectedImage(index)}
            className="group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`View ${image.alt}`}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
              aspectRatio="4/3"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images[selectedImage].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
              <p className="text-white">{images[selectedImage].caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};