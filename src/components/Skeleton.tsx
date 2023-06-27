import * as React from 'react';


type SkeletonProps = React.HTMLAttributes<HTMLOrSVGElement> & { nested?: boolean; tagName?: keyof JSX.IntrinsicElements };

export const skeletonStyle = {
  backgroundImage:
    'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
  backgroundSize: '700px 100%',
  backgroundRepeat: 'no-repeat',
}
export const skeletonClass = 'animate-shimmer bg-[#f6f7f8]';

export default function Skeleton({ className, children, nested = false, tagName = 'div', ...rest }: SkeletonProps) {
  const Component = tagName;
  return (
    <Component
      className={nested ? className : `${skeletonClass} ${className}`}
      style={nested ? {} : skeletonStyle}
      {...rest}
    >
      <div style={{
        opacity: 0
      }}>
        {children}
      </div>
    </Component>
  );
}
