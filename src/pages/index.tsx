// import { GetStaticProps } from 'next/types';
import { List, ListItem } from '@material-tailwind/react';
import Link from 'next/link';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <h1 className='mt-4'>Siedlungen</h1>
          <div className="relative flex w-full max-w-[24rem]">
            <List>
              <ListItem>
                <Link href="/architects">
                  Architekten
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/settlements">
                  Siedlungen
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/tags">
                  Tags
                </Link>
              </ListItem>
            </List>
          </div>
        </section>
      </main>
    </Layout>
  );
}
