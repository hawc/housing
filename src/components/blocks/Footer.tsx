import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';

export function Footer({ children }: { children?: React.ReactElement[] | React.ReactElement | string }) {
  return (
    <footer className='my-5'>
      <Container>
        <Box highlighted>
          <div className=" text-white leading-normal">
            <Link href="/">Home</Link>
          </div>
        </Box>
      </Container>
    </footer>
  );
}