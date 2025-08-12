/* eslint-disable @next/next/no-img-element */
'use client';

import { XIcon } from 'lucide-react';
import { HTMLAttributes, PropsWithChildren, useRef, useState } from 'react';

import './LightBox.css';

import { Button } from '@/components/common/form/Button';
import { clsxm } from '@/lib/clsxm';

interface LightBoxProps extends HTMLAttributes<HTMLElement> {
  src: string;
  alt?: string;
}

export function LightBox({
  src,
  alt,
  className,
  ...rest
}: PropsWithChildren<LightBoxProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const button = useRef(null);

  return (
    <>
      <img
        src={src}
        className={clsxm(`image ${className}`)}
        alt={alt ?? 'Siedlungsansicht'}
        loading='lazy'
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <dialog
          ref={button}
          open
          className={clsxm(`lightbox ${className}`)}
          onClick={() => setIsOpen(false)}
          {...rest}
        >
          <Button
            ghost
            autoFocus
            onClick={() => setIsOpen(false)}
            onKeyUp={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            className='lightbox-close p-1 top-1 right-1'
          >
            <XIcon />
          </Button>
          <div className='lightbox-wrapper sm:p-3 p-1'>
            <img
              src={src}
              className='lightbox-image'
              alt={alt ?? 'Siedlungsansicht'}
              loading='lazy'
            />
          </div>
        </dialog>
      )}
    </>
  );
}
