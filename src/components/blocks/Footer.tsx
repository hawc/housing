import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';

export function Footer() {
  return (
    <footer>
      <Container>
        <Box className='bg-black'>
          <div className="flex justify-between text-white leading-normal">
            <Link href="https://github.com/hawc/housing">Github</Link>
            <Link href="/impressum">Impressum</Link>
          </div>
        </Box>
      </Container>
    </footer>
  );
}