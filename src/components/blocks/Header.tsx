import { Link } from '@/components/blocks/Link';
import { LoginButton } from '@/components/LoginButton';

export function Header() {
  return (
    <header className='sticky top-0 z-10 mb-1' style={{ 'WebkitBackdropFilter': 'blur(10px) brightness(0.8)', 'backdropFilter': 'blur(10px) brightness(0.8)' }}>
      <div className="container xl:max-w-full mx-auto px-3 md:px-5 items-center justify-between flex">
        <div className="my-4 md:mv-6 text-xl text-content leading-tight md:leading-normal tracking-wide text-white">
          <Link className="inline-block font-black" href="/">
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
        <LoginButton />
      </div>
    </header>
  );
}