import { Box, Container } from '@/components/common/Box';
import { Link } from '@/components/common/Link';
import { LoginButton } from '@/components/LoginButton';

export function Footer() {
  return (
    <footer>
      <Container>
        <Box className='bg-black mb-3 md:mb-8'>
          <div className='flex md:justify-between text-white flex-col md:flex-row items-center leading-loose md:leading-normal'>
            <Link href='/updates'>Updates</Link>
            <Link href='/ressourcen'>Ressoucen</Link>
            <Link href='/kontakt'>Kontakt</Link>
            <Link href='/impressum'>Impressum</Link>
            <Link href='/datenschutz'>Datenschutz</Link>
            <Link href='https://github.com/hawc/housing'>Github</Link>
            <LoginButton />
          </div>
        </Box>
      </Container>
    </footer>
  );
}
