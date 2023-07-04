import { Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import { LoginButton } from '@/components/LoginButton';

export function Header() {
  return (
    <header className='flex items-end justify-between'>
      <Container>
        <div className="mt-6 text-3xl md:text-5xl text-content leading-normal">
          <Link className="inline-block font-black text-grey-light" href="/">
            <>Großwohn&shy;<span className='whitespace-nowrap'>siedlungen<span className='text-highlight'>
              <svg
                className='inline align-baseline ml-1 text-highlight'
                width="0.5rem"
                height="0.5rem"
                aria-hidden>
                <rect width="0.5rem" height="0.5rem" fill='currentcolor' />
              </svg></span>
            </span></>
          </Link>
        </div>
      </Container>
      <LoginButton className='mb-1.5 md:mb-3' />
    </header>
  );
}