import { Link } from '@/components/blocks/Link';

export function Header() {
  return (
    <header
      className='sticky top-0 z-10 text-bg border-b border-text'
      style={{ backdropFilter: 'invert(1) grayscale(1)', WebkitBackdropFilter: 'invert(1) grayscale(1)' }}>
      <div className="container xl:max-w-full mx-auto px-1 md:px-3 items-center justify-between flex">
        <div className="my-4 md:mv-6 text-xl leading-tight md:leading-normal tracking-wide">
          <Link className="inline-block font-bold bg-text px-2" href="/">
            <>Großwohn&shy;<span className='whitespace-nowrap'>siedlungen<span className='text-highlight'>
              <svg
                className='inline align-baseline ml-0.5 text-highlight'
                width="0.33rem"
                height="0.33rem"
                aria-hidden>
                <rect width="0.33rem" height="0.33rem" fill='currentcolor' />
              </svg></span>
            </span></>
          </Link>
        </div>
      </div>
    </header>
  );
}