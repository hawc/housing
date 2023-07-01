import { Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';

export function Header({ children }: { children?: React.ReactElement[] | React.ReactElement | string }) {
  return (
    <header>
      <Container>
        <div className="text-5xl text-white leading-normal">
          <Link href="/"><>Großwohnsiedlungen<span className='text-highlight'>.</span></></Link>
        </div>
      </Container>
    </header>
  );
}