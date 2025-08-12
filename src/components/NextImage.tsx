'use client';

import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useState } from 'react';

import { clsxm } from '@/lib/clsxm';

interface NextImageProps extends ImageProps {
  imgClassName?: string;
  blurClassName?: string;
  useSkeleton?: boolean;
}

export function NextImage({
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  blurClassName,
  useSkeleton,
  ...rest
}: NextImageProps) {
  const [status, setStatus] = useState(useSkeleton ? 'loading' : 'complete');
  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <figure
      style={!widthIsSet ? { width: `${width}px` } : undefined}
      className={className}
    >
      <Image
        className={clsxm(
          imgClassName,
          status === 'loading' && clsxm('animate-pulse', blurClassName)
        )}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onLoadingComplete={() => setStatus('complete')}
        {...rest}
      />
    </figure>
  );
}
