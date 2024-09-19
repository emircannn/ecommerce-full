import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ImageIcon } from 'lucide-react';

interface ImageProps {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  sizes?: string;
  className?: string;
  wrapperClass?: string;
  loading?: 'eager' | 'lazy';
  existSrcSet?: boolean;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt='image', 
  width='100%', 
  height='100%', 
  sizes, 
  className='object-cover object-center w-full h-full', 
  loading, 
  wrapperClass, 
  existSrcSet=true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const srcSet = `
    ${src}?w=400 400w,
    ${src}?w=800 800w,
    ${src}?w=1200 1200w,
    ${src}?w=1600 1600w,
    ${src}?w=2000 2000w
  `;

  const defaultSizes = sizes || `(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw`;

  

  return (
    <div style={{ position: 'relative', width: width || 'auto', height: height || 'auto' }} className={cn(wrapperClass)}>
      {!isLoaded && (
        <Skeleton className='w-full h-full flex items-center justify-center'>
          <ImageIcon size={30} className='text-third-dark animate-pulse'/>
        </Skeleton>
      )}
      {existSrcSet ? 
      (<img
        src={`${src}`}
        srcSet={srcSet}
        sizes={defaultSizes}
        alt={alt}
        className={cn(className, { 'hidden': !isLoaded })}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />) 
      : 
      (
        <img
        src={`${src}`}
        sizes={defaultSizes}
        alt={alt}
        className={cn(className, { 'hidden': !isLoaded }, 'h-full w-full')}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      )}
    </div>
  );
};

export default Image;
