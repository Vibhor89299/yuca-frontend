import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  priority?: boolean;
  onLoadComplete?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/fallback.jpg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  priority = false,
  className,
  onLoadComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-mushroom/50',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Shimmer placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-mushroom via-blanket to-mushroom animate-shimmer" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFitClasses[objectFit],
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
}
